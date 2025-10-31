/**
 * Middleware d'authentification JWT
 * Vérifie la validité du token et ajoute les informations utilisateur à la requête
 */

const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  try {
    // Récupération du token depuis le header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token manquant ou invalide' 
      });
    }

    const token = authHeader.split(' ')[1];

    // Vérification et décodage du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Ajout des informations utilisateur à la requête
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expiré' 
      });
    }
    
    return res.status(401).json({ 
      success: false, 
      message: 'Token invalide' 
    });
  }
};

// Middleware pour vérifier le rôle porteur de projet
const isPorteurProjet = (req, res, next) => {
  if (req.user.role !== 'porteur_projet') {
    return res.status(403).json({ 
      success: false, 
      message: 'Accès réservé aux porteurs de projet' 
    });
  }
  next();
};

module.exports = { authMiddleware, isPorteurProjet };
