import { useState, useEffect } from 'react';
import { Input, Badge, Avatar, Dropdown, Spin } from 'antd';
import { SearchOutlined, BellOutlined, UserOutlined, LogoutOutlined, DownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getStudentProfile, getTeacherProfile } from '../../services/profileService';
import { getProfilePhoto } from '../../services/documentService';
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
      let profilePhotoUrl = null;
      
      if (userRole === 'STUDENT') {
        const response = await getStudentProfile();
        const studentData = response.data.basic || response.data;
        
        // Get entity ID and fetch profile photo
        if (studentData?.id) {
          try {
            profilePhotoUrl = await getProfilePhoto('student', studentData.id);
          } catch (error) {
            console.log('No profile photo');
          }
        }
        
        setUserProfile({
          name: studentData?.full_name || 'Student',
          photo: profilePhotoUrl,
          role: 'Student',
          entityId: studentData?.id,
        });
      } else if (userRole === 'TEACHER') {
        const response = await getTeacherProfile();
        
        // Get entity ID and fetch profile photo
        if (response.data?.id) {
          try {
            profilePhotoUrl = await getProfilePhoto('teacher', response.data.id);
          } catch (error) {
            console.log('No profile photo');
          }
        }
        
        setUserProfile({
          name: response.data.full_name || 'Teacher',
          photo: profilePhotoUrl,
          role: 'Teacher',
          entityId: response.data?.id,
        });
      } else if (userRole === 'ADMIN') {
        setUserProfile({
          name: localStorage.getItem('userName') || 'Admin',
          photo: null,
          role: 'Administrator',
        });
      } else if (userRole === 'PARENT') {
        setUserProfile({
          name: localStorage.getItem('userName') || 'Parent',
          photo: null,
          role: 'Parent',
        });
      } else if (userRole === 'NON_TEACHING_STAFF') {
        setUserProfile({
          name: localStorage.getItem('userName') || 'Staff',
          photo: null,
          role: 'Staff',
        });
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setUserProfile({
        name: localStorage.getItem('userName') || 'User',
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
        case 'TEACHER': navigate('/teacher/profile'); break;
        case 'STUDENT': navigate('/student/profile'); break;
        case 'PARENT': navigate('/parent/profile'); break;
        case 'NON_TEACHING_STAFF': navigate('/staff/profile'); break;
        default: console.log('Profile not available');
      }
    }
  };

  const getUserMenuItems = () => {
    const items = [];
    if (['TEACHER', 'STUDENT', 'PARENT', 'NON_TEACHING_STAFF'].includes(userRole)) {
      items.push({ key: 'profile', icon: <UserOutlined />, label: 'Profile' });
      items.push({ type: 'divider' });
    }
    items.push({ key: 'logout', icon: <LogoutOutlined />, label: 'Logout', danger: true });
    return items;
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
          <div className="topbar-notification"><BellOutlined /></div>
        </Badge>
        <Badge count={3} offset={[-2, 2]}>
          <div className="topbar-notification">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
        </Badge>
        {loading ? (
          <div className="topbar-user-loading"><Spin size="small" /></div>
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