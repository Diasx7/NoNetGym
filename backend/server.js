require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');

// Importa as rotas
const authRoutes = require('./routes/auth');
const exercisesRoutes = require('./routes/exercises');
const measuresRoutes = require('./routes/measures');

const app = express();

// Permite requisições do frontend
app.use(cors());

// Permite receber JSON nas requisições
app.use(express.json());

// Define as rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/exercises', exercisesRoutes);
app.use('/api/measures', measuresRoutes);

// Rota de teste — acessa no navegador: http://localhost:3000/
app.get('/', (req, res) => {
  res.json({ message: '🏋️ NoNet GYM API rodando!' });
});

// Inicia o servidor na porta definida no .env
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});