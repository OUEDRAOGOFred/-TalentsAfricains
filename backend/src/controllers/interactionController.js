/**
 * Contrôleur des interactions (likes et commentaires)
 */

const Like = require('../models/Like');
const Comment = require('../models/Comment');
const Project = require('../models/Project');

class InteractionController {
  /**
   * Liker ou unliker un projet
   */
  static async toggleLike(req, res) {
    try {
      const { projectId } = req.params;

      // Vérifier que le projet existe
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ 
          success: false, 
          message: 'Projet non trouvé' 
        });
      }

      // Vérifier si l'utilisateur a déjà liké
      const hasLiked = await Like.hasLiked(req.user.id, projectId);

      if (hasLiked) {
        // Retirer le like
        await Like.remove(req.user.id, projectId);
        const likesCount = await Like.countByProject(projectId);

        return res.json({
          success: true,
          message: 'Like retiré',
          data: { 
            liked: false,
            likesCount
          }
        });
      } else {
        // Ajouter le like
        await Like.add(req.user.id, projectId);
        const likesCount = await Like.countByProject(projectId);

        return res.json({
          success: true,
          message: 'Projet liké',
          data: { 
            liked: true,
            likesCount
          }
        });
      }
    } catch (error) {
      console.error('Erreur lors du toggle like:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur' 
      });
    }
  }

  /**
   * Obtenir les likes d'un projet
   */
  static async getLikes(req, res) {
    try {
      const { projectId } = req.params;
      const users = await Like.getUsersByProject(projectId);
      const count = await Like.countByProject(projectId);

      res.json({
        success: true,
        data: {
          users,
          count
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des likes:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur' 
      });
    }
  }

  /**
   * Ajouter un commentaire à un projet
   */
  static async addComment(req, res) {
    try {
      const { projectId } = req.params;
      const { content } = req.body;

      if (!content || content.trim().length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Le contenu du commentaire est requis' 
        });
      }

      // Vérifier que le projet existe
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ 
          success: false, 
          message: 'Projet non trouvé' 
        });
      }

      const commentId = await Comment.create(projectId, req.user.id, content.trim());
      const comments = await Comment.getByProject(projectId);

      res.status(201).json({
        success: true,
        message: 'Commentaire ajouté',
        data: { 
          commentId,
          comments
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur' 
      });
    }
  }

  /**
   * Obtenir les commentaires d'un projet
   */
  static async getComments(req, res) {
    try {
      const { projectId } = req.params;
      const { limit, offset } = req.query;

      const comments = await Comment.getByProject(
        projectId,
        parseInt(limit) || 50,
        parseInt(offset) || 0
      );
      const count = await Comment.countByProject(projectId);

      res.json({
        success: true,
        data: {
          comments,
          count
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur' 
      });
    }
  }

  /**
   * Supprimer un commentaire
   */
  static async deleteComment(req, res) {
    try {
      const { commentId } = req.params;

      // Vérifier que l'utilisateur est propriétaire du commentaire
      const isOwner = await Comment.isOwner(commentId, req.user.id);
      if (!isOwner) {
        return res.status(403).json({ 
          success: false, 
          message: 'Accès non autorisé' 
        });
      }

      const deleted = await Comment.delete(commentId);

      if (!deleted) {
        return res.status(404).json({ 
          success: false, 
          message: 'Commentaire non trouvé' 
        });
      }

      res.json({
        success: true,
        message: 'Commentaire supprimé'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du commentaire:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur' 
      });
    }
  }
}

module.exports = InteractionController;
