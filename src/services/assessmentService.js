import { createAPI } from "./api";

// ✅ Connect to Assessment Service
const api = createAPI(import.meta.env.VITE_ASSESSMENT_SERVICE);

// ==================== GRADE SCALES ====================
export const getGradeScales = async () => {
  return await api.get("/assessment/grade-scales");
};

export const createGradeScale = async (data) => {
  return await api.post("/assessment/grade-scales", data);
};

export const updateGradeScale = async (id, data) => {
  return await api.put(`/assessment/grade-scales/${id}`, data);
};

export const deleteGradeScale = async (id) => {
  return await api.delete(`/assessment/grade-scales/${id}`);
};

// ==================== GRADE BANDS ====================
export const getGradeBands = async (scaleId) => {
  return await api.get("/assessment/grade-bands", {
    params: { scale_id: scaleId },
  });
};

export const createGradeBand = async (data) => {
  return await api.post("/assessment/grade-bands", data);
};

// ==================== COMPONENT WEIGHTS ====================
export const getComponentWeights = async (filters = {}) => {
  return await api.get("/assessment/component-weights", {
    params: filters,
  });
};

export const createComponentWeight = async (data) => {
  return await api.post("/assessment/component-weights", data);
};

// ==================== EXAMS ====================
export const getExams = async (filters = {}, page = 1, pageSize = 10) => {
  return await api.get("/assessment/exams", {
    params: { ...filters, page, pageSize },
  });
};

export const getExam = async (id) => {
  return await api.get(`/assessment/exams/${id}`);
};

export const createExam = async (data) => {
  return await api.post("/assessment/exams", data);
};

export const updateExam = async (id, data) => {
  return await api.put(`/assessment/exams/${id}`, data);
};

export const publishExam = async (id) => {
  return await api.post(`/assessment/exams/${id}/publish`);
};

export const cancelExam = async (id) => {
  return await api.post(`/assessment/exams/${id}/cancel`);
};

// ==================== ASSIGNMENTS ====================
export const getAssignments = async (filters = {}, page = 1, pageSize = 10) => {
  return await api.get("/assessment/assignments", {
    params: { ...filters, page, pageSize },
  });
};

export const getAssignment = async (id) => {
  return await api.get(`/assessment/assignments/${id}`);
};

export const createAssignment = async (data) => {
  return await api.post("/assessment/assignments", data);
};

export const updateAssignment = async (id, data) => {
  return await api.put(`/assessment/assignments/${id}`, data);
};

export const publishAssignment = async (id) => {
  return await api.post(`/assessment/assignments/${id}/publish`);
};

export const closeAssignment = async (id) => {
  return await api.post(`/assessment/assignments/${id}/close`);
};

export const cancelAssignment = async (id) => {
  return await api.post(`/assessment/assignments/${id}/cancel`);
};

// ==================== ASSIGNMENT SUBMISSIONS ====================
export const getAssignmentSubmissions = async (assignmentId) => {
  return await api.get(
    `/assessment/assignments/${assignmentId}/submissions`
  );
};

export const submitAssignment = async (assignmentId, data) => {
  return await api.post(`/assessment/assignments/${assignmentId}/submit`, data);
};

// ==================== BULK MARKS ====================
export const bulkUploadExamMarks = async (data) => {
  return await api.post("/assessment/exam-marks/bulk-upload", data);
};

export const verifyExamMarks = async (registrationId, remarks) => {
  return await api.post(
    `/assessment/exam-registrations/${registrationId}/verify`,
    { remarks }
  );
};

export const bulkUploadAssignmentMarks = async (data) => {
  return await api.post(
    "/assessment/assignment-marks/bulk-upload",
    data
  );
};

export const verifyAssignmentMarks = async (submissionId, feedback) => {
  return await api.post(
    `/assessment/assignment-submissions/${submissionId}/verify`,
    { feedback }
  );
};

// ==================== STUDENT HISTORY ====================
export const getStudentAssignmentHistory = async (
  studentId,
  page = 1,
  pageSize = 10
) => {
  return await api.get(
    `/assessment/students/${studentId}/assignment-history`,
    { params: { page, pageSize } }
  );
};

export const getStudentExamHistory = async (
  studentId,
  page = 1,
  pageSize = 10
) => {
  return await api.get(
    `/assessment/students/${studentId}/exam-history`,
    { params: { page, pageSize } }
  );
};

export const getStudentAcademicHistory = async (studentId) => {
  return await api.get(
    `/assessment/students/${studentId}/academic-history`
  );
};

// ==================== REPORT CARDS ====================
export const generateReportCards = async (data) => {
  return await api.post("/assessment/report-cards/generate", data);
};

export const publishReportCards = async (reportCardIds) => {
  return await api.post("/assessment/report-cards/publish", {
    report_card_ids: reportCardIds,
  });
};

export const getStudentReportCards = async (studentId) => {
  return await api.get(
    `/assessment/students/${studentId}/report-cards`
  );
};

// ==================== VIEW/DOWNLOAD ====================
export const viewReportCard = async (reportCardId) => {
  return await api.get(
    `/assessment/report-cards/${reportCardId}/view`
  );
};

export const downloadReportCard = async (reportCardId) => {
  return await api.get(
    `/assessment/report-cards/${reportCardId}/download`,
    { responseType: "blob" }
  );
};