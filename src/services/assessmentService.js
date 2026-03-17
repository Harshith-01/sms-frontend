import api from './api';

// ==================== GRADE SCALES ====================
export const getGradeScales = async () => {
  const response = await api.get('/assessment/grade-scales');
  return response;
};

export const createGradeScale = async (data) => {
  const response = await api.post('/assessment/grade-scales', data);
  return response;
};

export const updateGradeScale = async (id, data) => {
  const response = await api.put(`/assessment/grade-scales/${id}`, data);
  return response;
};

export const deleteGradeScale = async (id) => {
  const response = await api.delete(`/assessment/grade-scales/${id}`);
  return response;
};

// ==================== GRADE BANDS ====================
export const getGradeBands = async (scaleId) => {
  const response = await api.get('/assessment/grade-bands', { params: { scale_id: scaleId } });
  return response;
};

export const createGradeBand = async (data) => {
  const response = await api.post('/assessment/grade-bands', data);
  return response;
};

// ==================== COMPONENT WEIGHTS ====================
export const getComponentWeights = async (filters = {}) => {
  const response = await api.get('/assessment/component-weights', { params: filters });
  return response;
};

export const createComponentWeight = async (data) => {
  const response = await api.post('/assessment/component-weights', data);
  return response;
};

// ==================== EXAMS ====================
export const getExams = async (filters = {}, page = 1, pageSize = 10) => {
  const response = await api.get('/assessment/exams', { params: { ...filters, page, pageSize } });
  return response;
};

export const getExam = async (id) => {
  const response = await api.get(`/assessment/exams/${id}`);
  return response;
};

export const createExam = async (data) => {
  const response = await api.post('/assessment/exams', data);
  return response;
};

export const updateExam = async (id, data) => {
  const response = await api.put(`/assessment/exams/${id}`, data);
  return response;
};

export const publishExam = async (id) => {
  const response = await api.post(`/assessment/exams/${id}/publish`);
  return response;
};

export const cancelExam = async (id) => {
  const response = await api.post(`/assessment/exams/${id}/cancel`);
  return response;
};

// ==================== ASSIGNMENTS ====================
export const getAssignments = async (filters = {}, page = 1, pageSize = 10) => {
  const response = await api.get('/assessment/assignments', { params: { ...filters, page, pageSize } });
  return response;
};

export const getAssignment = async (id) => {
  const response = await api.get(`/assessment/assignments/${id}`);
  return response;
};

export const createAssignment = async (data) => {
  const response = await api.post('/assessment/assignments', data);
  return response;
};

export const updateAssignment = async (id, data) => {
  const response = await api.put(`/assessment/assignments/${id}`, data);
  return response;
};

export const publishAssignment = async (id) => {
  const response = await api.post(`/assessment/assignments/${id}/publish`);
  return response;
};

export const closeAssignment = async (id) => {
  const response = await api.post(`/assessment/assignments/${id}/close`);
  return response;
};

export const cancelAssignment = async (id) => {
  const response = await api.post(`/assessment/assignments/${id}/cancel`);
  return response;
};

// ==================== ASSIGNMENT SUBMISSIONS (FOR TEACHER GRADING) ====================
export const getAssignmentSubmissions = async (assignmentId) => {
  const response = await api.get(`/assessment/assignments/${assignmentId}/submissions`);
  return response;
};

// ==================== BULK MARKS UPLOAD ====================
export const bulkUploadExamMarks = async (data) => {
  const response = await api.post('/assessment/exam-marks/bulk-upload', data);
  return response;
};

export const verifyExamMarks = async (registrationId, remarks) => {
  const response = await api.post(`/assessment/exam-registrations/${registrationId}/verify`, { remarks });
  return response;
};

export const bulkUploadAssignmentMarks = async (data) => {
  const response = await api.post('/assessment/assignment-marks/bulk-upload', data);
  return response;
};

export const verifyAssignmentMarks = async (submissionId, feedback) => {
  const response = await api.post(`/assessment/assignment-submissions/${submissionId}/verify`, { feedback });
  return response;
};

// ==================== STUDENT HISTORY ====================
export const getStudentAssignmentHistory = async (studentId, page = 1, pageSize = 10) => {
  const response = await api.get(`/assessment/students/${studentId}/assignment-history`, { params: { page, pageSize } });
  return response;
};

export const getStudentExamHistory = async (studentId, page = 1, pageSize = 10) => {
  const response = await api.get(`/assessment/students/${studentId}/exam-history`, { params: { page, pageSize } });
  return response;
};

export const getStudentAcademicHistory = async (studentId) => {
  const response = await api.get(`/assessment/students/${studentId}/academic-history`);
  return response;
};

// ==================== REPORT CARDS ====================
export const generateReportCards = async (data) => {
  const response = await api.post('/assessment/report-cards/generate', data);
  return response;
};

export const publishReportCards = async (reportCardIds) => {
  const response = await api.post('/assessment/report-cards/publish', { report_card_ids: reportCardIds });
  return response;
};

export const getStudentReportCards = async (studentId) => {
  const response = await api.get(`/assessment/students/${studentId}/report-cards`);
  return response;
};

// ==================== VIEW/DOWNLOAD REPORT CARD ====================
export const viewReportCard = async (reportCardId) => {
  const response = await api.get(`/assessment/report-cards/${reportCardId}/view`);
  return response;
};

export const downloadReportCard = async (reportCardId) => {
  const response = await api.get(`/assessment/report-cards/${reportCardId}/download`, { responseType: 'blob' });
  return response;
};