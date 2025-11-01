/**
 * Modèle User - Gestion des utilisateurs
 * Fournit toutes les opérations CRUD pour les utilisateurs
 */

const db = require('../config/database');

class User {
  /**
   * Créer un nouvel utilisateur
   */
  static async create(userData) {
    const { first_name, last_name, email, password, role, bio } = userData;
    
    const [result] = await db.execute(
      `INSERT INTO users (first_name, last_name, email, password, role, bio) 
       VALUES (?, ?, ?, ?, ?, ?) RETURNING id`,
      [first_name, last_name, email, password, role || 'user', bio]
    );
    
    // PostgreSQL retourne un tableau avec les lignes insérées
    return result[0].id;
  }

  /**
   * Trouver un utilisateur par email
   */
  static async findByEmail(email) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    return rows[0];
  }

  /**
   * Trouver un utilisateur par ID
   */
  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT id, first_name, last_name, email, role, bio, competences, pays, photo_profil, linkedin, twitter, website, created_at FROM users WHERE id = ?',
      [id]
    );
    
    return rows[0];
  }

  /**
   * Mettre à jour le profil utilisateur
   */
  static async update(id, userData) {
    const fields = [];
    const values = [];

    // Construction dynamique de la requête
    Object.keys(userData).forEach(key => {
      if (userData[key] !== undefined && key !== 'id' && key !== 'email' && key !== 'password') {
        fields.push(`${key} = ?`);
        values.push(userData[key]);
      }
    });

    if (fields.length === 0) {
      return false;
    }

    values.push(id);
    
    const [result] = await db.execute(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return result.affectedRows > 0;
  }

  /**
   * Mettre à jour le mot de passe
   */
  static async updatePassword(id, hashedPassword) {
    const [result] = await db.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, id]
    );
    
    return result.affectedRows > 0;
  }

  /**
   * Supprimer un utilisateur
   */
  static async delete(id) {
    const [result] = await db.execute(
      'DELETE FROM users WHERE id = ?',
      [id]
    );
    
    return result.affectedRows > 0;
  }

  /**
   * Obtenir tous les porteurs de projet
   */
  static async getAllPorteurs(limit = 20, offset = 0) {
    const [rows] = await db.execute(
      `SELECT id, first_name, last_name, email, bio, competences, pays, photo_profil, linkedin, twitter, website, created_at 
       FROM users 
       WHERE role = 'porteur_projet' 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    
    return rows;
  }
}

module.exports = User;
