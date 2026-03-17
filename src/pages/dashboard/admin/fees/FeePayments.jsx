import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Card, Popconfirm, Select, Row, Col, DatePicker, InputNumber } from 'antd';
import { PlusOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { getFeePayments, createFeePayment, deleteFeePayment } from '../../../../services/feeService';
import { getStudentFeeTerms } from '../../../../services/feeService';
import dayjs from 'dayjs';
import './Fees.css';

const { Option } = Select;
const { TextArea } = Input;

export default function FeePayments() {
  const [data, setData] = useState([]);
  const [feeTerms, setFeeTerms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({ student_id: '', term_id: null, payment_date_from: null, payment_date_to: null });

  useEffect(() => {
    fetchFeeTerms();
    fetchData();
  }, []);

  const fetchFeeTerms = async () => {
    try {
      const response = await getStudentFeeTerms({});
      setFeeTerms(response.data.data || []);
    } catch (error) {
      message.error('Failed to fetch fee terms');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getFeePayments(filters);
      setData(response.data.data || []);
    } catch (error) {
      message.error('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    form.resetFields();
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteFeePayment(id);
      message.success('Payment deleted successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to delete payment');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        payment_date: values.payment_date ? dayjs(values.payment_date).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
      };

      await createFeePayment(payload);
      message.success('Payment recorded successfully');
      setModalOpen(false);
      fetchData();
      fetchFeeTerms();
    } catch (error) {
      message.error('Failed to record payment');
    }
  };

  const filteredData = data;

  const columns = [
    { title: 'Payment ID', dataIndex: 'id', key: 'id', render: (text) => <strong>#{text}</strong> },
    { title: 'Student ID', dataIndex: 'student_id', key: 'student_id', render: (text) => <strong>{text}</strong> },
    { title: 'Student Name', dataIndex: 'student_name', key: 'student_name' },
    { title: 'Term Name', dataIndex: 'term_name', key: 'term_name' },
    { title: 'Payment Amount', dataIndex: 'payment_amount', key: 'payment_amount', render: (text) => <span className="amount-display">₹{text?.toFixed(2)}</span> },
    { title: 'Payment Date', dataIndex: 'payment_date', key: 'payment_date', render: (text) => dayjs(text).format('DD/MM/YYYY') },
    { title: 'Payment Method', dataIndex: 'payment_method', key: 'payment_method' },
    { title: 'Reference ID', dataIndex: 'reference_id', key: 'reference_id' },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Popconfirm title="Delete this payment?" onConfirm={() => handleDelete(record.id)}>
          <Button type="link" icon={<DeleteOutlined />} danger className="action-btn delete-btn" />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="fees-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Fee Payments</h1>
          <p className="page-description">Record and track fee payments</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="large">Record Payment</Button>
      </div>

      <div className="page-content">
        <Card className="filter-card">
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <Input placeholder="Search by Student ID" value={filters.student_id} onChange={(e) => setFilters({ ...filters, student_id: e.target.value })} prefix={<SearchOutlined />} size="large" allowClear />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select placeholder="Fee Term" value={filters.term_id} onChange={(value) => setFilters({ ...filters, term_id: value })} size="large" style={{ width: '100%' }} allowClear>
                {feeTerms.map(term => <Option key={term.id} value={term.id}>{term.student_id} - {term.term_name}</Option>)}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Button icon={<ReloadOutlined />} onClick={() => { setFilters({ student_id: '', term_id: null, payment_date_from: null, payment_date_to: null }); fetchData(); }} size="large">Reset</Button>
            </Col>
          </Row>
        </Card>

        <Card className="table-card">
          <Table columns={columns} dataSource={filteredData} rowKey="id" loading={loading} pagination={{ pageSize: 10, showTotal: (total) => `Total ${total} payments` }} />
        </Card>
      </div>

      <Modal title="Record Fee Payment" open={modalOpen} onCancel={() => setModalOpen(false)} onOk={() => form.submit()} width={600}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="term_id" label="Fee Term" rules={[{ required: true }]}>
            <Select placeholder="Select fee term" size="large" showSearch filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}>
              {feeTerms.map(term => <Option key={term.id} value={term.id}>{term.student_id} - {term.term_name} (Balance: ₹{term.balance_amount})</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="payment_amount" label="Payment Amount" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} size="large" placeholder="Enter amount" prefix="₹" />
          </Form.Item>
          <Form.Item name="payment_date" label="Payment Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" size="large" defaultValue={dayjs()} />
          </Form.Item>
          <Form.Item name="payment_method" label="Payment Method" rules={[{ required: true }]}>
            <Select placeholder="Select payment method" size="large">
              <Option value="Cash">Cash</Option>
              <Option value="Card">Card</Option>
              <Option value="Online">Online</Option>
              <Option value="Cheque">Cheque</Option>
            </Select>
          </Form.Item>
          <Form.Item name="reference_id" label="Reference ID">
            <Input placeholder="Transaction/Cheque number" size="large" />
          </Form.Item>
          <Form.Item name="remarks" label="Remarks">
            <TextArea rows={3} placeholder="Additional remarks" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}