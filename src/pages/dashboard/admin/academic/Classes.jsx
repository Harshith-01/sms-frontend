import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Card, Popconfirm, Select, Tag, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { getClasses, createClass, updateClass, deleteClass, getDepartments, getAcademicYears } from '../../../../services/academicService';
import './Academic.css';

const { Option } = Select;

export default function Classes() {
  const [data, setData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({ search: '' });

  useEffect(() => {
    fetchData();
    fetchDepartments();
    fetchAcademicYears();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getClasses();
      setData(response.data);
    } catch (error) {
      message.error('Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await getDepartments();
      setDepartments(response.data);
    } catch (error) {
      console.error('Failed to fetch departments');
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
      await deleteClass(id);
      message.success('Class deleted successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to delete class');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingRecord) {
        await updateClass(editingRecord.id, values);
        message.success('Class updated successfully');
      } else {
        await createClass(values);
        message.success('Class created successfully');
      }
      setModalOpen(false);
      fetchData();
    } catch (error) {
      message.error(editingRecord ? 'Failed to update' : 'Failed to create');
    }
  };

  const filteredData = data.filter(item =>
    item.class_number?.toString().includes(filters.search)
  );

  const columns = [
    { title: 'Class Number', dataIndex: 'class_number', key: 'class_number', render: (text) => <strong>{text}</strong>, sorter: (a, b) => a.class_number - b.class_number },
    { title: 'Department', dataIndex: 'department_name', key: 'department_name' },
    { title: 'Academic Year', dataIndex: 'academic_year_label', key: 'academic_year_label' },
    { title: 'Status', dataIndex: 'is_active', key: 'is_active', render: (text) => <Tag color={text ? 'green' : 'red'}>{text ? 'Active' : 'Inactive'}</Tag> },
    {
      title: 'Actions', key: 'actions', fixed: 'right', width: 120,
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} className="action-btn edit-btn" />
          <Popconfirm title="Delete this class?" onConfirm={() => handleDelete(record.id)}>
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
          <h1 className="page-title">Classes</h1>
          <p className="page-description">Manage school classes</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="large">Add Class</Button>
      </div>

      <div className="page-content">
        <Card className="filter-card">
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
              <Input placeholder="Search by class number" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} prefix={<SearchOutlined />} size="large" allowClear />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Button icon={<ReloadOutlined />} onClick={() => { setFilters({ search: '' }); fetchData(); }} size="large">Reset</Button>
            </Col>
          </Row>
        </Card>

        <Card className="table-card">
          <Table columns={columns} dataSource={filteredData} rowKey="id" loading={loading} pagination={{ pageSize: 10, showTotal: (total) => `Total ${total} classes` }} />
        </Card>
      </div>

      <Modal title={editingRecord ? 'Edit Class' : 'Add Class'} open={modalOpen} onCancel={() => setModalOpen(false)} onOk={() => form.submit()} width={600}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="class_number" label="Class Number" rules={[{ required: true, message: 'Required' }]}>
            <Input placeholder="e.g., 10" size="large" type="number" />
          </Form.Item>
          <Form.Item name="department_id" label="Department" rules={[{ required: true, message: 'Required' }]}>
            <Select placeholder="Select department" size="large">
              {departments.map(d => <Option key={d.id} value={d.id}>{d.name}</Option>)}
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