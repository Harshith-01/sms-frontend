import { createAPI } from "./api";

const api = createAPI(import.meta.env.VITE_ACADEMIC_SERVICE);

// ==================== ACADEMIC YEARS ====================
export const getAcademicYears = () => api.get("/academic/academic-years");
export const createAcademicYear = (data) => api.post("/academic/academic-years", data);
export const updateAcademicYear = (year_id, data) => api.patch(`/academic/academic-years/${year_id}`, data);
export const deleteAcademicYear = (year_id) => api.delete(`/academic/academic-years/${year_id}`);

// ==================== ACADEMIC TERMS ====================
export const getAcademicTerms = () => api.get("/academic/academic-terms");
export const createAcademicTerm = (data) => api.post("/academic/academic-terms", data);
export const updateAcademicTerm = (term_id, data) => api.patch(`/academic/academic-terms/${term_id}`, data);
export const deleteAcademicTerm = (term_id) => api.delete(`/academic/academic-terms/${term_id}`);

// ==================== DEPARTMENTS ====================
export const getDepartments = () => api.get("/academic/departments");
export const createDepartment = (data) => api.post("/academic/departments", data);
export const updateDepartment = (dept_id, data) => api.patch(`/academic/departments/${dept_id}`, data);
export const deleteDepartment = (dept_id) => api.delete(`/academic/departments/${dept_id}`);

// ==================== CLASSES ====================
export const getClasses = () => api.get("/academic/classes");
export const createClass = (data) => api.post("/academic/classes", data);
export const updateClass = (class_id, data) => api.patch(`/academic/classes/${class_id}`, data);
export const deleteClass = (class_id) => api.delete(`/academic/classes/${class_id}`);

// ==================== SECTIONS ====================
export const getSections = () => api.get("/academic/sections");
export const createSection = (data) => api.post("/academic/sections", data);
export const updateSection = (section_id, data) => api.patch(`/academic/sections/${section_id}`, data);
export const deleteSection = (section_id) => api.delete(`/academic/sections/${section_id}`);

// ==================== CLASS SECTIONS ====================
export const getClassSections = () => api.get("/academic/class-sections");
export const createClassSection = (data) => api.post("/academic/class-sections", data);
export const updateClassSection = (cs_id, data) => api.patch(`/academic/class-sections/${cs_id}`, data);
export const deleteClassSection = (cs_id) => api.delete(`/academic/class-sections/${cs_id}`);

// ==================== SUBJECTS ====================
export const getSubjects = () => api.get("/academic/subjects");
export const createSubject = (data) => api.post("/academic/subjects", data);
export const updateSubject = (subject_id, data) => api.patch(`/academic/subjects/${subject_id}`, data);
export const deleteSubject = (subject_id) => api.delete(`/academic/subjects/${subject_id}`);

// ==================== TEACHING ASSIGNMENTS ====================
export const getTeachingAssignments = () => api.get("/academic/teaching-assignments");
export const createTeachingAssignment = (data) => api.post("/academic/teaching-assignments", data);
export const deleteTeachingAssignment = (assignment_id) => api.delete(`/academic/teaching-assignments/${assignment_id}`);

// ==================== STUDENT ENROLLMENTS ====================
export const getStudentEnrollments = (filters = {}) => api.get("/academic/student-subject-enrollments", { params: filters });
export const createStudentEnrollment = (data) => api.post("/academic/student-subject-enrollments", data);
export const deleteStudentEnrollment = (enrollment_id) => api.delete(`/academic/student-subject-enrollments/${enrollment_id}`);

export default {
  getAcademicYears, createAcademicYear, updateAcademicYear, deleteAcademicYear,
  getAcademicTerms, createAcademicTerm, updateAcademicTerm, deleteAcademicTerm,
  getDepartments, createDepartment, updateDepartment, deleteDepartment,
  getClasses, createClass, updateClass, deleteClass,
  getSections, createSection, updateSection, deleteSection,
  getClassSections, createClassSection, updateClassSection, deleteClassSection,
  getSubjects, createSubject, updateSubject, deleteSubject,
  getTeachingAssignments, createTeachingAssignment, deleteTeachingAssignment,
  getStudentEnrollments, createStudentEnrollment, deleteStudentEnrollment,
};