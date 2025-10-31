/**
 * Contrôleur des projets
 * Gère toutes les opérations CRUD sur les projets
 */

const { validationResult } = require('express-validator');
const Project = require('../models/Project');
const Like = require('../models/Like');
const Comment = require('../models/Comment');

class ProjectController {
  /**
   * Créer un nouveau projet
   */
  static async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }

      const { titre, description, categorie, localisation, lien_externe } = req.body;
      
      // Gestion des images uploadées
      let image_principale = null;
      let galerie_images = null;

      if (req.files) {
        if (req.files.image_principale) {
          image_principale = req.files.image_principale[0].filename;
        }
        if (req.files.galerie_images) {
          const galerieFiles = req.files.galerie_images.map(file => file.filename);
          galerie_images = JSON.stringify(galerieFiles);
        }
      }

      const projectId = await Project.create({
        titre,
        description,
        categorie,
        localisation,
        lien_externe,
        image_principale,
        galerie_images,
        user_id: req.user.id
      });

      const project = await Project.findById(projectId);

      res.status(201).json({
        success: true,
        message: 'Projet créé avec succès',
        data: { project }
      });
    } catch (error) {
      console.error('Erreur lors de la création du projet:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur lors de la création du projet' 
      });
    }
  }

  /**
   * Obtenir tous les projets avec filtres et pagination
   */
  static async getAll(req, res) {
    try {
      const { categorie, localisation, search, sort, limit, offset } = req.query;

      const filters = {
        categorie,
        localisation,
        search,
        sort,
        limit: parseInt(limit) || 12,
        offset: parseInt(offset) || 0
      };

      const projects = await Project.getAll(filters);
      const total = await Project.count({ categorie, localisation, search });

      res.json({
        success: true,
        data: {
          projects,
          pagination: {
            total,
            limit: filters.limit,
            offset: filters.offset,
            hasMore: (filters.offset + filters.limit) < total
          }
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des projets:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur' 
      });
    }
  }

  /**
   * Obtenir un projet par ID
   */
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const project = await Project.findById(id);

      if (!project) {
        return res.status(404).json({ 
          success: false, 
          message: 'Projet non trouvé' 
        });
      }

      // Incrémenter les vues
      await Project.incrementViews(id);

      // Vérifier si l'utilisateur connecté a liké le projet
      let hasLiked = false;
      if (req.user) {
        hasLiked = await Like.hasLiked(req.user.id, id);
      }

      // Récupérer les commentaires
      const comments = await Comment.getByProject(id);

      res.json({
        success: true,
        data: { 
          project: {
            ...project,
            hasLiked
          },
          comments
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du projet:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur' 
      });
    }
  }

  /**
   * Obtenir les projets de l'utilisateur connecté
   */
  static async getMyProjects(req, res) {
    try {
      const { limit, offset } = req.query;
      const projects = await Project.findByUserId(
        req.user.id,
        parseInt(limit) || 20,
        parseInt(offset) || 0
      );

      res.json({
        success: true,
        data: { projects }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des projets:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur' 
      });
    }
  }

  /**
   * Obtenir les projets d'un utilisateur par son ID
   */
  static async getByUserId(req, res) {
    try {
      const { userId } = req.params;
      const { limit, offset } = req.query;
      
      const projects = await Project.findByUserId(
        userId,
        parseInt(limit) || 20,
        parseInt(offset) || 0
      );

      res.json({
        success: true,
        data: { projects }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des projets:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur' 
      });
    }
  }

  /**
   * Mettre à jour un projet
   */
  static async update(req, res) {
    try {
      const { id } = req.params;

      // Vérifier que l'utilisateur est propriétaire du projet
      const isOwner = await Project.isOwner(id, req.user.id);
      if (!isOwner) {
        return res.status(403).json({ 
          success: false, 
          message: 'Accès non autorisé' 
        });
      }

      const { titre, description, categorie, localisation, lien_externe, status } = req.body;
      
      const updateData = {};
      if (titre) updateData.titre = titre;
      if (description) updateData.description = description;
      if (categorie) updateData.categorie = categorie;
      if (localisation !== undefined) updateData.localisation = localisation;
      if (lien_externe !== undefined) updateData.lien_externe = lien_externe;
      if (status) updateData.status = status;

      // Gestion des nouvelles images
      if (req.files) {
        if (req.files.image_principale) {
          updateData.image_principale = req.files.image_principale[0].filename;
        }
        if (req.files.galerie_images) {
          const galerieFiles = req.files.galerie_images.map(file => file.filename);
          updateData.galerie_images = JSON.stringify(galerieFiles);
        }
      }

      const updated = await Project.update(id, updateData);

      if (!updated) {
        return res.status(400).json({ 
          success: false, 
          message: 'Aucune modification effectuée' 
        });
      }

      const project = await Project.findById(id);

      res.json({
        success: true,
        message: 'Projet mis à jour avec succès',
        data: { project }
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du projet:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur' 
      });
    }
  }

  /**
   * Supprimer un projet
   */
  static async delete(req, res) {
    try {
      const { id } = req.params;

      // Vérifier que l'utilisateur est propriétaire du projet
      const isOwner = await Project.isOwner(id, req.user.id);
      if (!isOwner) {
        return res.status(403).json({ 
          success: false, 
          message: 'Accès non autorisé' 
        });
      }

      const deleted = await Project.delete(id);

      if (!deleted) {
        return res.status(404).json({ 
          success: false, 
          message: 'Projet non trouvé' 
        });
      }

      res.json({
        success: true,
        message: 'Projet supprimé avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du projet:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur' 
      });
    }
  }
}

module.exports = ProjectController;
