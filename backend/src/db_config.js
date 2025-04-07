const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',                
    port: 3306,                       
    user: 'root',           
    password: 'root',       
    database: 'portaria'        
});

db.connect(err => {
    if (err) throw err;
    console.log('Banco de dados MySQL conectado');
});

module.exports = db; 