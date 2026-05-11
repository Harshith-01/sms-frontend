import { useState, useEffect } from 'react';
import { Card, Row, Col, Avatar, Tag, Calendar, Badge, Spin } from 'antd';
import { 
  BookOutlined, 
  TrophyOutlined, 
  DollarOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';

// ✅ FIXED IMPORTS
import { getStudentProfile } from '../../../services/studentService';
import { getStudentAttendanceSummary } from '../../../services/attendanceService';
import { getStudentFeeTerms } from '../../../services/feeService';

import './StudentDashboard.css';

export default function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    totalClass: 0,
    extraClass: 0,
    presentClass: 0,
    homeWork: 0,
    classTest: 0,
    exam: 0,
    lastResult: '-',
    feesDue: 0
  });
  const [classRoutine, setClassRoutine] = useState([]);
  const [notices, setNotices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // ✅ FIXED PROFILE API
      const profileRes = await getStudentProfile();
      const profileData = profileRes.data || {};
      setProfile(profileData);

      const studentId = profileData?.id;

      // ❌ REMOVED invalid APIs (assignments & exams)
      const assignments = [];
      const completedHomework = 0;

      const exams = [];
      const upcomingExams = 0;

      // ✅ FIXED ATTENDANCE API
      let attendance = [];
      if (studentId) {
        const attendanceRes = await getStudentAttendanceSummary(studentId);
        attendance = attendanceRes.data || {};
      }

      const totalDays = attendance?.total_classes || 0;
      const presentDays = attendance?.present_classes || 0;

      // ✅ FIXED FEES API
      const feesRes = await getStudentFeeTerms({});
      const fees = feesRes.data?.results || feesRes.data || [];

      const totalFees = fees.reduce((sum, f) => sum + (f.total_amount || 0), 0);
      const paidFees = fees.reduce((sum, f) => sum + (f.paid_amount || 0), 0);

      const feesDue = totalFees - paidFees;

      setStats({
        totalClass: Math.floor(totalDays / 5) || 5,
        extraClass: 2,
        presentClass: Math.floor(presentDays / 5) || 5,
        homeWork: `${completedHomework}/${assignments.length}`,
        classTest: '2/2',
        exam: upcomingExams,
        lastResult: 'A',
        feesDue: feesDue
      });

      // ✅ UNCHANGED
      setClassRoutine([
        { time: '08:00', subject: 'Bangla', day: 'Sunday' },
        { time: '09:00', subject: 'English', day: 'Sunday' },
        { time: '10:00', subject: 'Math', day: 'Sunday' },
        { time: '11:00', subject: 'Physics', day: 'Sunday' },
        { time: '12:00', subject: 'Chemistry', day: 'Sunday' },
        { time: '08:00', subject: 'English', day: 'Monday' },
        { time: '09:00', subject: 'Math', day: 'Monday' },
        { time: '10:00', subject: 'Physics', day: 'Monday' },
        { time: '11:00', subject: 'Chemistry', day: 'Monday' },
        { time: '12:00', subject: 'Bangla', day: 'Monday' },
      ]);

      setNotices([
        {
          id: 1,
          date: '04/12',
          year: '2023',
          title: 'Final Examinations',
          description: 'December 15th, 2023: 8:15am to December 24th, 2023: 9:00pm'
        },
        {
          id: 2,
          date: '04/12',
          year: '2023',
          title: 'Victory Day-School Closed',
          description: 'December 16th, 2023 - School will remain closed'
        }
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const dateCellRender = (value) => {
    const listData = [];
    if (value.date() === 11) {
      listData.push({ type: 'warning', content: 'Homework' });
    }
    if (value.date() === 13) {
      listData.push({ type: 'error', content: 'Exam' });
    }
    if (value.date() === 15) {
      listData.push({ type: 'success', content: 'Test' });
    }
    return (
      <ul className="events">
        {listData.map((item, index) => (
          <li key={index}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" tip="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="student-dashboard-pro">
      {/* Header */}
      <div className="dashboard-header-student">
        <h1>Dashboard</h1>
        <div className="header-date">
          01-Dec- 2023 <span className="filter-btn">⚙ Filter</span>
        </div>
      </div>

      <Row gutter={24}>
        {/* Left Column - Profile & Class Routine */}
        <Col xs={24} lg={8}>
          {/* Profile Card */}
          <Card className="profile-card">
            <div className="profile-header">
              <Avatar 
                size={120} 
                src={profile?.profile_image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"}
                className="profile-avatar"
              />
              <h2 className="profile-name">{profile?.full_name || 'Bahar Khan'}</h2>
              <div className="profile-details">
                <p>Class: {profile?.class_name || 'XI-B'}</p>
                <p>Roll Number: {profile?.roll_number || '01'}</p>
              </div>
            </div>

            <div className="profile-badges">
              <div className="badge-item">
                <BookOutlined className="badge-icon" />
                <div className="badge-content">
                  <div className="badge-label">Last Result</div>
                  <div className="badge-value">{stats.lastResult}</div>
                </div>
              </div>
              <div className="badge-item">
                <DollarOutlined className="badge-icon" />
                <div className="badge-content">
                  <div className="badge-label">Fees Due</div>
                  <div className="badge-value">৳ {stats.feesDue}</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Class Routine */}
          <Card title="Class Routine" className="class-routine-card" extra={<span className="routine-date">01-Dec- 2023 📅</span>}>
            <div className="routine-days">
              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'].map((day, idx) => (
                <button 
                  key={day} 
                  className={`day-btn ${idx === 0 ? 'active' : ''}`}
                >
                  {day}
                </button>
              ))}
            </div>

            <div className="routine-schedule">
              {classRoutine.filter(r => r.day === 'Sunday').map((item, idx) => (
                <div key={idx} className="schedule-row">
                  <div className="schedule-time">
                    <ClockCircleOutlined /> {item.time}
                  </div>
                  <div className={`schedule-subject subject-${item.subject.toLowerCase()}`}>
                    {item.subject}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Notice Board */}
          <Card title="Notice" className="notice-card" extra={<a href="#">See All</a>}>
            {notices.map(notice => (
              <div key={notice.id} className="notice-item">
                <div className="notice-date">
                  <div className="date-day">{notice.date}</div>
                  <div className="date-year">{notice.year}</div>
                </div>
                <div className="notice-content">
                  <h4>{notice.title}</h4>
                  <p>{notice.description}</p>
                </div>
              </div>
            ))}
          </Card>
        </Col>

        {/* Right Column - Status & Calendar */}
        <Col xs={24} lg={16}>
          {/* Student Status */}
          <Card className="status-card">
            <div className="status-header">
              <h3>Student Status</h3>
              <span className="status-period">Last Week ▾</span>
            </div>
            
            <Row gutter={16} className="status-grid">
              <Col span={8}>
                <div className="status-box">
                  <div className="status-label">Total Class</div>
                  <div className="status-value">{stats.totalClass}/5</div>
                </div>
              </Col>
              <Col span={8}>
                <div className="status-box">
                  <div className="status-label">Extra Class</div>
                  <div className="status-value">{stats.extraClass}</div>
                </div>
              </Col>
              <Col span={8}>
                <div className="status-box">
                  <div className="status-label">Present Class</div>
                  <div className="status-value">{stats.presentClass}/5</div>
                </div>
              </Col>
              <Col span={8}>
                <div className="status-box">
                  <div className="status-label">Home Work</div>
                  <div className="status-value">{stats.homeWork}</div>
                </div>
              </Col>
              <Col span={8}>
                <div className="status-box">
                  <div className="status-label">Class Test</div>
                  <div className="status-value">{stats.classTest}</div>
                </div>
              </Col>
              <Col span={8}>
                <div className="status-box">
                  <div className="status-label">Exam</div>
                  <div className="status-value">{stats.exam}</div>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Calendar */}
          <Card title="Calendar" className="calendar-card" extra={<span>June 2023</span>}>
            <Calendar 
              fullscreen={false} 
              value={selectedDate}
              onChange={setSelectedDate}
              dateCellRender={dateCellRender}
            />
            <div className="calendar-legend">
              <span className="legend-item">
                <Badge status="warning" /> Homework
              </span>
              <span className="legend-item">
                <Badge status="error" /> Exam
              </span>
              <span className="legend-item">
                <Badge status="success" /> Test
              </span>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}