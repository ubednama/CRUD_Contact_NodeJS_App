const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

async function createDatabase() {
    return new Promise((resolve, reject) => {
        connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.MYSQL_DATABASE}`, (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
}

async function createTable() {
    return new Promise((resolve, reject) => {
        connection.query(`USE ${process.env.MYSQL_DATABASE}`, (error) => {
            if (error) return reject(error);
            connection.query(`
        CREATE TABLE IF NOT EXISTS contacts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          first_name VARCHAR(255),
          last_name VARCHAR(255),
          email VARCHAR(255),
          mobile_number VARCHAR(255)
        );
      `, (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    });
}

async function initDatabase() {
    try {
        await createDatabase();
        await createTable();
        console.log('Database and table created successfully');
    } catch (error) {
        console.error('Error creating database and table:', error);
    } finally {
        connection.end();
    }
}

module.exports = { initDatabase };