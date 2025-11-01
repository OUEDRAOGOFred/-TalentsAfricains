/**
 * Modèle Like - Gestion des likes sur les projets
 */

const db = require('../config/database');

class Like {
  /**
   * Ajouter un like à un projet
   */
  static async add(userId, projectId) {
    try {
      const [result] = await db.execute(
        'INSERT INTO likes (user_id, project_id) VALUES (?, ?) RETURNING id',
        [userId, projectId]
      );
      
      // PostgreSQL retourne un tableau avec les lignes insérées
      return result[0].id;
    } catch (error) {
      // Si le like existe déjà (duplicate key), on retourne null
      // PostgreSQL utilise le code '23505' pour les violations d'unicité
      if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Retirer un like d'un projet
   */
  static async remove(userId, projectId) {
    const [result] = await db.execute(
      'DELETE FROM likes WHERE user_id = ? AND project_id = ?',
      [userId, projectId]
    );
    
    return result.affectedRows > 0;
  }

  /**
   * Vérifier si un utilisateur a liké un projet
   */
  static async hasLiked(userId, projectId) {
    const [rows] = await db.execute(
      'SELECT id FROM likes WHERE user_id = ? AND project_id = ?',
      [userId, projectId]
    );
    
    return rows.length > 0;
  }

  /**
   * Obtenir le nombre de likes d'un projet
   */
  static async countByProject(projectId) {
    const [rows] = await db.execute(
      'SELECT COUNT(*) as count FROM likes WHERE project_id = ?',
      [projectId]
    );
    
    return rows[0].count;
  }

  /**
   * Obtenir tous les utilisateurs qui ont liké un projet
   */
  static async getUsersByProject(projectId) {
    const [rows] = await db.execute(
      `SELECT u.id, u.first_name, u.last_name, u.photo_profil, l.created_at
       FROM likes l
       JOIN users u ON l.user_id = u.id
       WHERE l.project_id = ?
       ORDER BY l.created_at DESC`,
      [projectId]
    );
    
    return rows;
  }
}

module.exports = Like;
