/**
 * Routes des interactions (likes et commentaires)
 */

const express = require('express');
const InteractionController = require('../controllers/interactionController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/interactions/like/:projectId
 * @desc    Liker ou unliker un projet
 * @access  Private
 */
router.post('/like/:projectId', authMiddleware, InteractionController.toggleLike);

/**
 * @route   GET /api/interactions/likes/:projectId
 * @desc    Obtenir les likes d'un projet
 * @access  Public
 */
router.get('/likes/:projectId', InteractionController.getLikes);

/**
 * @route   POST /api/interactions/comment/:projectId
 * @desc    Ajouter un commentaire à un projet
 * @access  Private
 */
router.post('/comment/:projectId', authMiddleware, InteractionController.addComment);

/**
 * @route   GET /api/interactions/comments/:projectId
 * @desc    Obtenir les commentaires d'un projet
 * @access  Public
 */
router.get('/comments/:projectId', InteractionController.getComments);

/**
 * @route   DELETE /api/interactions/comment/:commentId
 * @desc    Supprimer un commentaire
 * @access  Private (Propriétaire uniquement)
 */
router.delete('/comment/:commentId', authMiddleware, InteractionController.deleteComment);

module.exports = router;
