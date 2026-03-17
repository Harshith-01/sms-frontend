import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Card, Popconfirm, Select, Row, Col } from 'antd';
import { PlusOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { getStudentEnrollments, createStudentEnrollment, deleteStudentEnrollment, getSubjects, getClassSections, getAcademicYears } from '../../../../services/academicService';
import dayjs from 'dayjs';
import './Academic.css';

const { Option } = Select;

export default function StudentEnrollments() {
  const [data, setData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classSections, setClassSections] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({ student_id: '', subject_id: null, class_section_id: null, academic_year_id: null });

  useEffect(() => {
    fetchData();
    fetchSubjects();
    fetchClassSections();
    fetchAcademicYears();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const cleanFilters = {};
      if (filters.student_id) cleanFilters.student_id = filters.student_id;
      if (filters.subject_id) cleanFilters.subject_id = filters.subject_id;
      if (filters.class_section_id) cleanFilters.class_section_id = filters.class_section_id;
      if (filters.academic_year_id) cleanFilters.academic_year_id = filters.academic_year_id;
      
      const response = await getStudentEnrollments(cleanFilters);
      setData(response.data);
    } catch (error) {
      message.error('Failed to fetch student enrollments');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await getSubjects();
      setSubjects(response.data);
    } catch (error) {
      console.error('Failed to fetch subjects');
    }
  };

  const fetchClassSections = async () => {
    try {
      const response = await getClassSections();
      setClassSections(response.data);
    } catch (error) {
      console.error('Failed to fetch class sections');
    }
  };

  const fetchAcademicYears = async () => {
    try {
      const response = await getAcademicYears();
      setAcademicYears(response.data);
    } catch (error) {
      console.error('Failed to fetch academic years');
    }
  };

  const handleAdd = () => {
    form.resetFields();
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteStudentEnrollment(id);
      message.success('Student enrollment deleted successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to delete enrollment');
    }
  };

  const handleSubmit = async (values) => {
    try {
      await createStudentEnrollment(values);
      message.success('Student enrolled successfully');
      setModalOpen(false);
      fetchData();
    } catch (error) {
      message.error('Failed to enroll student');
    }
  };

  const columns = [
    { title: 'Student ID', dataIndex: 'student_id', key: 'student_id', render: (text) => <strong>{text}</strong> },
    { title: 'Student Name', dataIndex: 'student_name', key: 'student_name' },
    { title: 'Subject', dataIndex: 'subject_name', key: 'subject_name' },
    { title: 'Class Section', dataIndex: 'class_section_name', key: 'class_section_name' },
    { title: 'Academic Year', dataIndex: 'academic_year_label', key: 'academic_year_label' },
    { title: 'Enrolled Date', dataIndex: 'created_at', key: 'created_at', render: (text) => text ? dayjs(text).format('DD/MM/YYYY') : '—' },
    {
      title: 'Actions', key: 'actions', width: 100,
      render: (_, record) => (
        <Popconfirm title="Delete this enrollment?" onConfirm={() => handleDelete(record.id)}>
          <Button type="link" icon={<DeleteOutlined />} danger className="action-btn delete-btn" />
        </Popconfirm>
      )
    },
  ];

  return (
    <div className="academic-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Student Enrollments</h1>
          <p className="page-description">Manage student subject enrollments</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="large">Enroll Student</Button>
      </div>

      <div className="page-content">
        <Card className="filter-card">
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <Input placeholder="Student ID" value={filters.student_id} onChange={(e) => setFilters({ ...filters, student_id: e.target.value })} prefix={<SearchOutlined />} size="large" allowClear />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select placeholder="Subject" value={filters.subject_id} onChange={(value) => setFilters({ ...filters, subject_id: value })} size="large" allowClear style={{ width: '100%' }}>
                {subjects.map(s => <Option key={s.id} value={s.id}>{s.name}</Option>)}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select placeholder="Class Section" value={filters.class_section_id} onChange={(value) => setFilters({ ...filters, class_section_id: value })} size="large" allowClear style={{ width: '100%' }}>
                {classSections.map(cs => <Option key={cs.id} value={cs.id}>Class {cs.class_number} - {cs.section_name}</Option>)}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Button icon={<ReloadOutlined />} onClick={() => { setFilters({ student_id: '', subject_id: null, class_section_id: null, academic_year_id: null }); fetchData(); }} size="large">Reset</Button>
            </Col>
          </Row>
        </Card>

        <Card className="table-card">
          <Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={{ pageSize: 10, showTotal: (total) => `Total ${total} enrollments` }} />
        </Card>
      </div>

      <Modal title="Enroll Student" open={modalOpen} onCancel={() => setModalOpen(false)} onOk={() => form.submit()} width={600}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="student_id" label="Student ID" rules={[{ required: true, message: 'Required' }]}>
            <Input placeholder="Enter student ID" size="large" />
          </Form.Item>
          <Form.Item name="subject_id" label="Subject" rules={[{ required: true, message: 'Required' }]}>
            <Select placeholder="Select subject" size="large">
              {subjects.map(s => <Option key={s.id} value={s.id}>{s.name}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="class_section_id" label="Class Section" rules={[{ required: true, message: 'Required' }]}>
            <Select placeholder="Select class section" size="large">
              {classSections.map(cs => <Option key={cs.id} value={cs.id}>Class {cs.class_number} - {cs.section_name}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="academic_year_id" label="Academic Year" rules={[{ required: true, message: 'Required' }]}>
            <Select placeholder="Select academic year" size="large">
              {academicYears.map(y => <Option key={y.id} value={y.id}>{y.year_label}</Option>)}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}