import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, message, Card, Select, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getTimetableEntries, createTimetableEntry } from '../../../../services/attendanceService';
import { getClassSections, getAcademicTerms, getSubjects, getTeachers } from '../../../../services/academicService';
import './Attendance.css';

const { Option } = Select;

const weekdayNames = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function TimetableEntries() {
  const [data, setData] = useState([]);
  const [classSections, setClassSections] = useState([]);
  const [academicTerms, setAcademicTerms] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClassSection, setSelectedClassSection] = useState(null);
  const [selectedAcademicTerm, setSelectedAcademicTerm] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchClassSections();
    fetchAcademicTerms();
    fetchSubjects();
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (selectedClassSection && selectedAcademicTerm) {
      fetchData();
    }
  }, [selectedClassSection, selectedAcademicTerm]);

  const fetchClassSections = async () => {
    try {
      const response = await getClassSections();
      setClassSections(response.data || []);
      if (response.data?.length > 0) {
        setSelectedClassSection(response.data[0].id);
      }
    } catch (error) {
      message.error('Failed to fetch class sections');
    }
  };

  const fetchAcademicTerms = async () => {
    try {
      const response = await getAcademicTerms();
      setAcademicTerms(response.data || []);
      const current = response.data?.find(t => t.is_current);
      if (current) {
        setSelectedAcademicTerm(current.id);
      } else if (response.data?.length > 0) {
        setSelectedAcademicTerm(response.data[0].id);
      }
    } catch (error) {
      message.error('Failed to fetch academic terms');
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await getSubjects();
      setSubjects(response.data || []);
    } catch (error) {
      message.error('Failed to fetch subjects');
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await getTeachers();
      setTeachers(response.data.data || []);
    } catch (error) {
      message.error('Failed to fetch teachers');
    }
  };

  const fetchData = async () => {
    if (!selectedClassSection || !selectedAcademicTerm) return;
    setLoading(true);
    try {
      const response = await getTimetableEntries(selectedClassSection, selectedAcademicTerm);
      setData(response.data.data || []);
    } catch (error) {
      message.error('Failed to fetch timetable entries');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    form.resetFields();
    form.setFieldsValue({
      academic_term_id: selectedAcademicTerm,
      class_section_id: selectedClassSection,
      entry_type: 'REGULAR'
    });
    setModalOpen(true);
  };

  const handleSubmit = async (values) => {
    try {
      await createTimetableEntry(values);
      message.success('Timetable entry created successfully');
      setModalOpen(false);
      fetchData();
    } catch (error) {
      message.error(error.response?.data?.detail || 'Failed to create entry');
    }
  };

  const columns = [
    { 
      title: 'Weekday', 
      dataIndex: 'weekday', 
      key: 'weekday',
      render: (text) => <strong>{weekdayNames[text]}</strong>
    },
    { title: 'Period', dataIndex: 'period_no', key: 'period_no' },
    { title: 'Subject', dataIndex: 'subject_name', key: 'subject_name' },
    { title: 'Teacher', dataIndex: 'teacher_name', key: 'teacher_name' },
    { title: 'Room', dataIndex: 'room_code', key: 'room_code' },
    { 
      title: 'Type', 
      dataIndex: 'entry_type', 
      key: 'entry_type',
      render: (text) => <span className={`status-badge ${text?.toLowerCase()}`}>{text}</span>
    },
  ];

  return (
    <div className="attendance-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Timetable Entries</h1>
          <p className="page-description">Assign subjects and teachers to periods</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="large">
          Assign Entry
        </Button>
      </div>

      <div className="page-content">
        <Card className="table-card">
          <div className="filter-section">
            <Select
              style={{ width: 200 }}
              placeholder="Select Class Section"
              value={selectedClassSection}
              onChange={setSelectedClassSection}
            >
              {classSections.map(cs => (
                <Option key={cs.id} value={cs.id}>
                  Class {cs.class_number}-{cs.section_name}
                </Option>
              ))}
            </Select>

            <Select
              style={{ width: 180 }}
              placeholder="Select Academic Term"
              value={selectedAcademicTerm}
              onChange={setSelectedAcademicTerm}
            >
              {academicTerms.map(t => (
                <Option key={t.id} value={t.id}>
                  {t.term_name}
                </Option>
              ))}
            </Select>
          </div>

          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 20 }}
          />
        </Card>
      </div>

      <Modal
        title="Assign Timetable Entry"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="academic_term_id" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="class_section_id" hidden>
            <Input />
          </Form.Item>

          <Form.Item name="weekday" label="Weekday" rules={[{ required: true }]}>
            <Select>
              {[1, 2, 3, 4, 5, 6, 7].map(day => (
                <Option key={day} value={day}>
                  {weekdayNames[day]}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="period_no" label="Period Number" rules={[{ required: true }]}>
            <Select>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(p => (
                <Option key={p} value={p}>Period {p}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="subject_id" label="Subject" rules={[{ required: true }]}>
            <Select placeholder="Select subject">
              {subjects.map(s => (
                <Option key={s.id} value={s.id}>{s.subject_name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="teacher_id" label="Teacher" rules={[{ required: true }]}>
            <Select placeholder="Select teacher">
              {teachers.map(t => (
                <Option key={t.id} value={t.id}>{t.full_name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="room_code" label="Room Code">
            <Input placeholder="e.g., Room 101, Lab-A" />
          </Form.Item>

          <Form.Item name="entry_type" label="Entry Type" rules={[{ required: true }]}>
            <Select>
              <Option value="REGULAR">Regular</Option>
              <Option value="EXTRA">Extra Class</Option>
              <Option value="SUBSTITUTE">Substitute</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}