// backend/src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// 🌟 A MÁGICA DA NUVEM AQUI: Usando connectionString e SSL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.connect().then(() => console.log('💎 Conectado ao AURUM SaaS NA NUVEM!')).catch(err => console.error('Erro na conexão:', err));

const JWT_SECRET = 'aurum_premium_saas_2026_seguro';

const verificarToken = (req, res, next) => {
  const tokenHeader = req.headers.authorization;
  if (!tokenHeader) return res.status(401).json({ error: 'Acesso negado.' });
  try {
    const token = tokenHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.profissionalId = decoded.id;
    req.isCeo = decoded.is_ceo; 
    next();
  } catch (error) { res.status(401).json({ error: 'Token inválido.' }); }
};

const verificarCEO = (req, res, next) => {
  if (!req.isCeo) return res.status(403).json({ error: 'Acesso negado.' });
  next();
};

// ==========================================
// 🔐 LOGIN E CADASTRO
// ==========================================
app.post('/api/cadastro', async (req, res) => {
  const { nome, email, senha, telefone } = req.body;
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'E-mail inválido.' });
  if (!senha || senha.length < 6) return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres.' });
  if (!telefone || telefone.length < 10) return res.status(400).json({ error: 'Telefone inválido.' });

  try {
    const usuarioExiste = await pool.query('SELECT id FROM profissionais WHERE email = $1', [email]);
    if (usuarioExiste.rows.length > 0) return res.status(400).json({ error: 'Email já cadastrado.' });

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);
    const isCeo = email === 'codebyanderson@hotmail.com';

    const result = await pool.query(
      'INSERT INTO profissionais (nome, email, senha, telefone, is_ceo) VALUES ($1, $2, $3, $4, $5) RETURNING id, nome, email, is_ceo',
      [nome, email, senhaHash, telefone, isCeo]
    );

    const token = jwt.sign({ id: result.rows[0].id, is_ceo: isCeo }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ usuario: result.rows[0], token });
  } catch (error) { res.status(500).json({ error: 'Erro ao cadastrar.' }); }
});

app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const result = await pool.query('SELECT * FROM profissionais WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(400).json({ error: 'Credenciais incorretas.' });

    const usuario = result.rows[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) return res.status(400).json({ error: 'Credenciais incorretas.' });

    const token = jwt.sign({ id: usuario.id, is_ceo: usuario.is_ceo }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, is_ceo: usuario.is_ceo }, token });
  } catch (error) { res.status(500).json({ error: 'Erro no login.' }); }
});

app.post('/api/google/check', async (req, res) => {
  const { email, nome } = req.body;
  try {
    const result = await pool.query('SELECT * FROM profissionais WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      const usuario = result.rows[0];
      const token = jwt.sign({ id: usuario.id, is_ceo: usuario.is_ceo }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ action: 'login', token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, is_ceo: usuario.is_ceo } });
    } else {
      return res.json({ action: 'register_needed', email, nome });
    }
  } catch (error) { res.status(500).json({ error: 'Erro na verificação do Google.' }); }
});

app.post('/api/google/cadastro', async (req, res) => {
  const { nome, email, telefone } = req.body;
  if (!telefone || telefone.length < 10) return res.status(400).json({ error: 'WhatsApp inválido.' });

  try {
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(Math.random().toString(36), salt);
    const isCeo = email === 'codebyanderson@hotmail.com';

    const result = await pool.query(
      'INSERT INTO profissionais (nome, email, senha, telefone, is_ceo) VALUES ($1, $2, $3, $4, $5) RETURNING id, nome, email, is_ceo',
      [nome, email, senhaHash, telefone, isCeo]
    );

    const token = jwt.sign({ id: result.rows[0].id, is_ceo: isCeo }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ usuario: result.rows[0], token });
  } catch (error) { res.status(500).json({ error: 'Erro ao criar conta Google.' }); }
});

// ==========================================
// 👑 CEO
// ==========================================
app.get('/api/ceo/dashboard', verificarToken, verificarCEO, async (req, res) => {
  try {
    const empresasQuery = await pool.query('SELECT COUNT(id) as total FROM profissionais WHERE is_ceo = FALSE');
    const faturamentoQuery = await pool.query('SELECT COALESCE(SUM(valor), 0) as total_global FROM vendas');
    const listaEmpresas = await pool.query('SELECT id, nome, email, telefone, data_cadastro FROM profissionais WHERE is_ceo = FALSE ORDER BY data_cadastro DESC LIMIT 10');
    res.json({ totalEmpresas: parseInt(empresasQuery.rows[0].total), faturamentoGlobal: parseFloat(faturamentoQuery.rows[0].total_global), empresas: listaEmpresas.rows });
  } catch (error) { res.status(500).json({ error: 'Erro CEO' }); }
});

// ==========================================
// 🔒 PAINEL DO ASSINANTE
// ==========================================
app.get('/api/dashboard', verificarToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT COALESCE(SUM(valor), 0) as ganho_dia, COUNT(id) as qtd_atendimentos FROM vendas WHERE profissional_id = $1 AND DATE(data_venda) = CURRENT_DATE', [req.profissionalId]);
    res.json({ ganhoDia: parseFloat(result.rows[0].ganho_dia), qtdAtendimentos: parseInt(result.rows[0].qtd_atendimentos) });
  } catch (error) { res.status(500).json({ error: 'Erro dashboard' }); }
});

