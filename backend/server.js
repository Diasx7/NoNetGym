app.use(cors({
  origin: function(origin, callback) {
    const permitidas = [
      'https://nonet-gym.netlify.app',
      'http://127.0.0.1:5500',
      'http://localhost:5500'
    ]
    // aceita qualquer subdominio do vercel
    if (!origin || permitidas.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true)
    } else {
      callback(new Error('CORS bloqueado'))
    }
  }
}))