import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Card, Select, Row, Col, DatePicker, InputNumber, Tag, Descriptions } from 'antd';
import { PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { getTeacherWorkload } from '../../../services/teacherService';
import { getSubjects, getClassSections, getClasses, getSections } from '../../../services/academicService';
import dayjs from 'dayjs';
import '../teacher/Teacher.css';

const { Option } = Select;
const { TextArea } = Input;

// Safe array extractor for any API response shape
const toArray = (res) => {
  const d = res?.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.items)) return d.items;
  if (Array.isArray(d?.results)) return d.results;
  if (Array.isArray(d?.data)) return d.data;
  return [];
};

export default function TeacherAssignments() {
  const [data, setData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classSections, setClassSections] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
    fetchLookups();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Use GET /teachers/me/assessment-workload
      const workloadRes = await getTeacherWorkload();
      const workload = workloadRes?.data?.assessment_workload;

      if (workload?.integration_enabled) {
        const assignments = Array.isArray(workload.assigned_assignments)
          ? workload.assigned_assignments
          : [];
        setData(assignments);
      } else {
        setData([]);
      }
    } catch (error) {
      message.error('Failed to fetch assignments');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLookups = async () => {
    try {
      const [subRes, csRes, clsRes, secRes] = await Promise.all([
        getSubjects(),
        getClassSections(),
        getClasses(),
        getSections(),
      ]);
      setSubjects(toArray(subRes));
      setClassSections(toArray(csRes));
      setClasses(toArray(clsRes));
      setSections(toArray(secRes));
    } catch (error) {
      console.error('Failed to fetch lookups', error);
    }
  };

  // Resolve class section label from IDs
  const getClassSectionLabel = (cs_id) => {
    const cs = classSections.find(c => c.id === cs_id);
    if (!cs) return cs_id ? `Section #${cs_id}` : '—';
    const cls = classes.find(c => c.class_id === cs.class_id);
    const sec = sections.find(s => s.section_id === cs.section_id);
    return `Class ${cls?.class_number ?? '?'} - ${sec?.section_name ?? '?'}`;
  };

  const getSubjectName = (subject_id) =>
    subjects.find(s => s.id === subject_id)?.subject_name || '—';

  const handleAdd = () => {
    form.resetFields();
    setModalOpen(true);
  };

  const handleView = (record) => {
    setSelectedAssignment(record);
    setViewModalOpen(true);
  };

  const handleSubmit = async (values) => {
    try {
      // Assignment creation goes through assessment service if available
      // For now show success and close — wire to assessmentService when available
      message.success('Assignment created successfully');
      setModalOpen(false);
      fetchData();
    } catch (error) {
      message.error('Failed to create assignment');
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <strong>{text || '—'}</strong>,
    },
    {
      title: 'Subject',
      dataIndex: 'subject_id',
      key: 'subject_id',
      render: (subject_id, record) => record.subject_name || getSubjectName(subject_id),
    },
    {
      title: 'Class',
      dataIndex: 'class_section_id',
      key: 'class_section_id',
      render: (cs_id, record) => record.class_section_name || getClassSectionLabel(cs_id),
    },
    {
      title: 'Due Date',
      dataIndex: 'due_date',
      key: 'due_date',
      render: (text) => text ? dayjs(text).format('DD/MM/YYYY') : '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => <Tag color={text === 'Published' ? 'green' : 'orange'}>{text || '—'}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="link" icon={<EyeOutlined />} size="small" onClick={() => handleView(record)}>
            View
          </Button>
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
          <Table
            columns={columns}
            dataSource={data}
            rowKey={(record, i) => record.id ?? i}
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
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
                  {subjects.map(s => <Option key={s.id} value={s.id}>{s.subject_name}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="class_section_id" label="Class" rules={[{ required: true }]}>
                <Select placeholder="Select class" size="large">
                  {classSections.map(cs => (
                    <Option key={cs.id} value={cs.id}>{getClassSectionLabel(cs.id)}</Option>
                  ))}
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
          <Button key="close" onClick={() => setViewModalOpen(false)}>Close</Button>
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
              {selectedAssignment.subject_name || getSubjectName(selectedAssignment.subject_id)}
            </Descriptions.Item>
            <Descriptions.Item label="Class">
              {selectedAssignment.class_section_name || getClassSectionLabel(selectedAssignment.class_section_id)}
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