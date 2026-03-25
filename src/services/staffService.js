import { createAPI } from "./api";

// ✅ Connect to Staff Microservice
const api = createAPI(import.meta.env.VITE_STAFF_SERVICE);

// ==================== ADMIN ENDPOINTS ====================

// Get all staff
export const getStaff = async (filters = {}) => {
  return api.get("/staff", {
    params: filters,
  });
};

// Get staff by ID
export const getStaffById = async (staffId) => {
  return api.get(`/staff/${staffId}`);
};

// Create staff
export const createStaff = async (data) => {
  return api.post("/staff", data);
};

// Update staff
export const updateStaff = async (staffId, data) => {
  return api.put(`/staff/${staffId}`, data);
};

// Deactivate staff
export const deactivateStaff = async (staffId) => {
  return api.delete(`/staff/${staffId}`);
};

// Bulk upload
export const bulkUploadStaff = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post("/staff/bulk", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Get designations
export const getDesignations = async () => {
  return api.get("/staff/designations/list");
};

// Get departments
export const getDepartments = async () => {
  return api.get("/departments");
};

// ==================== STAFF SELF ====================

// My profile
export const getMyProfile = async () => {
  return api.get("/staff/me");
};

// School timetable
export const getSchoolTimetable = async (params = {}) => {
  return api.get("/staff/me/timetable", {
    params: {
      class_section_id: params.class_section_id,
      academic_term_id: params.academic_term_id,
    },
  });
};

// ==================== EXPORT ====================

export default {
  getStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deactivateStaff,
  bulkUploadStaff,
  getDesignations,
  getDepartments,
  getMyProfile,
  getSchoolTimetable,
};