const db = require('../config/database');

// Obtenir toutes les statistiques
exports.getStatistics = async (req, res) => {
  try {
    // Nombre total d'utilisateurs
    const [usersCount] = await db.execute(
      'SELECT COUNT(*) as total FROM users'
    );

    // Nombre d'utilisateurs par rôle
    const [usersByRole] = await db.execute(
      'SELECT role, COUNT(*) as count FROM users GROUP BY role'
    );

    // Nombre total de projets
    const [projectsCount] = await db.execute(
      'SELECT COUNT(*) as total FROM projects'
    );

    // Projets par statut
    const [projectsByStatus] = await db.execute(
      'SELECT statut, COUNT(*) as count FROM projects GROUP BY statut'
    );

    // Nombre total de likes
    const [likesCount] = await db.execute(
      'SELECT COUNT(*) as total FROM likes'
    );

    // Nombre total de commentaires
    const [commentsCount] = await db.execute(
      'SELECT COUNT(*) as total FROM comments'
    );

    // Utilisateurs les plus actifs
    const [activeUsers] = await db.execute(`
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.role,
        COUNT(DISTINCT p.id) as projects_count,
        COUNT(DISTINCT l.id) as likes_count,
        COUNT(DISTINCT c.id) as comments_count
      FROM users u
      LEFT JOIN projects p ON u.id = p.user_id
      LEFT JOIN likes l ON u.id = l.user_id
      LEFT JOIN comments c ON u.id = c.user_id
      GROUP BY u.id
      ORDER BY (COUNT(DISTINCT p.id) + COUNT(DISTINCT l.id) + COUNT(DISTINCT c.id)) DESC
      LIMIT 10
    `);

    // Projets les plus populaires
    const [popularProjects] = await db.execute(`
      SELECT 
        p.id,
        p.titre as title,
        u.first_name,
        u.last_name,
        COUNT(DISTINCT l.id) as likes_count,
        COUNT(DISTINCT c.id) as comments_count
      FROM projects p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN likes l ON p.id = l.project_id
      LEFT JOIN comments c ON p.id = c.project_id
      GROUP BY p.id
      ORDER BY (COUNT(DISTINCT l.id) + COUNT(DISTINCT c.id)) DESC
      LIMIT 10
    `);

    // Activité récente (dernières 30 jours)
    const [recentActivity] = await db.execute(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM (
        SELECT created_at FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        UNION ALL
        SELECT created_at FROM projects WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        UNION ALL
        SELECT created_at FROM likes WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        UNION ALL
        SELECT created_at FROM comments WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      ) as activity
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);

    res.json({
      success: true,
      statistics: {
        users: {
          total: usersCount[0].total,
          byRole: usersByRole
        },
        projects: {
          total: projectsCount[0].total,
          byStatus: projectsByStatus
        },
        interactions: {
          likes: likesCount[0].total,
          comments: commentsCount[0].total
        },
        activeUsers,
        popularProjects,
        recentActivity
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
};

// Obtenir tous les utilisateurs avec détails
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.execute(`
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.role,
        u.bio,
        u.created_at,
        COUNT(DISTINCT p.id) as projects_count,
        COUNT(DISTINCT l.id) as likes_given,
        COUNT(DISTINCT c.id) as comments_count
      FROM users u
      LEFT JOIN projects p ON u.id = p.user_id
      LEFT JOIN likes l ON u.id = l.user_id
      LEFT JOIN comments c ON u.id = c.user_id
      GROUP BY u.id, u.first_name, u.last_name, u.email, u.role, u.bio, u.created_at
      ORDER BY u.created_at DESC
    `);

    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des utilisateurs'
    });
  }
};

// Obtenir tous les projets avec détails
exports.getAllProjects = async (req, res) => {
  try {
    const [projects] = await db.execute(`
      SELECT 
        p.*,
        u.first_name,
        u.last_name,
        u.email as owner_email,
        COUNT(DISTINCT l.id) as likes_count,
        COUNT(DISTINCT c.id) as comments_count
      FROM projects p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN likes l ON p.id = l.project_id
      LEFT JOIN comments c ON p.id = c.project_id
      GROUP BY p.id, u.first_name, u.last_name, u.email
      ORDER BY p.created_at DESC
    `);

    res.json({
      success: true,
      projects
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des projets'
    });
  }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier que ce n'est pas l'admin lui-même
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Vous ne pouvez pas supprimer votre propre compte'
      });
    }

    const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Utilisateur supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'utilisateur'
    });
  }
};

// Supprimer un projet
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute('DELETE FROM projects WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
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
      message: 'Erreur lors de la suppression du projet'
    });
  }
};
