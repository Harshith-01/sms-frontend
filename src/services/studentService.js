import api from './api';

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

export const getStudentProfile = () => {
  return api.get('/students/me');
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

export default {
  getStudents,
  getStudentById,
  getStudentProfile,
  createStudent,
  deleteStudent,
  bulkUploadStudents,
  updateStudentBasic,
  updateStudentContact,
  updateStudentParent,
  updateStudentAcademic,
  updateStudentAdmission,
};