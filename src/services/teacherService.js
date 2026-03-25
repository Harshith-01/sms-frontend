import { createAPI } from "./api";

// ✅ Connect to Teacher Microservice
const api = createAPI(import.meta.env.VITE_TEACHER_SERVICE);

// ==================== TEACHERS ====================

// Get teachers
export const getTeachers = async (filters = {}) => {
  return api.get("/teachers", {
    params: filters,
  });
};

// Get teacher by ID
export const getTeacherById = async (id) => {
  return api.get(`/teachers/${id}`);
};

// Get logged-in teacher profile
export const getTeacherProfile = () => {
  return api.get("/teachers/me");
};

// Create teacher
export const createTeacher = async (data) => {
  return api.post("/teachers", data);
};

// Update teacher
export const updateTeacher = async (id, data) => {
  return api.put(`/teachers/${id}`, data);
};

// Delete teacher
export const deleteTeacher = async (id) => {
  return api.delete(`/teachers/${id}`);
};

// Bulk upload
export const bulkUploadTeachers = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post("/teachers/bulk", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ==================== EXPORT ====================

export default {
  getTeachers,
  getTeacherById,
  getTeacherProfile,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  bulkUploadTeachers,
};