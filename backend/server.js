require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/auth')
const exercisesRoutes = require('./routes/exercises')
const measuresRoutes = require('./routes/measures')

const app = express()

// permite o netlify chamar a api
app.use(cors({
  origin: ['https://nonet-gym.netlify.app', 'http://127.0.0.1:5500', 'http://localhost:5500']
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