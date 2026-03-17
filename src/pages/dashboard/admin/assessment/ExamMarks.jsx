import { useState, useEffect } from 'react';
import { Table, Button, message, Card, Select, Row, Col, Upload, Tag } from 'antd';
import { UploadOutlined, CheckCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { bulkUploadExamMarks, verifyExamMarks } from '../../../../services/assessmentService';
import { getExams } from '../../../../services/assessmentService';
import './Assessment.css';

const { Option } = Select;

export default function ExamMarks() {
  const [data, setData] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ exam_id: null });

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await getExams({});
      setExams(response.data.data || []);
    } catch (error) {
      message.error('Failed to fetch exams');
    }
  };

  const fetchData = async () => {
    if (!filters.exam_id) {
      message.warning('Please select an exam first');
      return;
    }
    setLoading(true);
    try {
      // This would fetch marks for selected exam
      // const response = await getExamMarks(filters.exam_id);
      // setData(response.data.data || []);
      setData([]); // Placeholder
    } catch (error) {
      message.error('Failed to fetch marks');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpload = async (file) => {
    if (!filters.exam_id) {
      message.error('Please select an exam first');
      return false;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('exam_id', filters.exam_id);

    try {
      await bulkUploadExamMarks(formData);
      message.success('Marks uploaded successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to upload marks');
    }
    return false;
  };

  const handleVerify = async (registrationId) => {
    try {
      await verifyExamMarks(registrationId, 'Marks verified by admin');
      message.success('Marks verified successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to verify marks');
    }
  };

  const columns = [
    { title: 'Student ID', dataIndex: 'student_id', key: 'student_id', render: (text) => <strong>{text}</strong> },
    { title: 'Student Name', dataIndex: 'student_name', key: 'student_name' },
    { title: 'Marks Obtained', dataIndex: 'marks_obtained', key: 'marks_obtained', render: (text) => <strong>{text}</strong> },
    {
      title: 'Status',
      dataIndex: 'is_verified',
      key: 'is_verified',
      render: (text) => <Tag color={text ? 'green' : 'orange'}>{text ? 'Verified' : 'Pending'}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        !record.is_verified && (
          <Button type="link" icon={<CheckCircleOutlined />} onClick={() => handleVerify(record.id)} className="action-btn verify-btn">
            Verify
          </Button>
        )
      ),
    },
  ];

  return (
    <div className="assessment-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Exam Marks</h1>
          <p className="page-description">Upload and verify exam marks</p>
        </div>
        <Upload beforeUpload={handleBulkUpload} showUploadList={false} accept=".csv,.xlsx">
          <Button type="primary" icon={<UploadOutlined />} size="large" disabled={!filters.exam_id}>
            Bulk Upload Marks
          </Button>
        </Upload>
      </div>

      <div className="page-content">
        <Card className="filter-card">
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
              <Select placeholder="Select Exam" value={filters.exam_id} onChange={(value) => setFilters({ ...filters, exam_id: value })} size="large" style={{ width: '100%' }} allowClear>
                {exams.map(exam => <Option key={exam.id} value={exam.id}>{exam.exam_name} ({exam.academic_year_label})</Option>)}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Button icon={<ReloadOutlined />} onClick={fetchData} size="large" disabled={!filters.exam_id}>Load Marks</Button>
            </Col>
          </Row>
        </Card>

        <Card className="table-card">
          <Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={{ pageSize: 10, showTotal: (total) => `Total ${total} students` }} />
        </Card>
      </div>
    </div>
  );
}