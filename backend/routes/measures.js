const express = require('express');
const db = require('../database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Todas as rotas aqui exigem login
router.use(authMiddleware);

// ─── LISTAR MEDIDAS ───────────────────────────────────
// GET /api/measures
router.get('/', (req, res) => {
  db.query(
    'SELECT * FROM measures WHERE user_id = ? ORDER BY date DESC',
    [req.userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Erro ao buscar medidas.' });
      res.json(results);
    }
  );
});

// ─── SALVAR MEDIDAS ───────────────────────────────────
// POST /api/measures
router.post('/', (req, res) => {
  const { weight, waist, abdomen, chest, arm, leg, date } = req.body;

  const measureDate = date || new Date().toISOString().slice(0, 10);

  // Se já existe medida nessa data, atualiza. Se não, cria nova.
  db.query(
    'SELECT id FROM measures WHERE user_id = ? AND date = ?',
    [req.userId, measureDate],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Erro no servidor.' });

      if (results.length > 0) {
        // Atualiza medida existente
        db.query(
          'UPDATE measures SET weight=?, waist=?, abdomen=?, chest=?, arm=?, leg=? WHERE id=?',
          [weight||null, waist||null, abdomen||null, chest||null, arm||null, leg||null, results[0].id],
          (err) => {
            if (err) return res.status(500).json({ error: 'Erro ao atualizar medidas.' });
            res.json({ message: 'Medidas atualizadas!' });
          }
        );
      } else {
        // Cria nova medida
        db.query(
          'INSERT INTO measures (user_id, weight, waist, abdomen, chest, arm, leg, date) VALUES (?,?,?,?,?,?,?,?)',
          [req.userId, weight||null, waist||null, abdomen||null, chest||null, arm||null, leg||null, measureDate],
          (err, result) => {
            if (err) return res.status(500).json({ error: 'Erro ao salvar medidas.' });
            res.status(201).json({ message: 'Medidas salvas!', id: result.insertId });
          }
        );
      }
    }
  );
});

module.exports = router;