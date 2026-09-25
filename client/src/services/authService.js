import api from './api';

export const authService = {
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('railtrack_token', response.data.token);
      localStorage.setItem('railtrack_user', JSON.stringify(response.data));
    }
    return response.data;
  },

  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('railtrack_token', response.data.token);
      localStorage.setItem('railtrack_user', JSON.stringify(response.data));
    }
    return response.data;
  },

  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async updateProfile(userData) {
    const response = await api.put('/auth/profile', userData);
    if (response.data.token) {
      localStorage.setItem('railtrack_token', response.data.token);
      const existing = JSON.parse(localStorage.getItem('railtrack_user') || '{}');
      localStorage.setItem('railtrack_user', JSON.stringify({ ...existing, ...response.data }));
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('railtrack_token');
    localStorage.removeItem('railtrack_user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('railtrack_user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('railtrack_token');
  },
};
