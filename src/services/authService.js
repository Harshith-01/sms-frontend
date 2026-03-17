import api from './api';

// ==================== AUTHENTICATION ====================

export const login = async (email, password) => {
  return api.post('/auth/login', { email, password });
};

export const register = async (data) => {
  return api.post('/auth/register', data);
};

export const logout = async () => {
  return api.post('/auth/logout');
};

export const refreshToken = async (refreshToken) => {
  return api.post('/auth/refresh', { refresh_token: refreshToken });
};

export const forgotPassword = async (email) => {
  return api.post('/auth/forgot-password', { email });
};

export const resetPassword = async (token, newPassword) => {
  return api.post('/auth/reset-password', { token, password: newPassword });
};

export default {
  login,
  register,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
};