app.get('/api/servicos', verificarToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM servicos WHERE profissional_id = $1 ORDER BY id DESC', [req.profissionalId]);
    res.json(result.rows);
  } catch (error) { res.status(500).json({ error: 'Erro servicos' }); }
});

app.post('/api/servicos', verificarToken, async (req, res) => {
  const { nome, preco, tempo } = req.body;
  try {
    const precoFormatado = parseFloat(preco.replace(',', '.'));
    const result = await pool.query('INSERT INTO servicos (profissional_id, nome, preco, tempo) VALUES ($1, $2, $3, $4) RETURNING *', [req.profissionalId, nome, precoFormatado, tempo]);
    res.status(201).json(result.rows[0]);
  } catch (error) { res.status(500).json({ error: 'Erro criar servico' }); }
});

app.delete('/api/servicos/:id', verificarToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM servicos WHERE id = $1 AND profissional_id = $2', [req.params.id, req.profissionalId]);
    res.json({ message: 'Removido' });
  } catch (error) { res.status(500).json({ error: 'Erro remover' }); }
});

app.get('/api/vendas', verificarToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vendas WHERE profissional_id = $1 ORDER BY data_venda DESC LIMIT 50', [req.profissionalId]);
    res.json(result.rows);
  } catch (error) { res.status(500).json({ error: 'Erro vendas' }); }
});

app.post('/api/vendas', verificarToken, async (req, res) => {
  const { valor } = req.body;
  try {
    const result = await pool.query('INSERT INTO vendas (profissional_id, valor) VALUES ($1, $2) RETURNING *', [req.profissionalId, valor]);
    res.status(201).json(result.rows[0]);
  } catch (error) { res.status(500).json({ error: 'Erro vender' }); }
});

app.get('/api/agendamentos', verificarToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM agendamentos WHERE profissional_id = $1 AND status = 'pendente' ORDER BY id ASC", [req.profissionalId]);
    res.json(result.rows);
  } catch (error) { res.status(500).json({ error: 'Erro agenda' }); }
});

app.post('/api/agendamentos/:id/concluir', verificarToken, async (req, res) => {
  const { id } = req.params;
  try {
    const agenda = await pool.query('SELECT valor FROM agendamentos WHERE id = $1 AND profissional_id = $2', [id, req.profissionalId]);
    if(agenda.rows.length === 0) return res.status(404).json({error: 'Não encontrado'});
    
    await pool.query("UPDATE agendamentos SET status = 'concluido' WHERE id = $1", [id]);
    await pool.query('INSERT INTO vendas (profissional_id, valor) VALUES ($1, $2)', [req.profissionalId, agenda.rows[0].valor]);
    res.json({ message: 'Concluído!' });
  } catch (error) { res.status(500).json({ error: 'Erro concluir' }); }
});

// ==========================================
// 🌍 ROTAS PÚBLICAS
// ==========================================
app.get('/api/public/profissional/:id_profissional', async (req, res) => {
  try {
    const result = await pool.query('SELECT nome, telefone FROM profissionais WHERE id = $1', [req.params.id_profissional]);
    res.json(result.rows[0] || {});
  } catch (error) { res.status(500).json({ error: 'Erro profissional' }); }
});

app.get('/api/public/servicos/:id_profissional', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM servicos WHERE profissional_id = $1 ORDER BY id DESC', [req.params.id_profissional]);
    res.json(result.rows);
  } catch (error) { res.status(500).json({ error: 'Erro servicos' }); }
});

app.get('/api/public/historico/:id_profissional/:whatsapp', async (req, res) => {
  const { id_profissional, whatsapp } = req.params;
  try {
    const result = await pool.query(`SELECT servico_nome FROM agendamentos WHERE profissional_id = $1 AND cliente_whatsapp = $2 ORDER BY data_criacao DESC LIMIT 1`, [id_profissional, whatsapp]);
    res.json({ ultimoServico: result.rows.length > 0 ? result.rows[0].servico_nome : null });
  } catch (error) { res.status(500).json({ error: 'Erro historico' }); }
});

app.post('/api/public/agendamentos', async (req, res) => {
  const { id_profissional, nome, whatsapp, nascimento, servico_nome, data_reserva, horario, valor } = req.body;
  try {
    await pool.query('INSERT INTO clientes (profissional_id, nome, whatsapp, nascimento) VALUES ($1, $2, $3, $4)', [id_profissional, nome, whatsapp, nascimento]);
    const result = await pool.query(
      'INSERT INTO agendamentos (profissional_id, cliente_nome, cliente_whatsapp, servico_nome, data_reserva, horario, valor) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [id_profissional, nome, whatsapp, servico_nome, data_reserva, horario, valor]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) { res.status(500).json({ error: 'Erro agendar' }); }
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`🚀 Servidor AURUM SaaS rodando na porta ${PORT}`));