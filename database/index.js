const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123!Aa#@',
  database: 'dbshop',
  port: 3306,
  multipleStatements: true,
});

module.exports = db;
