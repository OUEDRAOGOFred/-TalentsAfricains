/**
 * Modèle Project - Gestion des projets
 * Fournit toutes les opérations CRUD pour les projets
 */

const db = require('../config/database');

class Project {
  /**
   * Créer un nouveau projet
   */
  static async create(projectData) {
    const { titre, description, categorie, localisation, lien_demo, lien_github, image_principale, galerie_images, statut, user_id } = projectData;
    
    const [result] = await db.execute(
      `INSERT INTO projects (titre, description, categorie, localisation, lien_demo, lien_github, image_principale, galerie_images, statut, user_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
      [titre, description, categorie, localisation, lien_demo, lien_github, image_principale, galerie_images, statut || 'en_cours', user_id]
    );
    
    // PostgreSQL retourne un tableau avec les lignes insérées
    return result[0].id;
  }

  /**
   * Obtenir tous les projets avec pagination et filtres
   */
  static async getAll(filters = {}) {
    let query = `
      SELECT p.*, 
             u.first_name, u.last_name, u.photo_profil as author_photo,
             COUNT(DISTINCT l.id) as likes_count,
             COUNT(DISTINCT c.id) as comments_count
      FROM projects p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN likes l ON p.id = l.project_id
      LEFT JOIN comments c ON p.id = c.project_id
      WHERE p.statut = 'publie'
    `;
    
    const params = [];

    // Filtres dynamiques
    if (filters.categorie) {
      query += ' AND p.categorie = ?';
      params.push(filters.categorie);
    }

    if (filters.localisation) {
      query += ' AND p.localisation LIKE ?';
      params.push(`%${filters.localisation}%`);
    }

    if (filters.search) {
      query += ' AND (p.titre LIKE ? OR p.description LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    query += ' GROUP BY p.id, u.first_name, u.last_name, u.photo_profil';

    // Tri
    if (filters.sort === 'popular') {
      query += ' ORDER BY likes_count DESC, p.views DESC';
    } else if (filters.sort === 'oldest') {
      query += ' ORDER BY p.created_at ASC';
    } else {
      query += ' ORDER BY p.created_at DESC';
    }

    // Pagination
    const limit = parseInt(filters.limit) || 12;
    const offset = parseInt(filters.offset) || 0;
    query += ` LIMIT ${limit} OFFSET ${offset}`;

    const [rows] = await db.execute(query, params);
    return rows;
  }

  /**
   * Compter le nombre total de projets (pour pagination)
   */
  static async count(filters = {}) {
    let query = "SELECT COUNT(*) as total FROM projects WHERE statut = 'publie'";
    const params = [];

    if (filters.categorie) {
      query += ' AND categorie = ?';
      params.push(filters.categorie);
    }

    if (filters.localisation) {
      query += ' AND localisation LIKE ?';
      params.push(`%${filters.localisation}%`);
    }

    if (filters.search) {
      query += ' AND (titre LIKE ? OR description LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    const [rows] = await db.execute(query, params);
    return rows[0].total;
  }

  /**
   * Obtenir un projet par ID avec détails complets
   */
  static async findById(id) {
    const [rows] = await db.execute(
      `SELECT p.*, 
              u.id as author_id, u.first_name, u.last_name, u.email as user_email, u.bio, u.photo_profil as author_photo, 
              u.linkedin, u.twitter, u.website,
              (SELECT COUNT(*) FROM likes WHERE project_id = p.id) as likes_count,
              (SELECT COUNT(*) FROM comments WHERE project_id = p.id) as comments_count
       FROM projects p
       LEFT JOIN users u ON p.user_id = u.id
       WHERE p.id = ?`,
      [id]
    );
    
    return rows[0];
  }

  /**
   * Obtenir les projets d'un utilisateur
   */
  static async findByUserId(userId, limit = 20, offset = 0) {
    const limitNum = parseInt(limit) || 20;
    const offsetNum = parseInt(offset) || 0;
    
    const [rows] = await db.execute(
      `SELECT p.*,
              (SELECT COUNT(*) FROM likes WHERE project_id = p.id) as likes_count,
              (SELECT COUNT(*) FROM comments WHERE project_id = p.id) as comments_count
       FROM projects p
       WHERE p.user_id = ?
       ORDER BY p.created_at DESC
       LIMIT ${limitNum} OFFSET ${offsetNum}`,
      [userId]
    );
    
    return rows;
  }

  /**
   * Mettre à jour un projet
   */
  static async update(id, projectData) {
    const fields = [];
    const values = [];

    Object.keys(projectData).forEach(key => {
      if (projectData[key] !== undefined && key !== 'id' && key !== 'user_id') {
        fields.push(`${key} = ?`);
        values.push(projectData[key]);
      }
    });

    if (fields.length === 0) {
      return false;
    }

    values.push(id);
    
    const [result] = await db.execute(
      `UPDATE projects SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return result.affectedRows > 0;
  }

  /**
   * Incrémenter le nombre de vues
   */
  static async incrementViews(id) {
    await db.execute(
      'UPDATE projects SET views = views + 1 WHERE id = ?',
      [id]
    );
  }

  /**
   * Supprimer un projet
   */
  static async delete(id) {
    const [result] = await db.execute(
      'DELETE FROM projects WHERE id = ?',
      [id]
    );
    
    return result.affectedRows > 0;
  }

  /**
   * Vérifier si un utilisateur est propriétaire du projet
   */
  static async isOwner(projectId, userId) {
    const [rows] = await db.execute(
      'SELECT user_id FROM projects WHERE id = ?',
      [projectId]
    );
    
    return rows[0] && rows[0].user_id === userId;
  }
}

module.exports = Project;
