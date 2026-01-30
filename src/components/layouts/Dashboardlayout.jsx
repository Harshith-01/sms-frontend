import { useState } from 'react';
import Sidebar from './dashboard/sidebar/Sidebar';
import Header from './dashboard/header/Header';
import StudentRegistration from './dashboard/forms/StudentRegistration';
import TeacherRegistration from './dashboard/forms/TeacherRegistration';
import Settings from './dashboard/settings/Settings';
import './dashboard/DashboardLayout.css';

export default function DashboardLayout() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [userName, setUserName] = useState(
    localStorage.getItem('userName') || 'User'
  );

  const handleNavigate = (section) => {
    setActiveSection(section);
  };

  const handleLogout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-container">
      <Sidebar onNavigate={handleNavigate} activeSection={activeSection} />
      
      <div className="dashboard-main">
        <Header userName={userName} onLogout={handleLogout} />
        
        <div className="dashboard-content">
          {activeSection === 'dashboard' && (
            <div className="welcome-section">
              <h1>Welcome to Dashboard</h1>
              <p>Select an option from the sidebar to get started.</p>
            </div>
          )}

          {activeSection === 'student-registration' && (
            <StudentRegistration />
          )}

          {activeSection === 'teacher-registration' && (
            <TeacherRegistration />
          )}

          {activeSection === 'settings' && (
            <Settings />
          )}
        </div>
      </div>
    </div>
  );
}
