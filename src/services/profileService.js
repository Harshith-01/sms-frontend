import api from './api';

// ==================== PROFILE APIS ====================

export const getStudentProfile = () => {
  return api.get('/students/me');
};

export const getTeacherProfile = () => {
  return api.get('/teachers/me');
};

export const updateProfile = (data) => {
  return api.put('/profile', data);
};

export const updateProfilePhoto = (file) => {
  const formData = new FormData();
  formData.append('photo', file);
  return api.post('/profile/photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export default {
  getStudentProfile,
  getTeacherProfile,
  updateProfile,
  updateProfilePhoto,
};