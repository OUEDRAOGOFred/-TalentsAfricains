/**
 * Modèle Comment - Gestion des commentaires sur les projets
 */

const db = require('../config/database');

class Comment {
  /**
   * Créer un nouveau commentaire
   */
  static async create(projectId, userId, content) {
    const [result] = await db.execute(
      'INSERT INTO comments (project_id, user_id, content) VALUES (?, ?, ?) RETURNING id',
      [projectId, userId, content]
    );
    
    // PostgreSQL retourne un tableau avec les lignes insérées
    return result[0].id;
  }

  /**
   * Obtenir tous les commentaires d'un projet
   */
  static async getByProject(projectId, limit = 50, offset = 0) {
    const limitNum = parseInt(limit) || 50;
    const offsetNum = parseInt(offset) || 0;
    
    const [rows] = await db.execute(
      `SELECT c.*, u.first_name, u.last_name, u.photo_profil
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.project_id = ?
       ORDER BY c.created_at DESC
       LIMIT ${limitNum} OFFSET ${offsetNum}`,
      [projectId]
    );
    
    return rows;
  }

  /**
   * Compter les commentaires d'un projet
   */
  static async countByProject(projectId) {
    const [rows] = await db.execute(
      'SELECT COUNT(*) as count FROM comments WHERE project_id = ?',
      [projectId]
    );
    
    return rows[0].count;
  }

  /**
   * Mettre à jour un commentaire
   */
  static async update(id, content) {
    const [result] = await db.execute(
      'UPDATE comments SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [content, id]
    );
    
    return result.affectedRows > 0;
  }

  /**
   * Supprimer un commentaire
   */
  static async delete(id) {
    const [result] = await db.execute(
      'DELETE FROM comments WHERE id = ?',
      [id]
    );
    
    return result.affectedRows > 0;
  }

  /**
   * Vérifier si un utilisateur est propriétaire du commentaire
   */
  static async isOwner(commentId, userId) {
    const [rows] = await db.execute(
      'SELECT user_id FROM comments WHERE id = ?',
      [commentId]
    );
    
    return rows[0] && rows[0].user_id === userId;
  }
}

module.exports = Comment;
