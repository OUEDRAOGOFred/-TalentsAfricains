/**
 * Routes d'authentification
 * Gère l'inscription, la connexion et les opérations sur le profil utilisateur
 */

const express = require('express');
const { body } = require('express-validator');
const AuthController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Validation pour l'inscription
const registerValidation = [
  body('first_name').trim().notEmpty().withMessage('Le prénom est requis'),
  body('last_name').trim().notEmpty().withMessage('Le nom est requis'),
  body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Le mot de passe doit contenir au moins 8 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'),
  body('role').optional().isIn(['visiteur', 'porteur_projet']).withMessage('Rôle invalide')
];

// Validation pour la connexion
const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
  body('password').notEmpty().withMessage('Le mot de passe est requis')
];

/**
 * @route   POST /api/auth/register
 * @desc    Inscription d'un nouvel utilisateur
 * @access  Public
 */
router.post('/register', registerValidation, AuthController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Connexion d'un utilisateur
 * @access  Public
 */
router.post('/login', loginValidation, AuthController.login);

/**
 * @route   GET /api/auth/profile
 * @desc    Obtenir le profil de l'utilisateur connecté
 * @access  Private
 */
router.get('/profile', authMiddleware, AuthController.getProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Mettre à jour le profil utilisateur
 * @access  Private
 */
router.put('/profile', authMiddleware, upload.single('photo_profil'), AuthController.updateProfile);

/**
 * @route   GET /api/auth/user/:id
 * @desc    Obtenir le profil public d'un utilisateur
 * @access  Public
 */
router.get('/user/:id', AuthController.getUserById);

module.exports = router;
