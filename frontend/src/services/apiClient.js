/**
 * Centralized API Client for all backend requests
 * Handles authentication with httpOnly cookies, error handling, and request/response formatting
 * Compatible with new Node.js backend using JWT in httpOnly cookies
 */

const API_BASE_URL = '/api';

class APIClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Make HTTP request with proper headers and error handling
   */
  async request(endpoint, options = {}) {
    const { method = 'GET', body = null } = options;

    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include httpOnly cookies
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);

      if (endpoint === '/auth/me' && response.status === 401) {
        return {
          success: false,
          data: null,
          status: 401,
        };
      }

      const data = await response.json();

      if (!response.ok) {
        const details = Array.isArray(data.details) ? data.details.join(', ') : null;
        const message = details || data.error || `Request failed: ${response.status}`;
        throw new Error(message);
      }

      return {
        success: true,
        data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        status: null,
      };
    }
  }

  /**
   * AUTH ENDPOINTS
   */

  async register(username, email, password, displayName) {
    return this.request('/auth/register', {
      method: 'POST',
      body: { username, email, password, displayName },
    });
  }

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  }

  async logout() {
    return this.request('/auth/logout', { method: 'POST' });
  }

  async getProfile() {
    return this.request('/auth/me', { method: 'GET' });
  }

  async updatePassword(currentPassword, newPassword) {
    return this.request('/auth/update-password', {
      method: 'PUT',
      body: { currentPassword, newPassword },
    });
  }

  /**
   * USER ENDPOINTS
   */

  async getAllUsers(page = 1, limit = 12, search = '') {
    const q = new URLSearchParams({ page, limit, search }).toString();
    return this.request(`/users?${q}`, { method: 'GET' });
  }

  async getUserByUsername(username) {
    return this.request(`/users/${username}`, { method: 'GET' });
  }

  async updateProfile(data) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: data,
    });
  }

  async uploadAvatar(formData) {
    return fetch(`${this.baseURL}/upload/avatar`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    }).then((r) => r.json());
  }

  async uploadCover(formData) {
    return fetch(`${this.baseURL}/upload/cover`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    }).then((r) => r.json());
  }

  async followUser(userId) {
    return this.request(`/users/${userId}/follow`, {
      method: 'POST',
    });
  }

  async unfollowUser(userId) {
    return this.request(`/users/${userId}/follow`, {
      method: 'DELETE',
    });
  }

  async getFollowers(userId) {
    return this.request(`/users/${userId}/followers`, { method: 'GET' });
  }

  async getFollowing(userId) {
    return this.request(`/users/${userId}/following`, { method: 'GET' });
  }

  async searchUsers(query) {
    return this.request(`/users/search?q=${query}`, { method: 'GET' });
  }

  async getSuggestedUsers() {
    return this.request('/users/suggested', { method: 'GET' });
  }

  async getFilterValues() {
    const result = await this.request('/filters', { method: 'GET' });
    if (result.success) return result;

    return {
      success: true,
      data: {
        data: {
          creative_fields: ['Graphic Design', 'Illustration', 'Photography', 'UI/UX', 'Web Design', 'Animation', 'Branding'],
          availability: ['Available Now', 'Available Soon', 'Not Available'],
          location: ['USA', 'Canada', 'UK', 'Germany', 'France', 'India', 'Japan', 'China', 'Brazil', 'Australia'],
          tools: ['Photoshop', 'Illustrator', 'Figma', 'Sketch', 'InDesign', 'XD', 'CorelDRAW', 'Blender'],
          color: ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Black', 'White', 'Gray', 'Pink']
        }
      },
      status: 200
    };
  }

  /**
   * PROJECT ENDPOINTS
   */

  async createProject(projectData) {
    return this.request('/projects', {
      method: 'POST',
      body: projectData,
    });
  }

  async getUserProjects() {
    return this.request('/projects/user/my-projects', { method: 'GET' });
  }

  async getAllProjects(page = 1, limit = 12, filters = {}) {
    const q = new URLSearchParams({ page, limit, ...filters }).toString();
    return this.request(`/projects?${q}`, { method: 'GET' });
  }

  async getProjectBySlug(slug) {
    return this.request(`/projects/${slug}`, { method: 'GET' });
  }

  async updateProject(id, data) {
    return this.request(`/projects/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteProject(id) {
    return this.request(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  async publishProject(id) {
    return this.request(`/projects/${id}/publish`, {
      method: 'POST',
    });
  }

  async appreciateProject(id) {
    return this.request(`/projects/${id}/appreciate`, {
      method: 'POST',
    });
  }

  async removeAppreciation(id) {
    return this.request(`/projects/${id}/appreciate`, {
      method: 'DELETE',
    });
  }

  async recordProjectView(id) {
    return this.request(`/projects/${id}/view`, { method: 'POST' });
  }

  async saveProject(id) {
    return this.request(`/projects/${id}/save`, {
      method: 'POST',
    });
  }

  async removeSaved(id) {
    return this.request(`/projects/${id}/save`, {
      method: 'DELETE',
    });
  }

  async getSavedProjects() {
    return this.request('/projects/saved', { method: 'GET' });
  }

  /**
   * COMMENT ENDPOINTS
   */

  async addComment(projectId, content) {
    return this.request(`/comments/projects/${projectId}/comments`, {
      method: 'POST',
      body: { content },
    });
  }

  async getProjectComments(projectId) {
    return this.request(`/comments/projects/${projectId}/comments`, { method: 'GET' });
  }

  async updateComment(commentId, content) {
    return this.request(`/comments/comments/${commentId}`, {
      method: 'PUT',
      body: { content },
    });
  }

  async deleteComment(commentId) {
    return this.request(`/comments/comments/${commentId}`, {
      method: 'DELETE',
    });
  }

  async likeComment(commentId) {
    return this.request(`/comments/comments/${commentId}/like`, {
      method: 'POST',
    });
  }

  /**
   * COLLECTION ENDPOINTS
   */

  async createCollection(name, description, isPrivate = false) {
    return this.request('/collections', {
      method: 'POST',
      body: { name, description, isPrivate },
    });
  }

  async getCollections() {
    return this.request('/collections', { method: 'GET' });
  }

  async addProjectToCollection(collectionId, projectId) {
    return this.request(`/collections/${collectionId}/projects/${projectId}`, {
      method: 'POST',
    });
  }

  /**
   * NOTIFICATION ENDPOINTS
   */

  async getNotifications() {
    return this.request('/notifications', { method: 'GET' });
  }

  async getUnreadCount() {
    return this.request('/notifications/unread-count', { method: 'GET' });
  }

  async markNotificationRead(id) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  /**
   * UPLOAD ENDPOINTS
   */

  async uploadProjectImages(formData) {
    return fetch(`${this.baseURL}/upload/project`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    }).then((r) => r.json());
  }

  async deleteUpload(filename, folder) {
    return this.request('/upload', {
      method: 'DELETE',
      body: { filename, folder },
    });
  }
}

// Export singleton instance
export default new APIClient();
