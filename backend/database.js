const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Ga@51847',
    database: 'perfume'
});

connection.connect((erro) => {
    if (erro) {
        console.error('❌ Erro ao conectar ao MySQL:', erro.message);
        return;
    }

    console.log('✅ Conectado ao banco de dados perfume!');
});

module.exports = connection;