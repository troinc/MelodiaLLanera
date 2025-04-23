const mysql = require('mysql2');
require('dotenv').config({ path: '../.env' }); // Ensure .env is loaded relative to this file's location

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tienda_llanera',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10, // Adjust as needed
  queueLimit: 0
});

// Optional: Promisify the pool for async/await usage
const promisePool = pool.promise();

// Test connection (optional, can be done in server.js)
promisePool.getConnection()
  .then(connection => {
    console.log('Database connection pool created successfully.');
    connection.release();
  })
  .catch(err => {
    console.error('Error creating database connection pool:', err);
    // Consider exiting the process if the DB connection is critical
    // process.exit(1);
  });

module.exports = promisePool; // Export the promise-based pool
