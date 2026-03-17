import api from './api';

// ==================== STUDENTS ====================
export const getStudents = (filters = {}, page = 1, pageSize = 10) => {
  const params = new URLSearchParams();
  if (page) params.append('page', page);
  if (pageSize) params.append('page_size', pageSize);
  Object.keys(filters).forEach(key => {
    if (filters[key]) params.append(key, filters[key]);
  });
  return api.get(`/students?${params.toString()}`);
};

export const getStudent = (id) => api.get(`/students/${id}`);
export const createStudent = (data) => api.post('/students', data);
export const updateStudent = (id, data) => api.patch(`/students/${id}`, data);
export const deleteStudent = (id) => api.delete(`/students/${id}`);

// ==================== TEACHERS ====================
export const getTeachers = (filters = {}, page = 1, pageSize = 10) => {
  const params = new URLSearchParams();
  if (page) params.append('page', page);
  if (pageSize) params.append('page_size', pageSize);
  Object.keys(filters).forEach(key => {
    if (filters[key]) params.append(key, filters[key]);
  });
  return api.get(`/teachers?${params.toString()}`);
};

export const getTeacher = (id) => api.get(`/teachers/${id}`);
export const createTeacher = (data) => api.post('/teachers', data);
export const updateTeacher = (id, data) => api.patch(`/teachers/${id}`, data);
export const deleteTeacher = (id) => api.delete(`/teachers/${id}`);

// ==================== ACADEMIC YEARS ====================
export const getAcademicYears = () => api.get('/academic/academic-years');
export const createAcademicYear = (data) => api.post('/academic/academic-years', data);
export const updateAcademicYear = (id, data) => api.patch(`/academic/academic-years/${id}`, data);
export const deleteAcademicYear = (id) => api.delete(`/academic/academic-years/${id}`);

// ==================== ACADEMIC TERMS ====================
export const getAcademicTerms = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.academic_year_id) params.append('academic_year_id', filters.academic_year_id);
  if (filters.is_current !== undefined) params.append('is_current', filters.is_current);
  return api.get(`/academic/academic-terms?${params.toString()}`);
};

export const createAcademicTerm = (data) => api.post('/academic/academic-terms', data);
export const updateAcademicTerm = (id, data) => api.patch(`/academic/academic-terms/${id}`, data);
export const deleteAcademicTerm = (id) => api.delete(`/academic/academic-terms/${id}`);

// ==================== DEPARTMENTS ====================
export const getDepartments = () => api.get('/academic/departments');
export const createDepartment = (data) => api.post('/academic/departments', data);
export const updateDepartment = (id, data) => api.patch(`/academic/departments/${id}`, data);
export const deleteDepartment = (id) => api.delete(`/academic/departments/${id}`);

// ==================== CLASSES ====================
export const getClasses = () => api.get('/academic/classes');
export const createClass = (data) => api.post('/academic/classes', data);
export const updateClass = (id, data) => api.patch(`/academic/classes/${id}`, data);
export const deleteClass = (id) => api.delete(`/academic/classes/${id}`);

// ==================== SECTIONS ====================
export const getSections = () => api.get('/academic/sections');
export const createSection = (data) => api.post('/academic/sections', data);
export const updateSection = (id, data) => api.patch(`/academic/sections/${id}`, data);
export const deleteSection = (id) => api.delete(`/academic/sections/${id}`);

// ==================== CLASS SECTIONS ====================
export const getClassSections = () => api.get('/academic/class-sections');
export const createClassSection = (data) => api.post('/academic/class-sections', data);
export const updateClassSection = (id, data) => api.patch(`/academic/class-sections/${id}`, data);
export const deleteClassSection = (id) => api.delete(`/academic/class-sections/${id}`);

// ==================== SUBJECTS ====================
export const getSubjects = () => api.get('/academic/subjects');
export const createSubject = (data) => api.post('/academic/subjects', data);
export const updateSubject = (id, data) => api.patch(`/academic/subjects/${id}`, data);
export const deleteSubject = (id) => api.delete(`/academic/subjects/${id}`);

// ==================== TEACHING ASSIGNMENTS ====================
export const getTeachingAssignments = () => api.get('/academic/teaching-assignments');
export const createTeachingAssignment = (data) => api.post('/academic/teaching-assignments', data);
export const deleteTeachingAssignment = (id) => api.delete(`/academic/teaching-assignments/${id}`);

// ==================== STUDENT ENROLLMENTS ====================
export const getStudentEnrollments = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.student_id) params.append('student_id', filters.student_id);
  if (filters.subject_id) params.append('subject_id', filters.subject_id);
  if (filters.class_section_id) params.append('class_section_id', filters.class_section_id);
  if (filters.academic_year_id) params.append('academic_year_id', filters.academic_year_id);
  return api.get(`/academic/student-subject-enrollments?${params.toString()}`);
};

export const createStudentEnrollment = (data) => api.post('/academic/student-subject-enrollments', data);
export const deleteStudentEnrollment = (id) => api.delete(`/academic/student-subject-enrollments/${id}`);

// ==================== HOLIDAYS ====================
export const getHolidays = (academic_year_id = null) => {
  const params = new URLSearchParams();
  if (academic_year_id) params.append('academic_year_id', academic_year_id);
  return api.get(`/academic/holidays?${params.toString()}`);
};

export const createHoliday = (data) => api.post('/academic/holidays', data);
export const deleteHoliday = (id) => api.delete(`/academic/holidays/${id}`);

// ==================== SCHOOL SETTINGS ====================
export const getSchoolSettings = () => api.get('/academic/school-settings');
export const updateSchoolSettings = (data) => api.put('/academic/school-settings', data);