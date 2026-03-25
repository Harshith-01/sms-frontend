import { createAPI } from "./api";

// ✅ Connect to Auth Service
const api = createAPI(import.meta.env.VITE_AUTH_SERVICE);

// ==================== AUTHENTICATION ====================

// 🔐 LOGIN
export const login = async (email, password) => {
  return await api.post("/auth/login", { email, password });
};

// 🆕 REGISTER (Admin Creation - backend supported)
export const register = async (data) => {
  return await api.post("/auth/create-admin", data);
};

// 🚪 LOGOUT (frontend only)
export const logout = () => {
  // Backend does not have logout → just clear storage
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userName");
  localStorage.removeItem("userEmail");

  return Promise.resolve({ message: "Logged out successfully" });
};

// ❌ NOT SUPPORTED BY BACKEND (SAFE PLACEHOLDERS)

export const refreshToken = () => {
  console.warn("refreshToken API not implemented in backend");
  return Promise.resolve(null);
};

export const forgotPassword = () => {
  console.warn("forgotPassword API not implemented in backend");
  return Promise.resolve(null);
};

export const resetPassword = () => {
  console.warn("resetPassword API not implemented in backend");
  return Promise.resolve(null);
};

// ==================== EXPORT ====================

export default {
  login,
  register,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
};