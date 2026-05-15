require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

// 🌟 AUTO-SINCRONIZADOR
pool.connect().then(async () => {
  console.log('💎 Servidor AURUM Conectado!');
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS profissionais (id SERIAL PRIMARY KEY, nome VARCHAR(100) NOT NULL, email VARCHAR(100) UNIQUE NOT NULL, senha VARCHAR(255) NOT NULL, telefone VARCHAR(20), is_ceo BOOLEAN DEFAULT FALSE, data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
      ALTER TABLE profissionais ADD COLUMN IF NOT EXISTS horarios_trabalho TEXT DEFAULT '08:00,09:00,10:00,11:00,12:00,13:00,14:00,15:00,16:00,17:00,18:00,19:00,20:00,21:00,22:00';
      ALTER TABLE profissionais ADD COLUMN IF NOT EXISTS logo_url TEXT;
      ALTER TABLE profissionais ADD COLUMN IF NOT EXISTS plano VARCHAR(50) DEFAULT 'premium';
      ALTER TABLE profissionais ADD COLUMN IF NOT EXISTS status_assinatura VARCHAR(20) DEFAULT 'trial';
      ALTER TABLE profissionais ADD COLUMN IF NOT EXISTS data_vencimento TIMESTAMP;
      
      UPDATE profissionais SET data_vencimento = CURRENT_TIMESTAMP + INTERVAL '30 days' WHERE data_vencimento IS NULL AND is_ceo = FALSE;

      CREATE TABLE IF NOT EXISTS servicos (id SERIAL PRIMARY KEY, profissional_id INTEGER REFERENCES profissionais(id) ON DELETE CASCADE, nome VARCHAR(100) NOT NULL, preco DECIMAL(10,2) NOT NULL, tempo VARCHAR(50));
      CREATE TABLE IF NOT EXISTS clientes (id SERIAL PRIMARY KEY, profissional_id INTEGER REFERENCES profissionais(id) ON DELETE CASCADE, nome VARCHAR(100) NOT NULL, whatsapp VARCHAR(20), nascimento VARCHAR(20), observacoes TEXT, data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
      ALTER TABLE clientes ADD COLUMN IF NOT EXISTS observacoes TEXT;
      CREATE TABLE IF NOT EXISTS vendas (id SERIAL PRIMARY KEY, profissional_id INTEGER REFERENCES profissionais(id) ON DELETE CASCADE, valor DECIMAL(10,2) NOT NULL, data_venda TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS agendamentos (id SERIAL PRIMARY KEY, profissional_id INTEGER REFERENCES profissionais(id) ON DELETE CASCADE, cliente_nome VARCHAR(100), cliente_whatsapp VARCHAR(20), servico_nome VARCHAR(255), data_reserva VARCHAR(20) DEFAULT 'Hoje', horario VARCHAR(255), valor DECIMAL(10,2), status VARCHAR(20) DEFAULT 'pendente', data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
      ALTER TABLE agendamentos ALTER COLUMN horario TYPE VARCHAR(255);
      CREATE TABLE IF NOT EXISTS funcionarios (id SERIAL PRIMARY KEY, salao_id INTEGER REFERENCES profissionais(id) ON DELETE CASCADE, nome VARCHAR(100) NOT NULL, comissao DECIMAL(5,2) DEFAULT 0);
      ALTER TABLE agendamentos ADD COLUMN IF NOT EXISTS cliente_id INTEGER REFERENCES clientes(id) ON DELETE SET NULL;
      ALTER TABLE agendamentos ADD COLUMN IF NOT EXISTS funcionario_id INTEGER REFERENCES funcionarios(id) ON DELETE SET NULL;
      ALTER TABLE agendamentos ADD COLUMN IF NOT EXISTS funcionario_nome VARCHAR(100);
      ALTER TABLE agendamentos ADD COLUMN IF NOT EXISTS duracao_minutos INTEGER DEFAULT 60;
      ALTER TABLE agendamentos ADD COLUMN IF NOT EXISTS horario_fim VARCHAR(5);
      ALTER TABLE vendas ADD COLUMN IF NOT EXISTS funcionario_id INTEGER REFERENCES funcionarios(id) ON DELETE SET NULL;
      ALTER TABLE vendas ADD COLUMN IF NOT EXISTS comissao_valor DECIMAL(10,2) DEFAULT 0;
      CREATE TABLE IF NOT EXISTS tickets (id SERIAL PRIMARY KEY, profissional_id INTEGER REFERENCES profissionais(id) ON DELETE CASCADE, mensagem TEXT NOT NULL, status VARCHAR(20) DEFAULT 'aberto', data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
    `);
    console.log('✅ Banco de dados pronto para o Financeiro Premium!');
  } catch (e) { console.error('Erro na sincronização:', e); }
}).catch(err => console.error(err));

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

const FUSO_HORARIO_PADRAO = 'America/Sao_Paulo';
const PASSO_PADRAO_AGENDA = 15;

const obterPartesDataHoraBrasil = () => {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: FUSO_HORARIO_PADRAO,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).formatToParts(new Date());

  const mapa = partes.reduce((acc, item) => {
    if (item.type !== 'literal') acc[item.type] = item.value;
    return acc;
  }, {});

  return {
    iso: `${mapa.year}-${mapa.month}-${mapa.day}`,
    br: `${mapa.day}/${mapa.month}/${mapa.year}`,
    minutos: Number(mapa.hour) * 60 + Number(mapa.minute)
  };
};


// ==========================================
// ⏱️ UTILITÁRIOS DE AGENDA INTELIGENTE
// ==========================================
const normalizarDataBR = (data) => {
  if (!data) return data;
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(data)) return data;
  if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }
  return data;
};

const dataBRParaISO = (data) => {
  if (!data) return data;
  if (/^\d{4}-\d{2}-\d{2}$/.test(data)) return data;
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(data)) {
    const [dia, mes, ano] = data.split('/');
    return `${ano}-${mes}-${dia}`;
  }
  return data;
};

const horaParaMinutos = (hora) => {
  if (!hora || typeof hora !== 'string') return null;
  const [h, m] = hora.trim().split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
};

const minutosParaHora = (minutos) => {
  const h = Math.floor(minutos / 60).toString().padStart(2, '0');
  const m = (minutos % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
};

const calcularPassoAgenda = (horarios) => {
  const minutos = horarios.map(horaParaMinutos).filter(v => v !== null).sort((a, b) => a - b);
  let menorPasso = 60;
  for (let i = 1; i < minutos.length; i++) {
    const diff = minutos[i] - minutos[i - 1];
    if (diff > 0 && diff < menorPasso) menorPasso = diff;
  }
  return menorPasso || 60;
};

const prepararExpediente = (horariosBrutos = []) => {
  const minutosBase = horariosBrutos
    .map(horaParaMinutos)
    .filter(v => v !== null)
    .sort((a, b) => a - b);

  const unicos = [...new Set(minutosBase)];

  if (unicos.length === 0) {
    return { horarios: [], inicioExpediente: null, fimExpediente: null, passoOriginal: PASSO_PADRAO_AGENDA };
  }

  const passoOriginal = calcularPassoAgenda(unicos.map(minutosParaHora));
  const inicioExpediente = unicos[0];
  const fimExpediente = unicos[unicos.length - 1] + Math.max(passoOriginal, PASSO_PADRAO_AGENDA);

  const horarios = [];
  for (let minuto = inicioExpediente; minuto < fimExpediente; minuto += PASSO_PADRAO_AGENDA) {
    horarios.push(minutosParaHora(minuto));
  }

  return { horarios, inicioExpediente, fimExpediente, passoOriginal };
};

const horarioDentroDoExpediente = (horarioInicio, duracaoMinutos, expediente) => {
  const inicio = horaParaMinutos(horarioInicio);
  if (inicio === null || !expediente || expediente.inicioExpediente === null || expediente.fimExpediente === null) return false;
  const fim = inicio + duracaoMinutos;
  const alinhadoAoPasso = inicio % PASSO_PADRAO_AGENDA === 0;
  return alinhadoAoPasso && inicio >= expediente.inicioExpediente && fim <= expediente.fimExpediente;
};

const existeConflitoHorario = (inicioA, fimA, inicioB, fimB) => {
  return inicioA < fimB && fimA > inicioB;
};

const montarIntervalosOcupados = (agendamentos) => {
  const intervalos = [];
  agendamentos.forEach(item => {
    if (!item.horario) return;
    String(item.horario).split(',').forEach(horaBruta => {
      const inicio = horaParaMinutos(horaBruta.trim());
      if (inicio === null) return;
      const duracao = parseInt(item.duracao_minutos, 10) || 60;
      const fimBanco = item.horario_fim ? horaParaMinutos(item.horario_fim) : null;
      const fim = fimBanco && fimBanco > inicio ? fimBanco : inicio + duracao;
      intervalos.push({ inicio, fim });
    });
  });
  return intervalos;
};

const horarioEstaDisponivel = (horarioInicio, duracaoMinutos, intervalosOcupados) => {
  const inicio = horaParaMinutos(horarioInicio);
  if (inicio === null) return false;
  const fim = inicio + duracaoMinutos;
  return !intervalosOcupados.some(intervalo =>
    existeConflitoHorario(inicio, fim, intervalo.inicio, intervalo.fim)
  );
};


app.post('/api/cadastro', async (req, res) => {
  const { nome, email, senha, telefone } = req.body;
  try {
    const usuarioExiste = await pool.query('SELECT id, email, telefone FROM profissionais WHERE email = $1 OR telefone = $2', [email, telefone]);
    if (usuarioExiste.rows.length > 0) return res.status(400).json({ error: 'E-mail ou WhatsApp já em uso.' });
    const senhaHash = await bcrypt.hash(senha, await bcrypt.genSalt(10));
    const isCeo = email === 'codebyanderson@hotmail.com';
    const result = await pool.query(`INSERT INTO profissionais (nome, email, senha, telefone, is_ceo, data_vencimento) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP + INTERVAL '30 days') RETURNING id, nome, email, is_ceo`, [nome, email, senhaHash, telefone, isCeo]);
    res.status(201).json({ usuario: result.rows[0], token: jwt.sign({ id: result.rows[0].id, is_ceo: isCeo }, JWT_SECRET, { expiresIn: '30d' }) });
  } catch (error) { res.status(500).json({ error: 'Erro no cadastro.' }); }
});

app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const result = await pool.query('SELECT * FROM profissionais WHERE email = $1', [email]);
    if (result.rows.length === 0 || !(await bcrypt.compare(senha, result.rows[0].senha))) return res.status(400).json({ error: 'Credenciais incorretas.' });
    res.json({ usuario: result.rows[0], token: jwt.sign({ id: result.rows[0].id, is_ceo: result.rows[0].is_ceo }, JWT_SECRET, { expiresIn: '30d' }) });
  } catch (error) { res.status(500).json({ error: 'Erro no login.' }); }
});

app.get('/api/assinatura', verificarToken, async (req, res) => {
  if (req.isCeo) return res.json({ status: 'ativo', dias_restantes: 999 });
  try {
    const r = await pool.query('SELECT status_assinatura, data_vencimento FROM profissionais WHERE id = $1', [req.profissionalId]);
    if(r.rows.length === 0) return res.status(404).json({error: 'Usuário não encontrado'});
    
    const vencimento = new Date(r.rows[0].data_vencimento);
    const hoje = new Date();
    const diasRestantes = Math.ceil((vencimento - hoje) / (1000 * 60 * 60 * 24));
    
    if (hoje > vencimento && r.rows[0].status_assinatura !== 'pago') {
       return res.json({ status: 'vencido', dias_restantes: 0 });
    }
    
    res.json({ status: 'ativo', dias_restantes: diasRestantes });
  } catch (error) { res.status(500).json({ error: 'Erro' }); }
});

// ==========================================
// 🤑 INTEGRAÇÃO MERCADO PAGO (TRAVADO EM R$ 24,99)
// ==========================================
const MERCADO_PAGO_TOKEN = process.env.MP_ACCESS_TOKEN || 'APP_USR-5859543563291720-040214-783927917fff7300e8f5d14b728cc61e-270036990'; 

app.post('/api/gerar-pix', verificarToken, async (req, res) => {
  const valor = 24.99; 
  
  try {
    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MERCADO_PAGO_TOKEN}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': `pix-${req.profissionalId}-${Date.now()}`
      },
      body: JSON.stringify({
        transaction_amount: valor,
        description: `AURUM PREMIUM - Assinatura Mensal`,
        payment_method_id: 'pix',
        payer: { 
          email: `cliente_${req.profissionalId}@aurum.com`,
          first_name: "Assinante",
          last_name: "Premium" 
        },
        external_reference: req.profissionalId.toString() 
      })
    });

    const data = await response.json();
    console.log("📢 RESPOSTA DO MERCADO PAGO:", data);
    
    if (data.point_of_interaction && data.point_of_interaction.transaction_data) {
      res.json({ 
        qr_code_base64: data.point_of_interaction.transaction_data.qr_code_base64,
        qr_code_copia_cola: data.point_of_interaction.transaction_data.qr_code,
        payment_id: data.id
      });
    } else {
      res.status(400).json({ erro_mp: true, mensagem: "Erro no MP", detalhes: data });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Falha ao gerar PIX' });
  }
});

// 🔔 O OUVIDO DO SISTEMA (WEBHOOK)
app.post('/api/webhook', async (req, res) => {
  const paymentId = req.query.id || req.query['data.id'] || req.body?.data?.id;
  if (!paymentId) return res.sendStatus(200); 

  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { 'Authorization': `Bearer ${MERCADO_PAGO_TOKEN}` }
    });
    const payment = await response.json();

    if (payment.status === 'approved') {
      const profissionalId = payment.external_reference; 
      await pool.query(`UPDATE profissionais SET status_assinatura = 'pago', data_vencimento = CURRENT_TIMESTAMP + INTERVAL '30 days' WHERE id = $1`, [profissionalId]);
      console.log(`✅ [AURUM FINANCEIRO] Pagamento recebido! Conta ID ${profissionalId} renovada por 30 dias.`);
    }
    res.sendStatus(200);
  } catch(e) {
    console.error('Erro no webhook:', e);
    res.sendStatus(500);
  }
});


// ROTAS PADRÕES
app.get('/api/ceo/dashboard', verificarToken, verificarCEO, async (req, res) => { try { const empresas = await pool.query(`SELECT p.id, p.nome, p.email, p.telefone, COALESCE(SUM(v.valor), 0) as faturamento_total FROM profissionais p LEFT JOIN vendas v ON p.id = v.profissional_id WHERE p.is_ceo = FALSE GROUP BY p.id ORDER BY p.data_cadastro DESC`); res.json({ totalEmpresas: empresas.rows.length, faturamentoGlobal: empresas.rows.reduce((acc, curr) => acc + parseFloat(curr.faturamento_total), 0), empresas: empresas.rows }); } catch (error) { res.status(500).json({ error: 'Erro CEO' }); } });
app.delete('/api/ceo/usuarios/:id', verificarToken, verificarCEO, async (req, res) => { try { await pool.query('DELETE FROM profissionais WHERE id = $1 AND is_ceo = FALSE', [req.params.id]); res.json({ message: 'Excluído' }); } catch (error) { res.status(500).json({ error: 'Erro' }); } });
app.post('/api/tickets', verificarToken, async (req, res) => { try { await pool.query('INSERT INTO tickets (profissional_id, mensagem) VALUES ($1, $2)', [req.profissionalId, req.body.mensagem]); res.status(201).json({ message: 'Ticket aberto' }); } catch(e) { res.status(500).json({ error: 'Erro ao abrir ticket' }); } });
app.get('/api/ceo/tickets', verificarToken, verificarCEO, async (req, res) => { try { const result = await pool.query("SELECT t.*, p.nome as salao_nome, p.telefone as salao_whatsapp FROM tickets t JOIN profissionais p ON t.profissional_id = p.id WHERE t.status = 'aberto' ORDER BY t.data_criacao DESC"); res.json(result.rows); } catch(e) { res.status(500).json({ error: 'Erro buscar tickets' }); } });
app.delete('/api/ceo/tickets/:id', verificarToken, verificarCEO, async (req, res) => { try { await pool.query("UPDATE tickets SET status = 'resolvido' WHERE id = $1", [req.params.id]); res.json({ message: 'Ticket resolvido' }); } catch(e) { res.status(500).json({ error: 'Erro fechar ticket' }); } });
app.get('/api/dashboard', verificarToken, async (req, res) => { try { const result = await pool.query('SELECT COALESCE(SUM(valor), 0) as ganho_dia, COUNT(id) as qtd_atendimentos FROM vendas WHERE profissional_id = $1 AND DATE(data_venda) = CURRENT_DATE', [req.profissionalId]); res.json({ ganhoDia: parseFloat(result.rows[0].ganho_dia), qtdAtendimentos: parseInt(result.rows[0].qtd_atendimentos) }); } catch (error) { res.status(500).json({ error: 'Erro dash' }); } });
app.get('/api/funcionarios', verificarToken, async (req, res) => { try { res.json((await pool.query('SELECT * FROM funcionarios WHERE salao_id = $1 ORDER BY id DESC', [req.profissionalId])).rows); } catch (error) { res.status(500).json({ error: 'Erro' }); } });
app.post('/api/funcionarios', verificarToken, async (req, res) => { try { res.status(201).json((await pool.query('INSERT INTO funcionarios (salao_id, nome, comissao) VALUES ($1, $2, $3) RETURNING *', [req.profissionalId, req.body.nome, parseFloat(req.body.comissao || 0)])).rows[0]); } catch (error) { res.status(500).json({ error: 'Erro' }); } });
app.delete('/api/funcionarios/:id', verificarToken, async (req, res) => { try { await pool.query('DELETE FROM funcionarios WHERE id = $1 AND salao_id = $2', [req.params.id, req.profissionalId]); res.json({ message: 'Removido' }); } catch (error) { res.status(500).json({ error: 'Erro' }); } });
app.get('/api/configuracoes', verificarToken, async (req, res) => { try { res.json((await pool.query('SELECT horarios_trabalho, logo_url FROM profissionais WHERE id = $1', [req.profissionalId])).rows[0]); } catch (e) { res.status(500).json({ error: 'Erro' }); } });
app.post('/api/configuracoes', verificarToken, async (req, res) => { try { await pool.query('UPDATE profissionais SET horarios_trabalho = $1, logo_url = COALESCE($2, logo_url) WHERE id = $3', [req.body.horarios, req.body.logo_url, req.profissionalId]); res.json({ message: 'Salvo' }); } catch (e) { console.error(e); res.status(500).json({ error: 'Erro' }); } });
app.get('/api/servicos', verificarToken, async (req, res) => { try { res.json((await pool.query('SELECT * FROM servicos WHERE profissional_id = $1 ORDER BY id DESC', [req.profissionalId])).rows); } catch(e){ res.status(500).json({error: 'erro'}); } });
app.post('/api/servicos', verificarToken, async (req, res) => { try { res.status(201).json((await pool.query('INSERT INTO servicos (profissional_id, nome, preco, tempo) VALUES ($1, $2, $3, $4) RETURNING *', [req.profissionalId, req.body.nome, parseFloat(req.body.preco.replace(',', '.')), req.body.tempo])).rows[0]); } catch(e){ res.status(500).json({error:'erro'}); }});
app.delete('/api/servicos/:id', verificarToken, async (req, res) => { try { await pool.query('DELETE FROM servicos WHERE id = $1 AND profissional_id = $2', [req.params.id, req.profissionalId]); res.json({ message: 'Removido' }); } catch(e){ res.status(500).json({error:'erro'}); }});
app.get('/api/vendas', verificarToken, async (req, res) => { try { res.json((await pool.query('SELECT v.*, f.nome as funcionario_nome FROM vendas v LEFT JOIN funcionarios f ON v.funcionario_id = f.id WHERE v.profissional_id = $1 ORDER BY v.data_venda DESC LIMIT 50', [req.profissionalId])).rows); } catch (error) { res.status(500).json({ error: 'Erro vendas' }); } });
app.post('/api/vendas', verificarToken, async (req, res) => { try { res.status(201).json((await pool.query('INSERT INTO vendas (profissional_id, valor) VALUES ($1, $2) RETURNING *', [req.profissionalId, req.body.valor])).rows[0]); } catch (error) { res.status(500).json({ error: 'Erro vender' }); } });
app.get('/api/agendamentos', verificarToken, async (req, res) => { try { res.json((await pool.query("SELECT * FROM agendamentos WHERE profissional_id = $1 AND status = 'pendente' ORDER BY id ASC", [req.profissionalId])).rows); } catch (error) { res.status(500).json({ error: 'Erro agenda' }); } });
app.post('/api/agendamentos/:id/concluir', verificarToken, async (req, res) => {
  try {
    const agenda = await pool.query('SELECT valor, funcionario_id FROM agendamentos WHERE id = $1 AND profissional_id = $2', [req.params.id, req.profissionalId]);
    if(agenda.rows.length === 0) return res.status(404).json({error: 'Não encontrado'});
    let comissaoValor = 0; const funcId = agenda.rows[0].funcionario_id; const valorVenda = agenda.rows[0].valor;
    if (funcId) { const func = await pool.query('SELECT comissao FROM funcionarios WHERE id = $1', [funcId]); if (func.rows.length > 0) { comissaoValor = (valorVenda * func.rows[0].comissao) / 100; } }
    await pool.query("UPDATE agendamentos SET status = 'concluido' WHERE id = $1", [req.params.id]);
    await pool.query('INSERT INTO vendas (profissional_id, valor, funcionario_id, comissao_valor) VALUES ($1, $2, $3, $4)', [req.profissionalId, valorVenda, funcId, comissaoValor]);
    res.json({ message: 'Concluído com sucesso!' });
  } catch (error) { res.status(500).json({ error: 'Erro concluir' }); }
});

app.get('/api/clientes', verificarToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        c.id,
        c.nome,
        c.whatsapp,
        c.nascimento,
        c.observacoes,
        c.data_cadastro,
        MAX(a.data_criacao) as ultima_visita,
        COUNT(a.id) as total_visitas,
        COALESCE(SUM(CASE WHEN a.status = 'concluido' THEN a.valor ELSE 0 END), 0) as total_gasto,
        (
          SELECT a2.servico_nome
          FROM agendamentos a2
          WHERE a2.profissional_id = c.profissional_id
          AND (
            a2.cliente_id = c.id
            OR REGEXP_REPLACE(COALESCE(a2.cliente_whatsapp, ''), '\\D', '', 'g') = REGEXP_REPLACE(COALESCE(c.whatsapp, ''), '\\D', '', 'g')
          )
          ORDER BY a2.data_criacao DESC
          LIMIT 1
        ) as ultimo_servico,
        (
          SELECT a3.funcionario_nome
          FROM agendamentos a3
          WHERE a3.profissional_id = c.profissional_id
          AND (
            a3.cliente_id = c.id
            OR REGEXP_REPLACE(COALESCE(a3.cliente_whatsapp, ''), '\\D', '', 'g') = REGEXP_REPLACE(COALESCE(c.whatsapp, ''), '\\D', '', 'g')
          )
          AND a3.funcionario_nome IS NOT NULL
          ORDER BY a3.data_criacao DESC
          LIMIT 1
        ) as profissional_preferido
      FROM clientes c
      LEFT JOIN agendamentos a
        ON a.profissional_id = c.profissional_id
        AND (
          a.cliente_id = c.id
          OR REGEXP_REPLACE(COALESCE(a.cliente_whatsapp, ''), '\\D', '', 'g') = REGEXP_REPLACE(COALESCE(c.whatsapp, ''), '\\D', '', 'g')
        )
      WHERE c.profissional_id = $1
      GROUP BY c.id
      ORDER BY ultima_visita DESC NULLS LAST, c.data_cadastro DESC
    `, [req.profissionalId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar CRM:', error);
    res.status(500).json({ error: 'Erro ao buscar CRM' });
  }
});

app.post('/api/clientes', verificarToken, async (req, res) => {
  const { nome, whatsapp, nascimento, observacoes } = req.body;

  if (!nome || !String(nome).trim()) {
    return res.status(400).json({ error: 'Nome do cliente é obrigatório.' });
  }

  try {
    const whatsLimpo = String(whatsapp || '').replace(/\D/g, '');

    if (whatsLimpo) {
      const existente = await pool.query(
        `SELECT * FROM clientes
         WHERE profissional_id = $1
         AND REGEXP_REPLACE(COALESCE(whatsapp, ''), '\\D', '', 'g') = $2
         LIMIT 1`,
        [req.profissionalId, whatsLimpo]
      );

      if (existente.rows.length > 0) {
        const atualizado = await pool.query(
          `UPDATE clientes
           SET nome = $1,
               whatsapp = $2,
               nascimento = COALESCE($3, nascimento),
               observacoes = COALESCE($4, observacoes)
           WHERE id = $5 AND profissional_id = $6
           RETURNING *`,
          [nome.trim(), whatsapp || '', nascimento || null, observacoes || null, existente.rows[0].id, req.profissionalId]
        );
        return res.status(200).json(atualizado.rows[0]);
      }
    }

    const result = await pool.query(
      `INSERT INTO clientes (profissional_id, nome, whatsapp, nascimento, observacoes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.profissionalId, nome.trim(), whatsapp || '', nascimento || null, observacoes || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao cadastrar cliente:', error);
    res.status(500).json({ error: 'Erro ao cadastrar cliente.' });
  }
});

app.get('/api/clientes/:id/historico', verificarToken, async (req, res) => {
  try {
    const cliente = await pool.query(
      'SELECT * FROM clientes WHERE id = $1 AND profissional_id = $2',
      [req.params.id, req.profissionalId]
    );

    if (cliente.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado.' });
    }

    const whatsLimpo = String(cliente.rows[0].whatsapp || '').replace(/\D/g, '');

    const historico = await pool.query(
      `SELECT *
       FROM agendamentos
       WHERE profissional_id = $1
       AND (
         cliente_id = $2
         OR REGEXP_REPLACE(COALESCE(cliente_whatsapp, ''), '\\D', '', 'g') = $3
       )
       ORDER BY data_criacao DESC`,
      [req.profissionalId, req.params.id, whatsLimpo]
    );

    res.json(historico.rows);
  } catch (error) {
    console.error('Erro ao buscar histórico do cliente:', error);
    res.status(500).json({ error: 'Erro ao buscar histórico.' });
  }
});
app.get('/api/public/profissional/:id_profissional', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT nome, telefone, horarios_trabalho, logo_url FROM profissionais WHERE id = $1',
      [req.params.id_profissional]
    );

    const profissional = result.rows[0] || {};
    const horariosBrutos = String(profissional.horarios_trabalho || '')
      .split(',')
      .map(h => h.trim())
      .filter(Boolean);

    const expediente = prepararExpediente(horariosBrutos);

    res.json({
      ...profissional,
      horarios_trabalho: expediente.horarios.join(',')
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro' });
  }
});
app.get('/api/public/servicos/:id_profissional', async (req, res) => { try { res.json((await pool.query('SELECT * FROM servicos WHERE profissional_id = $1 ORDER BY id DESC', [req.params.id_profissional])).rows); } catch(e) { res.status(500).json({ error: 'erro' }); } });
app.get('/api/public/funcionarios/:id_profissional', async (req, res) => { try { res.json((await pool.query('SELECT id, nome FROM funcionarios WHERE salao_id = $1 ORDER BY id ASC', [req.params.id_profissional])).rows); } catch (error) { res.status(500).json({ error: 'Erro func' }); } });
app.get('/api/public/historico/:id_profissional/:whatsapp', async (req, res) => { try { const result = await pool.query(`SELECT servico_nome FROM agendamentos WHERE profissional_id = $1 AND cliente_whatsapp = $2 ORDER BY data_criacao DESC LIMIT 1`, [req.params.id_profissional, req.params.whatsapp]); res.json({ ultimoServico: result.rows.length > 0 ? result.rows[0].servico_nome : null }); } catch(e){ res.status(500).json({ error: 'erro' }); } });
app.get('/api/public/horarios-ocupados/:id_profissional', async (req, res) => {
  try {
    const idProfissional = req.params.id_profissional;
    const dataBR = normalizarDataBR(req.query.data);
    const duracaoMinutos = Math.max(parseInt(req.query.duracao, 10) || 60, 5);
    const funcionarioId = req.query.funcionario_id ? parseInt(req.query.funcionario_id, 10) : null;

    const profissional = await pool.query(
      'SELECT horarios_trabalho FROM profissionais WHERE id = $1',
      [idProfissional]
    );

    const horariosBrutos = (profissional.rows[0]?.horarios_trabalho || '')
      .split(',')
      .map(h => h.trim())
      .filter(Boolean);

    const expediente = prepararExpediente(horariosBrutos);
    const horariosTrabalho = expediente.horarios;

    if (horariosTrabalho.length === 0) {
      return res.json([]);
    }

    // Busca todos os agendamentos do dia.
    // Depois filtramos por funcionário em JavaScript para evitar erro de lógica no SQL.
    const agendamentosResult = await pool.query(
      `
      SELECT
        id,
        horario,
        horario_fim,
        duracao_minutos,
        funcionario_id,
        funcionario_nome,
        status
      FROM agendamentos
      WHERE profissional_id = $1
      AND data_reserva = $2
      AND COALESCE(status, 'pendente') != 'cancelado'
      `,
      [idProfissional, dataBR]
    );

    let agendamentosDoDia = agendamentosResult.rows;

    /*
      REGRA PROFISSIONAL:
      - Se cliente escolhe "sem preferência", bloqueia qualquer horário já usado por qualquer funcionário.
      - Se cliente escolhe um funcionário específico, bloqueia:
        1. agendamentos daquele funcionário
        2. agendamentos sem funcionário definido
    */
    if (funcionarioId) {
      agendamentosDoDia = agendamentosDoDia.filter(item => {
        return (
          !item.funcionario_id ||
          parseInt(item.funcionario_id, 10) === funcionarioId
        );
      });
    }

    const intervalosOcupados = montarIntervalosOcupados(agendamentosDoDia);

    const dataHoraBrasil = obterPartesDataHoraBrasil();
    const hojeISO = dataHoraBrasil.iso;
    const agoraMinutos = dataHoraBrasil.minutos;
    const dataSelecionadaISO = dataBRParaISO(dataBR);

    const ocupados = horariosTrabalho.filter(horario => {
      const inicio = horaParaMinutos(horario);
      if (inicio === null) return true;

      const fim = inicio + duracaoMinutos;

      // Bloqueia horários passados no dia atual
      if (dataSelecionadaISO === hojeISO && inicio <= agoraMinutos) {
        return true;
      }

      // Bloqueia se o serviço não couber no expediente real do salão
      if (!horarioDentroDoExpediente(horario, duracaoMinutos, expediente)) {
        return true;
      }

      // Bloqueia conflito real de intervalo
      const conflito = intervalosOcupados.some(intervalo => {
        return inicio < intervalo.fim && fim > intervalo.inicio;
      });

      return conflito;
    });

    res.json(ocupados);

  } catch (error) {
    console.error('Erro ao buscar horários ocupados:', error);
    res.status(500).json({ error: 'Erro ocupados' });
  }
});

app.post('/api/public/agendamentos', async (req, res) => {
  const {
    id_profissional,
    nome,
    whatsapp,
    nascimento,
    servico_nome,
    data_reserva,
    horario,
    valor,
    funcionario_id,
    funcionario_nome,
    duracao_minutos
  } = req.body;

  try {
    const dataBR = normalizarDataBR(data_reserva);
    const duracaoMinutos = Math.max(parseInt(duracao_minutos, 10) || 60, 5);
    const inicioMinutos = horaParaMinutos(horario);

    if (inicioMinutos === null) {
      return res.status(400).json({ error: 'Horário inválido.' });
    }

    const horarioFim = minutosParaHora(inicioMinutos + duracaoMinutos);
    const funcionarioId = funcionario_id ? parseInt(funcionario_id, 10) : null;

    const dataHoraBrasil = obterPartesDataHoraBrasil();
    const hojeISO = dataHoraBrasil.iso;
    const agoraMinutos = dataHoraBrasil.minutos;
    const dataSelecionadaISO = dataBRParaISO(dataBR);
    if (dataSelecionadaISO && dataSelecionadaISO < hojeISO) {
      return res.status(400).json({ error: 'Não é possível agendar em data passada.' });
    }

    if (dataSelecionadaISO === hojeISO && inicioMinutos <= agoraMinutos) {
      return res.status(400).json({ error: 'Este horário já passou. Escolha um horário mais à frente.' });
    }

    const profissionalResult = await pool.query(
      'SELECT horarios_trabalho FROM profissionais WHERE id = $1',
      [id_profissional]
    );

    if (profissionalResult.rows.length === 0) {
      return res.status(404).json({ error: 'Profissional não encontrado.' });
    }

    const horariosBrutos = String(profissionalResult.rows[0].horarios_trabalho || '')
      .split(',')
      .map(h => h.trim())
      .filter(Boolean);

    const expediente = prepararExpediente(horariosBrutos);

    if (expediente.horarios.length > 0 && !horarioDentroDoExpediente(horario, duracaoMinutos, expediente)) {
      return res.status(400).json({ error: 'O serviço não cabe neste horário de expediente.' });
    }

    // Busca todos os agendamentos do dia.
    const agendamentosResult = await pool.query(
      `
      SELECT
        id,
        horario,
        horario_fim,
        duracao_minutos,
        funcionario_id,
        funcionario_nome,
        status
      FROM agendamentos
      WHERE profissional_id = $1
      AND data_reserva = $2
      AND COALESCE(status, 'pendente') != 'cancelado'
      `,
      [id_profissional, dataBR]
    );

    let agendamentosDoDia = agendamentosResult.rows;

    /*
      REGRA DE CONFLITO:
      - Se o novo agendamento está "sem preferência", ele conflita com qualquer agendamento do dia.
      - Se tem funcionário específico, conflita com:
        1. agendamento do mesmo funcionário
        2. agendamento sem funcionário
    */
    if (funcionarioId) {
      agendamentosDoDia = agendamentosDoDia.filter(item => {
        return (
          !item.funcionario_id ||
          parseInt(item.funcionario_id, 10) === funcionarioId
        );
      });
    }

    const intervalosOcupados = montarIntervalosOcupados(agendamentosDoDia);

    const conflito = intervalosOcupados.some(intervalo => {
      return inicioMinutos < intervalo.fim && (inicioMinutos + duracaoMinutos) > intervalo.inicio;
    });

    if (conflito) {
      return res.status(409).json({
        error: 'Este horário já está ocupado. Escolha outro horário.'
      });
    }

    const whatsLimpo = String(whatsapp || '').replace(/\D/g, '');
    let clienteId = null;

    if (whatsLimpo) {
      const clienteExiste = await pool.query(
        `SELECT id FROM clientes
         WHERE profissional_id = $1
         AND REGEXP_REPLACE(COALESCE(whatsapp, ''), '\\D', '', 'g') = $2
         LIMIT 1`,
        [id_profissional, whatsLimpo]
      );

      if (clienteExiste.rows.length === 0) {
        const novoCliente = await pool.query(
          'INSERT INTO clientes (profissional_id, nome, whatsapp, nascimento) VALUES ($1, $2, $3, $4) RETURNING id',
          [id_profissional, nome, whatsapp, nascimento]
        );
        clienteId = novoCliente.rows[0].id;
      } else {
        clienteId = clienteExiste.rows[0].id;
        await pool.query(
          'UPDATE clientes SET nome = $1, whatsapp = $2, nascimento = COALESCE($3, nascimento) WHERE id = $4 AND profissional_id = $5',
          [nome, whatsapp, nascimento || null, clienteId, id_profissional]
        );
      }
    } else {
      const novoCliente = await pool.query(
        'INSERT INTO clientes (profissional_id, nome, whatsapp, nascimento) VALUES ($1, $2, $3, $4) RETURNING id',
        [id_profissional, nome, whatsapp || '', nascimento]
      );
      clienteId = novoCliente.rows[0].id;
    }

    const result = await pool.query(
      `INSERT INTO agendamentos
      (
        profissional_id,
        cliente_id,
        cliente_nome,
        cliente_whatsapp,
        servico_nome,
        data_reserva,
        horario,
        horario_fim,
        duracao_minutos,
        valor,
        funcionario_id,
        funcionario_nome
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        id_profissional,
        clienteId,
        nome,
        whatsapp,
        servico_nome,
        dataBR,
        horario,
        horarioFim,
        duracaoMinutos,
        valor,
        funcionarioId || null,
        funcionario_nome || null
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error('ERRO GRAVE AO AGENDAR:', error);
    res.status(500).json({ error: 'Erro agendar' });
  }
});

const PORT = process.env.PORT || 3333; app.listen(PORT, () => console.log(`🚀 Servidor AURUM ERP na porta ${PORT}`));