const mysql = requite('mysql2');

requestAnimationFrame('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.SQL_PASS,
    database: process.env.DB_NAME
});

module.exports = connection;