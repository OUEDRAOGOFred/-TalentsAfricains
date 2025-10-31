/**
 * Routes des projets
 * Gère toutes les opérations CRUD sur les projets
 */

const express = require('express');
const { body } = require('express-validator');
const ProjectController = require('../controllers/projectController');
const { authMiddleware, isPorteurProjet } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Configuration Multer pour plusieurs fichiers
const uploadFields = upload.fields([
  { name: 'image_principale', maxCount: 1 },
  { name: 'galerie_images', maxCount: 5 }
]);

// Validation pour la création de projet
const projectValidation = [
  body('titre').trim().notEmpty().withMessage('Le titre est requis')
    .isLength({ max: 255 }).withMessage('Le titre est trop long'),
  body('description').trim().notEmpty().withMessage('La description est requise'),
  body('categorie')
    .isIn(['technologie', 'art', 'entrepreneuriat', 'innovation', 'education', 'sante', 'agriculture', 'autre'])
    .withMessage('Catégorie invalide')
];

/**
 * @route   POST /api/projects
 * @desc    Créer un nouveau projet
 * @access  Private (Porteurs de projet uniquement)
 */
router.post('/', authMiddleware, isPorteurProjet, uploadFields, projectValidation, ProjectController.create);

/**
 * @route   GET /api/projects
 * @desc    Obtenir tous les projets avec filtres
 * @access  Public
 */
router.get('/', ProjectController.getAll);

/**
 * @route   GET /api/projects/my
 * @desc    Obtenir les projets de l'utilisateur connecté
 * @access  Private
 */
router.get('/my', authMiddleware, ProjectController.getMyProjects);

/**
 * @route   GET /api/projects/user/:userId
 * @desc    Obtenir les projets d'un utilisateur spécifique
 * @access  Public
 */
router.get('/user/:userId', ProjectController.getByUserId);

/**
 * @route   GET /api/projects/:id
 * @desc    Obtenir un projet par ID
 * @access  Public
 */
router.get('/:id', ProjectController.getById);

/**
 * @route   PUT /api/projects/:id
 * @desc    Mettre à jour un projet
 * @access  Private (Propriétaire uniquement)
 */
router.put('/:id', authMiddleware, uploadFields, ProjectController.update);

/**
 * @route   DELETE /api/projects/:id
 * @desc    Supprimer un projet
 * @access  Private (Propriétaire uniquement)
 */
router.delete('/:id', authMiddleware, ProjectController.delete);

module.exports = router;
