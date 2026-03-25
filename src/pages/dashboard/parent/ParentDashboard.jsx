import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Avatar, List, Tag, Button, Spin } from 'antd';
import { 
  UserOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  FileDoneOutlined,
  CalendarOutlined,
  ArrowRightOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getMyChildren } from '../../../services/parentService';
import './Parent.css';

export default function ParentDashboard() {
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const response = await getMyChildren();
      setChildren(response.data || []);
    } catch (error) {
      console.error('Failed to load children:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRelationshipColor = (type) => {
    const colors = {
      FATHER: 'blue',
      MOTHER: 'pink',
      GUARDIAN: 'green',
      STEP_PARENT: 'purple',
      OTHER: 'orange'
    };
    return colors[type] || 'default';
  };

  return (
    <div className="parent-dashboard-container">
      <h2>Parent Dashboard</h2>
      
      {/* Welcome Section */}
      <Card className="welcome-card" style={{ marginBottom: 24 }}>
        <Row align="middle" justify="space-between">
          <Col>
            <h3>Welcome Back!</h3>
            <p>Here's an overview of your children's academic progress</p>
          </Col>
          <Col>
            <Button 
              type="primary" 
              icon={<UserOutlined />}
              onClick={() => navigate('/parent/profile')}
            >
              My Profile
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Stats Overview */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="My Children"
              value={children.length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Permissions"
              value={children.filter(c => c.can_view_academics).length}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix={`/ ${children.length}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Attendance Access"
              value={children.filter(c => c.can_view_attendance).length}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
              suffix={`/ ${children.length}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Academic Access"
              value={children.filter(c => c.can_view_academics).length}
              prefix={<FileDoneOutlined />}
              valueStyle={{ color: '#722ed1' }}
              suffix={`/ ${children.length}`}
            />
          </Card>
        </Col>
      </Row>

      {/* Children List */}
      <Card 
        title="My Children" 
        extra={
          <Button 
            type="link" 
            icon={<ArrowRightOutlined />}
            onClick={() => navigate('/parent/children')}
          >
            View All
          </Button>
        }
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
          </div>
        ) : children.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
            <UserOutlined style={{ fontSize: 48, marginBottom: 16 }} />
            <p>No children linked to your account</p>
            <p>Please contact school administration</p>
          </div>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={children}
            renderItem={(child) => (
              <List.Item
                actions={[
                  <Button 
                    type="link" 
                    onClick={() => navigate(`/parent/children/${child.student_id}`)}
                  >
                    View Details
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar 
                      size={64} 
                      style={{ backgroundColor: '#1890ff' }}
                    >
                      {getInitials(child.full_name)}
                    </Avatar>
                  }
                  title={
                    <div>
                      {child.full_name}
                      {child.is_primary_contact && (
                        <Tag color="gold" style={{ marginLeft: 8 }}>Primary Contact</Tag>
                      )}
                    </div>
                  }
                  description={
                    <div>
                      <div style={{ marginBottom: 8 }}>
                        <Tag color={getRelationshipColor(child.relationship_type)}>
                          {child.relationship_type}
                        </Tag>
                        <span style={{ color: '#999', marginLeft: 8 }}>
                          ID: {child.student_id}
                        </span>
                      </div>
                      <div>
                        <strong>Access Permissions: </strong>
                        {child.can_view_academics && <Tag color="green">Academics</Tag>}
                        {child.can_view_attendance && <Tag color="blue">Attendance</Tag>}
                        {child.can_view_timetable && <Tag color="orange">Timetable</Tag>}
                        {!child.can_view_academics && !child.can_view_attendance && !child.can_view_timetable && (
                          <Tag color="default">No Access</Tag>
                        )}
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      {/* Quick Actions */}
      <Card title="Quick Actions" style={{ marginTop: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Button 
              block 
              size="large" 
              icon={<UserOutlined />}
              onClick={() => navigate('/parent/children')}
            >
              My Children
            </Button>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button 
              block 
              size="large" 
              icon={<ClockCircleOutlined />}
              onClick={() => navigate('/parent/children')}
              disabled={children.length === 0}
            >
              View Attendance
            </Button>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button 
              block 
              size="large" 
              icon={<TrophyOutlined />}
              onClick={() => navigate('/parent/children')}
              disabled={children.length === 0}
            >
              Report Cards
            </Button>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button 
              block 
              size="large" 
              icon={<CalendarOutlined />}
              onClick={() => navigate('/parent/meetings')}
            >
              Request Meeting
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
}