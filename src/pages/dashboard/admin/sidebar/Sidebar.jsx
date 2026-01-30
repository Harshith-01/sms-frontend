import { useState } from 'react';
import './Sidebar.css';

export default function Sidebar({ onNavigate, activeSection }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'student-registration', label: 'Student Registration', icon: '👨‍🎓' },
    { id: 'teacher-registration', label: 'Teacher Registration', icon: '👨‍🏫' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const handleMenuClick = (id) => {
    onNavigate(id);
    setIsExpanded(false); // Close sidebar after selection on mobile
  };

  return (
    <div
      className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon">SMS</span>
        </div>
        <span className={`logo-text ${isExpanded ? 'visible' : 'hidden'}`}>
          Student Management
        </span>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => handleMenuClick(item.id)}
                title={item.label}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className={`nav-label ${isExpanded ? 'visible' : 'hidden'}`}>
                  {item.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <span className={`footer-text ${isExpanded ? 'visible' : 'hidden'}`}>
          © 2026 SMS
        </span>
      </div>
    </div>
  );
}
