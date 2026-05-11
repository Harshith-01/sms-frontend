import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Card, Popconfirm, Select, Tag, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { getClasses, createClass, updateClass, deleteClass, getDepartments, getAcademicYears } from '../../../../services/academicService';
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
      setData(toArray(response));
    } catch (error) {
      message.error('Failed to fetch classes');
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

  const fetchAcademicYears = async () => {
    try {
      const response = await getAcademicYears();
      setAcademicYears(toArray(response));
    } catch (error) {
      console.error('Failed to fetch academic years');
    }
  };

  // Local join helpers — ClassOut has no department_name / academic_year_label
  const getDeptName = (dept_id) => departments.find(d => d.id === dept_id)?.name || '—';
  const getYearLabel = (year_id) => academicYears.find(y => y.id === year_id)?.year_label || '—';

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      class_number: record.class_number,
      department_id: record.department_id,
      academic_year_id: record.academic_year_id,
    });
    setModalOpen(true);
  };

  const handleDelete = async (class_id) => {
    try {
      await deleteClass(class_id);
      message.success('Class deleted successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to delete class');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const payload = {
        class_number: Number(values.class_number),
        department_id: Number(values.department_id),
        academic_year_id: Number(values.academic_year_id),
      };
      if (editingRecord) {
        await updateClass(editingRecord.class_id, payload);
        message.success('Class updated successfully');
      } else {
        await createClass(payload);
        message.success('Class created successfully');
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
    item.class_number?.toString().includes(filters.search)
  );

  const columns = [
    {
      title: 'Class Number',
      dataIndex: 'class_number',
      key: 'class_number',
      render: (text) => <strong>{text}</strong>,
      sorter: (a, b) => a.class_number - b.class_number,
    },
    {
      title: 'Department',
      dataIndex: 'department_id',
      key: 'department_id',
      // ClassOut has department_id only — resolve name locally
      render: (dept_id) => getDeptName(dept_id),
    },
    {
      title: 'Academic Year',
      dataIndex: 'academic_year_id',
      key: 'academic_year_id',
      // ClassOut has academic_year_id only — resolve label locally
      render: (year_id) => getYearLabel(year_id),
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
          <Popconfirm title="Delete this class?" onConfirm={() => handleDelete(record.class_id)}>
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
          <Table columns={columns} dataSource={filteredData} rowKey="class_id" loading={loading} pagination={{ pageSize: 10, showTotal: (total) => `Total ${total} classes` }} />
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