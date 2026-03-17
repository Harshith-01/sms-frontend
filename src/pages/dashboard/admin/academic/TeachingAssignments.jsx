import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, message, Card, Popconfirm, Select } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { getTeachingAssignments, createTeachingAssignment, deleteTeachingAssignment, getSubjects, getClassSections, getAcademicYears } from '../../../../services/academicService';
import { getTeachers } from '../../../../services/teacherService';
import './Academic.css';

const { Option } = Select;

export default function TeachingAssignments() {
  const [data, setData] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classSections, setClassSections] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
    fetchTeachers();
    fetchSubjects();
    fetchClassSections();
    fetchAcademicYears();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getTeachingAssignments();
      setData(response.data);
    } catch (error) {
      message.error('Failed to fetch teaching assignments');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await getTeachers();
      setTeachers(response.data);
    } catch (error) {
      console.error('Failed to fetch teachers');
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
      await deleteTeachingAssignment(id);
      message.success('Teaching assignment deleted successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to delete teaching assignment');
    }
  };

  const handleSubmit = async (values) => {
    try {
      await createTeachingAssignment(values);
      message.success('Teaching assignment created successfully');
      setModalOpen(false);
      fetchData();
    } catch (error) {
      message.error('Failed to create teaching assignment');
    }
  };

  const columns = [
    { title: 'Teacher', dataIndex: 'teacher_name', key: 'teacher_name', render: (text) => <strong>{text}</strong> },
    { title: 'Subject', dataIndex: 'subject_name', key: 'subject_name' },
    { title: 'Class Section', dataIndex: 'class_section_name', key: 'class_section_name' },
    { title: 'Academic Year', dataIndex: 'academic_year_label', key: 'academic_year_label' },
    {
      title: 'Actions', key: 'actions', width: 100,
      render: (_, record) => (
        <Popconfirm title="Delete this assignment?" onConfirm={() => handleDelete(record.id)}>
          <Button type="link" icon={<DeleteOutlined />} danger className="action-btn delete-btn" />
        </Popconfirm>
      )
    },
  ];

  return (
    <div className="academic-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Teaching Assignments</h1>
          <p className="page-description">Assign teachers to subjects and class sections</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="large">Assign Teacher</Button>
      </div>

      <div className="page-content">
        <Card className="table-card">
          <Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={{ pageSize: 10, showTotal: (total) => `Total ${total} assignments` }} />
        </Card>
      </div>

      <Modal title="Assign Teacher" open={modalOpen} onCancel={() => setModalOpen(false)} onOk={() => form.submit()} width={600}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="teacher_id" label="Teacher" rules={[{ required: true, message: 'Required' }]}>
            <Select placeholder="Select teacher" size="large" showSearch filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}>
              {teachers.map(t => <Option key={t.id} value={t.id}>{t.full_name}</Option>)}
            </Select>
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