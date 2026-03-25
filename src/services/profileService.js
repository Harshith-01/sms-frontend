import { createAPI } from "./api";

// ✅ Create separate APIs
const studentAPI = createAPI(import.meta.env.VITE_STUDENT_SERVICE);
const teacherAPI = createAPI(import.meta.env.VITE_TEACHER_SERVICE);

// ==================== PROFILE APIS ====================

// Student profile
export const getStudentProfile = () => {
  return studentAPI.get("/students/me");
};

// Teacher profile
export const getTeacherProfile = () => {
  return teacherAPI.get("/teachers/me");
};

// Optional (not supported yet by backend)
export const updateProfile = (data) => {
  console.warn("Update profile API not implemented in backend");
  return Promise.resolve(null);
};

export const updateProfilePhoto = (file) => {
  console.warn("Update profile photo API not implemented in backend");
  return Promise.resolve(null);
};

export default {
  getStudentProfile,
  getTeacherProfile,
  updateProfile,
  updateProfilePhoto,
};