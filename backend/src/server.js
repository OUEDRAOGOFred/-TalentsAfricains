/**
 * Serveur Express - TalentsAfricains Backend
 * Point d'entrée principal de l'API
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import des routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const interactionRoutes = require('./routes/interactionRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 5000;

// ===============================================
// Middlewares globaux
// ===============================================

// CORS - Permettre les requêtes depuis le frontend
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:5173',
  // Accepter tous les domaines Vercel pour les previews
  /\.vercel\.app$/
];

app.use(cors({
  origin: (origin, callback) => {
    // Permettre les requêtes sans origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Vérifier si l'origin est dans la liste ou correspond au pattern Vercel
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') return allowed === origin;
      if (allowed instanceof RegExp) return allowed.test(origin);
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Parser JSON et URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques (images uploadées)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Logger simple pour le développement
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ===============================================
// Routes de l'API
// ===============================================

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/admin', adminRoutes);

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API TalentsAfricains fonctionnelle',
    timestamp: new Date().toISOString()
  });
});

// ===============================================
// Gestion des erreurs 404
// ===============================================

app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route non trouvée' 
  });
});

// ===============================================
// Gestion globale des erreurs
// ===============================================

app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);

  // Erreur Multer (upload de fichier)
  if (err.name === 'MulterError') {
    return res.status(400).json({ 
      success: false, 
      message: 'Erreur lors de l\'upload du fichier',
      error: err.message
    });
  }

  res.status(err.status || 500).json({ 
    success: false, 
    message: err.message || 'Erreur serveur interne',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ===============================================
// Démarrage du serveur
// ===============================================

app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   🌍 TalentsAfricains API Server         ║');
  console.log('╚════════════════════════════════════════════╝');
  console.log(`✨ Serveur démarré sur le port ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📚 Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log('─────────────────────────────────────────────');
});

module.exports = app;
