import axios from 'axios';

// ==================== CONFIG ====================
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Add auth token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ==================== TEACHERS ====================

export const getTeachers = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  return api.get(`/teachers?${params.toString()}`);
};

export const getTeacherById = async (id) => {
  return api.get(`/teachers/${id}`);
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

// ==================== STUDENTS ====================

export const getStudents = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.name) params.append('name', filters.name);
  if (filters.admission_number) params.append('admission_number', filters.admission_number);
  if (filters.class_id) params.append('class_id', filters.class_id);
  if (filters.section_id) params.append('section_id', filters.section_id);
  if (filters.academic_year) params.append('academic_year', filters.academic_year);
  return api.get(`/students?${params.toString()}`);
};

export const getStudentById = async (id) => {
  return api.get(`/students/${id}`);
};

export const createStudent = async (data) => {
  return api.post('/students', data);
};

export const deleteStudent = async (id) => {
  return api.delete(`/students/${id}`);
};

export const bulkUploadStudents = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/students/bulk', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ==================== STUDENT UPDATE APIs ====================

export const updateStudentBasic = (id, data) => 
  api.put(`/students/${id}/basic`, data);

export const updateStudentContact = (id, data) => 
  api.put(`/students/${id}/contact`, data);

export const updateStudentParent = (id, data) => 
  api.put(`/students/${id}/parent`, data);

export const updateStudentAcademic = (id, data) => 
  api.put(`/students/${id}/academic`, data);

export const updateStudentAdmission = (id, data) => 
  api.put(`/students/${id}/admission`, data);

// ==================== EXPORT ====================
export default api;