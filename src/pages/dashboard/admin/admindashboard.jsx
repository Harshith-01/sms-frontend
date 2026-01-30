import { useState } from 'react';
import Sidebar from './sidebar/Sidebar';
import Header from './header/Header';
import StudentRegistration from './forms/StudentRegistration';
import TeacherRegistration from './forms/TeacherRegistration';
import Settings from './settings/Settings';
import './AdminDashboard.css';

export default function AdminDashboard() {
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
    localStorage.removeItem('userRole');
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
