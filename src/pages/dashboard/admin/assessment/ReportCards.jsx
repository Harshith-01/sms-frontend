import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, message, Card, Select, Row, Col, Input, Tag } from 'antd';
import { FileTextOutlined, CheckCircleOutlined, EyeOutlined, DownloadOutlined, ReloadOutlined } from '@ant-design/icons';
import { generateReportCards, publishReportCards, getStudentReportCards } from '../../../../services/assessmentService';
import { getAcademicYears } from '../../../../services/academicService';
import dayjs from 'dayjs';
import './Assessment.css';

const { Option } = Select;

export default function ReportCards() {
  const [data, setData] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({ student_id: '', academic_year_id: null });

  useEffect(() => {
    fetchAcademicYears();
  }, []);

  const fetchAcademicYears = async () => {
    try {
      const response = await getAcademicYears();
      setAcademicYears(response.data || []);
    } catch (error) {
      message.error('Failed to fetch academic years');
    }
  };

  const fetchData = async () => {
    if (!filters.student_id) {
      message.warning('Please enter a student ID');
      return;
    }
    setLoading(true);
    try {
      const response = await getStudentReportCards(filters.student_id);
      setData(response.data.data || []);
    } catch (error) {
      message.error('Failed to fetch report cards');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (values) => {
    try {
      await generateReportCards(values);
      message.success('Report cards generated successfully');
      setGenerateModalOpen(false);
      fetchData();
    } catch (error) {
      message.error('Failed to generate report cards');
    }
  };

  const handlePublish = async (reportCardId) => {
    try {
      await publishReportCards({ report_card_ids: [reportCardId] });
      message.success('Report card published successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to publish report card');
    }
  };

  const getStatusTag = (status) => {
    return status === 'published' ? <Tag color="green">Published</Tag> : <Tag color="orange">Draft</Tag>;
  };

  const columns = [
    { title: 'Student ID', dataIndex: 'student_id', key: 'student_id', render: (text) => <strong>{text}</strong> },
    { title: 'Student Name', dataIndex: 'student_name', key: 'student_name' },
    { title: 'Academic Year', dataIndex: 'academic_year_label', key: 'academic_year_label' },
    { title: 'Exam', dataIndex: 'exam_name', key: 'exam_name' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (text) => getStatusTag(text) },
    { title: 'Generated Date', dataIndex: 'created_at', key: 'created_at', render: (text) => dayjs(text).format('DD/MM/YYYY') },
    {
      title: 'Actions',
      key: 'actions',
      width: 180,
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="link" icon={<EyeOutlined />} className="action-btn view-btn" title="View" />
          <Button type="link" icon={<DownloadOutlined />} className="action-btn" title="Download" />
          {record.status !== 'published' && (
            <Button type="link" icon={<CheckCircleOutlined />} onClick={() => handlePublish(record.id)} className="action-btn publish-btn" title="Publish" />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="assessment-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Report Cards</h1>
          <p className="page-description">Generate and manage student report cards</p>
        </div>
        <Button type="primary" icon={<FileTextOutlined />} onClick={() => setGenerateModalOpen(true)} size="large">
          Generate Report Cards
        </Button>
      </div>

      <div className="page-content">
        <Card className="filter-card">
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <Input placeholder="Enter Student ID" value={filters.student_id} onChange={(e) => setFilters({ ...filters, student_id: e.target.value })} size="large" allowClear />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select placeholder="Academic Year" value={filters.academic_year_id} onChange={(value) => setFilters({ ...filters, academic_year_id: value })} size="large" style={{ width: '100%' }} allowClear>
                {academicYears.map(y => <Option key={y.id} value={y.id}>{y.year_label}</Option>)}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Button icon={<ReloadOutlined />} onClick={fetchData} size="large">Search</Button>
            </Col>
          </Row>
        </Card>

        <Card className="table-card">
          <Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={{ pageSize: 10, showTotal: (total) => `Total ${total} report cards` }} />
        </Card>
      </div>

      <Modal title="Generate Report Cards" open={generateModalOpen} onCancel={() => setGenerateModalOpen(false)} onOk={() => form.submit()} width={600}>
        <Form form={form} layout="vertical" onFinish={handleGenerate}>
          <Form.Item name="academic_year_id" label="Academic Year" rules={[{ required: true }]}>
            <Select placeholder="Select academic year" size="large">
              {academicYears.map(y => <Option key={y.id} value={y.id}>{y.year_label}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="exam_id" label="Exam" rules={[{ required: true }]}>
            <Select placeholder="Select exam" size="large">
              {/* Load exams based on academic year */}
            </Select>
          </Form.Item>
          <Form.Item name="student_ids" label="Students">
            <Select mode="multiple" placeholder="Select students (leave empty for all)" size="large">
              {/* Load students based on filters */}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}