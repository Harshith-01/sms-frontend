import { useState, useEffect } from 'react';
import { Table, Card, Tag, message } from 'antd';
import { getExams } from '../../../services/assessmentService';
import dayjs from 'dayjs';
import '../teacher/Teacher.css';

export default function TeacherExams() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getExams({});
      setData(response.data.data || []);
    } catch (error) {
      message.error('Failed to fetch exams');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'Exam Name', dataIndex: 'exam_name', key: 'exam_name', render: (text) => <strong>{text}</strong> },
    { title: 'Exam Type', dataIndex: 'exam_type', key: 'exam_type' },
    { title: 'Start Date', dataIndex: 'start_date', key: 'start_date', render: (text) => text ? dayjs(text).format('DD/MM/YYYY') : '-' },
    { title: 'End Date', dataIndex: 'end_date', key: 'end_date', render: (text) => text ? dayjs(text).format('DD/MM/YYYY') : '-' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (text) => <Tag color={text === 'Published' ? 'green' : 'orange'}>{text}</Tag> },
  ];

  return (
    <div className="teacher-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Exams</h1>
          <p className="page-description">View exam schedule</p>
        </div>
      </div>

      <div className="page-content">
        <Card className="table-card">
          <Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
        </Card>
      </div>
    </div>
  );
}