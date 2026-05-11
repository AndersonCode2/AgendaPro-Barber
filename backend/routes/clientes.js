const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {

    const id_profissional = req.usuario.id;

    const result = await pool.query(
      `
      SELECT *
      FROM clientes
      WHERE id_profissional = $1
      ORDER BY nome ASC
      `,
      [id_profissional]
    );

    res.json(result.rows);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: 'Erro ao buscar clientes'
    });
  }
});

router.post('/', async (req, res) => {

  try {

    const id_profissional = req.usuario.id;

    const {
      nome,
      whatsapp,
      nascimento,
      observacoes
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO clientes (
        id_profissional,
        nome,
        whatsapp,
        nascimento,
        observacoes
      )
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *
      `,
      [
        id_profissional,
        nome,
        whatsapp,
        nascimento,
        observacoes
      ]
    );

    res.json(result.rows[0]);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: 'Erro ao cadastrar cliente'
    });
  }
});

module.exports = router;
