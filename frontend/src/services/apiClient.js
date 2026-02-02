/**
 * Centralized API Client for all backend requests
 * Handles token management, error handling, and request/response formatting
 */

const API_BASE_URL = 'http://localhost:5000/api';

class APIClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  /**
   * Process queued requests after token refresh
   */
  processQueue(error, token = null) {
    this.failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  /**
   * Get the authorization token from localStorage
   */
  getToken() {
    return localStorage.getItem('accessToken');
  }

  /**
   * Set tokens in localStorage
   */
  setTokens(accessToken, refreshToken) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  /**
   * Clear tokens from localStorage
   */
  clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  /**
   * Build headers with authorization token
   */
  getHeaders(includeAuth = false) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Generic fetch method with error handling and auto token refresh
   */
  async request(endpoint, options = {}) {
    const { method = 'GET', body = null, requiresAuth = false } = options;

    const config = {
      method,
      headers: this.getHeaders(requiresAuth),
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      // Handle 401 - Try to refresh token
      if (response.status === 401 && requiresAuth) {
        if (this.isRefreshing) {
          // Wait for token refresh to complete
          return new Promise((resolve, reject) => {
            this.failedQueue.push({ resolve, reject });
          })
            .then(token => {
              config.headers['Authorization'] = `Bearer ${token}`;
              return fetch(`${this.baseURL}${endpoint}`, config);
            })
            .then(response => response.json())
            .then(data => ({
              success: true,
              data,
              status: response.status,
            }));
        }

        this.isRefreshing = true;

        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const refreshResponse = await fetch(`${this.baseURL}/auth/refresh_token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });

          if (!refreshResponse.ok) {
            // Refresh failed, clear tokens and redirect to login
            this.clearTokens();
            if (window.location.pathname !== '/') {
              window.location.href = '/';
            }
            throw new Error('Token refresh failed');
          }

          const refreshData = await refreshResponse.json();
          const newAccessToken = refreshData.accessToken;
          
          localStorage.setItem('accessToken', newAccessToken);
          this.processQueue(null, newAccessToken);

          // Retry original request with new token
          config.headers['Authorization'] = `Bearer ${newAccessToken}`;
          const retryResponse = await fetch(`${this.baseURL}${endpoint}`, config);
          const retryData = await retryResponse.json();

          if (!retryResponse.ok) {
            throw new Error(retryData.message || `Request failed: ${retryResponse.status}`);
          }

          return {
            success: true,
            data: retryData,
            status: retryResponse.status,
          };
        } catch (error) {
          this.processQueue(error, null);
          this.clearTokens();
          return {
            success: false,
            error: error.message,
            status: 401,
          };
        } finally {
          this.isRefreshing = false;
        }
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Request failed: ${response.status}`);
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

  async register(firstName, lastName, email, password) {
    return this.request('/auth/register', {
      method: 'POST',
      body: { firstName, lastName, email, password },
    });
  }

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    return this.request('/auth/refresh_token', {
      method: 'POST',
      body: { refreshToken },
    });
  }

  /**
   * Get current user profile
   */
  async getProfile() {
    return this.request('/auth/me', {
      method: 'GET',
      requiresAuth: true,
    });
  }

  /**
   * Check user role
   */
  async checkRole() {
    return this.request('/auth/checkRole', {
      method: 'POST',
      requiresAuth: true,
    });
  }

  /**
   * CARD ENDPOINTS
   */

  async getAllCards(page = 1, limit = 50) {
    return this.request(`/cards/all?page=${page}&limit=${limit}`, {
      method: 'GET',
    });
  }

  async searchCards(query, filters = {}) {
    let url = '/cards/search?';
    if (query) url += `q=${encodeURIComponent(query)}&`;
    
    // Handle array filters
    if (filters.creative_fields && filters.creative_fields.length > 0) {
      filters.creative_fields.forEach(field => {
        url += `creative_fields=${encodeURIComponent(field)}&`;
      });
    }
    if (filters.availability && filters.availability.length > 0) {
      filters.availability.forEach(item => {
        url += `availability=${encodeURIComponent(item)}&`;
      });
    }
    if (filters.location && filters.location.length > 0) {
      filters.location.forEach(loc => {
        url += `location=${encodeURIComponent(loc)}&`;
      });
    }
    if (filters.tools && filters.tools.length > 0) {
      filters.tools.forEach(tool => {
        url += `tools=${encodeURIComponent(tool)}&`;
      });
    }
    if (filters.color && filters.color.length > 0) {
      filters.color.forEach(c => {
        url += `color=${encodeURIComponent(c)}&`;
      });
    }
    if (filters.colors && filters.colors.length > 0) {
      filters.colors.forEach(c => {
        url += `colors=${encodeURIComponent(c)}&`;
      });
    }
    if (filters.country && filters.country.length > 0) {
      filters.country.forEach(c => {
        url += `country=${encodeURIComponent(c)}&`;
      });
    }
    if (filters.file_extension && filters.file_extension.length > 0) {
      filters.file_extension.forEach(ext => {
        url += `file_extension=${encodeURIComponent(ext)}&`;
      });
    }
    if (filters.category && filters.category.length > 0) {
      filters.category.forEach(cat => {
        url += `category=${encodeURIComponent(cat)}&`;
      });
    }
    
    // Remove trailing &
    url = url.replace(/&$/, '');
    
    return this.request(url, {
      method: 'GET',
    });
  }

  async getFilterValues() {
    return this.request('/cards/filters', {
      method: 'GET',
    });
  }

  async getCard(id) {
    return this.request(`/cards/specific/${id}`, {
      method: 'GET',
    });
  }

  async addCard(cardData) {
    return this.request('/cards/add', {
      method: 'POST',
      body: cardData,
    });
  }

  async likeCard(cardId) {
    return this.request(`/cards/like/${cardId}`, {
      method: 'POST',
      requiresAuth: true,
    });
  }

  async getLikedCards() {
    return this.request('/cards/liked', {
      method: 'GET',
      requiresAuth: true,
    });
  }

  async deleteCard(cardId) {
    return this.request(`/cards/delete/${cardId}`, {
      method: 'DELETE',
    });
  }

  async deleteAllCards() {
    return this.request('/cards/deleteAll', {
      method: 'DELETE',
    });
  }

  /**
   * USER ENDPOINTS
   */

  async getCreatorProfile(creatorName) {
    return this.request(`/users/creator/${encodeURIComponent(creatorName)}`, {
      method: 'GET',
    });
  }

  async getUserProfile() {
    return this.request('/users/profile', {
      method: 'GET',
      requiresAuth: true,
    });
  }

  async createCard(cardData) {
    return this.addCard(cardData);
  }
}

// Export singleton instance
export default new APIClient();
