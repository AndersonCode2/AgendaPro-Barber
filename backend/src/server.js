/* eslint-disable */
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

// 🌟 AUTO-SINCRONIZADOR DE TABELAS
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
  } catch (err) { console.error('Erro sincronização:', err); }
});

// --- ROTA EXCLUSIVA CEO: LISTAR EMPRESAS ---
app.get('/api/admin/empresas', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nome, email, data_vencimento FROM profissionais WHERE is_ceo = false ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: 'Erro ao listar empresas' }); }
});

// --- ROTA EXCLUSIVA CEO: RENOVAÇÃO MANUAL (+30 DIAS) ---
app.post('/api/admin/renovar-plano', async (req, res) => {
  const { profissional_id } = req.body;
  try {
    const p = await pool.query('SELECT data_vencimento FROM profissionais WHERE id = $1', [profissional_id]);
    if (p.rows.length === 0) return res.status(404).json({ error: 'Não encontrado' });
    let novaData = new Date(p.rows[0].data_vencimento || new Date());
    novaData.setDate(novaData.getDate() + 30); 
    await pool.query('UPDATE profissionais SET data_vencimento = $1 WHERE id = $2', [novaData, profissional_id]);
    res.json({ message: 'Sucesso', nova_data: novaData });
  } catch (err) { res.status(500).json({ error: 'Erro ao renovar' }); }
});

// --- ROTA DE AGENDAMENTO (MULTI-SERVIÇOS) ---
app.post('/api/public/agendamentos', async (req, res) => {
  const { id_profissional, nome, whatsapp, servico_nome, data_reserva, horario, valor } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO agendamentos (profissional_id, cliente_nome, cliente_whatsapp, servico_nome, data_reserva, horario, valor) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [id_profissional, nome, whatsapp, servico_nome, data_reserva, horario, valor]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: 'Erro no agendamento' }); }
});

// (Mantenha aqui as rotas de LOGIN e CADASTRO que já funcionam)

app.listen(process.env.PORT || 10000, () => console.log('🚀 API AURUM ONLINE'));