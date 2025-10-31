/**
 * Contrôleur d'authentification
 * Gère l'inscription, la connexion et la gestion du profil utilisateur
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

class AuthController {
  /**
   * Inscription d'un nouvel utilisateur
   */
  static async register(req, res) {
    try {
      // Validation des entrées
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }

      const { first_name, last_name, email, password, role, bio, competences, pays } = req.body;

      // Vérifier si l'email existe déjà
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: 'Cet email est déjà utilisé' 
        });
      }

      // Hachage du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Création de l'utilisateur
      const userId = await User.create({
        first_name,
        last_name,
        email,
        password: hashedPassword,
        role: role || 'visiteur',
        bio,
        competences,
        pays
      });

      // Génération du token JWT
      const token = jwt.sign(
        { id: userId, email, role: role || 'visiteur' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: true,
        message: 'Inscription réussie',
        data: {
          token,
          user: {
            id: userId,
            first_name,
            last_name,
            email,
            role: role || 'visiteur'
          }
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur lors de l\'inscription' 
      });
    }
  }

  /**
   * Connexion d'un utilisateur
   */
  static async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }

      const { email, password } = req.body;

      // Recherche de l'utilisateur
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Email ou mot de passe incorrect' 
        });
      }

      // Vérification du mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ 
          success: false, 
          message: 'Email ou mot de passe incorrect' 
        });
      }

      // Génération du token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        message: 'Connexion réussie',
        data: {
          token,
          user: {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,
            photo_profil: user.photo_profil
          }
        }
      });
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur lors de la connexion' 
      });
    }
  }

  /**
   * Obtenir le profil de l'utilisateur connecté
   */
  static async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'Utilisateur non trouvé' 
        });
      }

      res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur' 
      });
    }
  }

  /**
   * Mettre à jour le profil utilisateur
   */
  static async updateProfile(req, res) {
    try {
      const { first_name, last_name, bio, competences, pays, linkedin, twitter, website } = req.body;
      
      const updateData = {};
      if (first_name) updateData.first_name = first_name;
      if (last_name) updateData.last_name = last_name;
      if (bio !== undefined) updateData.bio = bio;
      if (competences !== undefined) updateData.competences = competences;
      if (pays) updateData.pays = pays;
      if (linkedin !== undefined) updateData.linkedin = linkedin;
      if (twitter !== undefined) updateData.twitter = twitter;
      if (website !== undefined) updateData.website = website;

      // Si une photo de profil a été uploadée
      if (req.file) {
        updateData.photo_profil = req.file.filename;
      }

      const updated = await User.update(req.user.id, updateData);
      
      if (!updated) {
        return res.status(400).json({ 
          success: false, 
          message: 'Aucune modification effectuée' 
        });
      }

      const user = await User.findById(req.user.id);

      res.json({
        success: true,
        message: 'Profil mis à jour avec succès',
        data: { user }
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur lors de la mise à jour' 
      });
    }
  }

  /**
   * Obtenir le profil d'un utilisateur par ID (public)
   */
  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'Utilisateur non trouvé' 
        });
      }

      res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur' 
      });
    }
  }
}

module.exports = AuthController;
