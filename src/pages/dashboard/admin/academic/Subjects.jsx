import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Card, Popconfirm, Select, Switch, Tag, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { getSubjects, createSubject, updateSubject, deleteSubject, getDepartments } from '../../../../services/academicService';
import './Academic.css';

const { Option } = Select;

export default function Subjects() {
  const [data, setData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({ search: '' });

  useEffect(() => {
    fetchData();
    fetchDepartments();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getSubjects();
      setData(response.data);
    } catch (error) {
      message.error('Failed to fetch subjects');
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
      await deleteSubject(id);
      message.success('Subject deleted successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to delete subject');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingRecord) {
        await updateSubject(editingRecord.id, values);
        message.success('Subject updated successfully');
      } else {
        await createSubject(values);
        message.success('Subject created successfully');
      }
      setModalOpen(false);
      fetchData();
    } catch (error) {
      message.error(editingRecord ? 'Failed to update' : 'Failed to create');
    }
  };

  const filteredData = data.filter(item =>
    item.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
    item.code?.toLowerCase().includes(filters.search.toLowerCase())
  );

  const columns = [
    { title: 'Subject Name', dataIndex: 'name', key: 'name', render: (text) => <strong>{text}</strong>, sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: 'Code', dataIndex: 'code', key: 'code' },
    { title: 'Department', dataIndex: 'department_name', key: 'department_name' },
    { title: 'Elective', dataIndex: 'is_elective', key: 'is_elective', render: (text) => <Tag color={text ? 'blue' : 'default'}>{text ? 'Yes' : 'No'}</Tag> },
    { title: 'Status', dataIndex: 'is_active', key: 'is_active', render: (text) => <Tag color={text ? 'green' : 'red'}>{text ? 'Active' : 'Inactive'}</Tag> },
    {
      title: 'Actions', key: 'actions', fixed: 'right', width: 120,
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} className="action-btn edit-btn" />
          <Popconfirm title="Delete this subject?" onConfirm={() => handleDelete(record.id)}>
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
          <h1 className="page-title">Subjects</h1>
          <p className="page-description">Manage school subjects</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="large">Add Subject</Button>
      </div>

      <div className="page-content">
        <Card className="filter-card">
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
              <Input placeholder="Search by name or code" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} prefix={<SearchOutlined />} size="large" allowClear />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Button icon={<ReloadOutlined />} onClick={() => { setFilters({ search: '' }); fetchData(); }} size="large">Reset</Button>
            </Col>
          </Row>
        </Card>

        <Card className="table-card">
          <Table columns={columns} dataSource={filteredData} rowKey="id" loading={loading} pagination={{ pageSize: 10, showTotal: (total) => `Total ${total} subjects` }} />
        </Card>
      </div>

      <Modal title={editingRecord ? 'Edit Subject' : 'Add Subject'} open={modalOpen} onCancel={() => setModalOpen(false)} onOk={() => form.submit()} width={600}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Subject Name" rules={[{ required: true, message: 'Required' }]}>
            <Input placeholder="e.g., Mathematics" size="large" />
          </Form.Item>
          <Form.Item name="code" label="Subject Code" rules={[{ required: true, message: 'Required' }]}>
            <Input placeholder="e.g., MATH101" size="large" />
          </Form.Item>
          <Form.Item name="department_id" label="Department" rules={[{ required: true, message: 'Required' }]}>
            <Select placeholder="Select department" size="large">
              {departments.map(d => <Option key={d.id} value={d.id}>{d.name}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="is_elective" label="Is Elective" valuePropName="checked" initialValue={false}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}