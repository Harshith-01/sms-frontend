import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, message, Card, Select, Row, Col, Input, Tag } from 'antd';
import { FileTextOutlined, CheckCircleOutlined, EyeOutlined, DownloadOutlined, ReloadOutlined } from '@ant-design/icons';
import { generateReportCards, publishReportCards, getStudentReportCards } from '../../../../services/assessmentService';
import { getAcademicYears, getAcademicTerms, getClassSections } from '../../../../services/academicService';
import dayjs from 'dayjs';
import './Assessment.css';

const { Option } = Select;

const extractRows = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

export default function ReportCards() {
  const [data, setData] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [academicTerms, setAcademicTerms] = useState([]);
  const [classSections, setClassSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({ student_id: '', academic_year_id: null, academic_term_id: null, class_section_id: null, report_type: null });

  useEffect(() => {
    fetchAcademicYears();
    fetchAcademicTerms();
    fetchClassSections();
  }, []);

  const fetchAcademicYears = async () => {
    try {
      const response = await getAcademicYears();
      setAcademicYears(extractRows(response?.data));
    } catch (error) {
      message.error('Failed to fetch academic years');
    }
  };

  const fetchAcademicTerms = async () => {
    try {
      const response = await getAcademicTerms();
      setAcademicTerms(extractRows(response?.data));
    } catch (error) {
      message.error('Failed to fetch academic terms');
    }
  };

  const fetchClassSections = async () => {
    try {
      const response = await getClassSections();
      setClassSections(extractRows(response?.data));
    } catch (error) {
      message.error('Failed to fetch class sections');
    }
  };

  const classSectionLabel = (cs) => {
    const room = cs?.room_number ? ` (${cs.room_number})` : '';
    return `Class ${cs?.class_id ?? '-'} - Section ${cs?.section_id ?? '-'}${room}`;
  };

  const fetchData = async () => {
    if (!filters.student_id) {
      message.warning('Please enter a student ID');
      return;
    }
    setLoading(true);
    try {
      const response = await getStudentReportCards(filters.student_id, 1, 50, {
        academic_year_id: filters.academic_year_id,
        academic_term_id: filters.academic_term_id,
        class_section_id: filters.class_section_id,
        report_type: filters.report_type,
      });
      setData(extractRows(response?.data));
    } catch (error) {
      message.error('Failed to fetch report cards');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (values) => {
    try {
      const studentIds = typeof values.student_ids === 'string'
        ? values.student_ids.split(',').map((s) => s.trim()).filter(Boolean)
        : undefined;

      await generateReportCards({
        ...values,
        student_ids: studentIds?.length ? studentIds : undefined,
      });
      message.success('Report cards generated successfully');
      setGenerateModalOpen(false);
      fetchData();
    } catch (error) {
      message.error('Failed to generate report cards');
    }
  };

  const handlePublish = async (reportCardId) => {
    try {
      await publishReportCards([reportCardId]);
      message.success('Report card published successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to publish report card');
    }
  };

  const getStatusTag = (status) => {
    return String(status || '').toUpperCase() === 'PUBLISHED'
      ? <Tag color="green">Published</Tag>
      : <Tag color="orange">Draft</Tag>;
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
          {String(record.status || '').toUpperCase() !== 'PUBLISHED' && (
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
            <Col xs={24} sm={12} md={6}>
              <Select placeholder="Academic Term" value={filters.academic_term_id} onChange={(value) => setFilters({ ...filters, academic_term_id: value })} size="large" style={{ width: '100%' }} allowClear>
                {academicTerms.map(t => <Option key={t.id} value={t.id}>{t.term_name}</Option>)}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select placeholder="Class Section" value={filters.class_section_id} onChange={(value) => setFilters({ ...filters, class_section_id: value })} size="large" style={{ width: '100%' }} allowClear>
                {classSections.map(cs => <Option key={cs.id} value={cs.id}>{classSectionLabel(cs)}</Option>)}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select placeholder="Report Type" value={filters.report_type} onChange={(value) => setFilters({ ...filters, report_type: value })} size="large" style={{ width: '100%' }} allowClear>
                <Option value="TERM">TERM</Option>
                <Option value="ANNUAL">ANNUAL</Option>
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
          <Form.Item name="academic_term_id" label="Academic Term">
            <Select placeholder="Select academic term (optional)" size="large" allowClear>
              {academicTerms.map(t => <Option key={t.id} value={t.id}>{t.term_name}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="class_section_id" label="Class Section">
            <Select placeholder="Select class section (optional)" size="large" allowClear>
              {classSections.map(cs => <Option key={cs.id} value={cs.id}>{classSectionLabel(cs)}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="report_type" label="Report Type" initialValue="TERM">
            <Select size="large">
              <Option value="TERM">TERM</Option>
              <Option value="ANNUAL">ANNUAL</Option>
            </Select>
          </Form.Item>
          <Form.Item name="student_ids" label="Student IDs (optional, comma separated)">
            <Input placeholder="e.g. S2,S3" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}