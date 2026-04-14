const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'nonet_gym'
});

db.connect((err) => {
  if (err) {
    console.error('❌ Erro ao conectar no banco de dados:', err.message);
    return;
  }
  console.log('✅ Conectado ao banco de dados MySQL!');
});

module.exports = db;