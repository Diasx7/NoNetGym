const mysql = require('mysql2')

// funciona tanto local quanto no railway
const db = mysql.createConnection({
  host: process.env.MYSQLHOST || process.env.DB_HOST,
  user: process.env.MYSQLUSER || process.env.DB_USER,
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
  database: process.env.MYSQLDATABASE || process.env.DB_NAME,
  port: process.env.MYSQLPORT || process.env.DB_PORT || 3306
})

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar no banco de dados:', err.message)
    return
  }
  console.log('Conectado ao banco de dados!')
})

module.exports = db