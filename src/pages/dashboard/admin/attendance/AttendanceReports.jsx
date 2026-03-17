import { useState, useEffect } from 'react';
import { Card, Select, Table, message, Progress } from 'antd';
import { getClassAttendanceAnalytics, getSchoolAttendanceAnalytics } from '../../../../services/attendanceService';
import { getClassSections, getAcademicTerms } from '../../../../services/academicService';
import './Attendance.css';

const { Option } = Select;

export default function AttendanceReports() {
  const [classSections, setClassSections] = useState([]);
  const [academicTerms, setAcademicTerms] = useState([]);
  const [selectedClassSection, setSelectedClassSection] = useState(null);
  const [selectedAcademicTerm, setSelectedAcademicTerm] = useState(null);
  const [classData, setClassData] = useState(null);
  const [schoolData, setSchoolData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClassSections();
    fetchAcademicTerms();
  }, []);

  useEffect(() => {
    if (selectedClassSection && selectedAcademicTerm) {
      fetchClassData();
    }
  }, [selectedClassSection, selectedAcademicTerm]);

  useEffect(() => {
    if (selectedAcademicTerm) {
      fetchSchoolData();
    }
  }, [selectedAcademicTerm]);

  const fetchClassSections = async () => {
    try {
      const response = await getClassSections();
      setClassSections(response.data || []);
      if (response.data?.length > 0) {
        setSelectedClassSection(response.data[0].id);
      }
    } catch (error) {
      message.error('Failed to fetch class sections');
    }
  };

  const fetchAcademicTerms = async () => {
    try {
      const response = await getAcademicTerms();
      setAcademicTerms(response.data || []);
      const current = response.data?.find(t => t.is_current);
      if (current) {
        setSelectedAcademicTerm(current.id);
      } else if (response.data?.length > 0) {
        setSelectedAcademicTerm(response.data[0].id);
      }
    } catch (error) {
      message.error('Failed to fetch academic terms');
    }
  };

  const fetchClassData = async () => {
    setLoading(true);
    try {
      const response = await getClassAttendanceAnalytics(selectedClassSection, selectedAcademicTerm);
      setClassData(response.data);
    } catch (error) {
      message.error('Failed to fetch class analytics');
    } finally {
      setLoading(false);
    }
  };

  const fetchSchoolData = async () => {
    try {
      const response = await getSchoolAttendanceAnalytics(selectedAcademicTerm);
      setSchoolData(response.data);
    } catch (error) {
      message.error('Failed to fetch school analytics');
    }
  };

  const studentColumns = [
    { 
      title: 'Student ID', 
      dataIndex: 'student_id', 
      key: 'student_id',
      width: 120
    },
    { 
      title: 'Student Name', 
      dataIndex: 'student_name', 
      key: 'student_name'
    },
    { 
      title: 'Total Sessions', 
      dataIndex: 'total_sessions', 
      key: 'total_sessions',
      width: 130,
      align: 'center'
    },
    { 
      title: 'Present', 
      dataIndex: 'present', 
      key: 'present',
      width: 100,
      align: 'center',
      render: (text) => <span style={{ color: '#52c41a', fontWeight: 600 }}>{text}</span>
    },
    { 
      title: 'Absent', 
      dataIndex: 'absent', 
      key: 'absent',
      width: 100,
      align: 'center',
      render: (text) => <span style={{ color: '#f5222d', fontWeight: 600 }}>{text}</span>
    },
    { 
      title: 'Attendance %', 
      dataIndex: 'attendance_percent', 
      key: 'attendance_percent',
      width: 200,
      render: (percent, record) => (
        <div>
          <Progress 
            percent={percent} 
            size="small"
            status={record.is_low_attendance ? 'exception' : 'success'}
            format={(p) => `${p}%`}
          />
        </div>
      )
    },
  ];

  return (
    <div className="attendance-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Attendance Reports</h1>
          <p className="page-description">View school-wide and class-wise attendance analytics</p>
        </div>
      </div>

      <div className="page-content">
        <div className="filter-section">
          <Select
            style={{ width: 200 }}
            placeholder="Select Class Section"
            value={selectedClassSection}
            onChange={setSelectedClassSection}
          >
            {classSections.map(cs => (
              <Option key={cs.id} value={cs.id}>
                Class {cs.class_number}-{cs.section_name}
              </Option>
            ))}
          </Select>

          <Select
            style={{ width: 180 }}
            placeholder="Select Academic Term"
            value={selectedAcademicTerm}
            onChange={setSelectedAcademicTerm}
          >
            {academicTerms.map(t => (
              <Option key={t.id} value={t.id}>
                {t.term_name}
              </Option>
            ))}
          </Select>
        </div>

        {schoolData && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Total Sessions (School)</div>
              <div className="stat-value">{schoolData.total_sessions_school}</div>
            </div>
            <div className="stat-card warning">
              <div className="stat-label">Total Absences</div>
              <div className="stat-value">{schoolData.total_absence_records}</div>
            </div>
            <div className="stat-card success">
              <div className="stat-label">Classes</div>
              <div className="stat-value">{schoolData.class_breakdown?.length || 0}</div>
            </div>
          </div>
        )}

        {classData && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Total Sessions</div>
                <div className="stat-value">{classData.total_sessions}</div>
              </div>
              <div className="stat-card success">
                <div className="stat-label">Average Attendance</div>
                <div className="stat-value">{classData.avg_attendance_percent}%</div>
              </div>
              <div className="stat-card warning">
                <div className="stat-label">Low Attendance Students</div>
                <div className="stat-value">{classData.low_attendance_count}</div>
                <div className="stat-sublabel">Below {classData.min_attendance_threshold_percent}%</div>
              </div>
            </div>

            <Card className="table-card">
              <h3 style={{ marginBottom: 16 }}>Student Attendance Details</h3>
              <Table
                columns={studentColumns}
                dataSource={classData.students}
                rowKey="student_id"
                loading={loading}
                pagination={{ pageSize: 20 }}
                rowClassName={(record) => record.is_low_attendance ? 'student-row-absent' : ''}
              />
            </Card>
          </>
        )}
      </div>
    </div>
  );
}