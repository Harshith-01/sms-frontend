import { useState, useEffect } from 'react';
import { Table, Card, Tag, Select, DatePicker, Button, message } from 'antd';
import { DownloadOutlined, FileTextOutlined } from '@ant-design/icons';
import { getStudentAttendanceHistory } from '../../../../services/attendanceService';
import dayjs from 'dayjs';
import './Attendance.css';

const { Option } = Select;
const { RangePicker } = DatePicker;

export default function AttendanceHistory() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const studentId = localStorage.getItem('userId') || localStorage.getItem('authUserId');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (!studentId) {
        setData([]);
        return;
      }
      const response = await getStudentAttendanceHistory(studentId);
      const rows = Array.isArray(response?.data?.data) ? response.data.data : [];
      setData(rows);
    } catch (error) {
      message.error('Failed to fetch attendance history');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    fetchData();
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => dayjs(text).format('DD/MM/YYYY'),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: 'Subject',
      dataIndex: 'subject_name',
      key: 'subject_name',
    },
    {
      title: 'Period',
      dataIndex: 'period',
      key: 'period',
      render: (text) => text ? `Period ${text}` : '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Present' ? 'success' : 'error'}>
          {status === 'Present' ? '✓ Present' : '✗ Absent'}
        </Tag>
      ),
    },
    {
      title: 'Absence Type',
      dataIndex: 'absence_type',
      key: 'absence_type',
      render: (type) => {
        if (!type) return '-';
        
        const colors = {
          'MEDICAL': 'blue',
          'JUSTIFIED': 'green',
          'UNEXCUSED': 'red',
          'SPECIAL_LEAVE': 'purple'
        };
        
        return <Tag color={colors[type] || 'default'}>{type.replace('_', ' ')}</Tag>;
      },
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      render: (text) => text || '-',
      ellipsis: true,
    },
    {
      title: 'Document',
      dataIndex: 'document_url',
      key: 'document_url',
      render: (url) => url ? (
        <Button 
          type="link" 
          size="small" 
          icon={<FileTextOutlined />}
          onClick={() => window.open(url, '_blank')}
        >
          View
        </Button>
      ) : '-',
    },
  ];

  return (
    <div className="attendance-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Attendance History</h1>
          <p className="page-description">View your complete attendance record</p>
        </div>
      </div>

      <div className="page-content">
        <Card className="table-card">
          <div className="filter-section">
            <Select
              style={{ width: 180 }}
              placeholder="All Subjects"
              value={selectedSubject}
              onChange={setSelectedSubject}
              allowClear
            >
              <Option value="Mathematics">Mathematics</Option>
              <Option value="Physics">Physics</Option>
              <Option value="Chemistry">Chemistry</Option>
              <Option value="English">English</Option>
            </Select>

            <RangePicker 
              format="DD/MM/YYYY"
              onChange={handleFilter}
            />

            <Button icon={<DownloadOutlined />}>
              Export
            </Button>
          </div>

          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 20 }}
            rowClassName={(record) => 
              record.status === 'Present' 
                ? 'student-row-present' 
                : 'student-row-absent'
            }
          />
        </Card>
      </div>
    </div>
  );
}