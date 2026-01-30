import './Header.css';

export default function Header({ userName, onLogout }) {
  return (
    <header className="dashboard-header">
      <div className="header-content">
        <div className="header-left">
          <h2>Dashboard</h2>
        </div>

        <div className="header-right">
          <div className="user-info">
            <div className="user-avatar">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <p className="user-name">{userName}</p>
              <p className="user-role">Administrator</p>
            </div>
          </div>

          <button className="logout-btn" onClick={onLogout} title="Sign Out">
            <span className="logout-icon">🚪</span>
            <span className="logout-text">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
