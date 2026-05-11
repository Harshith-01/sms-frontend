import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Card, Popconfirm, Switch, Tag, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '../../../../services/academicService';
import './Academic.css';

const toArray = (res) => {
  const d = res?.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.items)) return d.items;
  if (Array.isArray(d?.results)) return d.results;
  if (Array.isArray(d?.data)) return d.data;
  return [];
};

const { TextArea } = Input;

export default function Departments() {
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
      const response = await getDepartments();
      setData(toArray(response));
    } catch (error) {
      message.error('Failed to fetch departments');
      console.error(error);
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
    // Map backend status string to boolean for the Switch
    form.setFieldsValue({
      ...record,
      is_active: record.status === 'ACTIVE',
    });
    setModalOpen(true);
  };

  const handleDelete = async (dept_id) => {
    try {
      await deleteDepartment(dept_id);
      message.success('Department deleted successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to delete department');
      console.error(error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingRecord) {
        // UPDATE: name, description, status all allowed
        const payload = {
          name: values.name,
          description: values.description || null,
          status: values.is_active ? 'ACTIVE' : 'INACTIVE',
        };
        await updateDepartment(editingRecord.id, payload);
        message.success('Department updated successfully');
      } else {
        // CREATE: only name and description — NO status field
        const payload = {
          name: values.name,
          description: values.description || null,
        };
        await createDepartment(payload);
        message.success('Department created successfully');
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
      console.error(error);
    }
  };

  const filteredData = data.filter(item =>
    item.name?.toLowerCase().includes(filters.search.toLowerCase())
  );

  const columns = [
    {
      title: 'Department Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <strong>{text}</strong>,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => <Tag color={text === 'ACTIVE' ? 'green' : 'red'}>{text === 'ACTIVE' ? 'Active' : 'Inactive'}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} className="action-btn edit-btn" />
          <Popconfirm title="Delete this department?" onConfirm={() => handleDelete(record.id)} okText="Yes" cancelText="No">
            <Button type="link" icon={<DeleteOutlined />} danger className="action-btn delete-btn" />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="academic-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Departments</h1>
          <p className="page-description">Manage school departments</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="large">
          Add Department
        </Button>
      </div>

      <div className="page-content">
        <Card className="filter-card">
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
              <Input
                placeholder="Search by department name"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                prefix={<SearchOutlined />}
                size="large"
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Button icon={<ReloadOutlined />} onClick={() => { setFilters({ search: '' }); fetchData(); }} size="large">
                Reset
              </Button>
            </Col>
          </Row>
        </Card>

        <Card className="table-card">
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10, showTotal: (total) => `Total ${total} departments` }}
          />
        </Card>
      </div>

      <Modal
        title={editingRecord ? 'Edit Department' : 'Add Department'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        width={600}
        okText={editingRecord ? 'Update' : 'Create'}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Department Name" rules={[{ required: true, message: 'Required' }]}>
            <Input placeholder="e.g., Science" size="large" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea rows={4} placeholder="Enter department description" />
          </Form.Item>
          <Form.Item name="is_active" label="Active Status" valuePropName="checked" initialValue={true}>
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}