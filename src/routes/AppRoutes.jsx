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

export default function AppRoutes() {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ADMIN */}
      <Route path="/admin" element={<DashboardLayout userRole="admin" />}>
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
      </Route>

      {/* TEACHER */}
      <Route path="/teacher" element={<DashboardLayout userRole="teacher" />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="profile" element={<TeacherForm mode="view" />} />
      </Route>

      {/* STUDENT */}
      <Route path="/student" element={<DashboardLayout userRole="student" />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="profile" element={<StudentForm mode="view" />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}