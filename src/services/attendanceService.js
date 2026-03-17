import api from './api';

// ==================== TIMETABLE PERIODS ====================
export const getTimetablePeriods = async (class_section_id, academic_term_id) => {
  return api.get(`/timetable-attendance/periods?class_section_id=${class_section_id}&academic_term_id=${academic_term_id}`);
};

export const createTimetablePeriod = async (data) => {
  return api.post('/timetable-attendance/periods', data);
};

// ==================== TIMETABLE ENTRIES ====================
export const getTimetableEntries = async (class_section_id, academic_term_id) => {
  return api.get(`/timetable-attendance/entries/class/${class_section_id}?academic_term_id=${academic_term_id}`);
};

export const createTimetableEntry = async (data) => {
  return api.post('/timetable-attendance/entries', data);
};

// ==================== ATTENDANCE SETTINGS ====================
export const getAttendanceSetting = async (class_section_id) => {
  return api.get(`/timetable-attendance/attendance/settings/${class_section_id}`);
};

export const upsertAttendanceSetting = async (data) => {
  return api.put('/timetable-attendance/attendance/settings', data);
};

// ==================== ATTENDANCE SESSIONS ====================
export const createAttendanceSession = async (data) => {
  return api.post('/timetable-attendance/attendance/sessions', data);
};

// ==================== ATTENDANCE ABSENCES ====================
export const bulkUpsertAbsences = async (session_id, data) => {
  return api.post(`/timetable-attendance/attendance/sessions/${session_id}/absences/bulk`, data);
};

// ==================== STUDENT ATTENDANCE ====================
export const getStudentAttendanceHistory = async (student_id) => {
  return api.get(`/timetable-attendance/attendance/students/${student_id}/history`);
};

export const getStudentAttendanceSummary = async (student_id, class_section_id, academic_term_id) => {
  return api.get(`/timetable-attendance/attendance/students/${student_id}/summary?class_section_id=${class_section_id}&academic_term_id=${academic_term_id}`);
};

// ==================== ANALYTICS ====================
export const getClassAttendanceAnalytics = async (class_section_id, academic_term_id) => {
  return api.get(`/timetable-attendance/attendance/analytics/class/${class_section_id}?academic_term_id=${academic_term_id}`);
};

export const getSchoolAttendanceAnalytics = async (academic_term_id) => {
  return api.get(`/timetable-attendance/attendance/analytics/school?academic_term_id=${academic_term_id}`);
};