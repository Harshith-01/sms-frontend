import { Row, Col, Card, List, Avatar, Button } from 'antd';
import {
  TeamOutlined,
  BookOutlined,
  CalendarOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import StatCard from '../../../components/common/StatCard';
import SectionHeader from '../../../components/common/SectionHeader';
import './TeacherDashboard.css';

export default function TeacherDashboard() {
  const statsData = [
    {
      title: 'Total Students',
      value: '156',
      icon: <TeamOutlined />,
      color: '#667eea',
    },
    {
      title: 'My Classes',
      value: '6',
      icon: <BookOutlined />,
      color: '#52c41a',
    },
    {
      title: 'Pending Assignments',
      value: '23',
      icon: <FileTextOutlined />,
      color: '#faad14',
    },
    {
      title: 'Avg Attendance',
      value: '88%',
      icon: <CalendarOutlined />,
      color: '#13c2c2',
    },
  ];

  const todayClasses = [
    {
      id: 1,
      class: 'Grade 10 - Section A',
      subject: 'Mathematics',
      time: '09:00 AM - 10:00 AM',
      room: 'Room 101',
      students: 35,
    },
    {
      id: 2,
      class: 'Grade 9 - Section B',
      subject: 'Mathematics',
      time: '10:15 AM - 11:15 AM',
      room: 'Room 105',
      students: 32,
    },
    {
      id: 3,
      class: 'Grade 10 - Section C',
      subject: 'Mathematics',
      time: '02:00 PM - 03:00 PM',
      room: 'Room 101',
      students: 38,
    },
  ];

  const recentSubmissions = [
    {
      id: 1,
      student: 'John Doe',
      assignment: 'Chapter 5 Assignment',
      class: 'Grade 10-A',
      submittedAt: '2 hours ago',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: 2,
      student: 'Sarah Smith',
      assignment: 'Algebra Problems',
      class: 'Grade 9-B',
      submittedAt: '3 hours ago',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    {
      id: 3,
      student: 'Mike Johnson',
      assignment: 'Geometry Quiz',
      class: 'Grade 10-C',
      submittedAt: '5 hours ago',
      avatar: 'https://i.pravatar.cc/150?img=8',
    },
  ];

  return (
    <div className="teacher-dashboard">
      {/* Welcome Section */}
      <div className="dashboard-welcome">
        <h1 className="dashboard-welcome-title">Good Morning, Teacher!</h1>
        <p className="dashboard-welcome-subtitle">You have 3 classes scheduled for today.</p>
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
        {/* Today's Classes */}
        <Col xs={24} lg={14}>
          <SectionHeader title="Today's Classes" />
          <Card bordered={false} className="classes-card">
            <List
              itemLayout="horizontal"
              dataSource={todayClasses}
              renderItem={(item) => (
                <List.Item
                  className="class-list-item"
                  actions={[
                    <Button type="primary" size="small">
                      Take Attendance
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <div className="class-icon">
                        <BookOutlined />
                      </div>
                    }
                    title={
                      <div>
                        <span className="class-name">{item.class}</span>
                        <span className="class-subject"> - {item.subject}</span>
                      </div>
                    }
                    description={
                      <div className="class-details">
                        <div>
                          <ClockCircleOutlined /> {item.time}
                        </div>
                        <div>📍 {item.room}</div>
                        <div>👥 {item.students} students</div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Recent Submissions */}
        <Col xs={24} lg={10}>
          <SectionHeader title="Recent Submissions" />
          <Card bordered={false} className="submissions-card">
            <List
              itemLayout="horizontal"
              dataSource={recentSubmissions}
              renderItem={(item) => (
                <List.Item className="submission-item">
                  <List.Item.Meta
                    avatar={<Avatar size={44} src={item.avatar} />}
                    title={<span className="student-name">{item.student}</span>}
                    description={
                      <div>
                        <div className="assignment-name">{item.assignment}</div>
                        <div className="submission-meta">
                          {item.class} • {item.submittedAt}
                        </div>
                      </div>
                    }
                  />
                  <Button type="link" size="small">
                    Review
                  </Button>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}