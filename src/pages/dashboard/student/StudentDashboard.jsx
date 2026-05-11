import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Progress, message } from 'antd';
import { BookOutlined, FileTextOutlined, TrophyOutlined, DollarOutlined, ClockCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import { getStudentAssignmentHistory, getStudentExamHistory } from '../../../services/assessmentService';
import { getStudentFeeTerms } from '../../../services/feeService';
import dayjs from 'dayjs';
import './StudentDashboard.css';

export default function StudentDashboard() {
  const [stats, setStats] = useState({
    totalClasses: 8,
    attendance: 92,
    totalAssignments: 0,
    completedAssignments: 0,
    upcomingExams: 0,
    feeBalance: 0,
  });
  const [recentAssignments, setRecentAssignments] = useState([]);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [loading, setLoading] = useState(true);

  const studentId = localStorage.getItem('userId') || localStorage.getItem('authUserId');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (!studentId) {
        setRecentAssignments([]);
        setUpcomingExams([]);
        setStats(prev => ({ ...prev, totalAssignments: 0, completedAssignments: 0, upcomingExams: 0, feeBalance: 0 }));
        return;
      }

      // Fetch assignments
      try {
        const assignmentsRes = await getStudentAssignmentHistory(studentId, 1, 5);
        const assignmentsData = Array.isArray(assignmentsRes?.data?.data) ? assignmentsRes.data.data : [];
        setRecentAssignments(assignmentsData);
        setStats(prev => ({ 
          ...prev, 
          totalAssignments: assignmentsRes?.data?.total || 0,
          completedAssignments: assignmentsData?.filter(a => a.status === 'Submitted').length || 0
        }));
      } catch (assignmentError) {
        console.error('Failed to fetch assignment history:', assignmentError.response?.status);
        setRecentAssignments([]);
      }

      // Fetch exams
      try {
        const examsRes = await getStudentExamHistory(studentId, 1, 5);
        const examsData = Array.isArray(examsRes?.data?.data) ? examsRes.data.data : [];
        setUpcomingExams(examsData);
        setStats(prev => ({ ...prev, upcomingExams: examsRes?.data?.total || 0 }));
      } catch (examError) {
        console.error('Failed to fetch exam history:', examError.response?.status);
        setUpcomingExams([]);
      }

      // Fetch fees
      try {
        const feesRes = await getStudentFeeTerms({ student_id: studentId });
        const totalBalance = Array.isArray(feesRes?.data?.data) 
          ? feesRes.data.data.reduce((sum, fee) => sum + (fee.balance_amount || 0), 0) 
          : 0;
        setStats(prev => ({ ...prev, feeBalance: totalBalance }));
      } catch (feeError) {
        console.error('Failed to fetch fees:', feeError.response?.status);
        setStats(prev => ({ ...prev, feeBalance: 0 }));
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    {
      title: 'Total Classes',
      value: stats.totalClasses,
      icon: <BookOutlined />,
      color: '#667eea',
    },
    {
      title: 'Attendance',
      value: `${stats.attendance}%`,
      icon: <CalendarOutlined />,
      color: '#52c41a',
    },
    {
      title: 'Assignments',
      value: stats.totalAssignments,
      suffix: ` (${stats.completedAssignments} done)`,
      icon: <ClockCircleOutlined />,
      color: '#faad14',
    },
    {
      title: 'Fee Balance',
      value: stats.feeBalance,
      prefix: '₹',
      icon: <DollarOutlined />,
      color: '#ef4444',
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

  const assignmentColumns = [
    { title: 'Assignment', dataIndex: 'title', key: 'title', render: (text) => <strong>{text}</strong> },
    { title: 'Subject', dataIndex: 'subject_name', key: 'subject_name' },
    { title: 'Due Date', dataIndex: 'due_date', key: 'due_date', render: (text) => text ? dayjs(text).format('DD/MM/YYYY') : '-' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (text) => <Tag color={text === 'Submitted' ? 'green' : 'orange'}>{text || 'Pending'}</Tag> },
    { title: 'Marks', dataIndex: 'marks_obtained', key: 'marks_obtained', render: (text, record) => text ? `${text}/${record.total_marks}` : '-' },
  ];

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
            <Card bordered={false} className="stat-card">
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
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
            {upcomingClasses.map((item) => (
              <div key={item.id} className="class-item">
                <div className="class-icon">
                  <BookOutlined />
                </div>
                <div className="class-details">
                  <div className="class-subject">{item.subject}</div>
                  <div className="class-teacher">{item.teacher}</div>
                  <div className="class-meta">
                    <ClockCircleOutlined /> {item.time} • {item.room}
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </Col>

        {/* Recent Assignments */}
        <Col xs={24} lg={10}>
          <Card title="Upcoming Assignments" bordered={false} className="content-card">
            {recentAssignments.slice(0, 3).map((assignment) => (
              <div key={assignment.id} className="assignment-item">
                <div>
                  <div className="assignment-title">{assignment.title}</div>
                  <div className="assignment-subject">{assignment.subject_name}</div>
                  <div className="assignment-due">
                    <CalendarOutlined /> Due: {dayjs(assignment.due_date).format('DD MMM, YYYY')}
                  </div>
                </div>
                <Tag color={assignment.status === 'Submitted' ? 'green' : 'orange'}>
                  {assignment.status || 'Pending'}
                </Tag>
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      {/* Recent Assignments Table */}
      <Card title="Recent Assignments" style={{ marginTop: 24 }} bordered={false}>
        <Table
          columns={assignmentColumns}
          dataSource={recentAssignments}
          rowKey="id"
          loading={loading}
          pagination={false}
        />
      </Card>
    </div>
  );
}