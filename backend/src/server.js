require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
pool.connect().then(() => console.log('💎 Servidor Conectado!')).catch(err => console.error(err));

const JWT_SECRET = 'aurum_premium_saas_2026_seguro';

const verificarToken = (req, res, next) => {
  const tokenHeader = req.headers.authorization;
  if (!tokenHeader) return res.status(401).json({ error: 'Acesso negado.' });
  try {
    const decoded = jwt.verify(tokenHeader.split(' ')[1], JWT_SECRET);
    req.profissionalId = decoded.id; req.isCeo = decoded.is_ceo; next();
  } catch (error) { res.status(401).json({ error: 'Token inválido.' }); }
};
const verificarCEO = (req, res, next) => { if (!req.isCeo) return res.status(403).json({ error: 'Acesso negado.' }); next(); };

// ROTAS DE AUTENTICAÇÃO
app.post('/api/cadastro', async (req, res) => {
  const { nome, email, senha, telefone } = req.body;
  try {
    const usuarioExiste = await pool.query('SELECT id, email, telefone FROM profissionais WHERE email = $1 OR telefone = $2', [email, telefone]);
    if (usuarioExiste.rows.length > 0) {
      if (usuarioExiste.rows[0].email === email) return res.status(400).json({ error: 'E-mail já cadastrado.' });
      if (usuarioExiste.rows[0].telefone === telefone) return res.status(400).json({ error: 'WhatsApp já em uso.' });
    }
    const senhaHash = await bcrypt.hash(senha, await bcrypt.genSalt(10));
    const isCeo = email === 'codebyanderson@hotmail.com';
    const result = await pool.query('INSERT INTO profissionais (nome, email, senha, telefone, is_ceo) VALUES ($1, $2, $3, $4, $5) RETURNING id, nome, email, is_ceo', [nome, email, senhaHash, telefone, isCeo]);
    res.status(201).json({ usuario: result.rows[0], token: jwt.sign({ id: result.rows[0].id, is_ceo: isCeo }, JWT_SECRET, { expiresIn: '7d' }) });
  } catch (error) { res.status(500).json({ error: 'Erro no cadastro.' }); }
});

app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const result = await pool.query('SELECT * FROM profissionais WHERE email = $1', [email]);
    if (result.rows.length === 0 || !(await bcrypt.compare(senha, result.rows[0].senha))) return res.status(400).json({ error: 'Credenciais incorretas.' });
    const usuario = result.rows[0];
    res.json({ usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, is_ceo: usuario.is_ceo }, token: jwt.sign({ id: usuario.id, is_ceo: usuario.is_ceo }, JWT_SECRET, { expiresIn: '7d' }) });
  } catch (error) { res.status(500).json({ error: 'Erro no login.' }); }
});

app.post('/api/google/check', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM profissionais WHERE email = $1', [req.body.email]);
    if (result.rows.length > 0) return res.json({ action: 'login', token: jwt.sign({ id: result.rows[0].id, is_ceo: result.rows[0].is_ceo }, JWT_SECRET, { expiresIn: '7d' }), usuario: result.rows[0] });
    res.json({ action: 'register_needed', email: req.body.email, nome: req.body.nome });
  } catch (error) { res.status(500).json({ error: 'Erro Google.' }); }
});

app.post('/api/google/cadastro', async (req, res) => {
  try {
    if ((await pool.query('SELECT id FROM profissionais WHERE telefone = $1', [req.body.telefone])).rows.length > 0) return res.status(400).json({ error: 'WhatsApp já em uso.' });
    const isCeo = req.body.email === 'codebyanderson@hotmail.com';
    const result = await pool.query('INSERT INTO profissionais (nome, email, senha, telefone, is_ceo) VALUES ($1, $2, $3, $4, $5) RETURNING id, nome, email, is_ceo', [req.body.nome, req.body.email, await bcrypt.hash(Math.random().toString(), 10), req.body.telefone, isCeo]);
    res.status(201).json({ usuario: result.rows[0], token: jwt.sign({ id: result.rows[0].id, is_ceo: isCeo }, JWT_SECRET, { expiresIn: '7d' }) });
  } catch (error) { res.status(500).json({ error: 'Erro Google Cad.' }); }
});

