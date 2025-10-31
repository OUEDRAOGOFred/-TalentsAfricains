/**
 * Configuration de la connexion à la base de données PostgreSQL (Supabase)
 * Remplace la configuration MySQL pour utiliser Supabase
 */

const { Pool } = require('pg');
require('dotenv').config();

// Configuration du pool de connexions PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'postgres',
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false,
  max: 10, // Maximum de connexions dans le pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test de connexion
pool.on('connect', () => {
  console.log('✅ Connexion à PostgreSQL (Supabase) établie avec succès');
});

pool.on('error', (err) => {
  console.error('❌ Erreur PostgreSQL:', err.message);
});

// Adapter l'interface pour être compatible avec le code MySQL existant
const promisePool = {
  query: async (text, params) => {
    const result = await pool.query(text, params);
    return [result.rows];
  },
  execute: async (text, params) => {
    const result = await pool.query(text, params);
    return [result.rows];
  }
};

module.exports = promisePool;
