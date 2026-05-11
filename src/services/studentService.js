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
export const getStudentById = async (student_id) => {
  return api.get(`/students/${student_id}`);
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
export const deleteStudent = async (student_id) => {
  return api.delete(`/students/${student_id}`);
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

export const updateStudentBasic = (student_id, data) =>
  api.put(`/students/${student_id}/basic`, data);

export const updateStudentContact = (student_id, data) =>
  api.put(`/students/${student_id}/contact`, data);

export const updateStudentParent = (student_id, data) =>
  api.put(`/students/${student_id}/parent`, data);

export const updateStudentAcademic = (student_id, data) =>
  api.put(`/students/${student_id}/academic`, data);

// ✅ FIXED: requires admission_id
export const updateStudentAdmission = (student_id, admission_id, data) =>
  api.put(`/students/${student_id}/admission/${admission_id}`, data);

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