import { useState, useEffect } from 'react';
import { Input, Badge, Avatar, Dropdown, Spin } from 'antd';
import {
  SearchOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getStudentProfile, getTeacherProfile } from '../../services/profileService';
import './TopBar.css';

export default function TopBar() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      let response;
      
      // Fetch based on role using profileService
      if (userRole === 'STUDENT') {
        response = await getStudentProfile();
        setUserProfile({
          name: response.data.basic?.full_name || 'Student',
          photo: response.data.basic?.photo_url || null,
          role: 'Student',
        });
      } else if (userRole === 'TEACHER') {
        response = await getTeacherProfile();
        setUserProfile({
          name: response.data.full_name || 'Teacher',
          photo: response.data.photo_url || null,
          role: 'Teacher',
        });
      } else if (userRole === 'ADMIN') {
        // Admin uses stored data from registration
        const userEmail = localStorage.getItem('userEmail') || 'admin@school.com';
        const userName = localStorage.getItem('userName') || 'Admin';
        setUserProfile({
          name: userName,
          photo: null,
          role: 'Administrator',
        });
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // Fallback to stored data
      const userEmail = localStorage.getItem('userEmail') || 'User';
      const userName = localStorage.getItem('userName') || userEmail.split('@')[0];
      setUserProfile({
        name: userName,
        photo: null,
        role: userRole || 'User',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (e) => {
    if (e.key === 'logout') {
      localStorage.clear();
      navigate('/login', { replace: true });
    } else if (e.key === 'profile') {
      switch (userRole) {
        case 'TEACHER':
          navigate('/teacher/profile');
          break;
        case 'STUDENT':
          navigate('/student/profile');
          break;
        default:
          console.log('Admin profile not implemented yet');
      }
    }
  };

  const getUserMenuItems = () => {
    const baseMenu = [];
    if (userRole === 'TEACHER' || userRole === 'STUDENT') {
      baseMenu.push({
        key: 'profile',
        icon: <UserOutlined />,
        label: 'Profile',
      });
      baseMenu.push({ type: 'divider' });
    }
    baseMenu.push({
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
    });
    return baseMenu;
  };

  const getAvatarUrl = () => {
    if (userProfile?.photo) return userProfile.photo;
    if (userProfile?.name) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.name)}&background=667eea&color=fff&size=128`;
    }
    return null;
  };

  return (
    <div className="topbar">
      <div className="topbar-logo">
        <span className="topbar-logo-text">SchooolMS</span>
      </div>
      <div className="topbar-search">
        <Input placeholder="Search anything here" prefix={<SearchOutlined />} size="large" />
      </div>
      <div className="topbar-actions">
        <Badge count={5} offset={[-2, 2]}>
          <div className="topbar-notification">
            <BellOutlined />
          </div>
        </Badge>
        <Badge count={3} offset={[-2, 2]}>
          <div className="topbar-notification">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
        </Badge>
        {loading ? (
          <div className="topbar-user-loading">
            <Spin size="small" />
          </div>
        ) : (
          <Dropdown menu={{ items: getUserMenuItems(), onClick: handleMenuClick }} trigger={['click']} placement="bottomRight">
            <div className="topbar-user-dropdown">
              <Avatar size={40} src={getAvatarUrl()} icon={!userProfile?.photo && <UserOutlined />} className="topbar-user-avatar" />
              <div className="topbar-user-info">
                <div className="topbar-user-name">{userProfile?.name || 'User'}</div>
                <div className="topbar-user-role">{userProfile?.role || userRole}</div>
              </div>
              <DownOutlined className="topbar-dropdown-icon" />
            </div>
          </Dropdown>
        )}
      </div>
    </div>
  );
}