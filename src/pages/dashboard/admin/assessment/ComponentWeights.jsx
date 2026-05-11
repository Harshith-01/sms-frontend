import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, message, Card, Select, Row, Col, Slider, Alert } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { getComponentWeights, createComponentWeight } from '../../../../services/assessmentService';
import { getAcademicYears } from '../../../../services/academicService';
import './Assessment.css';

const { Option } = Select;

const extractRows = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

export default function ComponentWeights() {
  const [data, setData] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({ academic_year_id: null });
  const [weights, setWeights] = useState({ exam: 60, assignment: 30, attendance: 10 });

  useEffect(() => {
    fetchAcademicYears();
    fetchData();
  }, []);

  const fetchAcademicYears = async () => {
    try {
      const response = await getAcademicYears();
      setAcademicYears(extractRows(response?.data));
    } catch (error) {
      console.error('Failed to fetch academic years');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getComponentWeights(filters);
      setData(extractRows(response?.data));
    } catch (error) {
      message.error('Failed to fetch component weights');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    form.resetFields();
    setWeights({ exam: 60, assignment: 30, attendance: 10 });
    setModalOpen(true);
  };

  const handleSubmit = async (values) => {
    const total = weights.exam + weights.assignment + weights.attendance;
    if (total !== 100) {
      message.error('Total weight must equal 100%');
      return;
    }

    try {
      await createComponentWeight({
        academic_year_id: values.academic_year_id,
        exam_weight: weights.exam,
        assignment_weight: weights.assignment,
        attendance_weight: weights.attendance,
      });
      message.success('Component weight created successfully');
      setModalOpen(false);
      fetchData();
    } catch (error) {
      message.error('Failed to create component weight');
    }
  };

  const getTotalWeight = () => weights.exam + weights.assignment + weights.attendance;

  const columns = [
    { title: 'Academic Year', dataIndex: 'academic_year_label', key: 'academic_year_label', render: (text) => <strong>{text}</strong> },
    { title: 'Exam Weight', dataIndex: 'exam_weight', key: 'exam_weight', render: (text) => `${text}%` },
    { title: 'Assignment Weight', dataIndex: 'assignment_weight', key: 'assignment_weight', render: (text) => `${text}%` },
    { title: 'Attendance Weight', dataIndex: 'attendance_weight', key: 'attendance_weight', render: (text) => `${text}%` },
  ];

  return (
    <div className="assessment-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Component Weights</h1>
          <p className="page-description">Configure assessment component weights for each academic year</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="large">Add Component Weight</Button>
      </div>

      <div className="page-content">
        <Card className="filter-card">
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
              <Select placeholder="Filter by Academic Year" value={filters.academic_year_id} onChange={(value) => setFilters({ ...filters, academic_year_id: value })} size="large" style={{ width: '100%' }} allowClear>
                {academicYears.map(year => <Option key={year.id} value={year.id}>{year.year_label}</Option>)}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Button icon={<ReloadOutlined />} onClick={() => { setFilters({ academic_year_id: null }); fetchData(); }} size="large">Reset</Button>
            </Col>
          </Row>
        </Card>

        <Card className="table-card">
          <Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={{ pageSize: 10, showTotal: (total) => `Total ${total} records` }} />
        </Card>
      </div>

      <Modal title="Add Component Weight" open={modalOpen} onCancel={() => setModalOpen(false)} onOk={() => form.submit()} width={600}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="academic_year_id" label="Academic Year" rules={[{ required: true, message: 'Please select academic year' }]}>
            <Select placeholder="Select academic year" size="large">
              {academicYears.map(year => <Option key={year.id} value={year.id}>{year.year_label}</Option>)}
            </Select>
          </Form.Item>
          <Alert message={`Total Weight: ${getTotalWeight()}% ${getTotalWeight() === 100 ? '✓' : '(Must be 100%)'}`} type={getTotalWeight() === 100 ? 'success' : 'warning'} style={{ marginBottom: 16 }} />
          <Form.Item label={`Exam Weight: ${weights.exam}%`}>
            <Slider min={0} max={100} value={weights.exam} onChange={(value) => setWeights({ ...weights, exam: value })} />
          </Form.Item>
          <Form.Item label={`Assignment Weight: ${weights.assignment}%`}>
            <Slider min={0} max={100} value={weights.assignment} onChange={(value) => setWeights({ ...weights, assignment: value })} />
          </Form.Item>
          <Form.Item label={`Attendance Weight: ${weights.attendance}%`}>
            <Slider min={0} max={100} value={weights.attendance} onChange={(value) => setWeights({ ...weights, attendance: value })} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}