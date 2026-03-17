import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  Input,
  Button,
  Space,
  Popconfirm,
  message,
  Avatar,
  Tag,
  Row,
  Col,
  Card,
  Select,
  Modal,
  Upload,
} from 'antd';
import {
  SearchOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
  EyeOutlined,
  EditOutlined,
  CloudUploadOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { getTeachers, deleteTeacher, bulkUploadTeachers } from '../../../../../services/teacherService';
import './teacher.css';

const { Option } = Select;

export default function TeacherList() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bulkModal, setBulkModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    department: '',
    designation: '',
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await getTeachers(filters);
      setTeachers(response.data);
    } catch (error) {
      message.error('Failed to fetch teachers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTeacher(id);
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
    const csvContent = 'full_name,email,phone_number,designation,department,employment_type,date_of_joining,address,is_active\n' +
                       'John Doe,john@example.com,1234567890,Teacher,Mathematics,Permanent,2024-01-01,123 Main St,true';
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

  const columns = [
    {
      title: 'Teacher ID',
      dataIndex: 'id',
      key: 'id',
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
      dataIndex: 'email',
      key: 'email',
      width: 220,
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      width: 150,
      render: (text) => <Tag color="purple">{text || 'N/A'}</Tag>,
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
      dataIndex: 'is_active',
      key: 'is_active',
      width: 100,
      render: (text) => (
        <Tag color={text ? 'green' : 'red'}>{text ? 'Active' : 'Inactive'}</Tag>
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
            onClick={() => navigate(`/admin/onboarding/teachers/${record.id}`)}
            className="action-btn view-btn"
          />
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/onboarding/teachers/${record.id}/edit`)}
            className="action-btn edit-btn"
          />
          <Popconfirm
            title="Delete this teacher?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="link"
              icon={<DeleteOutlined />}
              className="action-btn delete-btn"
              danger
            />
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
          <Button
            icon={<CloudUploadOutlined />}
            size="large"
            onClick={() => setBulkModal(true)}
          >
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
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={5}>
            <Input
              placeholder="Search by name"
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              size="large"
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={5}>
            <Select
              placeholder="Department"
              value={filters.department || undefined}
              onChange={(value) => setFilters({ ...filters, department: value })}
              size="large"
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="Mathematics">Mathematics</Option>
              <Option value="English">English</Option>
              <Option value="Science">Science</Option>
              <Option value="Physics">Physics</Option>
              <Option value="Chemistry">Chemistry</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={5}>
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
          <Col xs={24} sm={12} md={4}>
            <Space>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={fetchTeachers}
                size="large"
              >
                Search
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  setFilters({ name: '', department: '', designation: '' });
                  setTimeout(fetchTeachers, 100);
                }}
                size="large"
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
          rowKey="id"
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
            <p className="ant-upload-drag-icon">
              <CloudUploadOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to upload</p>
            <p className="ant-upload-hint">Supports: .xlsx, .xls, .csv</p>
          </Upload.Dragger>
        </Space>
      </Modal>
    </div>
  );
}