// ROTAS DO CEO E DASHBOARD...
app.get('/api/ceo/dashboard', verificarToken, verificarCEO, async (req, res) => {
  try {
    const empresas = await pool.query(`SELECT p.id, p.nome, p.email, p.telefone, COALESCE(SUM(v.valor), 0) as faturamento_total FROM profissionais p LEFT JOIN vendas v ON p.id = v.profissional_id WHERE p.is_ceo = FALSE GROUP BY p.id`);
    res.json({ totalEmpresas: empresas.rows.length, faturamentoGlobal: empresas.rows.reduce((acc, curr) => acc + parseFloat(curr.faturamento_total), 0), empresas: empresas.rows });
  } catch (error) { res.status(500).json({ error: 'Erro CEO' }); }
});
app.delete('/api/ceo/usuarios/:id', verificarToken, verificarCEO, async (req, res) => {
  try {
    if ((await pool.query('SELECT is_ceo FROM profissionais WHERE id = $1', [req.params.id])).rows[0]?.is_ceo) return res.status(403).json({ error: 'Negado.' });
    await pool.query('DELETE FROM vendas WHERE profissional_id = $1', [req.params.id]); await pool.query('DELETE FROM agendamentos WHERE profissional_id = $1', [req.params.id]); await pool.query('DELETE FROM clientes WHERE profissional_id = $1', [req.params.id]); await pool.query('DELETE FROM servicos WHERE profissional_id = $1', [req.params.id]); await pool.query('DELETE FROM profissionais WHERE id = $1', [req.params.id]);
    res.json({ message: 'Excluído' });
  } catch (error) { res.status(500).json({ error: 'Erro' }); }
});
app.get('/api/dashboard', verificarToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT COALESCE(SUM(valor), 0) as ganho_dia, COUNT(id) as qtd_atendimentos FROM vendas WHERE profissional_id = $1 AND DATE(data_venda) = CURRENT_DATE', [req.profissionalId]);
    res.json({ ganhoDia: parseFloat(result.rows[0].ganho_dia), qtdAtendimentos: parseInt(result.rows[0].qtd_atendimentos) });
  } catch (error) { res.status(500).json({ error: 'Erro dash' }); }
});

// 🌟 NOVA ROTA: SALVAR HORÁRIOS DE TRABALHO
app.get('/api/configuracoes', verificarToken, async (req, res) => {
  try { const r = await pool.query('SELECT horarios_trabalho FROM profissionais WHERE id = $1', [req.profissionalId]); res.json(r.rows[0]); } catch (e) { res.status(500).json({ error: 'Erro' }); }
});
app.post('/api/configuracoes', verificarToken, async (req, res) => {
  try { await pool.query('UPDATE profissionais SET horarios_trabalho = $1 WHERE id = $2', [req.body.horarios, req.profissionalId]); res.json({ message: 'Salvo' }); } catch (e) { res.status(500).json({ error: 'Erro' }); }
});

