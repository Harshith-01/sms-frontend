import { Input, Badge, Avatar, Dropdown } from 'antd';
import {
  SearchOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './TopBar.css';

export default function TopBar({ userName = 'Admin', userRole = 'Admin', userAvatar }) {
  const navigate = useNavigate();

  const handleMenuClick = (e) => {
    if (e.key === 'logout') {
      console.log('Logging out...');
      localStorage.clear();
      navigate('/login');
    } else if (e.key === 'profile') {
      navigate('/admin/profile');
    } else if (e.key === 'settings') {
      navigate('/admin/settings');
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
    },
  ];

  return (
    <div className="topbar">
      {/* Logo */}
      <div className="topbar-logo">

        <span className="topbar-logo-text">SchooolMS</span>
      </div>

      {/* Search */}
      <div className="topbar-search">
        <Input
          placeholder="Search anything here"
          prefix={<SearchOutlined />}
          size="large"
        />
      </div>

      {/* Right Actions */}
      <div className="topbar-actions">
        {/* Notifications */}
        <Badge count={5} offset={[-2, 2]}>
          <div className="topbar-notification">
            <BellOutlined />
          </div>
        </Badge>

        {/* Messages */}
        <Badge count={3} offset={[-2, 2]}>
          <div className="topbar-notification">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
        </Badge>

        {/* User Dropdown */}
        <Dropdown
          menu={{
            items: userMenuItems,
            onClick: handleMenuClick,
          }}
          trigger={['click']}
          placement="bottomRight"
        >
          <div className="topbar-user-dropdown">
            <Avatar
              size={40}
              src={userAvatar || 'https://i.pravatar.cc/150?img=12'}
              className="topbar-user-avatar"
            />
            <div className="topbar-user-info">
              <div className="topbar-user-name">{userName}</div>
              <div className="topbar-user-role">{userRole}</div>
            </div>
            <DownOutlined className="topbar-dropdown-icon" />
          </div>
        </Dropdown>
      </div>
    </div>
  );
}