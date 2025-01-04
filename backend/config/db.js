const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'karthik18',
  database: 'hospital_db',
});

module.exports = db;