// SERVIÇOS, VENDAS, AGENDAMENTOS...
app.get('/api/servicos', verificarToken, async (req, res) => { res.json((await pool.query('SELECT * FROM servicos WHERE profissional_id = $1 ORDER BY id DESC', [req.profissionalId])).rows); });
app.post('/api/servicos', verificarToken, async (req, res) => { res.status(201).json((await pool.query('INSERT INTO servicos (profissional_id, nome, preco, tempo) VALUES ($1, $2, $3, $4) RETURNING *', [req.profissionalId, req.body.nome, parseFloat(req.body.preco.replace(',', '.')), req.body.tempo])).rows[0]); });
app.delete('/api/servicos/:id', verificarToken, async (req, res) => { await pool.query('DELETE FROM servicos WHERE id = $1 AND profissional_id = $2', [req.params.id, req.profissionalId]); res.json({ message: 'Removido' }); });
app.get('/api/vendas', verificarToken, async (req, res) => { res.json((await pool.query('SELECT * FROM vendas WHERE profissional_id = $1 ORDER BY data_venda DESC LIMIT 50', [req.profissionalId])).rows); });
app.post('/api/vendas', verificarToken, async (req, res) => { res.status(201).json((await pool.query('INSERT INTO vendas (profissional_id, valor) VALUES ($1, $2) RETURNING *', [req.profissionalId, req.body.valor])).rows[0]); });
app.get('/api/agendamentos', verificarToken, async (req, res) => { res.json((await pool.query("SELECT * FROM agendamentos WHERE profissional_id = $1 AND status = 'pendente' ORDER BY id ASC", [req.profissionalId])).rows); });
app.post('/api/agendamentos/:id/concluir', verificarToken, async (req, res) => {
  const agenda = await pool.query('SELECT valor FROM agendamentos WHERE id = $1 AND profissional_id = $2', [req.params.id, req.profissionalId]);
  if(agenda.rows.length > 0) { await pool.query("UPDATE agendamentos SET status = 'concluido' WHERE id = $1", [req.params.id]); await pool.query('INSERT INTO vendas (profissional_id, valor) VALUES ($1, $2)', [req.profissionalId, agenda.rows[0].valor]); res.json({ message: 'Concluído!' }); }
});

// 🌟 ROTAS PÚBLICAS (LÓGICA DOS HORÁRIOS MÚLTIPLOS)
app.get('/api/public/profissional/:id_profissional', async (req, res) => {
  try { res.json((await pool.query('SELECT nome, telefone, horarios_trabalho FROM profissionais WHERE id = $1', [req.params.id_profissional])).rows[0] || {}); } catch (e) { res.status(500).json({ error: 'Erro' }); }
});
app.get('/api/public/servicos/:id_profissional', async (req, res) => { res.json((await pool.query('SELECT * FROM servicos WHERE profissional_id = $1 ORDER BY id DESC', [req.params.id_profissional])).rows); });
app.get('/api/public/historico/:id_profissional/:whatsapp', async (req, res) => {
  const result = await pool.query(`SELECT servico_nome FROM agendamentos WHERE profissional_id = $1 AND cliente_whatsapp = $2 ORDER BY data_criacao DESC LIMIT 1`, [req.params.id_profissional, req.params.whatsapp]);
  res.json({ ultimoServico: result.rows.length > 0 ? result.rows[0].servico_nome : null });
});
app.get('/api/public/horarios-ocupados/:id_profissional', async (req, res) => {
  try {
    const result = await pool.query("SELECT horario FROM agendamentos WHERE profissional_id = $1 AND data_reserva = $2 AND status != 'cancelado'", [req.params.id_profissional, req.query.data]);
    let ocupados = [];
    result.rows.forEach(r => { if(r.horario) ocupados = ocupados.concat(r.horario.split(',')); });
    res.json(ocupados);
  } catch (error) { res.status(500).json({ error: 'Erro ocupados' }); }
});
app.post('/api/public/agendamentos', async (req, res) => {
  const { id_profissional, nome, whatsapp, nascimento, servico_nome, data_reserva, horario, valor } = req.body;
  try {
    await pool.query('INSERT INTO clientes (profissional_id, nome, whatsapp, nascimento) VALUES ($1, $2, $3, $4)', [id_profissional, nome, whatsapp, nascimento]);
    const result = await pool.query('INSERT INTO agendamentos (profissional_id, cliente_nome, cliente_whatsapp, servico_nome, data_reserva, horario, valor) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [id_profissional, nome, whatsapp, servico_nome, data_reserva, horario, valor]);
    res.status(201).json(result.rows[0]);
  } catch (error) { res.status(500).json({ error: 'Erro agendar' }); }
});

const PORT = process.env.PORT || 3333; app.listen(PORT, () => console.log(`🚀 Servidor AURUM na porta ${PORT}`));