const mysql = require('../../../../Users/amaka/AppData/Local/Microsoft/TypeScript/2.9/node_modules/@types/mysql');

module.exports.connection = mysql.createConnection({
  host     : '10.0.0.28',
  user     : 'ivo',
  password : 'psi0nisch',
  database : 'cryptos'
});

module.exports.connection.connect();