const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { isAdmin } = require('../middleware/adminAuth');
const adminController = require('../controllers/adminController');

// Statistiques
router.get('/statistics', authMiddleware, isAdmin, adminController.getStatistics);

// Gestion des utilisateurs
router.get('/users', authMiddleware, isAdmin, adminController.getAllUsers);
router.delete('/users/:id', authMiddleware, isAdmin, adminController.deleteUser);

// Gestion des projets
router.get('/projects', authMiddleware, isAdmin, adminController.getAllProjects);
router.delete('/projects/:id', authMiddleware, isAdmin, adminController.deleteProject);

module.exports = router;
