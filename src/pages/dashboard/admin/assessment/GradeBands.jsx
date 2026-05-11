import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Card, Select, Row, Col, InputNumber } from 'antd';
import { PlusOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { getGradeBands, createGradeBand, getGradeScales } from '../../../../services/assessmentService';
import './Assessment.css';

const { Option } = Select;
const { TextArea } = Input;

const extractRows = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

export default function GradeBands() {
  const [data, setData] = useState([]);
  const [gradeScales, setGradeScales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({ scale_id: null, search: '' });

  useEffect(() => {
    fetchGradeScales();
  }, []);

  useEffect(() => {
    if (filters.scale_id) {
      fetchData();
    }
  }, [filters.scale_id]);

  const fetchGradeScales = async () => {
    try {
      const response = await getGradeScales();
      setGradeScales(extractRows(response?.data));
    } catch (error) {
      message.error('Failed to fetch grade scales');
    }
  };

  const fetchData = async () => {
    if (!filters.scale_id) return;
    setLoading(true);
    try {
      const response = await getGradeBands(filters.scale_id);
      setData(extractRows(response?.data));
    } catch (error) {
      message.error('Failed to fetch grade bands');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (!filters.scale_id) {
      message.warning('Please select a grade scale first');
      return;
    }
    form.resetFields();
    form.setFieldsValue({ scale_id: filters.scale_id });
    setModalOpen(true);
  };

  const handleSubmit = async (values) => {
    try {
      await createGradeBand(values);
      message.success('Grade band created successfully');
      setModalOpen(false);
      fetchData();
    } catch (error) {
      message.error('Failed to create grade band');
      console.error(error);
    }
  };

  const filteredData = data.filter(item =>
    item.grade?.toLowerCase().includes(filters.search.toLowerCase())
  );

  const columns = [
    {
      title: 'Grade',
      dataIndex: 'grade',
      key: 'grade',
      render: (text) => <strong style={{ fontSize: '16px' }}>{text}</strong>,
      sorter: (a, b) => a.grade.localeCompare(b.grade),
    },
    {
      title: 'Min Score',
      dataIndex: 'min_score',
      key: 'min_score',
      sorter: (a, b) => a.min_score - b.min_score,
    },
    {
      title: 'Max Score',
      dataIndex: 'max_score',
      key: 'max_score',
      sorter: (a, b) => a.max_score - b.max_score,
    },
    {
      title: 'GPA',
      dataIndex: 'gpa',
      key: 'gpa',
      render: (text) => <strong>{text?.toFixed(2)}</strong>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
  ];

  return (
    <div className="assessment-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Grade Bands</h1>
          <p className="page-description">Define grade bands for each grading scale</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="large" disabled={!filters.scale_id}>
          Add Grade Band
        </Button>
      </div>

      <div className="page-content">
        <Card className="filter-card">
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
              <Select
                placeholder="Select Grade Scale"
                value={filters.scale_id}
                onChange={(value) => setFilters({ ...filters, scale_id: value })}
                size="large"
                style={{ width: '100%' }}
                allowClear
              >
                {gradeScales.map(scale => (
                  <Option key={scale.id} value={scale.id}>{scale.name}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Input
                placeholder="Search by grade"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                prefix={<SearchOutlined />}
                size="large"
                allowClear
                disabled={!filters.scale_id}
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Button icon={<ReloadOutlined />} onClick={() => { setFilters({ ...filters, search: '' }); fetchData(); }} size="large" disabled={!filters.scale_id}>
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
            pagination={{ pageSize: 10, showTotal: (total) => `Total ${total} grade bands` }}
          />
        </Card>
      </div>

      <Modal
        title="Add Grade Band"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="scale_id" label="Grade Scale" rules={[{ required: true }]}>
            <Select placeholder="Select grade scale" size="large" disabled>
              {gradeScales.map(scale => (
                <Option key={scale.id} value={scale.id}>{scale.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="grade" label="Grade" rules={[{ required: true, message: 'Please enter grade' }]}>
            <Input placeholder="e.g., A+, A, B+" size="large" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="min_score" label="Min Score" rules={[{ required: true, message: 'Required' }]}>
                <InputNumber min={0} max={100} style={{ width: '100%' }} size="large" placeholder="e.g., 90" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="max_score" label="Max Score" rules={[{ required: true, message: 'Required' }]}>
                <InputNumber min={0} max={100} style={{ width: '100%' }} size="large" placeholder="e.g., 100" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="gpa" label="GPA Value" rules={[{ required: true, message: 'Required' }]}>
            <InputNumber min={0} max={4} step={0.1} style={{ width: '100%' }} size="large" placeholder="e.g., 4.0" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea rows={3} placeholder="Enter description" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}