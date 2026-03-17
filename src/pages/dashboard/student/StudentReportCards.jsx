import { useState, useEffect } from 'react';
import { Table, Card, Tag, Button, message, Modal, Descriptions } from 'antd';
import { DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import { getStudentReportCards, viewReportCard, downloadReportCard } from '../../../services/assessmentService';
import dayjs from 'dayjs';
import '../student/Student.css';

export default function StudentReportCards() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const studentId = localStorage.getItem('userId') || 'STD2024001'; // Default for testing

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getStudentReportCards(studentId);
      console.log('Report Cards Response:', response); // Debug log
      setData(response.data.data || []);
    } catch (error) {
      console.error('Error fetching report cards:', error);
      message.error('Failed to fetch report cards');
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (record) => {
    try {
      message.info('Opening report card in new tab...');
      await viewReportCard(record.id);
    } catch (error) {
      console.error('Error viewing report card:', error);
      message.error('Failed to view report card');
    }
  };

  const handleDownload = async (record) => {
    try {
      message.loading('Downloading report card...', 1);
      await downloadReportCard(record.id);
      setTimeout(() => {
        message.success('Report card downloaded successfully!');
      }, 500);
    } catch (error) {
      console.error('Error downloading report card:', error);
      message.error('Failed to download report card');
    }
  };

  const columns = [
    { title: 'Academic Year', dataIndex: 'academic_year_label', key: 'academic_year_label', render: (text) => <strong>{text}</strong> },
    { title: 'Exam', dataIndex: 'exam_name', key: 'exam_name' },
    { title: 'Overall Grade', dataIndex: 'overall_grade', key: 'overall_grade', render: (text) => <Tag color="blue" style={{ fontSize: 16 }}>{text}</Tag> },
    { title: 'GPA', dataIndex: 'gpa', key: 'gpa', render: (text) => <strong>{text?.toFixed(2)}</strong> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (text) => <Tag color={text === 'published' ? 'green' : 'orange'}>{text === 'published' ? 'Published' : 'Draft'}</Tag> },
    { title: 'Generated Date', dataIndex: 'created_at', key: 'created_at', render: (text) => dayjs(text).format('DD/MM/YYYY') },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        record.status === 'published' && (
          <div style={{ display: 'flex', gap: 8 }}>
            <Button 
              type="link" 
              icon={<EyeOutlined />} 
              size="small"
              onClick={() => handleView(record)}
            >
              View
            </Button>
            <Button 
              type="link" 
              icon={<DownloadOutlined />} 
              size="small"
              onClick={() => handleDownload(record)}
            >
              Download
            </Button>
          </div>
        )
      ),
    },
  ];

  return (
    <div className="student-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">My Report Cards</h1>
          <p className="page-description">View and download your academic report cards</p>
        </div>
      </div>

      <div className="page-content">
        {data.length === 0 && !loading && (
          <Card style={{ marginBottom: 16 }}>
            <p style={{ textAlign: 'center', color: '#999', margin: '20px 0' }}>
              No report cards available yet. They will appear here once published by your school.
            </p>
          </Card>
        )}
        
        <Card className="table-card">
          <Table 
            columns={columns} 
            dataSource={data} 
            rowKey="id" 
            loading={loading} 
            pagination={{ pageSize: 10 }} 
          />
        </Card>
      </div>
    </div>
  );
}