import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Card, Select, Tag, Row, Col, DatePicker, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, SearchOutlined, ReloadOutlined, CheckCircleOutlined, StopOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { getAssignments, createAssignment, updateAssignment, publishAssignment, closeAssignment, cancelAssignment } from '../../../../services/assessmentService';
import { getAcademicYears, getClassSections, getSubjects } from '../../../../services/academicService';
import { getTeachers } from '../../../../services/teacherService';
import dayjs from 'dayjs';
import './Assessment.css';

const { Option } = Select;
const { TextArea } = Input;

const extractRows = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

export default function Assignments() {
  const [data, setData] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [classSections, setClassSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({ academic_year_id: null, class_section_id: null, subject_id: null, search: '' });

  useEffect(() => {
    fetchAcademicYears();
    fetchClassSections();
    fetchSubjects();
    fetchTeachers();
    fetchData();
  }, []);

  const classSectionLabel = (cs) => {
    const room = cs?.room_number ? ` (${cs.room_number})` : '';
    return `Class ${cs?.class_id ?? '-'} - Section ${cs?.section_id ?? '-'}${room}`;
  };

  const fetchAcademicYears = async () => {
    try {
      const response = await getAcademicYears();
      setAcademicYears(extractRows(response?.data));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchClassSections = async () => {
    try {
      const response = await getClassSections();
      setClassSections(extractRows(response?.data));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await getSubjects();
      setSubjects(extractRows(response?.data));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await getTeachers();
      setTeachers(extractRows(response?.data));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAssignments(filters);
      setData(extractRows(response?.data));
    } catch (error) {
      message.error('Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      due_date: record.due_date ? dayjs(record.due_date) : null,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingRecord) {
        const updatePayload = {
          title: values.title,
          description: values.description || null,
          due_date: values.due_date ? dayjs(values.due_date).format('YYYY-MM-DD') : null,
          pass_marks: values.pass_marks,
        };
        await updateAssignment(editingRecord.id, updatePayload);
        message.success('Assignment updated successfully');
      } else {
        const createPayload = {
          title: values.title,
          description: values.description || null,
          academic_year_id: values.academic_year_id,
          class_section_id: values.class_section_id,
          subject_id: values.subject_id,
          assigned_by_teacher_id: values.assigned_by_teacher_id,
          assigned_date: values.assigned_date ? dayjs(values.assigned_date).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
          due_date: values.due_date ? dayjs(values.due_date).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
          max_marks: values.max_marks,
          pass_marks: values.pass_marks,
        };
        await createAssignment(createPayload);
        message.success('Assignment created successfully');
      }
      setModalOpen(false);
      fetchData();
    } catch (error) {
      message.error('Failed to save assignment');
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

  const handleClose = async (id) => {
    try {
      await closeAssignment(id);
      message.success('Assignment closed successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to close assignment');
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelAssignment(id);
      message.success('Assignment cancelled successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to cancel assignment');
    }
  };

  const getStatusTag = (status) => {
    const statusMap = {
      draft: { color: 'default', text: 'Draft' },
      published: { color: 'green', text: 'Published' },
      closed: { color: 'orange', text: 'Closed' },
      cancelled: { color: 'red', text: 'Cancelled' },
    };
    const s = statusMap[status?.toLowerCase()] || statusMap.draft;
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  const filteredData = data.filter(item => item.title?.toLowerCase().includes(filters.search.toLowerCase()));

  const columns = [
    { title: 'Assignment Title', dataIndex: 'title', key: 'title', render: (text) => <strong>{text}</strong> },
    { title: 'Subject', dataIndex: 'subject_name', key: 'subject_name' },
    { title: 'Class Section', dataIndex: 'class_section_name', key: 'class_section_name' },
    { title: 'Total Marks', dataIndex: 'total_marks', key: 'total_marks' },
    { title: 'Due Date', dataIndex: 'due_date', key: 'due_date', render: (text) => text ? dayjs(text).format('DD/MM/YYYY') : '—' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (text) => getStatusTag(text) },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} className="action-btn edit-btn" disabled={record.status === 'cancelled'} />
          {String(record.status || '').toUpperCase() === 'DRAFT' && <Button type="link" icon={<CheckCircleOutlined />} onClick={() => handlePublish(record.id)} className="action-btn publish-btn" title="Publish" />}
          {String(record.status || '').toUpperCase() === 'PUBLISHED' && <Button type="link" icon={<CloseCircleOutlined />} onClick={() => handleClose(record.id)} className="action-btn" style={{ color: '#f59e0b' }} title="Close" />}
          {(String(record.status || '').toUpperCase() === 'DRAFT' || String(record.status || '').toUpperCase() === 'PUBLISHED') && <Button type="link" icon={<StopOutlined />} onClick={() => handleCancel(record.id)} className="action-btn delete-btn" title="Cancel" />}
        </div>
      ),
    },
  ];

  return (
    <div className="assessment-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Assignments</h1>
          <p className="page-description">Manage student assignments and homework</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="large">Add Assignment</Button>
      </div>

      <div className="page-content">
        <Card className="filter-card">
          <Row gutter={16}>
            <Col xs={24} sm={12} md={5}>
              <Input placeholder="Search assignments" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} prefix={<SearchOutlined />} size="large" allowClear />
            </Col>
            <Col xs={24} sm={12} md={5}>
              <Select placeholder="Academic Year" value={filters.academic_year_id} onChange={(value) => setFilters({ ...filters, academic_year_id: value })} size="large" style={{ width: '100%' }} allowClear>
                {academicYears.map(y => <Option key={y.id} value={y.id}>{y.year_label}</Option>)}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={5}>
              <Select placeholder="Class Section" value={filters.class_section_id} onChange={(value) => setFilters({ ...filters, class_section_id: value })} size="large" style={{ width: '100%' }} allowClear>
                {classSections.map(cs => <Option key={cs.id} value={cs.id}>{classSectionLabel(cs)}</Option>)}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={5}>
              <Select placeholder="Subject" value={filters.subject_id} onChange={(value) => setFilters({ ...filters, subject_id: value })} size="large" style={{ width: '100%' }} allowClear>
                {subjects.map(s => <Option key={s.id} value={s.id}>{s.subject_name || s.name}</Option>)}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Button icon={<ReloadOutlined />} onClick={() => { setFilters({ academic_year_id: null, class_section_id: null, subject_id: null, search: '' }); fetchData(); }} size="large">Reset</Button>
            </Col>
          </Row>
        </Card>

        <Card className="table-card">
          <Table columns={columns} dataSource={filteredData} rowKey="id" loading={loading} pagination={{ pageSize: 10, showTotal: (total) => `Total ${total} assignments` }} />
        </Card>
      </div>

      <Modal title={editingRecord ? 'Edit Assignment' : 'Add Assignment'} open={modalOpen} onCancel={() => setModalOpen(false)} onOk={() => form.submit()} width={700}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="title" label="Assignment Title" rules={[{ required: true }]}>
            <Input placeholder="e.g., Math Homework Chapter 5" size="large" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea rows={3} placeholder="Enter assignment description" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="subject_id" label="Subject" rules={[{ required: true }]}>
                <Select placeholder="Select subject" size="large">
                  {subjects.map(s => <Option key={s.id} value={s.id}>{s.subject_name || s.name}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="class_section_id" label="Class Section" rules={[{ required: true }]}>
                <Select placeholder="Select class section" size="large">
                  {classSections.map(cs => <Option key={cs.id} value={cs.id}>{classSectionLabel(cs)}</Option>)}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          {!editingRecord && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="assigned_by_teacher_id" label="Assigned By Teacher" rules={[{ required: true }]}>
                  <Select placeholder="Select teacher" size="large">
                    {teachers.map(t => <Option key={t.id} value={t.id}>{t.full_name || t.teacher_name || t.id}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="assigned_date" label="Assigned Date" rules={[{ required: true }]}>
                  <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" size="large" />
                </Form.Item>
              </Col>
            </Row>
          )}
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="academic_year_id" label="Academic Year" rules={[{ required: true }]}>
                <Select placeholder="Select year" size="large">
                  {academicYears.map(y => <Option key={y.id} value={y.id}>{y.year_label}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="max_marks" label="Max Marks" rules={[{ required: !editingRecord }]}>
                <InputNumber min={0} style={{ width: '100%' }} size="large" placeholder="100" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="pass_marks" label="Pass Marks">
                <InputNumber min={0} style={{ width: '100%' }} size="large" placeholder="40" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="due_date" label="Due Date" rules={[{ required: !editingRecord }]}>
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" size="large" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}