import { useState, useEffect } from 'react';
import { Table, Card, Tag, Row, Col, Statistic, message } from 'antd';
import { DollarOutlined } from '@ant-design/icons';
import { getStudentFeeTerms, getFeePayments } from '../../../services/feeService';
import dayjs from 'dayjs';
import '../student/Student.css';

export default function StudentFeeStatus() {
  const [feeTerms, setFeeTerms] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalFee: 0, totalPaid: 0, balance: 0 });

  const studentId = localStorage.getItem('userId');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const feesRes = await getStudentFeeTerms({ student_id: studentId });
      const feeData = feesRes.data.data || [];
      setFeeTerms(feeData);

      const totalFee = feeData.reduce((sum, fee) => sum + (fee.total_amount || 0), 0);
      const totalPaid = feeData.reduce((sum, fee) => sum + (fee.amount_paid || 0), 0);
      setStats({ totalFee, totalPaid, balance: totalFee - totalPaid });

      const paymentsRes = await getFeePayments({ student_id: studentId });
      setPayments(paymentsRes.data.data || []);
    } catch (error) {
      message.error('Failed to fetch fee status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (record) => {
    if (record.balance_amount === 0) return <Tag color="green">Paid</Tag>;
    else if (record.amount_paid > 0) return <Tag color="orange">Partial</Tag>;
    else return <Tag color="red">Pending</Tag>;
  };

  const feeColumns = [
    { title: 'Term Name', dataIndex: 'term_name', key: 'term_name', render: (text) => <strong>{text}</strong> },
    { title: 'Total Amount', dataIndex: 'total_amount', key: 'total_amount', render: (text) => `₹${text?.toFixed(2)}` },
    { title: 'Amount Paid', dataIndex: 'amount_paid', key: 'amount_paid', render: (text) => `₹${text?.toFixed(2)}` },
    { title: 'Balance', dataIndex: 'balance_amount', key: 'balance_amount', render: (text) => <strong style={{ color: '#ef4444' }}>₹{text?.toFixed(2)}</strong> },
    { title: 'Due Date', dataIndex: 'due_date', key: 'due_date', render: (text) => dayjs(text).format('DD/MM/YYYY') },
    { title: 'Status', key: 'status', render: (_, record) => getStatusTag(record) },
  ];

  const paymentColumns = [
    { title: 'Payment Date', dataIndex: 'payment_date', key: 'payment_date', render: (text) => dayjs(text).format('DD/MM/YYYY') },
    { title: 'Term', dataIndex: 'term_name', key: 'term_name' },
    { title: 'Amount', dataIndex: 'payment_amount', key: 'payment_amount', render: (text) => `₹${text?.toFixed(2)}` },
    { title: 'Method', dataIndex: 'payment_method', key: 'payment_method', render: (text) => <Tag>{text}</Tag> },
    { title: 'Reference ID', dataIndex: 'reference_id', key: 'reference_id' },
  ];

  return (
    <div className="student-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Fee Status</h1>
          <p className="page-description">View your fee details and payment history</p>
        </div>
      </div>

      <div className="page-content">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic title="Total Fee" value={stats.totalFee} prefix="₹" valueStyle={{ color: '#667eea' }} />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic title="Total Paid" value={stats.totalPaid} prefix="₹" valueStyle={{ color: '#10b981' }} />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic title="Balance" value={stats.balance} prefix="₹" valueStyle={{ color: '#ef4444' }} />
            </Card>
          </Col>
        </Row>

        <Card title="Fee Terms" style={{ marginTop: 24 }}>
          <Table columns={feeColumns} dataSource={feeTerms} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
        </Card>

        <Card title="Payment History" style={{ marginTop: 24 }}>
          <Table columns={paymentColumns} dataSource={payments} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
        </Card>
      </div>
    </div>
  );
}