/**
 * Service d'authentification
 * Gère l'inscription, la connexion et la gestion du profil
 */

import api from './api';

const authService = {
  /**
   * Inscription d'un nouvel utilisateur
   */
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  /**
   * Connexion d'un utilisateur
   */
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  /**
   * Déconnexion
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Obtenir le profil de l'utilisateur connecté
   */
  async getProfile() {
    const response = await api.get('/auth/profile');
    if (response.data.success) {
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  /**
   * Mettre à jour le profil
   */
  async updateProfile(formData) {
    const response = await api.put('/auth/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    if (response.data.success) {
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  /**
   * Obtenir un utilisateur par ID
   */
  async getUserById(userId) {
    const response = await api.get(`/auth/user/${userId}`);
    return response.data;
  },

  /**
   * Obtenir l'utilisateur depuis le localStorage
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Vérifier si l'utilisateur est connecté
   */
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};

export default authService;
