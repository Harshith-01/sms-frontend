import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Card, Popconfirm, Select, Tag, Row, Col, DatePicker, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { getStudentFeeTerms, createStudentFeeTerm, updateStudentFeeTerm, deleteStudentFeeTerm } from '../../../../services/feeService';
import { getAcademicYears } from '../../../../services/academicService';
import dayjs from 'dayjs';
import './Fees.css';

const { Option } = Select;

const extractRows = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

export default function StudentFees() {
  const [data, setData] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({ student_id: '', academic_year_id: null, status: null });

  useEffect(() => {
    fetchAcademicYears();
    fetchData();
  }, []);

  const fetchAcademicYears = async () => {
    try {
      const response = await getAcademicYears();
      setAcademicYears(extractRows(response?.data));
    } catch (error) {
      message.error('Failed to fetch academic years');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getStudentFeeTerms(filters);
      setData(extractRows(response?.data));
    } catch (error) {
      message.error('Failed to fetch student fees');
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
      due_date: record.due_date ? dayjs(record.due_date) : null,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteStudentFeeTerm(id);
      message.success('Fee term deleted successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to delete fee term');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        due_date: values.due_date ? dayjs(values.due_date).format('YYYY-MM-DD') : null,
      };

      if (editingRecord) {
        await updateStudentFeeTerm(editingRecord.id, payload);
        message.success('Fee term updated successfully');
      } else {
        await createStudentFeeTerm(payload);
        message.success('Fee term created successfully');
      }
      setModalOpen(false);
      fetchData();
    } catch (error) {
      message.error('Failed to save fee term');
    }
  };

  const getStatusTag = (record) => {
    if (record.balance_amount === 0) {
      return <Tag color="green">Paid</Tag>;
    } else if (record.amount_paid > 0) {
      return <Tag color="orange">Partial</Tag>;
    } else {
      return <Tag color="red">Pending</Tag>;
    }
  };

  const filteredData = data.filter(item => item.student_id?.includes(filters.student_id));

  const columns = [
    { title: 'Student ID', dataIndex: 'student_id', key: 'student_id', render: (text) => <strong>{text}</strong> },
    { title: 'Student Name', dataIndex: 'student_name', key: 'student_name' },
    { title: 'Academic Year', dataIndex: 'academic_year_label', key: 'academic_year_label' },
    { title: 'Term Name', dataIndex: 'term_name', key: 'term_name' },
    { title: 'Total Amount', dataIndex: 'total_amount', key: 'total_amount', render: (text) => <span className="amount-display">₹{text?.toFixed(2)}</span> },
    { title: 'Amount Paid', dataIndex: 'amount_paid', key: 'amount_paid', render: (text) => `₹${text?.toFixed(2)}` },
    { title: 'Balance', dataIndex: 'balance_amount', key: 'balance_amount', render: (text) => <span className="balance-display">₹{text?.toFixed(2)}</span> },
    { title: 'Status', key: 'status', render: (_, record) => getStatusTag(record) },
    { title: 'Due Date', dataIndex: 'due_date', key: 'due_date', render: (text) => text ? dayjs(text).format('DD/MM/YYYY') : '—' },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} className="action-btn edit-btn" />
          <Popconfirm title="Delete this fee term?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" icon={<DeleteOutlined />} danger className="action-btn delete-btn" />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="fees-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Student Fees</h1>
          <p className="page-description">Manage student fee terms and track payments</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="large">Add Fee Term</Button>
      </div>

      <div className="page-content">
        <Card className="filter-card">
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <Input placeholder="Search by Student ID" value={filters.student_id} onChange={(e) => setFilters({ ...filters, student_id: e.target.value })} prefix={<SearchOutlined />} size="large" allowClear />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select placeholder="Academic Year" value={filters.academic_year_id} onChange={(value) => setFilters({ ...filters, academic_year_id: value })} size="large" style={{ width: '100%' }} allowClear>
                {academicYears.map(y => <Option key={y.id} value={y.id}>{y.year_label}</Option>)}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select placeholder="Status" value={filters.status} onChange={(value) => setFilters({ ...filters, status: value })} size="large" style={{ width: '100%' }} allowClear>
                <Option value="paid">Paid</Option>
                <Option value="partial">Partial</Option>
                <Option value="pending">Pending</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Button icon={<ReloadOutlined />} onClick={() => { setFilters({ student_id: '', academic_year_id: null, status: null }); fetchData(); }} size="large">Reset</Button>
            </Col>
          </Row>
        </Card>

        <Card className="table-card">
          <Table columns={columns} dataSource={filteredData} rowKey="id" loading={loading} pagination={{ pageSize: 10, showTotal: (total) => `Total ${total} fee terms` }} />
        </Card>
      </div>

      <Modal title={editingRecord ? 'Edit Fee Term' : 'Add Fee Term'} open={modalOpen} onCancel={() => setModalOpen(false)} onOk={() => form.submit()} width={600}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="student_id" label="Student ID" rules={[{ required: true }]}>
            <Input placeholder="Enter student ID" size="large" />
          </Form.Item>
          <Form.Item name="academic_year_id" label="Academic Year" rules={[{ required: true }]}>
            <Select placeholder="Select academic year" size="large">
              {academicYears.map(y => <Option key={y.id} value={y.id}>{y.year_label}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="term_name" label="Term Name" rules={[{ required: true }]}>
            <Input placeholder="e.g., Term 1, Annual Fee" size="large" />
          </Form.Item>
          <Form.Item name="total_amount" label="Total Amount" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} size="large" placeholder="10000" prefix="₹" />
          </Form.Item>
          <Form.Item name="due_date" label="Due Date">
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" size="large" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}