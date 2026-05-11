import { createAPI } from "./api";

const api = createAPI(import.meta.env.VITE_PARENT_SERVICE);

// Safe array extractor for any API response shape
export const toArray = (res) => {
  const d = res?.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.items)) return d.items;
  if (Array.isArray(d?.results)) return d.results;
  if (Array.isArray(d?.data)) return d.data;
  return [];
};

// ==================== ADMIN APIs ====================

// GET /parents
export const getParents = (params = {}) =>
  api.get("/parents", { params });

// GET /parents/{parent_id}
export const getParentById = (parent_id) =>
  api.get(`/parents/${parent_id}`);

// POST /parents
export const createParent = (data) =>
  api.post("/parents", data);

// PUT /parents/{parent_id}
export const updateParent = (parent_id, data) =>
  api.put(`/parents/${parent_id}`, data);

// DELETE /parents/{parent_id}
export const deactivateParent = (parent_id) =>
  api.delete(`/parents/${parent_id}`);

// GET /parents/{parent_id}/children  (admin view)
export const getParentChildren = (parent_id) =>
  api.get(`/parents/${parent_id}/children`);

// POST /parents/{parent_id}/link-student
export const linkStudentToParent = (parent_id, data) =>
  api.post(`/parents/${parent_id}/link-student`, data);

// DELETE /parents/{parent_id}/unlink-student/{student_id}
export const unlinkStudentFromParent = (parent_id, student_id) =>
  api.delete(`/parents/${parent_id}/unlink-student/${student_id}`);

// ==================== PARENT SELF APIs ====================

// GET /parents/me
export const getMyProfile = () =>
  api.get("/parents/me");

// GET /parents/me/children
export const getMyChildren = () =>
  api.get("/parents/me/children");

// GET /parents/me/children/{student_id}/attendance
export const getChildAttendance = (student_id, params = {}) =>
  api.get(`/parents/me/children/${student_id}/attendance`, { params });

// GET /parents/me/children/{student_id}/report-cards
export const getChildReportCards = (student_id) =>
  api.get(`/parents/me/children/${student_id}/report-cards`);

// GET /parents/me/children/{student_id}/exam-schedule
export const getChildExamSchedule = (student_id, params = {}) =>
  api.get(`/parents/me/children/${student_id}/exam-schedule`, { params });

// GET /parents/me/children/{student_id}/timetable
export const getChildTimetable = (student_id, params = {}) =>
  api.get(`/parents/me/children/${student_id}/timetable`, { params });

// ==================== MEETINGS ====================

// POST /parents/me/meetings
export const requestMeeting = (data) =>
  api.post("/parents/me/meetings", data);

// GET /parents/me/meetings
export const getMyMeetings = (params = {}) =>
  api.get("/parents/me/meetings", { params });

// PATCH /parents/meetings/{meeting_id}
export const updateMeeting = (meeting_id, data) =>
  api.patch(`/parents/meetings/${meeting_id}`, data);

export default {
  getParents, getParentById, createParent, updateParent, deactivateParent,
  getParentChildren, linkStudentToParent, unlinkStudentFromParent,
  getMyProfile, getMyChildren,
  getChildAttendance, getChildReportCards, getChildExamSchedule, getChildTimetable,
  requestMeeting, getMyMeetings, updateMeeting,
};