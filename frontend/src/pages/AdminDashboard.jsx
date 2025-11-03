import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import adminService from '../services/adminService';
import { Shield, BarChart3, Users, FolderOpen, Heart, MessageCircle } from 'lucide-react';
import '../styles/AdminDashboard.css';

function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState(null);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Vérifier que l'utilisateur est admin
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, usersData, projectsData] = await Promise.all([
        adminService.getStatistics(),
        adminService.getAllUsers(),
        adminService.getAllProjects()
      ]);

      setStatistics(statsData.statistics);
      setUsers(usersData.users);
      setProjects(projectsData.projects);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      await adminService.deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
      // Recharger les statistiques
      const statsData = await adminService.getStatistics();
      setStatistics(statsData.statistics);
    } catch (err) {
      alert('Erreur lors de la suppression de l\'utilisateur');
      console.error(err);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      return;
    }

    try {
      await adminService.deleteProject(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
      // Recharger les statistiques
      const statsData = await adminService.getStatistics();
      setStatistics(statsData.statistics);
    } catch (err) {
      alert('Erreur lors de la suppression du projet');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">Chargement des données administrateur...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1><Shield size={28} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} /> Tableau de Bord Administrateur</h1>
        <p>Bienvenue, {user?.first_name} {user?.last_name}</p>
      </div>

      <div className="admin-tabs">
        <button
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          <BarChart3 size={18} style={{ marginRight: '6px' }} /> Vue d'ensemble
        </button>
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          <Users size={18} style={{ marginRight: '6px' }} /> Utilisateurs ({users.length})
        </button>
        <button
          className={activeTab === 'projects' ? 'active' : ''}
          onClick={() => setActiveTab('projects')}
        >
          <FolderOpen size={18} style={{ marginRight: '6px' }} /> Projets ({projects.length})
        </button>
      </div>

      {activeTab === 'overview' && statistics && (
        <div className="overview-section">
          {/* Cartes statistiques principales */}
          <div className="stats-cards">
            <div className="stat-card users">
              <div className="stat-icon"><Users size={32} /></div>
              <div className="stat-info">
                <h3>{statistics.users.total}</h3>
                <p>Utilisateurs inscrits</p>
              </div>
            </div>

            <div className="stat-card projects">
              <div className="stat-icon"><FolderOpen size={32} /></div>
              <div className="stat-info">
                <h3>{statistics.projects.total}</h3>
                <p>Projets publiés</p>
              </div>
            </div>

            <div className="stat-card likes">
              <div className="stat-icon"><Heart size={32} /></div>
              <div className="stat-info">
                <h3>{statistics.interactions.likes}</h3>
                <p>J'aime</p>
              </div>
            </div>

            <div className="stat-card comments">
              <div className="stat-icon"><MessageCircle size={32} /></div>
              <div className="stat-info">
                <h3>{statistics.interactions.comments}</h3>
                <p>Commentaires</p>
              </div>
            </div>
          </div>

          {/* Utilisateurs par rôle */}
          <div className="stats-section">
            <h2>Répartition par rôle</h2>
            <div className="role-stats">
              {statistics.users.byRole.map(roleData => (
                <div key={roleData.role} className="role-item">
                  <span className={`role-badge ${roleData.role}`}>
                    {roleData.role}
                  </span>
                  <span className="role-count">{roleData.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Projets par statut */}
          <div className="stats-section">
            <h2>Projets par statut</h2>
            <div className="status-stats">
              {statistics.projects.byStatus.map(statusData => (
                <div key={statusData.status} className="status-item">
                  <span className={`status-badge ${statusData.status}`}>
                    {statusData.status}
                  </span>
                  <span className="status-count">{statusData.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Utilisateurs les plus actifs */}
          <div className="stats-section">
            <h2>🌟 Utilisateurs les plus actifs</h2>
            <div className="active-users-table">
              <table>
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Projets</th>
                    <th>Likes</th>
                    <th>Commentaires</th>
                  </tr>
                </thead>
                <tbody>
                  {statistics.activeUsers.slice(0, 5).map(user => (
                    <tr key={user.id}>
                      <td>{user.first_name} {user.last_name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>{user.projects_count}</td>
                      <td>{user.likes_count}</td>
                      <td>{user.comments_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Projets populaires */}
          <div className="stats-section">
            <h2>🔥 Projets les plus populaires</h2>
            <div className="popular-projects-table">
              <table>
                <thead>
                  <tr>
                    <th>Titre</th>
                    <th>Porteur</th>
                    <th>Likes</th>
                    <th>Commentaires</th>
                  </tr>
                </thead>
                <tbody>
                  {statistics.popularProjects.slice(0, 5).map(project => (
                    <tr key={project.id}>
                      <td>{project.title}</td>
                      <td>{project.first_name} {project.last_name}</td>
                      <td>{project.likes_count}</td>
                      <td>{project.comments_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="users-section">
          <h2>Gestion des utilisateurs</h2>
          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Pays</th>
                  <th>Projets</th>
                  <th>Date d'inscription</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.first_name} {user.last_name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>{user.pays}</td>
                    <td>{user.projects_count}</td>
                    <td>{formatDate(user.created_at)}</td>
                    <td>
                      {user.role !== 'admin' && (
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          🗑️ Supprimer
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="projects-section">
          <h2>Gestion des projets</h2>
          <div className="projects-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Titre</th>
                  <th>Porteur</th>
                  <th>Catégorie</th>
                  <th>Statut</th>
                  <th>Likes</th>
                  <th>Commentaires</th>
                  <th>Date de création</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(project => (
                  <tr key={project.id}>
                    <td>{project.id}</td>
                    <td>{project.title}</td>
                    <td>{project.first_name} {project.last_name}</td>
                    <td>{project.category}</td>
                    <td>
                      <span className={`status-badge ${project.status}`}>
                        {project.status}
                      </span>
                    </td>
                    <td>{project.likes_count}</td>
                    <td>{project.comments_count}</td>
                    <td>{formatDate(project.created_at)}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        🗑️ Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
