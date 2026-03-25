import { createAPI } from "./api";

// ✅ Connect to Parent Microservice
const api = createAPI(import.meta.env.VITE_PARENT_SERVICE);

// ==================== ADMIN ENDPOINTS ====================

// Get all parents
export const getParents = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.is_active !== undefined)
    params.append("is_active", filters.is_active);
  if (filters.limit) params.append("limit", filters.limit);
  if (filters.offset) params.append("offset", filters.offset);

  return api.get(`/parents?${params.toString()}`);
};

// Get parent by ID
export const getParentById = async (parentId) => {
  return api.get(`/parents/${parentId}`);
};

// Create parent
export const createParent = async (data) => {
  return api.post("/parents", data);
};

// Update parent
export const updateParent = async (parentId, data) => {
  return api.put(`/parents/${parentId}`, data);
};

// Delete / deactivate parent
export const deactivateParent = async (parentId) => {
  return api.delete(`/parents/${parentId}`);
};

// Link student
export const linkStudentToParent = async (parentId, data) => {
  return api.post(`/parents/${parentId}/link-student`, data);
};

// Unlink student
export const unlinkStudentFromParent = async (parentId, studentId) => {
  return api.delete(
    `/parents/${parentId}/unlink-student/${studentId}`
  );
};

// Get children of parent
export const getParentChildren = async (parentId) => {
  return api.get(`/parents/${parentId}/children`);
};

// ==================== PARENT SELF ====================

// My profile
export const getMyProfile = async () => {
  return api.get("/parents/me");
};

// My children
export const getMyChildren = async () => {
  return api.get("/parents/me/children");
};

// Child attendance
export const getChildAttendance = async (studentId, params = {}) => {
  return api.get(
    `/parents/me/children/${studentId}/attendance`,
    {
      params: {
        class_section_id: params.class_section_id,
        academic_term_id: params.academic_term_id,
      },
    }
  );
};

// Child report cards
export const getChildReportCards = async (studentId) => {
  return api.get(
    `/parents/me/children/${studentId}/report-cards`
  );
};

// Child exam schedule
export const getChildExamSchedule = async (
  studentId,
  params = {}
) => {
  return api.get(
    `/parents/me/children/${studentId}/exam-schedule`,
    {
      params: {
        class_section_id: params.class_section_id,
        academic_year_id: params.academic_year_id,
        academic_term_id: params.academic_term_id,
      },
    }
  );
};

// Child timetable
export const getChildTimetable = async (studentId, params = {}) => {
  return api.get(
    `/parents/me/children/${studentId}/timetable`,
    {
      params: {
        class_section_id: params.class_section_id,
        academic_term_id: params.academic_term_id,
      },
    }
  );
};

// ==================== MEETINGS ====================

// Request meeting
export const requestMeeting = async (data) => {
  return api.post("/parents/me/meetings", data);
};

// My meetings
export const getMyMeetings = async (status = null) => {
  return api.get("/parents/me/meetings", {
    params: status ? { status } : {},
  });
};

// All meetings (admin/teacher)
export const listAllMeetings = async (filters = {}) => {
  return api.get("/parents/meetings", {
    params: filters,
  });
};

// Update meeting
export const updateMeetingStatus = async (meetingId, data) => {
  return api.patch(`/parents/meetings/${meetingId}`, data);
};

// ==================== EXPORT ====================

export default {
  getParents,
  getParentById,
  createParent,
  updateParent,
  deactivateParent,
  linkStudentToParent,
  unlinkStudentFromParent,
  getParentChildren,

  getMyProfile,
  getMyChildren,
  getChildAttendance,
  getChildReportCards,
  getChildExamSchedule,
  getChildTimetable,

  requestMeeting,
  getMyMeetings,
  listAllMeetings,
  updateMeetingStatus,
};