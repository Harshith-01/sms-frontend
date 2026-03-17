import api from './api';

// ==================== TEACHERS ====================

export const getTeachers = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  return api.get(`/teachers?${params.toString()}`);
};

export const getTeacherById = async (id) => {
  return api.get(`/teachers/${id}`);
};

export const getTeacherProfile = () => {
  return api.get('/teachers/me');
};

export const createTeacher = async (data) => {
  return api.post('/teachers', data);
};

export const updateTeacher = async (id, data) => {
  return api.put(`/teachers/${id}`, data);
};

export const deleteTeacher = async (id) => {
  return api.delete(`/teachers/${id}`);
};

export const bulkUploadTeachers = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/teachers/bulk', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export default {
  getTeachers,
  getTeacherById,
  getTeacherProfile,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  bulkUploadTeachers,
};