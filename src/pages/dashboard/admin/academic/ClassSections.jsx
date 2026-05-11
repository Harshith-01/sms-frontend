import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Card, Popconfirm, Select, Tag, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { getClassSections, createClassSection, updateClassSection, deleteClassSection, getClasses, getSections, getAcademicYears } from '../../../../services/academicService';
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

export default function ClassSections() {
  const [data, setData] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
    fetchClasses();
    fetchSections();
    fetchAcademicYears();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getClassSections();
      setData(toArray(response));
    } catch (error) {
      message.error('Failed to fetch class sections');
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await getClasses();
      setClasses(toArray(response));
    } catch (error) {
      console.error('Failed to fetch classes');
    }
  };

  const fetchSections = async () => {
    try {
      const response = await getSections();
      setSections(toArray(response));
    } catch (error) {
      console.error('Failed to fetch sections');
    }
  };

  const fetchAcademicYears = async () => {
    try {
      const response = await getAcademicYears();
      setAcademicYears(toArray(response));
    } catch (error) {
      console.error('Failed to fetch academic years');
    }
  };

  // ClassSectionOut has only IDs — resolve names locally
  const getClassName = (class_id) => {
    const cls = classes.find(c => c.class_id === class_id);
    return cls ? `Class ${cls.class_number}` : '—';
  };
  const getSectionName = (section_id) => sections.find(s => s.section_id === section_id)?.section_name || '—';
  const getYearLabel = (year_id) => academicYears.find(y => y.id === year_id)?.year_label || '—';

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      class_id: record.class_id,
      section_id: record.section_id,
      academic_year_id: record.academic_year_id,
      capacity: record.capacity,
      room_number: record.room_number,
    });
    setModalOpen(true);
  };

  const handleDelete = async (cs_id) => {
    try {
      await deleteClassSection(cs_id);
      message.success('Class section deleted successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to delete class section');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingRecord) {
        // ClassSectionUpdate: ONLY capacity, room_number, status allowed
        const payload = {
          capacity: values.capacity ? Number(values.capacity) : undefined,
          room_number: values.room_number || null,
        };
        await updateClassSection(editingRecord.id, payload);
        message.success('Class section updated successfully');
      } else {
        // ClassSectionCreate: class_id, section_id, academic_year_id, capacity, room_number
        const payload = {
          class_id: Number(values.class_id),
          section_id: Number(values.section_id),
          academic_year_id: Number(values.academic_year_id),
          capacity: values.capacity ? Number(values.capacity) : 40,
          room_number: values.room_number || null,
        };
        await createClassSection(payload);
        message.success('Class section created successfully');
      }
      setModalOpen(false);
      fetchData();
    } catch (error) {
      const detail = error.response?.data?.detail;
      if (Array.isArray(detail)) {
        detail.forEach(e => message.error(`${e.loc?.slice(1).join('.')} — ${e.msg}`));
      } else {
        message.error(editingRecord ? 'Failed to update' : 'Failed to create');
      }
    }
  };

  const columns = [
    {
      title: 'Class',
      dataIndex: 'class_id',
      key: 'class_id',
      render: (class_id) => <strong>{getClassName(class_id)}</strong>,
    },
    {
      title: 'Section',
      dataIndex: 'section_id',
      key: 'section_id',
      render: (section_id) => getSectionName(section_id),
    },
    {
      title: 'Academic Year',
      dataIndex: 'academic_year_id',
      key: 'academic_year_id',
      render: (year_id) => getYearLabel(year_id),
    },
    { title: 'Room Number', dataIndex: 'room_number', key: 'room_number', render: (v) => v || '—' },
    { title: 'Capacity', dataIndex: 'capacity', key: 'capacity' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => <Tag color={text === 'ACTIVE' ? 'green' : 'red'}>{text === 'ACTIVE' ? 'Active' : 'Inactive'}</Tag>,
    },
    {
      title: 'Actions', key: 'actions', fixed: 'right', width: 120,
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} className="action-btn edit-btn" />
          <Popconfirm title="Delete this class section?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" icon={<DeleteOutlined />} danger className="action-btn delete-btn" />
          </Popconfirm>
        </div>
      )
    },
  ];

  return (
    <div className="academic-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Class Sections</h1>
          <p className="page-description">Manage class sections with room details</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="large">Add Class Section</Button>
      </div>

      <div className="page-content">
        <Card className="table-card">
          <Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={{ pageSize: 10, showTotal: (total) => `Total ${total} class sections` }} />
        </Card>
      </div>

      <Modal
        title={editingRecord ? 'Edit Class Section' : 'Add Class Section'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="class_id" label="Class" rules={[{ required: !editingRecord, message: 'Required' }]}>
            <Select placeholder="Select class" size="large" disabled={!!editingRecord}>
              {classes.map(c => <Option key={c.class_id} value={c.class_id}>Class {c.class_number}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="section_id" label="Section" rules={[{ required: !editingRecord, message: 'Required' }]}>
            <Select placeholder="Select section" size="large" disabled={!!editingRecord}>
              {sections.map(s => <Option key={s.section_id} value={s.section_id}>{s.section_name}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="academic_year_id" label="Academic Year" rules={[{ required: !editingRecord, message: 'Required' }]}>
            <Select placeholder="Select academic year" size="large" disabled={!!editingRecord}>
              {academicYears.map(y => <Option key={y.id} value={y.id}>{y.year_label}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="room_number" label="Room Number">
            <Input placeholder="e.g., 101" size="large" />
          </Form.Item>
          <Form.Item name="capacity" label="Capacity">
            <Input type="number" placeholder="e.g., 40" size="large" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}