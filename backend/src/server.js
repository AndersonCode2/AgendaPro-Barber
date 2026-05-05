require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL, 
  ssl: { rejectUnauthorized: false } 
});

const JWT_SECRET = process.env.JWT_SECRET || 'aurum_secret_2026';

// 🌟 SINCRONIZADOR DE TABELAS
pool.connect().then(async () => {
  console.log('💎 Servidor AURUM Conectado!');
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS profissionais (
        id SERIAL PRIMARY KEY, 
        nome VARCHAR(100) NOT NULL, 
        email VARCHAR(100) UNIQUE NOT NULL, 
        senha VARCHAR(255) NOT NULL, 
        telefone VARCHAR(20), 
        is_ceo BOOLEAN DEFAULT FALSE, 
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        horarios_trabalho TEXT DEFAULT '08:00,09:00,10:00,11:00,12:00,13:00,14:00,15:00,16:00,17:00,18:00,19:00,20:00,21:00,22:00',
        logo_url TEXT,
        data_vencimento TIMESTAMP DEFAULT CURRENT_TIMESTAMP + INTERVAL '30 days'
      );
    `);
  } catch (err) { console.error('Erro na sincronização:', err); }
});

// --- ROTAS DO CEO (ADMINISTRAÇÃO MASTER) ---
app.get('/api/admin/profissionais', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nome, email, data_vencimento FROM profissionais WHERE is_ceo = false ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: 'Erro ao listar empresas' }); }
});

app.post('/api/admin/renovar', async (req, res) => {
  const { id } = req.body;
  try {
    const query = "UPDATE profissionais SET data_vencimento = COALESCE(data_vencimento, CURRENT_TIMESTAMP) + INTERVAL '30 days' WHERE id = $1 RETURNING data_vencimento";
    const result = await pool.query(query, [id]);
    res.json({ success: true, nova_data: result.rows[0].data_vencimento });
  } catch (err) { res.status(500).json({ error: 'Erro ao renovar plano' }); }
});

// --- ROTA DE AGENDAMENTO (MULTI-SERVIÇOS) ---
app.post('/api/public/agendamentos', async (req, res) => {
  const { id_profissional, nome, whatsapp, servico_nome, data_reserva, horario, valor, funcionario_id, funcionario_nome } = req.body;
  try {
    const query = `
      INSERT INTO agendamentos 
      (profissional_id, cliente_nome, cliente_whatsapp, servico_nome, data_reserva, horario, valor, funcionario_id, funcionario_nome) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *
    `;
    const result = await pool.query(query, [id_profissional, nome, whatsapp, servico_nome, data_reserva, horario, valor, funcionario_id || null, funcionario_nome || null]);
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: 'Erro ao salvar agendamento' }); }
});

// (Aqui você mantém as rotas de LOGIN e CADASTRO originais...)

app.listen(process.env.PORT || 10000, () => console.log('🚀 API AURUM ONLINE'));