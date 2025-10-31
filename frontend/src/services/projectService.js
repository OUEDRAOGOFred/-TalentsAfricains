/**
 * Service des projets
 * Gère toutes les opérations sur les projets
 */

import api from './api';

const projectService = {
  /**
   * Créer un nouveau projet
   */
  async create(formData) {
    const response = await api.post('/projects', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  /**
   * Obtenir tous les projets avec filtres
   */
  async getAll(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.categorie) params.append('categorie', filters.categorie);
    if (filters.localisation) params.append('localisation', filters.localisation);
    if (filters.search) params.append('search', filters.search);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.offset) params.append('offset', filters.offset);

    const response = await api.get(`/projects?${params.toString()}`);
    return response.data;
  },

  /**
   * Obtenir un projet par ID
   */
  async getById(projectId) {
    const response = await api.get(`/projects/${projectId}`);
    return response.data;
  },

  /**
   * Obtenir les projets de l'utilisateur connecté
   */
  async getMyProjects() {
    const response = await api.get('/projects/my');
    return response.data;
  },

  /**
   * Obtenir les projets d'un utilisateur
   */
  async getByUserId(userId) {
    const response = await api.get(`/projects/user/${userId}`);
    return response.data;
  },

  /**
   * Mettre à jour un projet
   */
  async update(projectId, formData) {
    const response = await api.put(`/projects/${projectId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  /**
   * Supprimer un projet
   */
  async delete(projectId) {
    const response = await api.delete(`/projects/${projectId}`);
    return response.data;
  }
};

export default projectService;
