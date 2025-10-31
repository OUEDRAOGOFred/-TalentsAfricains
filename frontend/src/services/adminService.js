import api from './api';

class AdminService {
  // Obtenir les statistiques
  async getStatistics() {
    const response = await api.get('/admin/statistics');
    return response.data;
  }

  // Obtenir tous les utilisateurs
  async getAllUsers() {
    const response = await api.get('/admin/users');
    return response.data;
  }

  // Obtenir tous les projets
  async getAllProjects() {
    const response = await api.get('/admin/projects');
    return response.data;
  }

  // Supprimer un utilisateur
  async deleteUser(userId) {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  }

  // Supprimer un projet
  async deleteProject(projectId) {
    const response = await api.delete(`/admin/projects/${projectId}`);
    return response.data;
  }
}

export default new AdminService();
