import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Button, message, Empty } from 'antd';
import { BookOutlined, FileTextOutlined, UserOutlined, CheckCircleOutlined, TeamOutlined, CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { getTeacherWorkload } from '../../../services/teacherService';
import dayjs from 'dayjs';
import './TeacherDashboard.css';

export default function TeacherDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    totalAssignments: 0,
    totalExams: 0,
    pendingGrading: 0,
    avgAttendance: 0,
  });
  const [recentAssignments, setRecentAssignments] = useState([]);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Use GET /teachers/me/assessment-workload
      const workloadRes = await getTeacherWorkload();
      const workload = workloadRes?.data?.assessment_workload;

      if (workload?.integration_enabled) {
        const assignments = Array.isArray(workload.assigned_assignments)
          ? workload.assigned_assignments
          : [];
        const examSubjects = Array.isArray(workload.evaluated_exam_subjects)
          ? workload.evaluated_exam_subjects
          : [];

        setRecentAssignments(assignments.slice(0, 5));
        setUpcomingExams(examSubjects.slice(0, 5));
        setStats(prev => ({
          ...prev,
          totalAssignments: assignments.length,
          totalExams: examSubjects.length,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: <TeamOutlined />,
      color: '#667eea',
    },
    {
      title: 'My Classes',
      value: stats.totalClasses,
      icon: <BookOutlined />,
      color: '#52c41a',
    },
    {
      title: 'Pending Grading',
      value: stats.pendingGrading,
      icon: <FileTextOutlined />,
      color: '#faad14',
    },
    {
      title: 'Avg Attendance',
      value: `${stats.avgAttendance}%`,
      icon: <CalendarOutlined />,
      color: '#13c2c2',
    },
  ];

  const todayClasses = [];

  const assignmentColumns = [
    { title: 'Assignment', dataIndex: 'title', key: 'title', render: (text) => <strong>{text || '—'}</strong> },
    { title: 'Class', dataIndex: 'class_section_name', key: 'class_section_name', render: (v) => v || '—' },
    { title: 'Due Date', dataIndex: 'due_date', key: 'due_date', render: (text) => text ? dayjs(text).format('DD/MM/YYYY') : '-' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (text) => <Tag color={text === 'Published' ? 'green' : 'orange'}>{text || '—'}</Tag> },
  ];

  const examColumns = [
    { title: 'Exam', dataIndex: 'exam_name', key: 'exam_name', render: (text) => <strong>{text || '—'}</strong> },
    { title: 'Date', dataIndex: 'start_date', key: 'start_date', render: (text) => text ? dayjs(text).format('DD/MM/YYYY') : '-' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (text) => <Tag>{text || '—'}</Tag> },
  ];

  return (
    <div className="teacher-dashboard">
      {/* Welcome Section */}
      <div className="dashboard-welcome">
        <h1 className="dashboard-welcome-title">Good Morning, Teacher!</h1>
        <p className="dashboard-welcome-subtitle">Here's your teaching overview and recent activity.</p>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className="dashboard-stats">
        {statsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card bordered={false} className="stat-card">
              <Statistic
                title={stat.title}
                value={stat.value}
                valueStyle={{ color: stat.color }}
              />
              <div className="stat-icon" style={{ color: stat.color }}>
                {stat.icon}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Main Content */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        {/* Today's Classes */}
        <Col xs={24} lg={14}>
          <Card title="Today's Classes" bordered={false} className="content-card">
            {todayClasses.length === 0
              ? <Empty description="No classes scheduled. View your full schedule in the Schedule tab." />
              : todayClasses.map((item) => (
                <div key={item.id} className="class-item">
                  <div className="class-icon"><BookOutlined /></div>
                  <div className="class-details">
                    <div className="class-name">{item.class} - {item.subject}</div>
                    <div className="class-meta">
                      <ClockCircleOutlined /> {item.time} • {item.room} • 👥 {item.students} students
                    </div>
                  </div>
                  <Button type="primary" size="small">Take Attendance</Button>
                </div>
              ))}
          </Card>
        </Col>

        {/* Quick Actions */}
        <Col xs={24} lg={10}>
          <Card title="Quick Actions" bordered={false} className="content-card">
            <div className="quick-action-item">
              <FileTextOutlined style={{ fontSize: 24, color: '#667eea' }} />
              <div>
                <div className="action-title">Create Assignment</div>
                <div className="action-subtitle">Add new assignment for students</div>
              </div>
            </div>
            <div className="quick-action-item">
              <CheckCircleOutlined style={{ fontSize: 24, color: '#10b981' }} />
              <div>
                <div className="action-title">Grade Submissions</div>
                <div className="action-subtitle">{stats.pendingGrading} pending submissions</div>
              </div>
            </div>
            <div className="quick-action-item">
              <CalendarOutlined style={{ fontSize: 24, color: '#f59e0b' }} />
              <div>
                <div className="action-title">View Schedule</div>
                <div className="action-subtitle">Check your class schedule</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Assignments */}
      <Card title="Recent Assignments" style={{ marginTop: 24 }} bordered={false}>
        <Table
          columns={assignmentColumns}
          dataSource={recentAssignments}
          rowKey={(record, index) => record.id ?? index}
          loading={loading}
          pagination={false}
        />
      </Card>

      {/* Upcoming Exams */}
      <Card title="Upcoming Exams" style={{ marginTop: 24 }} bordered={false}>
        <Table
          columns={examColumns}
          dataSource={upcomingExams}
          rowKey={(record, index) => record.id ?? index}
          loading={loading}
          pagination={false}
        />
      </Card>
    </div>
  );
}