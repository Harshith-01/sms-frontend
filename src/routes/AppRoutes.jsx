import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../components/layouts/Dashboardlayout';

import LandingPage from '../pages/public/LandingPage';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

import AdminDashboard from '../pages/dashboard/admin/AdminDashboard';
import TeacherDashboard from '../pages/dashboard/teacher/TeacherDashboard';
import StudentDashboard from '../pages/dashboard/student/StudentDashboard';

import TeacherList from '../pages/dashboard/admin/onboarding/teachers/TeacherList';
import StudentList from '../pages/dashboard/admin/onboarding/students/StudentList';

import TeacherForm from '../pages/shared/TeacherForm';
import StudentForm from '../pages/shared/StudentForm';

// Academic Management Pages
import AcademicYears from '../pages/dashboard/admin/academic/AcademicYears';
import Departments from '../pages/dashboard/admin/academic/Departments';
import Classes from '../pages/dashboard/admin/academic/Classes';
import Sections from '../pages/dashboard/admin/academic/Sections';
import ClassSections from '../pages/dashboard/admin/academic/ClassSections';
import Subjects from '../pages/dashboard/admin/academic/Subjects';
import TeachingAssignments from '../pages/dashboard/admin/academic/TeachingAssignments';
import StudentEnrollments from '../pages/dashboard/admin/academic/StudentEnrollments';

// Assessment Management Pages
import GradeScales from '../pages/dashboard/admin/assessment/GradeScales';
import GradeBands from '../pages/dashboard/admin/assessment/GradeBands';
import ComponentWeights from '../pages/dashboard/admin/assessment/ComponentWeights';
import Exams from '../pages/dashboard/admin/assessment/Exams';
import Assignments from '../pages/dashboard/admin/assessment/Assignments';
import ExamMarks from '../pages/dashboard/admin/assessment/ExamMarks';
import AssignmentMarks from '../pages/dashboard/admin/assessment/AssignmentMarks';
import ReportCards from '../pages/dashboard/admin/assessment/ReportCards';

// Fee Management Pages
import StudentFees from '../pages/dashboard/admin/fees/StudentFees';
import FeePayments from '../pages/dashboard/admin/fees/FeePayments';

// Attendance Management Pages - Admin
import TimetablePeriods from '../pages/dashboard/admin/attendance/TimetablePeriods';
import TimetableEntries from '../pages/dashboard/admin/attendance/TimetableEntries';
import AttendanceSettings from '../pages/dashboard/admin/attendance/AttendanceSettings';
import AttendanceReports from '../pages/dashboard/admin/attendance/AttendanceReports';

// Attendance Management Pages - Teacher
import MarkAttendance from '../pages/dashboard/teacher/attendance/MarkAttendance';
import AttendanceSessions from '../pages/dashboard/teacher/attendance/AttendanceSessions';
import ClassAttendanceSummary from '../pages/dashboard/teacher/attendance/ClassAttendanceSummary';

// Attendance Management Pages - Student
import MyAttendance from '../pages/dashboard/student/attendance/MyAttendance';
import AttendanceHistory from '../pages/dashboard/student/attendance/AttendanceHistory';

// Student Pages
import StudentAssignments from '../pages/dashboard/student/StudentAssignments';
import StudentExams from '../pages/dashboard/student/StudentExams';
import StudentReportCards from '../pages/dashboard/student/StudentReportCards';
import StudentFeeStatus from '../pages/dashboard/student/StudentFeeStatus';

// Teacher Pages
import TeacherAssignments from '../pages/dashboard/teacher/TeacherAssignments';
import TeacherExams from '../pages/dashboard/teacher/TeacherExams';
import TeacherGrading from '../pages/dashboard/teacher/TeacherGrading';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const userRole = localStorage.getItem('userRole');
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    switch (userRole) {
      case 'ADMIN':
        return <Navigate to="/admin/dashboard" replace />;
      case 'TEACHER':
        return <Navigate to="/teacher/dashboard" replace />;
      case 'STUDENT':
        return <Navigate to="/student/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ADMIN ROUTES */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardLayout userRole="admin" />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        
        {/* Teachers */}
        <Route path="onboarding/teachers" element={<TeacherList />} />
        <Route path="onboarding/teachers/add" element={<TeacherForm mode="add" />} />
        <Route path="onboarding/teachers/:id" element={<TeacherForm mode="view" />} />
        <Route path="onboarding/teachers/:id/edit" element={<TeacherForm mode="edit" />} />
        
        {/* Students */}
        <Route path="onboarding/students" element={<StudentList />} />
        <Route path="onboarding/students/add" element={<StudentForm mode="add" />} />
        <Route path="onboarding/students/:id" element={<StudentForm mode="view" />} />
        <Route path="onboarding/students/:id/edit" element={<StudentForm mode="edit" />} />

        {/* Academic Management */}
        <Route path="academic/academic-years" element={<AcademicYears />} />
        <Route path="academic/departments" element={<Departments />} />
        <Route path="academic/classes" element={<Classes />} />
        <Route path="academic/sections" element={<Sections />} />
        <Route path="academic/class-sections" element={<ClassSections />} />
        <Route path="academic/subjects" element={<Subjects />} />
        <Route path="academic/teaching-assignments" element={<TeachingAssignments />} />
        <Route path="academic/student-enrollments" element={<StudentEnrollments />} />

        {/* Assessment Management */}
        <Route path="assessment/grade-scales" element={<GradeScales />} />
        <Route path="assessment/grade-bands" element={<GradeBands />} />
        <Route path="assessment/component-weights" element={<ComponentWeights />} />
        <Route path="assessment/exams" element={<Exams />} />
        <Route path="assessment/assignments" element={<Assignments />} />
        <Route path="assessment/exam-marks" element={<ExamMarks />} />
        <Route path="assessment/assignment-marks" element={<AssignmentMarks />} />
        <Route path="assessment/report-cards" element={<ReportCards />} />

        {/* Fee Management */}
        <Route path="fees/student-fees" element={<StudentFees />} />
        <Route path="fees/fee-payments" element={<FeePayments />} />

        {/* Attendance Management */}
        <Route path="attendance/timetable-periods" element={<TimetablePeriods />} />
        <Route path="attendance/timetable-entries" element={<TimetableEntries />} />
        <Route path="attendance/settings" element={<AttendanceSettings />} />
        <Route path="attendance/reports" element={<AttendanceReports />} />
      </Route>

      {/* TEACHER ROUTES */}
      <Route
        path="/teacher"
        element={
          <ProtectedRoute allowedRoles={['TEACHER']}>
            <DashboardLayout userRole="teacher" />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="profile" element={<TeacherForm mode="view" />} />
        <Route path="assignments" element={<TeacherAssignments />} />
        <Route path="exams" element={<TeacherExams />} />
        <Route path="grading" element={<TeacherGrading />} />
        
        {/* Attendance */}
        <Route path="attendance/mark" element={<MarkAttendance />} />
        <Route path="attendance/sessions" element={<AttendanceSessions />} />
        <Route path="attendance/summary" element={<ClassAttendanceSummary />} />
      </Route>

      {/* STUDENT ROUTES */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <DashboardLayout userRole="student" />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="profile" element={<StudentForm mode="view" />} />
        <Route path="assignments" element={<StudentAssignments />} />
        <Route path="exams" element={<StudentExams />} />
        <Route path="report-cards" element={<StudentReportCards />} />
        <Route path="fees" element={<StudentFeeStatus />} />
        
        {/* Attendance */}
        <Route path="attendance" element={<MyAttendance />} />
        <Route path="attendance/history" element={<AttendanceHistory />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}