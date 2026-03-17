import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Card, Popconfirm, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { getSections, createSection, updateSection, deleteSection } from '../../../../services/academicService';
import './Academic.css';

export default function Sections() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({ search: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getSections();
      setData(response.data);
    } catch (error) {
      message.error('Failed to fetch sections');
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
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteSection(id);
      message.success('Section deleted successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to delete section');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingRecord) {
        await updateSection(editingRecord.id, values);
        message.success('Section updated successfully');
      } else {
        await createSection(values);
        message.success('Section created successfully');
      }
      setModalOpen(false);
      fetchData();
    } catch (error) {
      message.error(editingRecord ? 'Failed to update' : 'Failed to create');
    }
  };

  const filteredData = data.filter(item => item.name?.toLowerCase().includes(filters.search.toLowerCase()));

  const columns = [
    { title: 'Section Name', dataIndex: 'name', key: 'name', render: (text) => <strong>{text}</strong>, sorter: (a, b) => a.name.localeCompare(b.name) },
    {
      title: 'Actions', key: 'actions', width: 120,
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} className="action-btn edit-btn" />
          <Popconfirm title="Delete this section?" onConfirm={() => handleDelete(record.id)}>
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
          <h1 className="page-title">Sections</h1>
          <p className="page-description">Manage class sections</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="large">Add Section</Button>
      </div>

      <div className="page-content">
        <Card className="filter-card">
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
              <Input placeholder="Search by section name" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} prefix={<SearchOutlined />} size="large" allowClear />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Button icon={<ReloadOutlined />} onClick={() => { setFilters({ search: '' }); fetchData(); }} size="large">Reset</Button>
            </Col>
          </Row>
        </Card>

        <Card className="table-card">
          <Table columns={columns} dataSource={filteredData} rowKey="id" loading={loading} pagination={{ pageSize: 10, showTotal: (total) => `Total ${total} sections` }} />
        </Card>
      </div>

      <Modal title={editingRecord ? 'Edit Section' : 'Add Section'} open={modalOpen} onCancel={() => setModalOpen(false)} onOk={() => form.submit()} width={500}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Section Name" rules={[{ required: true, message: 'Please enter section name' }]}>
            <Input placeholder="e.g., A" size="large" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}