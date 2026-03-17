import { useState, useEffect } from 'react';
import { Table, Card, Tag, Select, DatePicker, message } from 'antd';
import { getClassSections, getAcademicTerms } from '../../../../services/academicService';
import dayjs from 'dayjs';
import './Attendance.css';

const { Option } = Select;
const { RangePicker } = DatePicker;

export default function AttendanceSessions() {
  const [data, setData] = useState([]);
  const [classSections, setClassSections] = useState([]);
  const [academicTerms, setAcademicTerms] = useState([]);
  const [selectedClassSection, setSelectedClassSection] = useState(null);
  const [selectedAcademicTerm, setSelectedAcademicTerm] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClassSections();
    fetchAcademicTerms();
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [selectedClassSection, selectedAcademicTerm, dateRange]);

  const fetchClassSections = async () => {
    try {
      const response = await getClassSections();
      setClassSections(response.data || []);
    } catch (error) {
      message.error('Failed to fetch class sections');
    }
  };

  const fetchAcademicTerms = async () => {
    try {
      const response = await getAcademicTerms();
      setAcademicTerms(response.data || []);
    } catch (error) {
      message.error('Failed to fetch academic terms');
    }
  };

  const fetchSessions = async () => {
    setLoading(true);
    try {
      // Build query parameters
      const params = {};
      if (selectedClassSection) params.class_section_id = selectedClassSection;
      if (selectedAcademicTerm) params.academic_term_id = selectedAcademicTerm;
      if (dateRange) {
        params.start_date = dateRange[0].format('YYYY-MM-DD');
        params.end_date = dateRange[1].format('YYYY-MM-DD');
      }

      setData([]);
      
    } catch (error) {
      message.error('Failed to fetch attendance sessions');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'attendance_date',
      key: 'attendance_date',
      render: (text) => dayjs(text).format('DD/MM/YYYY'),
      sorter: (a, b) => new Date(a.attendance_date) - new Date(b.attendance_date),
    },
    {
      title: 'Class',
      dataIndex: 'class_section_name',
      key: 'class_section_name',
    },
    {
      title: 'Subject',
      dataIndex: 'subject_name',
      key: 'subject_name',
    },
    {
      title: 'Period',
      dataIndex: 'period_no',
      key: 'period_no',
      render: (text) => `Period ${text}`,
    },
    {
      title: 'Present',
      dataIndex: 'present_count',
      key: 'present_count',
      render: (text) => <span style={{ color: '#52c41a', fontWeight: 600 }}>{text}</span>,
    },
    {
      title: 'Absent',
      dataIndex: 'absent_count',
      key: 'absent_count',
      render: (text) => <span style={{ color: '#f5222d', fontWeight: 600 }}>{text}</span>,
    },
    {
      title: 'Total',
      dataIndex: 'total_students',
      key: 'total_students',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'OPEN' ? 'blue' : 'default'}>
          {status === 'OPEN' ? '🔓 Open' : '🔒 Locked'}
        </Tag>
      ),
    },
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
      render: (text) => <Tag>{text}</Tag>,
    },
  ];

  return (
    <div className="attendance-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">My Attendance Sessions</h1>
          <p className="page-description">View and manage your attendance sessions</p>
        </div>
      </div>

      <div className="page-content">
        <Card className="table-card">
          <div className="filter-section">
            <Select
              style={{ width: 200 }}
              placeholder="All Classes"
              value={selectedClassSection}
              onChange={setSelectedClassSection}
              allowClear
            >
              {classSections.map(cs => (
                <Option key={cs.id} value={cs.id}>
                  Class {cs.class_number}-{cs.section_name}
                </Option>
              ))}
            </Select>

            <Select
              style={{ width: 180 }}
              placeholder="All Academic Terms"
              value={selectedAcademicTerm}
              onChange={setSelectedAcademicTerm}
              allowClear
            >
              {academicTerms.map(t => (
                <Option key={t.id} value={t.id}>
                  {t.term_name}
                </Option>
              ))}
            </Select>

            <RangePicker 
              format="DD/MM/YYYY" 
              onChange={handleDateRangeChange}
              value={dateRange}
            />
          </div>

          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 20 }}
          />
        </Card>
      </div>
    </div>
  );
}