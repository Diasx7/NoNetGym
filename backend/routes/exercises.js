const express = require('express');
const db = require('../database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Todas as rotas aqui exigem login (token JWT)
router.use(authMiddleware);

// ─── LISTAR TREINOS ───────────────────────────────────
// GET /api/exercises
router.get('/', (req, res) => {
  db.query(
    'SELECT * FROM exercises WHERE user_id = ? ORDER BY date DESC, created_at DESC',
    [req.userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Erro ao buscar treinos.' });
      res.json(results);
    }
  );
});

// ─── ADICIONAR EXERCÍCIO ──────────────────────────────
// POST /api/exercises
router.post('/', (req, res) => {
  const { name, sets, reps, load, date } = req.body;

  if (!name || !sets || !reps) {
    return res.status(400).json({ error: 'Nome, séries e repetições são obrigatórios.' });
  }

  const exerciseDate = date || new Date().toISOString().slice(0, 10);

  db.query(
    'INSERT INTO exercises (user_id, name, sets, reps, load, date) VALUES (?, ?, ?, ?, ?, ?)',
    [req.userId, name, sets, reps, load || 0, exerciseDate],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Erro ao salvar exercício.' });
      res.status(201).json({ message: 'Exercício salvo!', id: result.insertId });
    }
  );
});

// ─── DELETAR EXERCÍCIO ────────────────────────────────
// DELETE /api/exercises/:id
router.delete('/:id', (req, res) => {
  db.query(
    'DELETE FROM exercises WHERE id = ? AND user_id = ?',
    [req.params.id, req.userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Erro ao deletar exercício.' });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Exercício não encontrado.' });
      res.json({ message: 'Exercício deletado!' });
    }
  );
});

module.exports = router;