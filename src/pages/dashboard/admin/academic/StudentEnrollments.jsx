import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Card, Popconfirm, Select, Row, Col } from 'antd';
import { PlusOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import {
  getStudentEnrollments, createStudentEnrollment, deleteStudentEnrollment,
  getSubjects, getClassSections, getAcademicYears, getClasses, getSections
} from '../../../../services/academicService';
import dayjs from 'dayjs';
import './Academic.css';

const { Option } = Select;

// Safely extract array from any API response shape:
// [], { items: [] }, { data: [] }, { results: [] }
const toArray = (res) => {
  const d = res?.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.items)) return d.items;
  if (Array.isArray(d?.results)) return d.results;
  if (Array.isArray(d?.data)) return d.data;
  return [];
};

export default function StudentEnrollments() {
  const [data, setData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classSections, setClassSections] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({
    student_id: '',
    subject_id: null,
    class_section_id: null,
    academic_year_id: null,
  });

  useEffect(() => {
    fetchLookups();
    fetchData();
  }, []);

  const fetchLookups = async () => {
    try {
      const [subRes, csRes, yearRes, clsRes, secRes] = await Promise.all([
        getSubjects(),
        getClassSections(),
        getAcademicYears(),
        getClasses(),
        getSections(),
      ]);
      setSubjects(toArray(subRes));
      setClassSections(toArray(csRes));
      setAcademicYears(toArray(yearRes));
      setClasses(toArray(clsRes));
      setSections(toArray(secRes));
    } catch (error) {
      console.error('Failed to fetch lookup data', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const cleanFilters = {};
      if (filters.student_id) cleanFilters.student_id = filters.student_id;
      if (filters.subject_id) cleanFilters.subject_id = filters.subject_id;
      if (filters.class_section_id) cleanFilters.class_section_id = filters.class_section_id;
      if (filters.academic_year_id) cleanFilters.academic_year_id = filters.academic_year_id;

      const response = await getStudentEnrollments(cleanFilters);
      setData(toArray(response));
    } catch (error) {
      message.error('Failed to fetch student enrollments');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Resolve IDs to names locally — all Out DTOs return only IDs
  const getSubjectName = (subject_id) =>
    subjects.find(s => s.id === subject_id)?.subject_name || '—';

  const getYearLabel = (year_id) =>
    academicYears.find(y => y.id === year_id)?.year_label || '—';

  const getClassSectionLabel = (cs_id) => {
    const cs = classSections.find(c => c.id === cs_id);
    if (!cs) return '—';
    const cls = classes.find(c => c.class_id === cs.class_id);
    const sec = sections.find(s => s.section_id === cs.section_id);
    return `Class ${cls?.class_number ?? '?'} - ${sec?.section_name ?? '?'}`;
  };

  const handleAdd = () => {
    form.resetFields();
    setModalOpen(true);
  };

  const handleDelete = async (enrollment_id) => {
    try {
      await deleteStudentEnrollment(enrollment_id);
      message.success('Student enrollment deleted successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to delete enrollment');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const payload = {
        student_id: values.student_id,
        subject_id: Number(values.subject_id),
        academic_year_id: Number(values.academic_year_id),
        class_section_id: Number(values.class_section_id),
      };
      await createStudentEnrollment(payload);
      message.success('Student enrolled successfully');
      setModalOpen(false);
      fetchData();
    } catch (error) {
      const detail = error.response?.data?.detail;
      message.error(typeof detail === 'string' ? detail : 'Failed to enroll student');
    }
  };

  const handleReset = () => {
    setFilters({ student_id: '', subject_id: null, class_section_id: null, academic_year_id: null });
    setTimeout(fetchData, 100);
  };

  const columns = [
    {
      title: 'Student ID',
      dataIndex: 'student_id',
      key: 'student_id',
      render: (text) => <strong>{text}</strong>,
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
      title: 'Enrolled Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => text ? dayjs(text).format('DD/MM/YYYY') : '—',
    },
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
              <Input
                placeholder="Student ID"
                value={filters.student_id}
                onChange={(e) => setFilters({ ...filters, student_id: e.target.value })}
                prefix={<SearchOutlined />}
                size="large"
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="Subject"
                value={filters.subject_id}
                onChange={(value) => setFilters({ ...filters, subject_id: value })}
                size="large"
                allowClear
                style={{ width: '100%' }}
              >
                {subjects.map(s => <Option key={s.id} value={s.id}>{s.subject_name}</Option>)}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="Class Section"
                value={filters.class_section_id}
                onChange={(value) => setFilters({ ...filters, class_section_id: value })}
                size="large"
                allowClear
                style={{ width: '100%' }}
              >
                {classSections.map(cs => (
                  <Option key={cs.id} value={cs.id}>{getClassSectionLabel(cs.id)}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Button icon={<ReloadOutlined />} onClick={handleReset} size="large">Reset</Button>
            </Col>
          </Row>
        </Card>

        <Card className="table-card">
          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10, showTotal: (total) => `Total ${total} enrollments` }}
          />
        </Card>
      </div>

      <Modal title="Enroll Student" open={modalOpen} onCancel={() => setModalOpen(false)} onOk={() => form.submit()} width={600}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="student_id" label="Student ID" rules={[{ required: true, message: 'Required' }]}>
            <Input placeholder="Enter student ID" size="large" />
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