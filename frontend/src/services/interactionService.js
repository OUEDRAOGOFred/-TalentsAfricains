/**
 * Service des interactions (likes et commentaires)
 */

import api from './api';

const interactionService = {
  /**
   * Liker/Unliker un projet
   */
  async toggleLike(projectId) {
    const response = await api.post(`/interactions/like/${projectId}`);
    return response.data;
  },

  /**
   * Obtenir les likes d'un projet
   */
  async getLikes(projectId) {
    const response = await api.get(`/interactions/likes/${projectId}`);
    return response.data;
  },

  /**
   * Ajouter un commentaire
   */
  async addComment(projectId, content) {
    const response = await api.post(`/interactions/comment/${projectId}`, { content });
    return response.data;
  },

  /**
   * Obtenir les commentaires d'un projet
   */
  async getComments(projectId) {
    const response = await api.get(`/interactions/comments/${projectId}`);
    return response.data;
  },

  /**
   * Supprimer un commentaire
   */
  async deleteComment(commentId) {
    const response = await api.delete(`/interactions/comment/${commentId}`);
    return response.data;
  }
};

export default interactionService;
