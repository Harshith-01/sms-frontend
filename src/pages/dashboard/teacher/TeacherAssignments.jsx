import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Card, Select, Row, Col, DatePicker, InputNumber, Tag, Descriptions } from 'antd';
import { PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { getAssignments, getAssignment, createAssignment, publishAssignment } from '../../../services/assessmentService';
import { getSubjects, getClassSections } from '../../../services/academicService';
import dayjs from 'dayjs';
import '../teacher/Teacher.css';

const { Option } = Select;
const { TextArea } = Input;

export default function TeacherAssignments() {
  const [data, setData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classSections, setClassSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
    fetchSubjects();
    fetchClassSections();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAssignments({});
      setData(response.data.data || []);
    } catch (error) {
      message.error('Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await getSubjects();
      setSubjects(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchClassSections = async () => {
    try {
      const response = await getClassSections();
      setClassSections(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = () => {
    form.resetFields();
    setModalOpen(true);
  };

  const handleView = async (record) => {
    try {
      // If you have a getAssignment function, use it to fetch full details
      // const response = await getAssignment(record.id);
      // setSelectedAssignment(response.data);
      
      // For now, use the record data
      setSelectedAssignment(record);
      setViewModalOpen(true);
    } catch (error) {
      message.error('Failed to load assignment details');
    }
  };

  const handleSubmit = async (values) => {
    try {
      await createAssignment({
        ...values,
        due_date: values.due_date ? dayjs(values.due_date).format('YYYY-MM-DD') : null,
      });
      message.success('Assignment created successfully');
      setModalOpen(false);
      fetchData();
    } catch (error) {
      message.error('Failed to create assignment');
    }
  };

  const handlePublish = async (id) => {
    try {
      await publishAssignment(id);
      message.success('Assignment published successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to publish assignment');
    }
  };

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title', render: (text) => <strong>{text}</strong> },
    { title: 'Subject', dataIndex: 'subject_name', key: 'subject_name' },
    { title: 'Class', dataIndex: 'class_section_name', key: 'class_section_name' },
    { title: 'Due Date', dataIndex: 'due_date', key: 'due_date', render: (text) => text ? dayjs(text).format('DD/MM/YYYY') : '-' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (text) => <Tag color={text === 'Published' ? 'green' : 'orange'}>{text}</Tag> },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button 
            type="link" 
            icon={<EyeOutlined />} 
            size="small"
            onClick={() => handleView(record)}
          >
            View
          </Button>
          {record.status === 'Draft' && (
            <Button 
              type="link" 
              onClick={() => handlePublish(record.id)} 
              size="small"
            >
              Publish
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="teacher-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Assignments</h1>
          <p className="page-description">Create and manage assignments</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="large">Create Assignment</Button>
      </div>

      <div className="page-content">
        <Card className="table-card">
          <Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
        </Card>
      </div>

      {/* Create Assignment Modal */}
      <Modal 
        title="Create Assignment" 
        open={modalOpen} 
        onCancel={() => setModalOpen(false)} 
        onOk={() => form.submit()} 
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input placeholder="Assignment title" size="large" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea rows={3} placeholder="Assignment description" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="subject_id" label="Subject" rules={[{ required: true }]}>
                <Select placeholder="Select subject" size="large">
                  {subjects.map(s => <Option key={s.id} value={s.id}>{s.name}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="class_section_id" label="Class" rules={[{ required: true }]}>
                <Select placeholder="Select class" size="large">
                  {classSections.map(cs => <Option key={cs.id} value={cs.id}>Class {cs.class_number} - {cs.section_name}</Option>)}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="total_marks" label="Total Marks">
                <InputNumber min={0} style={{ width: '100%' }} size="large" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="passing_marks" label="Passing Marks">
                <InputNumber min={0} style={{ width: '100%' }} size="large" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="due_date" label="Due Date">
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" size="large" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* View Assignment Modal */}
      <Modal
        title="Assignment Details"
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalOpen(false)}>
            Close
          </Button>
        ]}
        width={700}
      >
        {selectedAssignment && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Title" span={2}>
              <strong>{selectedAssignment.title}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Description" span={2}>
              {selectedAssignment.description || 'No description provided'}
            </Descriptions.Item>
            <Descriptions.Item label="Subject">
              {selectedAssignment.subject_name}
            </Descriptions.Item>
            <Descriptions.Item label="Class">
              {selectedAssignment.class_section_name}
            </Descriptions.Item>
            <Descriptions.Item label="Due Date">
              {selectedAssignment.due_date ? dayjs(selectedAssignment.due_date).format('DD/MM/YYYY') : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={selectedAssignment.status === 'Published' ? 'green' : 'orange'}>
                {selectedAssignment.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Total Marks">
              {selectedAssignment.total_marks || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Passing Marks">
              {selectedAssignment.passing_marks || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Submission Type" span={2}>
              {selectedAssignment.submission_type || 'File Upload'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}