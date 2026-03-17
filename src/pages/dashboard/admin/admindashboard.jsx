import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, List, Avatar, Tag, Button } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  EyeOutlined,
  BellOutlined,
} from '@ant-design/icons';
import StatCard from '../../../components/common/StatCard';
import QuickActionCard from '../../../components/common/QuickActionCard';
import SectionHeader from '../../../components/common/SectionHeader';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const statsData = [
    {
      title: 'Total Students',
      value: '15,000',
      icon: <UserOutlined />,
      color: '#667eea',
      trend: 'up',
      trendValue: '+12%',
    },
    {
      title: 'Total Teachers',
      value: '200',
      icon: <TeamOutlined />,
      color: '#52c41a',
      trend: 'up',
      trendValue: '+8%',
    },
    {
      title: 'Total Classes',
      value: '45',
      icon: <BookOutlined />,
      color: '#faad14',
      trend: 'down',
      trendValue: '-2%',
    },
    {
      title: 'Pending Requests',
      value: '12',
      icon: <ClockCircleOutlined />,
      color: '#ff4d4f',
      trend: 'up',
      trendValue: '+4',
    },
  ];

  const quickActions = [
    {
      title: 'Add Student',
      icon: <PlusOutlined />,
      color: '#667eea',
      onClick: () => navigate('/admin/onboarding/students/add'),
    },
    {
      title: 'Add Teacher',
      icon: <PlusOutlined />,
      color: '#52c41a',
      onClick: () => navigate('/admin/onboarding/teachers/add'),
    },
    {
      title: 'Create Class',
      icon: <PlusOutlined />,
      color: '#faad14',
      onClick: () => console.log('Create Class - Not implemented yet'),
    },
  ];

  const recentActivities = [
    {
      id: 1,
      user: 'John Doe',
      action: 'registered as a new student',
      time: '2 minutes ago',
      avatar: 'https://i.pravatar.cc/150?img=1',
      type: 'student',
    },
    {
      id: 2,
      user: 'Sarah Smith',
      action: 'submitted fee payment',
      time: '15 minutes ago',
      avatar: 'https://i.pravatar.cc/150?img=5',
      type: 'payment',
    },
    {
      id: 3,
      user: 'Mike Johnson',
      action: 'updated attendance records',
      time: '1 hour ago',
      avatar: 'https://i.pravatar.cc/150?img=8',
      type: 'attendance',
    },
    {
      id: 4,
      user: 'Emily Brown',
      action: 'created a new class schedule',
      time: '2 hours ago',
      avatar: 'https://i.pravatar.cc/150?img=9',
      type: 'schedule',
    },
    {
      id: 5,
      user: 'David Wilson',
      action: 'requested leave approval',
      time: '3 hours ago',
      avatar: 'https://i.pravatar.cc/150?img=3',
      type: 'leave',
    },
  ];

  const announcements = [
    {
      id: 1,
      title: 'Emergency School Closure',
      content: 'School will remain closed tomorrow due to severe weather conditions.',
      time: '4:00 PM',
      date: '15 Aug',
      priority: 'high',
    },
    {
      id: 2,
      title: 'New Extracurricular Clubs',
      content: 'Registration open for debate club, robotics team, and art workshops.',
      time: '4:00 PM',
      date: '15 Aug',
      priority: 'medium',
    },
    {
      id: 3,
      title: 'Parent-Teacher Meeting',
      content: 'Scheduled for next Saturday. All parents are requested to attend.',
      time: '2:30 PM',
      date: '12 Aug',
      priority: 'medium',
    },
  ];

  const getActivityTypeColor = (type) => {
    const colors = {
      student: '#667eea',
      payment: '#52c41a',
      attendance: '#faad14',
      schedule: '#13c2c2',
      leave: '#eb2f96',
    };
    return colors[type] || '#8c8c8c';
  };

  const getPriorityTag = (priority) => {
    const config = {
      high: { color: 'red', text: 'High Priority' },
      medium: { color: 'orange', text: 'Medium' },
      low: { color: 'blue', text: 'Low' },
    };
    return config[priority] || config.low;
  };

  return (
    <div className="admin-dashboard">
      {/* Welcome Section */}
      <div className="dashboard-welcome">
        <h1 className="dashboard-welcome-title">Welcome.</h1>
        <p className="dashboard-welcome-subtitle">
          Navigate the future of education with Schoooli.
        </p>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className="dashboard-stats">
        {statsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <StatCard {...stat} />
          </Col>
        ))}
      </Row>

      {/* Quick Actions */}
      <div className="dashboard-quick-actions">
        <SectionHeader title="Quick Actions" />
        <Row gutter={[16, 16]}>
          {quickActions.map((action, index) => (
            <Col xs={24} sm={12} lg={8} key={index}>
              <QuickActionCard
                {...action}
                onClick={action.onClick}
              />
            </Col>
          ))}
        </Row>
      </div>

      {/* Recent Activity & Announcements */}
      <Row gutter={[16, 16]}>
        {/* Recent Activity */}
        <Col xs={24} lg={14}>
          <SectionHeader
            title="Recent Activity"
            action={
              <Button 
                type="link" 
                style={{ padding: 0, color: '#667eea' }}
                onClick={() => navigate('/admin/onboarding/students')}
              >
                View All
              </Button>
            }
          />
          <Card bordered={false} className="activity-card">
            <List
              itemLayout="horizontal"
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item className="activity-list-item" actions={[<span className="activity-time">{item.time}</span>]}>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        size={44}
                        src={item.avatar}
                        style={{
                          border: `2px solid ${getActivityTypeColor(item.type)}`,
                        }}
                        className="activity-avatar"
                      />
                    }
                    title={<span className="activity-user-name">{item.user}</span>}
                    description={<span className="activity-action">{item.action}</span>}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Announcements */}
        <Col xs={24} lg={10}>
          <SectionHeader
            title="Announcements"
            action={
              <Button type="link" style={{ padding: 0, color: '#667eea' }}>
                View All
              </Button>
            }
          />
          <div className="announcements-section">
            {announcements.map((announcement) => (
              <Card key={announcement.id} bordered={false} className="announcement-card">
                <div className="announcement-content">
                  <div className="announcement-icon">
                    <BellOutlined />
                  </div>
                  <div className="announcement-details">
                    <div className="announcement-header">
                      <h4 className="announcement-title">{announcement.title}</h4>
                      <Button type="text" size="small" icon={<EyeOutlined />} />
                    </div>
                    <p className="announcement-text">{announcement.content}</p>
                    <div className="announcement-footer">
                      <div className="announcement-meta">
                        <ClockCircleOutlined />
                        <span className="announcement-time">{announcement.time}</span>
                        <span className="announcement-separator">•</span>
                        <span className="announcement-date">{announcement.date}</span>
                      </div>
                      <Tag color={getPriorityTag(announcement.priority).color}>
                        {getPriorityTag(announcement.priority).text}
                      </Tag>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Col>
      </Row>
    </div>
  );
}