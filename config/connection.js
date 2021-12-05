const mysql = require('mysql2');

require('dotenv').config();

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: 'root',
    password: '7quv7!Joe535',
    database: 'employee_db'
});

module.exports = connection;