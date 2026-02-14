import { Row, Col, Card, List, Avatar, Tag, Progress } from 'antd';
import {
  BookOutlined,
  TrophyOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import StatCard from '../../../components/common/StatCard';
import SectionHeader from '../../../components/common/SectionHeader';
import './StudentDashboard.css';

export default function StudentDashboard() {
  const statsData = [
    {
      title: 'Total Classes',
      value: '8',
      icon: <BookOutlined />,
      color: '#667eea',
    },
    {
      title: 'Attendance',
      value: '92%',
      icon: <CalendarOutlined />,
      color: '#52c41a',
    },
    {
      title: 'Assignments',
      value: '12',
      icon: <ClockCircleOutlined />,
      color: '#faad14',
    },
    {
      title: 'Grade Average',
      value: 'A',
      icon: <TrophyOutlined />,
      color: '#13c2c2',
    },
  ];

  const upcomingClasses = [
    {
      id: 1,
      subject: 'Mathematics',
      teacher: 'Mr. John Smith',
      time: '09:00 AM - 10:00 AM',
      room: 'Room 101',
    },
    {
      id: 2,
      subject: 'Science',
      teacher: 'Ms. Sarah Wilson',
      time: '10:15 AM - 11:15 AM',
      room: 'Room 205',
    },
    {
      id: 3,
      subject: 'English',
      teacher: 'Mrs. Emily Brown',
      time: '11:30 AM - 12:30 PM',
      room: 'Room 102',
    },
  ];

  const assignments = [
    {
      id: 1,
      title: 'Math Assignment Chapter 5',
      subject: 'Mathematics',
      dueDate: 'Feb 5, 2026',
      status: 'pending',
    },
    {
      id: 2,
      title: 'Science Project',
      subject: 'Science',
      dueDate: 'Feb 8, 2026',
      status: 'in-progress',
    },
    {
      id: 3,
      title: 'English Essay',
      subject: 'English',
      dueDate: 'Feb 2, 2026',
      status: 'completed',
    },
  ];

  const getStatusTag = (status) => {
    const config = {
      pending: { color: 'orange', text: 'Pending' },
      'in-progress': { color: 'blue', text: 'In Progress' },
      completed: { color: 'green', text: 'Completed' },
    };
    return config[status] || config.pending;
  };

  return (
    <div className="student-dashboard">
      {/* Welcome Section */}
      <div className="dashboard-welcome">
        <h1 className="dashboard-welcome-title">Welcome Back!</h1>
        <p className="dashboard-welcome-subtitle">Here's what's happening with your classes today.</p>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className="dashboard-stats">
        {statsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <StatCard {...stat} />
          </Col>
        ))}
      </Row>

      {/* Main Content */}
      <Row gutter={[16, 16]}>
        {/* Upcoming Classes */}
        <Col xs={24} lg={14}>
          <SectionHeader title="Today's Classes" />
          <Card bordered={false} className="upcoming-classes-card">
            <List
              itemLayout="horizontal"
              dataSource={upcomingClasses}
              renderItem={(item) => (
                <List.Item className="class-list-item">
                  <List.Item.Meta
                    avatar={
                      <div className="class-icon">
                        <BookOutlined />
                      </div>
                    }
                    title={<span className="class-subject">{item.subject}</span>}
                    description={
                      <div>
                        <div className="class-teacher">{item.teacher}</div>
                        <div className="class-details">
                          <ClockCircleOutlined /> {item.time} • {item.room}
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Assignments */}
        <Col xs={24} lg={10}>
          <SectionHeader title="Recent Assignments" />
          <div className="assignments-section">
            {assignments.map((assignment) => (
              <Card key={assignment.id} bordered={false} className="assignment-card">
                <div className="assignment-content">
                  <div>
                    <h4 className="assignment-title">{assignment.title}</h4>
                    <p className="assignment-subject">{assignment.subject}</p>
                    <div className="assignment-due">
                      <CalendarOutlined /> Due: {assignment.dueDate}
                    </div>
                  </div>
                  <Tag color={getStatusTag(assignment.status).color}>
                    {getStatusTag(assignment.status).text}
                  </Tag>
                </div>
              </Card>
            ))}
          </div>
        </Col>
      </Row>
    </div>
  );
}