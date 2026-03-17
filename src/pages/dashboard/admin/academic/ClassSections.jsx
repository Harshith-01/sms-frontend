import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Card, Popconfirm, Select, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { getClassSections, createClassSection, updateClassSection, deleteClassSection, getClasses, getSections, getAcademicYears } from '../../../../services/academicService';
import './Academic.css';

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
      setData(response.data);
    } catch (error) {
      message.error('Failed to fetch class sections');
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await getClasses();
      setClasses(response.data);
    } catch (error) {
      console.error('Failed to fetch classes');
    }
  };

  const fetchSections = async () => {
    try {
      const response = await getSections();
      setSections(response.data);
    } catch (error) {
      console.error('Failed to fetch sections');
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
    setEditingRecord(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteClassSection(id);
      message.success('Class section deleted successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to delete class section');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingRecord) {
        await updateClassSection(editingRecord.id, values);
        message.success('Class section updated successfully');
      } else {
        await createClassSection(values);
        message.success('Class section created successfully');
      }
      setModalOpen(false);
      fetchData();
    } catch (error) {
      message.error(editingRecord ? 'Failed to update' : 'Failed to create');
    }
  };

  const columns = [
    { title: 'Class', dataIndex: 'class_number', key: 'class_number', render: (text) => <strong>{text}</strong> },
    { title: 'Section', dataIndex: 'section_name', key: 'section_name' },
    { title: 'Academic Year', dataIndex: 'academic_year_label', key: 'academic_year_label' },
    { title: 'Room Number', dataIndex: 'room_number', key: 'room_number' },
    { title: 'Capacity', dataIndex: 'capacity', key: 'capacity' },
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

      <Modal title={editingRecord ? 'Edit Class Section' : 'Add Class Section'} open={modalOpen} onCancel={() => setModalOpen(false)} onOk={() => form.submit()} width={600}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="class_id" label="Class" rules={[{ required: true, message: 'Required' }]}>
            <Select placeholder="Select class" size="large">
              {classes.map(c => <Option key={c.id} value={c.id}>Class {c.class_number}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="section_id" label="Section" rules={[{ required: true, message: 'Required' }]}>
            <Select placeholder="Select section" size="large">
              {sections.map(s => <Option key={s.id} value={s.id}>{s.name}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="academic_year_id" label="Academic Year" rules={[{ required: true, message: 'Required' }]}>
            <Select placeholder="Select academic year" size="large">
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