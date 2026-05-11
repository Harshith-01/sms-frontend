import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, message, Card, Popconfirm, Select } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { getTeachingAssignments, createTeachingAssignment, deleteTeachingAssignment, getSubjects, getClassSections, getAcademicYears } from '../../../../services/academicService';
import { getTeachers } from '../../../../services/teacherService';
import './Academic.css';

const toArray = (res) => {
  const d = res?.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.items)) return d.items;
  if (Array.isArray(d?.results)) return d.results;
  if (Array.isArray(d?.data)) return d.data;
  return [];
};

const { Option } = Select;

export default function TeachingAssignments() {
  const [data, setData] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classSections, setClassSections] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
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
      setData(toArray(response));
    } catch (error) {
      message.error('Failed to fetch teaching assignments');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await getTeachers();
      setTeachers(toArray(response));
    } catch (error) {
      console.error('Failed to fetch teachers');
    }
  };

  const fetchSubjects = async () => {
    try {
      const { getSubjects } = await import('../../../../services/academicService');
      const response = await getSubjects();
      setSubjects(toArray(response));
    } catch (error) {
      console.error('Failed to fetch subjects');
    }
  };

  const fetchClassSections = async () => {
    try {
      const [csRes, clsRes, secRes] = await Promise.all([
        import('../../../../services/academicService').then(m => m.getClassSections()),
        import('../../../../services/academicService').then(m => m.getClasses()),
        import('../../../../services/academicService').then(m => m.getSections()),
      ]);
      setClassSections(csRes.data || []);
      setClasses(clsRes.data || []);
      setSections(secRes.data || []);
    } catch (error) {
      console.error('Failed to fetch class sections');
    }
  };

  const fetchAcademicYears = async () => {
    try {
      const { getAcademicYears } = await import('../../../../services/academicService');
      const response = await getAcademicYears();
      setAcademicYears(toArray(response));
    } catch (error) {
      console.error('Failed to fetch academic years');
    }
  };

  // TeachingAssignmentOut has only IDs — resolve names locally
  const getTeacherName = (teacher_id) => teachers.find(t => t.teacher_id === teacher_id)?.full_name || teacher_id;
  const getSubjectName = (subject_id) => subjects.find(s => s.id === subject_id)?.subject_name || '—';
  const getYearLabel = (year_id) => academicYears.find(y => y.id === year_id)?.year_label || '—';
  const getClassSectionLabel = (cs_id) => {
    const cs = classSections.find(c => c.id === cs_id);
    if (!cs) return '—';
    const cls = classes.find(c => c.class_id === cs.class_id);
    const sec = sections.find(s => s.section_id === cs.section_id);
    return `Class ${cls?.class_number || '?'} - ${sec?.section_name || '?'}`;
  };

  const handleAdd = () => {
    form.resetFields();
    setModalOpen(true);
  };

  const handleDelete = async (assignment_id) => {
    try {
      await deleteTeachingAssignment(assignment_id);
      message.success('Teaching assignment deleted successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to delete teaching assignment');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const payload = {
        teacher_id: values.teacher_id,
        subject_id: Number(values.subject_id),
        class_section_id: Number(values.class_section_id),
        academic_year_id: Number(values.academic_year_id),
      };
      await createTeachingAssignment(payload);
      message.success('Teaching assignment created successfully');
      setModalOpen(false);
      fetchData();
    } catch (error) {
      const detail = error.response?.data?.detail;
      message.error(typeof detail === 'string' ? detail : 'Failed to create teaching assignment');
    }
  };

  const columns = [
    {
      title: 'Teacher',
      dataIndex: 'teacher_id',
      key: 'teacher_id',
      render: (teacher_id) => <strong>{getTeacherName(teacher_id)}</strong>,
    },
    {
      title: 'Subject',
      dataIndex: 'subject_id',
      key: 'subject_id',
      render: (subject_id) => getSubjectName(subject_id),
    },
    {
      title: 'Class Section',
      dataIndex: 'class_section_id',
      key: 'class_section_id',
      render: (cs_id) => getClassSectionLabel(cs_id),
    },
    {
      title: 'Academic Year',
      dataIndex: 'academic_year_id',
      key: 'academic_year_id',
      render: (year_id) => getYearLabel(year_id),
    },
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
            <Select placeholder="Select teacher" size="large" showSearch
              filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}>
              {teachers.map(t => <Option key={t.teacher_id} value={t.teacher_id}>{t.full_name}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="subject_id" label="Subject" rules={[{ required: true, message: 'Required' }]}>
            <Select placeholder="Select subject" size="large">
              {subjects.map(s => <Option key={s.id} value={s.id}>{s.subject_name}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="class_section_id" label="Class Section" rules={[{ required: true, message: 'Required' }]}>
            <Select placeholder="Select class section" size="large">
              {classSections.map(cs => (
                <Option key={cs.id} value={cs.id}>{getClassSectionLabel(cs.id)}</Option>
              ))}
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