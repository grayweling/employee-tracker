const path = require('path');
require('dotenv').config({
    path: path.join(__dirname, '../.env')
});
const mysql = require('mysql2');


const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PW,
        database: process.env.DB_NAME
    },

    console.log("Connected to database")
);

module.exports = db;