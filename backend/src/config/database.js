/**
 * Configuration de la connexion à la base de données MySQL
 * Utilise mysql2 avec support des Promises pour des requêtes asynchrones
 */

const mysql = require('mysql2');
require('dotenv').config();

// Création du pool de connexions pour optimiser les performances
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Freddy1243.',
  database: process.env.DB_NAME || 'talentsafricains',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

// Promisify pour utiliser async/await
const promisePool = pool.promise();

// Test de connexion
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Erreur de connexion à MySQL:', err.message);
    return;
  }
  console.log('✅ Connexion à MySQL établie avec succès');
  connection.release();
});

module.exports = promisePool;
