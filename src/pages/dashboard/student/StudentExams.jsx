import { useState, useEffect } from 'react';
import { Table, Card, Tag, message } from 'antd';
import { getStudentExamHistory } from '../../../services/assessmentService';
import dayjs from 'dayjs';
import '../student/Student.css';

export default function StudentExams() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const studentId = localStorage.getItem('userId');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getStudentExamHistory(studentId);
      setData(response.data.data || []);
    } catch (error) {
      message.error('Failed to fetch exams');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'Exam Name', dataIndex: 'exam_name', key: 'exam_name', render: (text) => <strong>{text}</strong> },
    { title: 'Subject', dataIndex: 'subject_name', key: 'subject_name' },
    { title: 'Exam Date', dataIndex: 'exam_date', key: 'exam_date', render: (text) => dayjs(text).format('DD/MM/YYYY') },
    { title: 'Total Marks', dataIndex: 'total_marks', key: 'total_marks' },
    { title: 'Marks Obtained', dataIndex: 'marks_obtained', key: 'marks_obtained', render: (text) => text || '-' },
    { title: 'Grade', dataIndex: 'grade', key: 'grade', render: (text) => text ? <Tag color="blue">{text}</Tag> : '-' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (text) => <Tag color={text === 'Completed' ? 'green' : 'orange'}>{text}</Tag> },
  ];

  return (
    <div className="student-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">My Exams</h1>
          <p className="page-description">View your exam schedule and results</p>
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