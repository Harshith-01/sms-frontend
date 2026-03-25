import { createAPI } from "./api";

// ✅ Connect to Student Microservice
const api = createAPI(import.meta.env.VITE_STUDENT_SERVICE);

// ==================== STUDENTS ====================

// Get students
export const getStudents = async (filters = {}) => {
  return api.get("/students", {
    params: filters,
  });
};

// Get student by ID
export const getStudentById = async (id) => {
  return api.get(`/students/${id}`);
};

// Get logged-in student profile
export const getStudentProfile = () => {
  return api.get("/students/me");
};

// Create student
export const createStudent = async (data) => {
  return api.post("/students", data);
};

// Delete student
export const deleteStudent = async (id) => {
  return api.delete(`/students/${id}`);
};

// Bulk upload
export const bulkUploadStudents = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post("/students/bulk", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ==================== UPDATE APIs ====================

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