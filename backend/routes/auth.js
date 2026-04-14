require('dotenv').config({ path: require('path').join(__dirname, '../../.env') })
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../database')

const router = express.Router()

// cadastro
router.post('/register', (req, res) => {
  const { name, email, password, age, gender, weight_initial } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' })
  }

  db.query('SELECT id FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro no servidor.' })
    if (results.length > 0) return res.status(400).json({ error: 'Email já cadastrado.' })

    const hashedPassword = bcrypt.hashSync(password, 10)

    db.query(
      'INSERT INTO users (name, email, password, age, gender, weight_initial) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, age || null, gender || null, weight_initial || null],
      (err, result) => {
        if (err) return res.status(500).json({ error: 'Erro ao criar conta.' })
        res.status(201).json({ message: 'Conta criada com sucesso!' })
      }
    )
  })
})

// login
router.post('/login', (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' })
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro no servidor.' })
    if (results.length === 0) return res.status(401).json({ error: 'Email ou senha incorretos.' })

    const user = results[0]

    const senhaCorreta = bcrypt.compareSync(password, user.password)
    if (!senhaCorreta) return res.status(401).json({ error: 'Email ou senha incorretos.' })

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      message: 'Login realizado!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        weight_initial: user.weight_initial
      }
    })
  })
})

module.exports = router