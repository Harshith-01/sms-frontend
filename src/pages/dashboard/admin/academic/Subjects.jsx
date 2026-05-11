import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Card, Popconfirm, Select, Switch, Tag, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { getSubjects, createSubject, updateSubject, deleteSubject, getDepartments } from '../../../../services/academicService';
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
      setData(toArray(response));
    } catch (error) {
      message.error('Failed to fetch subjects');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await getDepartments();
      setDepartments(toArray(response));
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
    form.setFieldsValue({
      subject_name: record.subject_name,
      subject_code: record.subject_code,
      department_id: record.department_id,
      is_elective: record.is_elective,
      // status only shown on edit — map ACTIVE→true for Switch
      is_active: record.status === 'ACTIVE',
    });
    setModalOpen(true);
  };

  const handleDelete = async (subject_id) => {
    try {
      await deleteSubject(subject_id);
      message.success('Subject deleted successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to delete subject');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingRecord) {
        // SubjectUpdate: subject_name, subject_code, department_id, is_elective, status
        const payload = {
          subject_name: values.subject_name,
          subject_code: values.subject_code,
          department_id: values.department_id ? Number(values.department_id) : null,
          is_elective: values.is_elective || false,
          status: values.is_active ? 'ACTIVE' : 'INACTIVE',
        };
        await updateSubject(editingRecord.id, payload);
        message.success('Subject updated successfully');
      } else {
        // SubjectCreate: subject_name, subject_code, department_id, is_elective — NO status
        const payload = {
          subject_name: values.subject_name,
          subject_code: values.subject_code,
          department_id: values.department_id ? Number(values.department_id) : null,
          is_elective: values.is_elective || false,
        };
        await createSubject(payload);
        message.success('Subject created successfully');
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

  const filteredData = data.filter(item =>
    item.subject_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
    item.subject_code?.toLowerCase().includes(filters.search.toLowerCase())
  );

  const columns = [
    {
      title: 'Subject Name',
      dataIndex: 'subject_name',
      key: 'subject_name',
      render: (text) => <strong>{text}</strong>,
      sorter: (a, b) => a.subject_name.localeCompare(b.subject_name),
    },
    { title: 'Code', dataIndex: 'subject_code', key: 'subject_code' },
    {
      title: 'Elective',
      dataIndex: 'is_elective',
      key: 'is_elective',
      render: (text) => <Tag color={text ? 'blue' : 'default'}>{text ? 'Yes' : 'No'}</Tag>,
    },
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

      <Modal
        title={editingRecord ? 'Edit Subject' : 'Add Subject'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        width={600}
        okText={editingRecord ? 'Update' : 'Create'}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="subject_name" label="Subject Name" rules={[{ required: true, message: 'Required' }]}>
            <Input placeholder="e.g., Mathematics" size="large" />
          </Form.Item>
          <Form.Item name="subject_code" label="Subject Code" rules={[{ required: true, message: 'Required' }]}>
            <Input placeholder="e.g., MATH101" size="large" />
          </Form.Item>
          <Form.Item name="department_id" label="Department">
            <Select placeholder="Select department" size="large" allowClear>
              {departments.map(d => <Option key={d.id} value={d.id}>{d.name}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="is_elective" label="Is Elective" valuePropName="checked" initialValue={false}>
            <Switch />
          </Form.Item>
          {/* Status only shown when editing — SubjectCreate has no status field */}
          {editingRecord && (
            <Form.Item name="is_active" label="Status" valuePropName="checked">
              <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
}