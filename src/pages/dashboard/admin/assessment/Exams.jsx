import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Card, Popconfirm, Select, Tag, Row, Col, DatePicker, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined, CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import { getExams, createExam, updateExam, publishExam, cancelExam } from '../../../../services/assessmentService';
import { getAcademicYears, getClassSections } from '../../../../services/academicService';
import dayjs from 'dayjs';
import './Assessment.css';

const { Option } = Select;
const { TextArea } = Input;

export default function Exams() {
  const [data, setData] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [classSections, setClassSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({ academic_year_id: null, class_section_id: null, search: '' });

  useEffect(() => {
    fetchAcademicYears();
    fetchClassSections();
    fetchData();
  }, []);

  const fetchAcademicYears = async () => {
    try {
      const response = await getAcademicYears();
      setAcademicYears(response.data || []);
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getExams(filters);
      setData(response.data.data || []);
    } catch (error) {
      message.error('Failed to fetch exams');
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
      start_date: record.start_date ? dayjs(record.start_date) : null,
      end_date: record.end_date ? dayjs(record.end_date) : null,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        start_date: values.start_date ? dayjs(values.start_date).format('YYYY-MM-DD') : null,
        end_date: values.end_date ? dayjs(values.end_date).format('YYYY-MM-DD') : null,
      };

      if (editingRecord) {
        await updateExam(editingRecord.id, payload);
        message.success('Exam updated successfully');
      } else {
        await createExam(payload);
        message.success('Exam created successfully');
      }
      setModalOpen(false);
      fetchData();
    } catch (error) {
      message.error('Failed to save exam');
    }
  };

  const handlePublish = async (id) => {
    try {
      await publishExam(id);
      message.success('Exam published successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to publish exam');
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelExam(id);
      message.success('Exam cancelled successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to cancel exam');
    }
  };

  const getStatusTag = (status) => {
    const statusMap = {
      draft: { color: 'default', text: 'Draft' },
      published: { color: 'green', text: 'Published' },
      cancelled: { color: 'red', text: 'Cancelled' },
    };
    const s = statusMap[status?.toLowerCase()] || statusMap.draft;
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  const filteredData = data.filter(item => item.exam_name?.toLowerCase().includes(filters.search.toLowerCase()));

  const columns = [
    { title: 'Exam Name', dataIndex: 'exam_name', key: 'exam_name', render: (text) => <strong>{text}</strong> },
    { title: 'Exam Type', dataIndex: 'exam_type', key: 'exam_type' },
    { title: 'Academic Year', dataIndex: 'academic_year_label', key: 'academic_year_label' },
    { title: 'Start Date', dataIndex: 'start_date', key: 'start_date', render: (text) => text ? dayjs(text).format('DD/MM/YYYY') : '—' },
    { title: 'End Date', dataIndex: 'end_date', key: 'end_date', render: (text) => text ? dayjs(text).format('DD/MM/YYYY') : '—' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (text) => getStatusTag(text) },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 180,
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} className="action-btn edit-btn" disabled={record.status === 'cancelled'} />
          {record.status === 'draft' && <Button type="link" icon={<CheckCircleOutlined />} onClick={() => handlePublish(record.id)} className="action-btn publish-btn" title="Publish" />}
          {record.status === 'published' && <Button type="link" icon={<StopOutlined />} onClick={() => handleCancel(record.id)} className="action-btn delete-btn" title="Cancel" />}
        </div>
      ),
    },
  ];

  return (
    <div className="assessment-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Exams</h1>
          <p className="page-description">Manage exams and examinations</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="large">Add Exam</Button>
      </div>

      <div className="page-content">
        <Card className="filter-card">
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <Input placeholder="Search exams" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} prefix={<SearchOutlined />} size="large" allowClear />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select placeholder="Academic Year" value={filters.academic_year_id} onChange={(value) => setFilters({ ...filters, academic_year_id: value })} size="large" style={{ width: '100%' }} allowClear>
                {academicYears.map(y => <Option key={y.id} value={y.id}>{y.year_label}</Option>)}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select placeholder="Class Section" value={filters.class_section_id} onChange={(value) => setFilters({ ...filters, class_section_id: value })} size="large" style={{ width: '100%' }} allowClear>
                {classSections.map(cs => <Option key={cs.id} value={cs.id}>Class {cs.class_number} - {cs.section_name}</Option>)}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Button icon={<ReloadOutlined />} onClick={() => { setFilters({ academic_year_id: null, class_section_id: null, search: '' }); fetchData(); }} size="large">Reset</Button>
            </Col>
          </Row>
        </Card>

        <Card className="table-card">
          <Table columns={columns} dataSource={filteredData} rowKey="id" loading={loading} pagination={{ pageSize: 10, showTotal: (total) => `Total ${total} exams` }} />
        </Card>
      </div>

      <Modal title={editingRecord ? 'Edit Exam' : 'Add Exam'} open={modalOpen} onCancel={() => setModalOpen(false)} onOk={() => form.submit()} width={700}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="exam_name" label="Exam Name" rules={[{ required: true }]}>
            <Input placeholder="e.g., Mid-term Examination" size="large" />
          </Form.Item>
          <Form.Item name="exam_type" label="Exam Type" rules={[{ required: true }]}>
            <Select placeholder="Select exam type" size="large">
              <Option value="Mid-term">Mid-term</Option>
              <Option value="Final">Final</Option>
              <Option value="Unit Test">Unit Test</Option>
              <Option value="Monthly Test">Monthly Test</Option>
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="academic_year_id" label="Academic Year" rules={[{ required: true }]}>
                <Select placeholder="Select year" size="large">
                  {academicYears.map(y => <Option key={y.id} value={y.id}>{y.year_label}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="class_section_id" label="Class Section" rules={[{ required: true }]}>
                <Select placeholder="Select class section" size="large">
                  {classSections.map(cs => <Option key={cs.id} value={cs.id}>Class {cs.class_number} - {cs.section_name}</Option>)}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="start_date" label="Start Date" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="end_date" label="End Date" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" size="large" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="total_marks" label="Total Marks">
                <InputNumber min={0} style={{ width: '100%' }} size="large" placeholder="100" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="passing_marks" label="Passing Marks">
                <InputNumber min={0} style={{ width: '100%' }} size="large" placeholder="40" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="Description">
            <TextArea rows={3} placeholder="Enter description" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}