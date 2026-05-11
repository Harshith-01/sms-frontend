import { useState, useEffect } from 'react';
import { Card, Select, DatePicker, Button, Table, Radio, Input, Upload, message } from 'antd';
import { SaveOutlined, CheckCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { createAttendanceSession, bulkUpsertAbsences } from '../../../../services/attendanceService';
import { getClassSections, getAcademicTerms, getSubjects} from '../../../../services/academicService';
import { getStudents } from '../../../../services/studentService';

import dayjs from 'dayjs';
import './Attendance.css';

const { Option } = Select;
const { TextArea } = Input;

export default function MarkAttendance() {
  const [classSections, setClassSections] = useState([]);
  const [academicTerms, setAcademicTerms] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClassSection, setSelectedClassSection] = useState(null);
  const [selectedAcademicTerm, setSelectedAcademicTerm] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedPeriod, setSelectedPeriod] = useState(1);
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClassSections();
    fetchAcademicTerms();
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedClassSection) {
      fetchStudents();
    }
  }, [selectedClassSection]);

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
      }
    } catch (error) {
      message.error('Failed to fetch academic terms');
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await getSubjects();
      setSubjects(response.data || []);
      if (response.data?.length > 0) {
        setSelectedSubject(response.data[0].id);
      }
    } catch (error) {
      message.error('Failed to fetch subjects');
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await getStudents();
      setStudents(response.data.data || []);
      
      const initialData = {};
      (response.data.data || []).forEach(student => {
        initialData[student.admission_number] = {
          status: 'present',
          absence_type: null,
          reason: '',
          document_url: ''
        };
      });
      setAttendanceData(initialData);
    } catch (error) {
      message.error('Failed to fetch students');
    }
  };

  const handleMarkAllPresent = () => {
    const newData = {};
    students.forEach(student => {
      newData[student.admission_number] = {
        status: 'present',
        absence_type: null,
        reason: '',
        document_url: ''
      };
    });
    setAttendanceData(newData);
    message.success('All students marked present');
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
        absence_type: status === 'absent' ? 'UNEXCUSED' : null,
        reason: status === 'absent' ? prev[studentId]?.reason || '' : '',
        document_url: status === 'absent' ? prev[studentId]?.document_url || '' : ''
      }
    }));
  };

  const handleAbsenceTypeChange = (studentId, type) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        absence_type: type
      }
    }));
  };

  const handleReasonChange = (studentId, reason) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        reason
      }
    }));
  };

  const handleSubmit = async () => {
    if (!selectedClassSection || !selectedAcademicTerm || !selectedDate) {
      message.error('Please select class, academic term, and date');
      return;
    }

    setLoading(true);
    try {
      const sessionResponse = await createAttendanceSession({
        class_section_id: selectedClassSection,
        academic_term_id: selectedAcademicTerm,
        subject_id: selectedSubject,
        attendance_date: selectedDate.format('YYYY-MM-DD'),
        period_no: selectedPeriod,
        source: 'MANUAL'
      });

      const sessionId = sessionResponse.data.id;

      const absences = Object.entries(attendanceData)
        .filter(([_, data]) => data.status === 'absent')
        .map(([studentId, data]) => ({
          student_id: studentId,
          absence_type: data.absence_type || 'UNEXCUSED',
          reason: data.reason || null,
          document_url: data.document_url || null
        }));

      if (absences.length > 0) {
        await bulkUpsertAbsences(sessionId, { rows: absences });
      }

      message.success('Attendance submitted successfully');
      fetchStudents();
    } catch (error) {
      message.error(error.response?.data?.detail || 'Failed to submit attendance');
    } finally {
      setLoading(false);
    }
  };

  const presentCount = Object.values(attendanceData).filter(d => d.status === 'present').length;
  const absentCount = Object.values(attendanceData).filter(d => d.status === 'absent').length;

  const columns = [
    {
      title: 'Roll No',
      dataIndex: 'roll_number',
      key: 'roll_number',
      width: 80,
      render: (text) => <strong>{text || '-'}</strong>
    },
    {
      title: 'Student Name',
      dataIndex: 'full_name',
      key: 'full_name',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{record.admission_number}</div>
        </div>
      )
    },
    {
      title: 'Attendance',
      key: 'attendance',
      width: 150,
      render: (_, record) => (
        <Radio.Group
          value={attendanceData[record.admission_number]?.status}
          onChange={(e) => handleStatusChange(record.admission_number, e.target.value)}
        >
          <Radio.Button value="present">Present</Radio.Button>
          <Radio.Button value="absent">Absent</Radio.Button>
        </Radio.Group>
      )
    },
    {
      title: 'Absence Details',
      key: 'details',
      render: (_, record) => {
        const data = attendanceData[record.admission_number];
        if (data?.status !== 'absent') return null;

        return (
          <div className="absence-details">
            <Select
              size="small"
              style={{ width: '100%' }}
              value={data.absence_type}
              onChange={(value) => handleAbsenceTypeChange(record.admission_number, value)}
              placeholder="Select type"
            >
              <Option value="UNEXCUSED">Unexcused</Option>
              <Option value="JUSTIFIED">Justified</Option>
              <Option value="MEDICAL">Medical</Option>
              <Option value="SPECIAL_LEAVE">Special Leave</Option>
            </Select>
            
            <TextArea
              size="small"
              placeholder="Reason (optional)"
              value={data.reason}
              onChange={(e) => handleReasonChange(record.admission_number, e.target.value)}
              rows={2}
            />

            <Upload
              maxCount={1}
              beforeUpload={() => false}
              onChange={(info) => {
                if (info.fileList.length > 0) {
                  message.info('Document upload simulated');
                }
              }}
            >
              <Button size="small" icon={<UploadOutlined />}>
                Upload Document
              </Button>
            </Upload>
          </div>
        );
      }
    }
  ];

  return (
    <div className="attendance-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Mark Attendance</h1>
          <p className="page-description">Mark daily attendance for your classes</p>
        </div>
      </div>

      <div className="page-content">
        <Card className="table-card">
          <div className="attendance-controls">
            <Select
              style={{ width: 200 }}
              placeholder="Select Class"
              value={selectedClassSection}
              onChange={setSelectedClassSection}
              size="large"
            >
              {classSections.map(cs => (
                <Option key={cs.id} value={cs.id}>
                  Class {cs.class_number}-{cs.section_name}
                </Option>
              ))}
            </Select>

            <Select
              style={{ width: 180 }}
              placeholder="Academic Term"
              value={selectedAcademicTerm}
              onChange={setSelectedAcademicTerm}
              size="large"
            >
              {academicTerms.map(t => (
                <Option key={t.id} value={t.id}>
                  {t.term_name}
                </Option>
              ))}
            </Select>

            <Select
              style={{ width: 180 }}
              placeholder="Select Subject"
              value={selectedSubject}
              onChange={setSelectedSubject}
              size="large"
            >
              {subjects.map(s => (
                <Option key={s.id} value={s.id}>
                  {s.subject_name}
                </Option>
              ))}
            </Select>

            <DatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              format="DD/MM/YYYY"
              size="large"
            />

            <Select
              style={{ width: 130 }}
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              size="large"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(p => (
                <Option key={p} value={p}>Period {p}</Option>
              ))}
            </Select>

            <Button 
              type="default" 
              onClick={handleMarkAllPresent}
              size="large"
            >
              Mark All Present
            </Button>
          </div>

          <div className="attendance-summary">
            <div className="attendance-summary-item">
              <span className="attendance-summary-label">Total Students:</span>
              <span className="attendance-summary-value">{students.length}</span>
            </div>
            <div className="attendance-summary-item">
              <span className="attendance-summary-label">Present:</span>
              <span className="attendance-summary-value present">{presentCount}</span>
            </div>
            <div className="attendance-summary-item">
              <span className="attendance-summary-label">Absent:</span>
              <span className="attendance-summary-value absent">{absentCount}</span>
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={students}
            rowKey="admission_number"
            pagination={false}
            rowClassName={(record) => 
              attendanceData[record.admission_number]?.status === 'present' 
                ? 'student-row-present' 
                : attendanceData[record.admission_number]?.status === 'absent'
                ? 'student-row-absent'
                : ''
            }
          />

          <div style={{ marginTop: 24, textAlign: 'right' }}>
            <Button 
              type="primary" 
              size="large" 
              icon={<CheckCircleOutlined />}
              onClick={handleSubmit}
              loading={loading}
            >
              Submit Attendance
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}