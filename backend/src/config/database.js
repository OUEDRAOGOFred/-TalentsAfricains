/**
 * Configuration de la connexion à la base de données
 * Utilise PostgreSQL (Supabase) en production et MySQL en développement
 */

require('dotenv').config();

// Fonction helper pour convertir les requêtes MySQL en PostgreSQL
function convertQueryToPostgres(query, params) {
  let paramIndex = 1;
  const convertedQuery = query.replace(/\?/g, () => `$${paramIndex++}`);
  return convertedQuery;
}

// En production (Render), utiliser PostgreSQL (Supabase)
if (process.env.USE_SUPABASE === 'true' || process.env.NODE_ENV === 'production') {
  const { Pool } = require('pg');
  
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      rejectUnauthorized: false
    },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  pool.on('connect', () => {
    console.log('✅ Connexion à PostgreSQL (Supabase) établie avec succès');
  });

  pool.on('error', (err) => {
    console.error('❌ Erreur PostgreSQL:', err.message);
  });

  // Adapter pour utiliser la même interface que MySQL
  const promisePool = {
    query: async (text, params) => {
      const convertedQuery = convertQueryToPostgres(text, params);
      const result = await pool.query(convertedQuery, params);
      return [result.rows];
    },
    execute: async (text, params) => {
      const convertedQuery = convertQueryToPostgres(text, params);
      const result = await pool.query(convertedQuery, params);
      return [result.rows];
    }
  };

  module.exports = promisePool;

} else {
  // En développement local, utiliser MySQL
  const mysql = require('mysql2');
  
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

  const promisePool = pool.promise();

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('❌ Erreur de connexion à MySQL:', err.message);
      return;
    }
    console.log('✅ Connexion à MySQL établie avec succès');
    connection.release();
  });

  module.exports = promisePool;
}
