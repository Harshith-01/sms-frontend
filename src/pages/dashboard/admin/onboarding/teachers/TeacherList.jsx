import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table, Input, Button, Space, Popconfirm, message, Avatar,
  Tag, Row, Col, Card, Select, Modal, Upload,
} from 'antd';
import {
  SearchOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined,
  EyeOutlined, EditOutlined, CloudUploadOutlined, DownloadOutlined,
} from '@ant-design/icons';
import { getTeachers, deleteTeacher, bulkUploadTeachers } from '../../../../../services/teacherService';
import { getDepartments } from '../../../../../services/academicService';
import './teacher.css';

const { Option } = Select;

const toArray = (res) => {
  const d = res?.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.items)) return d.items;
  if (Array.isArray(d?.results)) return d.results;
  if (Array.isArray(d?.data)) return d.data;
  return [];
};

export default function TeacherList() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bulkModal, setBulkModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filters, setFilters] = useState({
    full_name: '',
    department_id: '',
    designation: '',
  });

  useEffect(() => {
    fetchTeachers();
    fetchDepartments();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '' && value !== null)
      );
      const response = await getTeachers(cleanFilters);
      setTeachers(toArray(response));
    } catch (error) {
      message.error('Failed to fetch teachers');
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await getDepartments();
      setDepartments(toArray(response));
    } catch (error) {
      console.error('Failed to fetch departments', error);
    }
  };

  const handleDelete = async (teacher_id) => {
    try {
      await deleteTeacher(teacher_id);
      message.success('Teacher deleted successfully');
      fetchTeachers();
    } catch (error) {
      message.error('Failed to delete teacher');
    }
  };

  const handleBulkUpload = async ({ file }) => {
    setUploading(true);
    try {
      const response = await bulkUploadTeachers(file);
      message.success(`Uploaded: ${response.data.success_count} teachers`);
      setBulkModal(false);
      fetchTeachers();
    } catch (error) {
      message.error(error.response?.data?.detail || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = 'full_name,email_id,contact_number,designation,department_id,employment_type,date_of_joining,communication_address\n' +
                       'John Doe,john@example.com,1234567890,Teacher,1,Permanent,2024-01-01,123 Main St';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'teacher_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Resolve department_id → name from academic service departments
  const getDeptName = (dept_id) => departments.find(d => d.id === dept_id)?.name || dept_id || 'N/A';

  const columns = [
    {
      title: 'Teacher ID',
      dataIndex: 'teacher_id',
      key: 'teacher_id',
      width: 120,
      render: (text) => <span className="teacher-id">#{text}</span>,
    },
    {
      title: 'Photo',
      dataIndex: 'photo_url',
      key: 'photo_url',
      width: 80,
      render: (photo, record) => (
        <Avatar
          size={44}
          src={photo || `https://ui-avatars.com/api/?name=${record.full_name}&background=667eea&color=fff`}
        />
      ),
    },
    {
      title: 'Full Name',
      dataIndex: 'full_name',
      key: 'full_name',
      width: 200,
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Email',
      dataIndex: 'email_id',
      key: 'email_id',
      width: 220,
    },
    {
      title: 'Department',
      dataIndex: 'department_id',
      key: 'department_id',
      width: 150,
      render: (dept_id) => <Tag color="purple">{getDeptName(dept_id)}</Tag>,
    },
    {
      title: 'Designation',
      dataIndex: 'designation',
      key: 'designation',
      width: 150,
      render: (text) => <Tag color="blue">{text || 'N/A'}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text) => (
        <Tag color={text === 'ACTIVE' ? 'green' : 'red'}>{text === 'ACTIVE' ? 'Active' : 'Inactive'}</Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/onboarding/teachers/${record.teacher_id}`)}
            className="action-btn view-btn"
          />
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/onboarding/teachers/${record.teacher_id}/edit`)}
            className="action-btn edit-btn"
          />
          <Popconfirm
            title="Delete this teacher?"
            onConfirm={() => handleDelete(record.teacher_id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" icon={<DeleteOutlined />} className="action-btn delete-btn" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="teacher-list-container">
      <div className="list-header">
        <div>
          <h1 className="page-title">Teacher Management</h1>
          <p className="page-subtitle">Manage all teachers</p>
        </div>
        <Space>
          <Button icon={<CloudUploadOutlined />} size="large" onClick={() => setBulkModal(true)}>
            Bulk Upload
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => navigate('/admin/onboarding/teachers/add')}
          >
            Add Teacher
          </Button>
        </Space>
      </div>

      <Card className="filter-card">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Search by name"
              value={filters.full_name}
              onChange={(e) => setFilters({ ...filters, full_name: e.target.value })}
              size="large"
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            {/* Department options loaded from academic service */}
            <Select
              placeholder="Department"
              value={filters.department_id || undefined}
              onChange={(value) => setFilters({ ...filters, department_id: value })}
              size="large"
              allowClear
              style={{ width: '100%' }}
            >
              {departments.map(d => (
                <Option key={d.id} value={d.id}>{d.name}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Designation"
              value={filters.designation || undefined}
              onChange={(value) => setFilters({ ...filters, designation: value })}
              size="large"
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="Teacher">Teacher</Option>
              <Option value="Senior Teacher">Senior Teacher</Option>
              <Option value="Head of Department">Head of Department</Option>
              <Option value="Principal">Principal</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Space style={{ width: '100%' }}>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={fetchTeachers}
                size="large"
                style={{ flex: 1 }}
              >
                Search
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  setFilters({ full_name: '', department_id: '', designation: '' });
                  setTimeout(fetchTeachers, 100);
                }}
                size="large"
                style={{ flex: 1 }}
              >
                Reset
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card className="table-card">
        <Table
          columns={columns}
          dataSource={teachers}
          rowKey="teacher_id"
          loading={loading}
          scroll={{ x: 1400 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} teachers`,
          }}
        />
      </Card>

      <Modal
        title="Bulk Upload Teachers"
        open={bulkModal}
        onCancel={() => setBulkModal(false)}
        footer={null}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Button icon={<DownloadOutlined />} block onClick={downloadTemplate}>
            Download Template
          </Button>
          <Upload.Dragger
            accept=".xlsx,.xls,.csv"
            customRequest={handleBulkUpload}
            showUploadList={false}
          >
            <p className="ant-upload-drag-icon"><CloudUploadOutlined /></p>
            <p className="ant-upload-text">Click or drag file to upload</p>
            <p className="ant-upload-hint">Supports: .xlsx, .xls, .csv</p>
          </Upload.Dragger>
        </Space>
      </Modal>
    </div>
  );
}