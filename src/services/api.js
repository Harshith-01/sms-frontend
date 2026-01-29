const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = {
  login: async (credentials) => {
    // Backend API integration placeholder
  },
  
  signup: async (userData) => {
    // Backend API integration placeholder
  },
  
  forgotPassword: async (email) => {
    // Backend API integration placeholder
  },
  
  resetPassword: async (token, newPassword) => {
    // Backend API integration placeholder
  },
};

export default api;