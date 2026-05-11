import { useState, useEffect } from 'react';
import { Card, Progress, message } from 'antd';
import { getStudentAttendanceHistory } from '../../../../services/attendanceService';
import './Attendance.css';

export default function MyAttendance() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const studentId = localStorage.getItem('userId') || localStorage.getItem('authUserId');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (!studentId) {
        setData(null);
        return;
      }

      const response = await getStudentAttendanceHistory(studentId);
      const rows = Array.isArray(response?.data?.data) ? response.data.data : [];

      const totalSessions = rows.length;
      const absentSessions = rows.filter((r) => {
        const status = String(r.status || '').toUpperCase();
        return status.includes('ABSENT');
      }).length;
      const attendancePercent = totalSessions > 0
        ? ((totalSessions - absentSessions) / totalSessions) * 100
        : 0;

      const subjectMap = new Map();
      rows.forEach((r) => {
        const key = r.subject_name || 'Unknown';
        const current = subjectMap.get(key) || { subject_name: key, total: 0, absent: 0, percentage: 0 };
        current.total += 1;
        const status = String(r.status || '').toUpperCase();
        if (status.includes('ABSENT')) current.absent += 1;
        subjectMap.set(key, current);
      });

      const subjectWise = Array.from(subjectMap.values()).map((s) => ({
        ...s,
        percentage: s.total > 0 ? ((s.total - s.absent) / s.total) * 100 : 0,
      }));

      setData({
        total_sessions: totalSessions,
        absent_sessions: absentSessions,
        attendance_percent: attendancePercent,
        min_required_percent: 75,
        subject_wise: subjectWise,
      });
    } catch (error) {
      message.error('Failed to fetch attendance summary');
    } finally {
      setLoading(false);
    }
  };

  if (!data) {
    return (
      <div className="attendance-page">
        <div className="page-header">
          <div className="header-left">
            <h1 className="page-title">My Attendance</h1>
            <p className="page-description">View your attendance summary</p>
          </div>
        </div>
        <div className="page-content">
          <Card loading={loading}>Loading attendance data...</Card>
        </div>
      </div>
    );
  }

  const attendancePercent = parseFloat(data.attendance_percent) || 0;
  const minRequired = parseFloat(data.min_required_percent) || 75;
  const isAboveMinimum = attendancePercent >= minRequired;

  return (
    <div className="attendance-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">My Attendance</h1>
          <p className="page-description">View your attendance summary and performance</p>
        </div>
      </div>

      <div className="page-content">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Sessions</div>
            <div className="stat-value">{data.total_sessions}</div>
          </div>
          <div className="stat-card success">
            <div className="stat-label">Present</div>
            <div className="stat-value">{data.total_sessions - data.absent_sessions}</div>
          </div>
          <div className="stat-card warning">
            <div className="stat-label">Absent</div>
            <div className="stat-value">{data.absent_sessions}</div>
          </div>
        </div>

        <Card className="table-card">
          <h3 style={{ marginBottom: 16 }}>Overall Attendance</h3>
          
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 16, fontWeight: 500 }}>Your Attendance</span>
              <span style={{ fontSize: 24, fontWeight: 700, color: isAboveMinimum ? '#52c41a' : '#f5222d' }}>
                {attendancePercent.toFixed(1)}%
              </span>
            </div>
            
            <Progress
              percent={attendancePercent}
              status={isAboveMinimum ? 'success' : 'exception'}
              strokeWidth={12}
            />
            
            <div style={{ marginTop: 12, fontSize: 14 }}>
              <span style={{ color: '#666' }}>Minimum Required: </span>
              <span style={{ fontWeight: 600 }}>{minRequired}%</span>
              <span style={{ 
                marginLeft: 16, 
                padding: '4px 12px', 
                borderRadius: 12,
                background: isAboveMinimum ? '#f6ffed' : '#fff2f0',
                color: isAboveMinimum ? '#52c41a' : '#f5222d',
                fontWeight: 500
              }}>
                {isAboveMinimum ? '✓ Above Minimum' : '⚠ Below Minimum'}
              </span>
            </div>
          </div>
        </Card>

        {data.subject_wise && data.subject_wise.length > 0 && (
          <Card className="table-card">
            <h3 style={{ marginBottom: 16 }}>Subject-wise Attendance</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {data.subject_wise.map((subject, index) => (
                <div key={index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontWeight: 500 }}>{subject.subject_name}</span>
                    <span style={{ fontWeight: 600 }}>
                      {subject.percentage.toFixed(1)}% 
                      <span style={{ color: '#999', marginLeft: 8, fontSize: 13 }}>
                        ({subject.total - subject.absent}/{subject.total})
                      </span>
                    </span>
                  </div>
                  <Progress
                    percent={subject.percentage}
                    status={subject.percentage >= minRequired ? 'success' : 'exception'}
                    size="small"
                  />
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card className="table-card">
          <h3 style={{ marginBottom: 16 }}>Monthly Attendance Calendar</h3>
          
          <div className="calendar-header">
            <button style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 16 }}>
              ←
            </button>
            <span className="calendar-month">March 2024</span>
            <button style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 16 }}>
              →
            </button>
          </div>

          <div className="calendar-grid">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="calendar-day-header">{day}</div>
            ))}
            
            {[...Array(31)].map((_, i) => {
              const isPresent = i % 5 !== 0;
              const isHoliday = i % 7 === 6 || i % 7 === 0;
              
              return (
                <div 
                  key={i} 
                  className={`calendar-day ${isHoliday ? 'holiday' : isPresent ? 'present' : 'absent'}`}
                >
                  <div className="calendar-day-number">{i + 1}</div>
                  <div className="calendar-day-status">
                    {isHoliday ? '-' : isPresent ? '✓' : '✗'}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 16, display: 'flex', gap: 24, fontSize: 13 }}>
            <div><span style={{ display: 'inline-block', width: 12, height: 12, background: '#f6ffed', border: '1px solid #52c41a', marginRight: 6 }}></span> Present</div>
            <div><span style={{ display: 'inline-block', width: 12, height: 12, background: '#fff2f0', border: '1px solid #f5222d', marginRight: 6 }}></span> Absent</div>
            <div><span style={{ display: 'inline-block', width: 12, height: 12, background: '#fafafa', border: '1px solid #e0e0e0', marginRight: 6 }}></span> Holiday</div>
          </div>
        </Card>
      </div>
    </div>
  );
}