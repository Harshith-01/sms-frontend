import { useState } from 'react';
import './Settings.css';

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    twoFactor: false,
    emailUpdates: true,
  });

  const [saved, setSaved] = useState(false);

  const handleToggle = (key) => {
    setSettings({
      ...settings,
      [key]: !settings[key],
    });
  };

  const handleSave = () => {
    console.log('Settings saved:', settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>⚙️ Settings</h1>
        <p>Manage your account preferences and settings</p>
      </div>

      <div className="settings-content">
        <div className="settings-section">
          <h3>Notification Settings</h3>
          <div className="setting-item">
            <div className="setting-info">
              <label>Enable Notifications</label>
              <p>Receive notifications about important updates</p>
            </div>
            <div className="toggle-switch">
              <input
                type="checkbox"
                id="notifications"
                checked={settings.notifications}
                onChange={() => handleToggle('notifications')}
              />
              <label htmlFor="notifications"></label>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <label>Email Updates</label>
              <p>Receive email updates about new features</p>
            </div>
            <div className="toggle-switch">
              <input
                type="checkbox"
                id="emailUpdates"
                checked={settings.emailUpdates}
                onChange={() => handleToggle('emailUpdates')}
              />
              <label htmlFor="emailUpdates"></label>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3>Security Settings</h3>
          <div className="setting-item">
            <div className="setting-info">
              <label>Two-Factor Authentication</label>
              <p>Add an extra layer of security to your account</p>
            </div>
            <div className="toggle-switch">
              <input
                type="checkbox"
                id="twoFactor"
                checked={settings.twoFactor}
                onChange={() => handleToggle('twoFactor')}
              />
              <label htmlFor="twoFactor"></label>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3>Display Settings</h3>
          <div className="setting-item">
            <div className="setting-info">
              <label>Dark Mode</label>
              <p>Use dark theme for better visibility in low light</p>
            </div>
            <div className="toggle-switch">
              <input
                type="checkbox"
                id="darkMode"
                checked={settings.darkMode}
                onChange={() => handleToggle('darkMode')}
              />
              <label htmlFor="darkMode"></label>
            </div>
          </div>
        </div>

        <div className="settings-actions">
          <button className="btn btn-primary" onClick={handleSave}>
            Save Changes
          </button>
          <button className="btn btn-secondary">Reset to Defaults</button>
        </div>
      </div>

      {saved && (
        <div className="success-message">
          ✓ Settings saved successfully!
        </div>
      )}
    </div>
  );
}
