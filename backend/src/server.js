/* eslint-disable */
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 10000;
const JWT_SECRET = process.env.JWT_SECRET || 'aurum_secret_2026';

app.use(cors());
app.use(express.json());

// ==========================================
// ROTAS PÚBLICAS (O QUE O CLIENTE VÊ)
// ==========================================

// 1. Buscar dados do salão para o agendamento
app.get('/api/publico/empresa/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const empresa = await prisma.usuario.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        nome: true,
        logo_url: true,
        horarios_trabalho: true,
        servicos: {
          select: { id: true, nome: true, preco: true, tempo: true }
        }
      }
    });

    if (!empresa) return res.status(404).json({ error: 'Salão não encontrado' });
    res.json(empresa);
  } catch (err) {
    console.error('Erro na API Pública:', err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// 2. Criar agendamento vindo do link do cliente
app.post('/api/publico/agendar', async (req, res) => {
  const { empresa_id, cliente_nome, cliente_whatsapp, servico_id, data_reserva, horario, valor } = req.body;
  try {
    const novoAgendamento = await prisma.agendamento.create({
      data: {
        empresa_id: parseInt(empresa_id),
        cliente_nome,
        cliente_whatsapp,
        servico_id: parseInt(servico_id),
        data_reserva,
        horario,
        valor: parseFloat(valor),
        status: 'pendente'
      }
    });
    res.status(201).json(novoAgendamento);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao processar agendamento' });
  }
});

// ==========================================
// ROTAS DE AUTENTICAÇÃO E PAINEL
// ==========================================

app.post('/api/cadastro', async (req, res) => {
  const { nome, email, senha, telefone } = req.body;
  try {
    const senhaHash = await bcrypt.hash(senha, 10);
    const usuario = await prisma.usuario.create({
      data: { 
        nome, email, senha: senhaHash, telefone,
        data_vencimento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    });
    const token = jwt.sign({ id: usuario.id }, JWT_SECRET);
    res.json({ token, usuario });
  } catch (err) {
    res.status(400).json({ error: 'Erro no cadastro' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    const token = jwt.sign({ id: usuario.id, is_ceo: usuario.is_ceo }, JWT_SECRET);
    res.json({ token, usuario });
  } catch (err) {
    res.status(500).json({ error: 'Erro no login' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 AURUM API Online na porta ${PORT}`);
});