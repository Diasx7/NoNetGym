require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/auth')
const exercisesRoutes = require('./routes/exercises')
const measuresRoutes = require('./routes/measures')

const app = express()

// aceita netlify, localhost e qualquer subdominio do vercel
app.use(cors({
  origin: function(origin, callback) {
    const permitidas = [
      'https://nonet-gym.netlify.app',
      'http://127.0.0.1:5500',
      'http://localhost:5500'
    ]
    if (!origin || permitidas.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true)
    } else {
      callback(new Error('CORS bloqueado'))
    }
  }
}))

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/exercises', exercisesRoutes)
app.use('/api/measures', measuresRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'NoNet GYM API rodando!' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log('Servidor rodando em http://localhost:' + PORT)
})