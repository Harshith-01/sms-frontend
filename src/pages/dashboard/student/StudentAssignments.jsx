import { useState, useEffect } from 'react';
import { Table, Card, Tag, Button, Upload, Modal, Form, Input, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { getStudentAssignmentHistory } from '../../../services/assessmentService';
import dayjs from 'dayjs';
import '../student/Student.css';

const { TextArea } = Input;

export default function StudentAssignments() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [form] = Form.useForm();

  const studentId = localStorage.getItem('userId');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getStudentAssignmentHistory(studentId);
      setData(response.data.data || []);
    } catch (error) {
      message.error('Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (assignment) => {
    setSelectedAssignment(assignment);
    setSubmitModalOpen(true);
  };

  const handleSubmitAssignment = async (values) => {
    try {
      // Call submit assignment API
      message.success('Assignment submitted successfully');
      setSubmitModalOpen(false);
      fetchData();
    } catch (error) {
      message.error('Failed to submit assignment');
    }
  };

  const columns = [
    { title: 'Assignment Title', dataIndex: 'title', key: 'title', render: (text) => <strong>{text}</strong> },
    { title: 'Subject', dataIndex: 'subject_name', key: 'subject_name' },
    { title: 'Due Date', dataIndex: 'due_date', key: 'due_date', render: (text) => dayjs(text).format('DD/MM/YYYY') },
    { title: 'Total Marks', dataIndex: 'total_marks', key: 'total_marks' },
    { title: 'Marks Obtained', dataIndex: 'marks_obtained', key: 'marks_obtained', render: (text) => text || '-' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (text) => <Tag color={text === 'Submitted' ? 'green' : 'orange'}>{text}</Tag> },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        record.status !== 'Submitted' && (
          <Button type="primary" size="small" onClick={() => handleSubmit(record)}>Submit</Button>
        )
      ),
    },
  ];

  return (
    <div className="student-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">My Assignments</h1>
          <p className="page-description">View and submit your assignments</p>
        </div>
      </div>

      <div className="page-content">
        <Card className="table-card">
          <Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
        </Card>
      </div>

      <Modal title="Submit Assignment" open={submitModalOpen} onCancel={() => setSubmitModalOpen(false)} onOk={() => form.submit()} width={600}>
        <Form form={form} layout="vertical" onFinish={handleSubmitAssignment}>
          <Form.Item name="submission_text" label="Submission Text">
            <TextArea rows={4} placeholder="Enter your answer or notes" />
          </Form.Item>
          <Form.Item name="file" label="Upload File">
            <Upload maxCount={1}>
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}