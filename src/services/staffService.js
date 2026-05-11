import { createAPI } from "./api";

const api = createAPI(import.meta.env.VITE_STAFF_SERVICE);

// Safe array extractor
export const toArray = (res) => {
  const d = res?.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.items)) return d.items;
  if (Array.isArray(d?.results)) return d.results;
  if (Array.isArray(d?.data)) return d.data;
  return [];
};

// ==================== STAFF ====================

// GET /staff
export const getStaff = (params = {}) => {
  // Strip null/undefined params before sending
  const clean = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== null && v !== undefined && v !== '')
  );
  return api.get("/staff", { params: clean });
};

// GET /staff/{staff_id}
export const getStaffById = (staff_id) =>
  api.get(`/staff/${staff_id}`);

// POST /staff
export const createStaff = (data) =>
  api.post("/staff", data);

// PUT /staff/{staff_id}
export const updateStaff = (staff_id, data) =>
  api.put(`/staff/${staff_id}`, data);

// DELETE /staff/{staff_id}
export const deactivateStaff = (staff_id) =>
  api.delete(`/staff/${staff_id}`);

// POST /staff/bulk
export const bulkUploadStaff = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/staff/bulk", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// ==================== SELF ====================

// GET /staff/me
export const getMyProfile = () =>
  api.get("/staff/me");

// GET /staff/me/timetable
export const getMyTimetable = (params = {}) =>
  api.get("/staff/me/timetable", { params });

// ==================== DESIGNATIONS ====================

// GET /staff/designations/list
export const getDesignations = () =>
  api.get("/staff/designations/list");

// ==================== EXPORT ====================

export default {
  getStaff, getStaffById, createStaff, updateStaff, deactivateStaff,
  bulkUploadStaff, getMyProfile, getMyTimetable, getDesignations,
};