require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const SECRET_KEY = process.env.JWT_SECRET || 'aurum_premium_secret_key_2026';

const verificarToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'Token não fornecido' });

  const tokenLimpo = token.split(' ')[1];
  jwt.verify(tokenLimpo, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Sessão expirada ou inválida' });
    req.usuarioId = decoded.id;
    req.isCeo = decoded.is_ceo;
    next();
  });
};

// ==========================================
// 🌍 ROTAS PÚBLICAS (AGENDAMENTO DO CLIENTE)
// ==========================================
app.get('/api/publico/empresa/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const salaoResult = await pool.query('SELECT nome, logo_url, horarios_trabalho FROM usuarios WHERE id = $1', [id]);
    if (salaoResult.rows.length === 0) return res.status(404).json({ error: 'Salão não encontrado' });
    
    const servicosResult = await pool.query('SELECT id, nome, preco, tempo FROM servicos WHERE usuario_id = $1', [id]);
    const salao = salaoResult.rows[0];
    salao.servicos = servicosResult.rows;
    res.json(salao);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

app.post('/api/publico/agendar', async (req, res) => {
  try {
    const { empresa_id, cliente_nome, cliente_whatsapp, servico_id, data_reserva, horario, valor } = req.body;
    const servicoResult = await pool.query('SELECT nome FROM servicos WHERE id = $1', [servico_id]);
    const servico_nome = servicoResult.rows.length > 0 ? servicoResult.rows[0].nome : 'Serviço Padrão';

    await pool.query(
      `INSERT INTO agendamentos (usuario_id, cliente_nome, cliente_whatsapp, servico_id, servico_nome, data_reserva, horario, valor, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Pendente')`,
      [empresa_id, cliente_nome, cliente_whatsapp, servico_id, servico_nome, data_reserva, horario, valor]
    );
    res.json({ message: 'Agendamento criado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar agendamento' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const userResult = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (userResult.rows.length === 0) return res.status(401).json({ error: 'Credenciais inválidas' });
    
    const user = userResult.rows[0];
    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) return res.status(401).json({ error: 'Credenciais inválidas' });

    const token = jwt.sign({ id: user.id, is_ceo: user.is_ceo }, SECRET_KEY, { expiresIn: '7d' });
    res.json({ token, usuario: { id: user.id, nome: user.nome, email: user.email, is_ceo: user.is_ceo } });
  } catch (err) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

app.post('/api/cadastro', async (req, res) => {
  try {
    const { nome, email, senha, telefone } = req.body;
    const userExist = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (userExist.rows.length > 0) return res.status(400).json({ error: 'E-mail já cadastrado' });

    const hash = await bcrypt.hash(senha, 10);
    const dataVencimento = new Date();
    dataVencimento.setDate(dataVencimento.getDate() + 30);

    const result = await pool.query(
      'INSERT INTO usuarios (nome, email, senha, telefone, data_vencimento, status_assinatura) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, nome, email, is_ceo',
      [nome, email, hash, telefone, dataVencimento, 'teste']
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, is_ceo: user.is_ceo }, SECRET_KEY, { expiresIn: '7d' });
    res.json({ token, usuario: user });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao cadastrar' });
  }
});

// ==========================================
// 🔐 ROTAS PROTEGIDAS (PAINEL DO SALÃO)
// ==========================================
app.get('/api/assinatura', verificarToken, async (req, res) => {
  if (req.isCeo) return res.json({ status: 'ativo', dias_restantes: 999 });
  const result = await pool.query('SELECT data_vencimento, status_assinatura FROM usuarios WHERE id = $1', [req.usuarioId]);
  const data = result.rows[0];
  const hoje = new Date();
  const vencimento = new Date(data.data_vencimento);
  const diasRestantes = Math.ceil((vencimento - hoje) / (1000 * 60 * 60 * 24));

  if (diasRestantes < 0 && data.status_assinatura !== 'pago') return res.json({ status: 'vencido', dias_restantes: 0 });
  res.json({ status: 'ativo', dias_restantes: diasRestantes > 0 ? diasRestantes : 0 });
});

app.get('/api/dashboard', verificarToken, async (req, res) => {
  try {
    const vendas = await pool.query('SELECT sum(valor) as total FROM vendas WHERE usuario_id = $1 AND DATE(data_venda) = CURRENT_DATE', [req.usuarioId]);
    const atendimentos = await pool.query('SELECT count(*) as total FROM agendamentos WHERE usuario_id = $1 AND DATE(data_reserva) = CURRENT_DATE AND status = $2', [req.usuarioId, 'Concluído']);
    const grafico = await pool.query(`SELECT to_char(data_venda, 'DD/MM') as data, sum(valor) as valor FROM vendas WHERE usuario_id = $1 AND data_venda >= CURRENT_DATE - INTERVAL '6 days' GROUP BY DATE(data_venda), data_venda ORDER BY data_venda ASC`, [req.usuarioId]);
    res.json({ ganhoDia: Number(vendas.rows[0].total) || 0, qtdAtendimentos: Number(atendimentos.rows[0].total) || 0, grafico7Dias: grafico.rows });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao carregar dashboard' });
  }
});

app.get('/api/vendas', verificarToken, async (req, res) => {
  const result = await pool.query('SELECT * FROM vendas WHERE usuario_id = $1 ORDER BY data_venda DESC LIMIT 50', [req.usuarioId]);
  res.json(result.rows);
});
app.post('/api/vendas', verificarToken, async (req, res) => {
  await pool.query('INSERT INTO vendas (usuario_id, valor) VALUES ($1, $2)', [req.usuarioId, req.body.valor]);
  res.json({ message: 'Venda registrada' });
});

app.get('/api/despesas', verificarToken, async (req, res) => {
  const result = await pool.query('SELECT * FROM despesas WHERE usuario_id = $1 ORDER BY data_criacao DESC LIMIT 50', [req.usuarioId]);
  res.json(result.rows);
});
app.post('/api/despesas', verificarToken, async (req, res) => {
  await pool.query('INSERT INTO despesas (usuario_id, descricao, valor) VALUES ($1, $2, $3)', [req.usuarioId, req.body.descricao, req.body.valor]);
  res.json({ message: 'Despesa registrada' });
});
app.delete('/api/despesas/:id', verificarToken, async (req, res) => {
  await pool.query('DELETE FROM despesas WHERE id = $1 AND usuario_id = $2', [req.params.id, req.usuarioId]);
  res.json({ message: 'Despesa removida' });
});

app.get('/api/servicos', verificarToken, async (req, res) => {
  const result = await pool.query('SELECT * FROM servicos WHERE usuario_id = $1 ORDER BY nome ASC', [req.usuarioId]);
  res.json(result.rows);
});
app.post('/api/servicos', verificarToken, async (req, res) => {
  await pool.query('INSERT INTO servicos (usuario_id, nome, preco, tempo) VALUES ($1, $2, $3, $4)', [req.usuarioId, req.body.nome, req.body.preco, req.body.tempo]);
  res.json({ message: 'Serviço cadastrado' });
});
app.delete('/api/servicos/:id', verificarToken, async (req, res) => {
  await pool.query('DELETE FROM servicos WHERE id = $1 AND usuario_id = $2', [req.params.id, req.usuarioId]);
  res.json({ message: 'Serviço removido' });
});

app.get('/api/funcionarios', verificarToken, async (req, res) => {
  const result = await pool.query('SELECT * FROM funcionarios WHERE usuario_id = $1', [req.usuarioId]);
  res.json(result.rows);
});
app.post('/api/funcionarios', verificarToken, async (req, res) => {
  await pool.query('INSERT INTO funcionarios (usuario_id, nome, comissao) VALUES ($1, $2, $3)', [req.usuarioId, req.body.nome, req.body.comissao]);
  res.json({ message: 'Funcionário cadastrado' });
});
app.delete('/api/funcionarios/:id', verificarToken, async (req, res) => {
  await pool.query('DELETE FROM funcionarios WHERE id = $1 AND usuario_id = $2', [req.params.id, req.usuarioId]);
  res.json({ message: 'Funcionário removido' });
});

app.get('/api/clientes', verificarToken, async (req, res) => {
  const result = await pool.query(`SELECT cliente_nome as nome, cliente_whatsapp as whatsapp, count(*) as total_visitas, max(data_reserva) as ultima_visita FROM agendamentos WHERE usuario_id = $1 AND status = 'Concluído' GROUP BY cliente_nome, cliente_whatsapp ORDER BY ultima_visita DESC`, [req.usuarioId]);
  res.json(result.rows);
});

app.get('/api/configuracoes', verificarToken, async (req, res) => {
  const result = await pool.query('SELECT horarios_trabalho, logo_url FROM usuarios WHERE id = $1', [req.usuarioId]);
  res.json(result.rows[0]);
});
app.post('/api/configuracoes', verificarToken, async (req, res) => {
  await pool.query('UPDATE usuarios SET horarios_trabalho = $1, logo_url = $2 WHERE id = $3', [req.body.horarios, req.body.logo_url, req.usuarioId]);
  res.json({ message: 'Configurações atualizadas' });
});

app.get('/api/agendamentos', verificarToken, async (req, res) => {
  const result = await pool.query("SELECT * FROM agendamentos WHERE usuario_id = $1 AND DATE(data_reserva) = CURRENT_DATE AND status = 'Pendente' ORDER BY horario ASC", [req.usuarioId]);
  res.json(result.rows);
});
app.post('/api/agendamentos/:id/concluir', verificarToken, async (req, res) => {
  const agendamento = await pool.query('SELECT * FROM agendamentos WHERE id = $1 AND usuario_id = $2', [req.params.id, req.usuarioId]);
  if (agendamento.rows.length > 0) {
    await pool.query("UPDATE agendamentos SET status = 'Concluído' WHERE id = $1", [req.params.id]);
    await pool.query('INSERT INTO vendas (usuario_id, valor) VALUES ($1, $2)', [req.usuarioId, agendamento.rows[0].valor]);
  }
  res.json({ message: 'Atendimento concluído' });
});

app.post('/api/gerar-pix', verificarToken, (req, res) => {
  res.json({ qr_code_base64: 'base64_mockado_aqui', qr_code_copia_cola: '00020126580014br.gov.bcb.pix...mock' });
});

app.get('/api/ceo/dashboard', verificarToken, async (req, res) => {
  if (!req.isCeo) return res.status(403).json({ error: 'Acesso Negado' });
  const total = await pool.query('SELECT count(*) as qtd FROM usuarios WHERE is_ceo = false');
  const faturamento = await pool.query('SELECT sum(valor) as giro FROM vendas');
  const empresas = await pool.query(`SELECT u.id, u.nome, u.telefone, u.data_vencimento, u.status_assinatura, COALESCE(sum(v.valor), 0) as faturamento_total FROM usuarios u LEFT JOIN vendas v ON u.id = v.usuario_id WHERE u.is_ceo = false GROUP BY u.id ORDER BY u.data_vencimento ASC`);
  res.json({ totalEmpresas: Number(total.rows[0].qtd), faturamentoGlobal: Number(faturamento.rows[0].giro) || 0, empresas: empresas.rows });
});

app.post('/api/ceo/usuarios/:id/renovar', verificarToken, async (req, res) => {
  if (!req.isCeo) return res.status(403).json({ error: 'Acesso Negado' });
  const novaData = new Date();
  novaData.setDate(novaData.getDate() + 30);
  await pool.query("UPDATE usuarios SET data_vencimento = $1, status_assinatura = 'pago' WHERE id = $2", [novaData, req.params.id]);
  res.json({ message: 'Acesso liberado com sucesso' });
});

app.delete('/api/ceo/usuarios/:id', verificarToken, async (req, res) => {
  if (!req.isCeo) return res.status(403).json({ error: 'Acesso Negado' });
  await pool.query("DELETE FROM usuarios WHERE id = $1", [req.params.id]);
  res.json({ message: 'Usuário excluído com sucesso' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Motor V8 AURUM rodando na porta ${PORT}`);
});