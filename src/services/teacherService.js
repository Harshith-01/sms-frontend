import { createAPI } from "./api";

const api = createAPI(import.meta.env.VITE_TEACHER_SERVICE);

// ==================== TEACHERS ====================

export const getTeachers = async (filters = {}) =>
  api.get("/teachers", { params: filters });

export const getTeacherById = async (teacher_id) =>
  api.get(`/teachers/${teacher_id}`);

// GET /teachers/me — logged-in teacher profile
export const getTeacherProfile = () =>
  api.get("/teachers/me");

// GET /teachers/me/assessment-workload
// Response: { teacher_id, assessment_workload: { integration_enabled, assigned_assignments, evaluated_exam_subjects } }
export const getTeacherWorkload = () =>
  api.get("/teachers/me/assessment-workload");

export const getTeacherCount = () =>
  api.get("/teachers/count");

export const createTeacher = async (data) =>
  api.post("/teachers", data);

// PUT /teachers/{teacher_id}/details
export const updateTeacher = async (teacher_id, data) =>
  api.put(`/teachers/${teacher_id}/details`, data);

export const deleteTeacher = async (teacher_id, hard = false) =>
  api.delete(`/teachers/${teacher_id}`, { params: hard ? { hard: true } : {} });

export const bulkUploadTeachers = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/teachers/bulk", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// ==================== QUALIFICATIONS ====================

export const addQualification = async (teacher_id, data) =>
  api.post(`/teachers/${teacher_id}/qualification`, data);

export const updateQualification = async (teacher_id, qualification_id, data) =>
  api.put(`/teachers/${teacher_id}/qualification/${qualification_id}`, data);

export const deleteQualification = async (teacher_id, qualification_id) =>
  api.delete(`/teachers/${teacher_id}/qualification/${qualification_id}`);

// ==================== ACADEMICS ====================

export const addAcademic = async (teacher_id, data) =>
  api.post(`/teachers/${teacher_id}/academic`, data);

export const updateAcademic = async (teacher_id, academic_id, data) =>
  api.put(`/teachers/${teacher_id}/academic/${academic_id}`, data);

export const deleteAcademic = async (teacher_id, academic_id) =>
  api.delete(`/teachers/${teacher_id}/academic/${academic_id}`);

// ==================== EXPORT ====================

export default {
  getTeachers, getTeacherById, getTeacherProfile, getTeacherWorkload,
  getTeacherCount, createTeacher, updateTeacher, deleteTeacher,
  bulkUploadTeachers, addQualification, updateQualification, deleteQualification,
  addAcademic, updateAcademic, deleteAcademic,
};