import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Descriptions, Button, Spin, message } from 'antd';
import { UserOutlined, CalendarOutlined, IdcardOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getMyProfile } from '../../../services/staffService';
import './Staff.css';

export default function StaffDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getMyProfile();
      setProfile(response.data);
    } catch (error) {
      message.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const calculateYearsOfService = (joiningDate) => {
    if (!joiningDate) return 0;
    const start = new Date(joiningDate);
    const today = new Date();
    const years = today.getFullYear() - start.getFullYear();
    return years;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!profile) {
    return <Card>Profile not found</Card>;
  }

  return (
    <div className="staff-dashboard-container">
      <h2>Staff Dashboard</h2>

      <Card className="welcome-card" style={{ marginBottom: 24 }}>
        <Row align="middle" justify="space-between">
          <Col>
            <h3>Welcome, {profile.full_name}!</h3>
            <p>Here's your profile summary</p>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<UserOutlined />}
              onClick={() => navigate('/staff/profile')}
            >
              View Full Profile
            </Button>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Staff ID"
              value={profile.id}
              prefix={<IdcardOutlined />}
              valueStyle={{ color: '#1890ff', fontSize: 20 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Employment Type"
              value={profile.employment_type?.replace('_', ' ')}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#52c41a', fontSize: 16 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Years of Service"
              value={calculateYearsOfService(profile.date_of_joining)}
              suffix="years"
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Status"
              value={profile.status}
              prefix={<UserOutlined />}
              valueStyle={{ color: profile.status === 'ACTIVE' ? '#52c41a' : '#999', fontSize: 18 }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Profile Summary">
        <Descriptions bordered column={{ xs: 1, sm: 1, md: 2 }}>
          <Descriptions.Item label="Full Name">{profile.full_name}</Descriptions.Item>
          <Descriptions.Item label="Email">{profile.email}</Descriptions.Item>
          <Descriptions.Item label="Contact">{profile.contact_number || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Emergency Contact">{profile.emergency_contact || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Date of Joining">
            {profile.date_of_joining ? new Date(profile.date_of_joining).toLocaleDateString() : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Employment Type">
            {profile.employment_type?.replace('_', ' ')}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Quick Actions" style={{ marginTop: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Button
              block
              size="large"
              icon={<UserOutlined />}
              onClick={() => navigate('/staff/profile')}
            >
              My Profile
            </Button>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button
              block
              size="large"
              icon={<CalendarOutlined />}
              onClick={() => navigate('/staff/timetable')}
            >
              School Timetable
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
}