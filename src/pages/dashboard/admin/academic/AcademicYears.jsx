import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Card, Popconfirm, Switch, DatePicker, Tag, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { getAcademicYears, createAcademicYear, updateAcademicYear, deleteAcademicYear } from '../../../../services/academicService';
import dayjs from 'dayjs';
import './Academic.css';

const toArray = (res) => {
  const d = res?.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.items)) return d.items;
  if (Array.isArray(d?.results)) return d.results;
  if (Array.isArray(d?.data)) return d.data;
  return [];
};

export default function AcademicYears() {
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
      const response = await getAcademicYears();
      setData(toArray(response));
    } catch (error) {
      message.error('Failed to fetch academic years');
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
    form.setFieldsValue({
      ...record,
      start_date: record.start_date ? dayjs(record.start_date) : null,
      end_date: record.end_date ? dayjs(record.end_date) : null,
    });
    setModalOpen(true);
  };

  const handleDelete = async (year_id) => {
    try {
      await deleteAcademicYear(year_id);
      message.success('Academic year deleted successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to delete academic year');
      console.error(error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        start_date: values.start_date ? dayjs(values.start_date).format('YYYY-MM-DD') : null,
        end_date: values.end_date ? dayjs(values.end_date).format('YYYY-MM-DD') : null,
      };

      if (editingRecord) {
        await updateAcademicYear(editingRecord.id, payload);
        message.success('Academic year updated successfully');
      } else {
        await createAcademicYear(payload);
        message.success('Academic year created successfully');
      }
      setModalOpen(false);
      fetchData();
    } catch (error) {
      message.error(editingRecord ? 'Failed to update' : 'Failed to create');
      console.error(error);
    }
  };

  const filteredData = data.filter(item =>
    item.year_label?.toLowerCase().includes(filters.search.toLowerCase())
  );

  const columns = [
    {
      title: 'Year Label',
      dataIndex: 'year_label',
      key: 'year_label',
      render: (text) => <strong>{text}</strong>,
      sorter: (a, b) => a.year_label.localeCompare(b.year_label),
    },
    {
      title: 'Start Date',
      dataIndex: 'start_date',
      key: 'start_date',
      render: (text) => text ? dayjs(text).format('DD/MM/YYYY') : '—',
    },
    {
      title: 'End Date',
      dataIndex: 'end_date',
      key: 'end_date',
      render: (text) => text ? dayjs(text).format('DD/MM/YYYY') : '—',
    },
    {
      title: 'Current',
      dataIndex: 'is_current',
      key: 'is_current',
      render: (text) => <Tag color={text ? 'green' : 'default'}>{text ? 'Yes' : 'No'}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} className="action-btn edit-btn" />
          <Popconfirm title="Delete this year?" onConfirm={() => handleDelete(record.id)} okText="Yes" cancelText="No">
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
          <h1 className="page-title">Academic Years</h1>
          <p className="page-description">Manage academic years and set current year</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="large">
          Add Academic Year
        </Button>
      </div>

      <div className="page-content">
        <Card className="filter-card">
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
              <Input
                placeholder="Search by year label"
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
            pagination={{ pageSize: 10, showTotal: (total) => `Total ${total} academic years` }}
          />
        </Card>
      </div>

      <Modal
        title={editingRecord ? 'Edit Academic Year' : 'Add Academic Year'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        width={600}
        okText={editingRecord ? 'Update' : 'Create'}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="year_label" label="Year Label" rules={[{ required: true, message: 'Required' }]}>
            <Input placeholder="e.g., 2024-2025" size="large" />
          </Form.Item>
          <Form.Item name="start_date" label="Start Date" rules={[{ required: true, message: 'Required' }]}>
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" size="large" />
          </Form.Item>
          <Form.Item name="end_date" label="End Date" rules={[{ required: true, message: 'Required' }]}>
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" size="large" />
          </Form.Item>
          <Form.Item name="is_current" label="Set as Current Year" valuePropName="checked" initialValue={false}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}