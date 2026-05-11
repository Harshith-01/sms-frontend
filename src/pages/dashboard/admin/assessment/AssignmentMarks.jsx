import { useState, useEffect } from 'react';
import { Table, Button, message, Card, Select, Row, Col, Upload, Tag } from 'antd';
import { UploadOutlined, CheckCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { bulkUploadAssignmentMarks, verifyAssignmentMarks } from '../../../../services/assessmentService';
import { getAssignments } from '../../../../services/assessmentService';
import dayjs from 'dayjs';
import './Assessment.css';

const { Option } = Select;

const extractRows = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

export default function AssignmentMarks() {
  const [data, setData] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ assignment_id: null });

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await getAssignments({});
      setAssignments(extractRows(response?.data));
    } catch (error) {
      message.error('Failed to fetch assignments');
    }
  };

  const fetchData = async () => {
    if (!filters.assignment_id) {
      message.warning('Please select an assignment first');
      return;
    }
    setLoading(true);
    try {
      // This would fetch marks for selected assignment
      // const response = await getAssignmentSubmissions(filters.assignment_id);
      // setData(response.data.data || []);
      setData([]); // Placeholder
    } catch (error) {
      message.error('Failed to fetch marks');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpload = async (file) => {
    if (!filters.assignment_id) {
      message.error('Please select an assignment first');
      return false;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('assignment_id', filters.assignment_id);

    try {
      await bulkUploadAssignmentMarks(formData);
      message.success('Marks uploaded successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to upload marks');
    }
    return false;
  };

  const handleVerify = async (submissionId) => {
    try {
      await verifyAssignmentMarks(submissionId, 'Marks verified by admin');
      message.success('Marks verified successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to verify marks');
    }
  };

  const columns = [
    { title: 'Student ID', dataIndex: 'student_id', key: 'student_id', render: (text) => <strong>{text}</strong> },
    { title: 'Student Name', dataIndex: 'student_name', key: 'student_name' },
    { title: 'Submission Date', dataIndex: 'submission_date', key: 'submission_date', render: (text) => text ? dayjs(text).format('DD/MM/YYYY HH:mm') : '—' },
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
          <h1 className="page-title">Assignment Marks</h1>
          <p className="page-description">Upload and verify assignment marks</p>
        </div>
        <Upload beforeUpload={handleBulkUpload} showUploadList={false} accept=".csv,.xlsx">
          <Button type="primary" icon={<UploadOutlined />} size="large" disabled={!filters.assignment_id}>
            Bulk Upload Marks
          </Button>
        </Upload>
      </div>

      <div className="page-content">
        <Card className="filter-card">
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
              <Select placeholder="Select Assignment" value={filters.assignment_id} onChange={(value) => setFilters({ ...filters, assignment_id: value })} size="large" style={{ width: '100%' }} allowClear>
                {assignments.map(assignment => <Option key={assignment.id} value={assignment.id}>{assignment.title}</Option>)}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Button icon={<ReloadOutlined />} onClick={fetchData} size="large" disabled={!filters.assignment_id}>Load Marks</Button>
            </Col>
          </Row>
        </Card>

        <Card className="table-card">
          <Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={{ pageSize: 10, showTotal: (total) => `Total ${total} submissions` }} />
        </Card>
      </div>
    </div>
  );
}