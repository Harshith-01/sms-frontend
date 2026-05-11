import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  Input,
  Button,
  Space,
  Popconfirm,
  message,
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
import { getStudents, deleteStudent, bulkUploadStudents } from '../../../../../services/studentService';
import './Student.css';

const { Option } = Select;

export default function StudentList() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bulkModal, setBulkModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [filters, setFilters] = useState({
    full_name: '',
    admission_number: '',
    class_id: '',
    section_id: '',
    academic_year: '',
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '' && value !== null)
      );

      const response = await getStudents(cleanFilters);

      setStudents(response.data?.results || response.data || []);
    } catch (error) {
      message.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (student_id) => {
    try {
      await deleteStudent(student_id);
      message.success('Student deleted successfully');
      fetchStudents();
    } catch (error) {
      message.error('Failed to delete student');
    }
  };

  const handleBulkUpload = async ({ file }) => {
    setUploading(true);
    try {
      const response = await bulkUploadStudents(file);
      message.success(`Uploaded: ${response.data.success_count} students`);
      setBulkModal(false);
      fetchStudents();
    } catch (error) {
      message.error(error.response?.data?.detail || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent =
      'admission_number,full_name,email,contact_number,parent_contact\n' +
      'ADM001,John Doe,john@example.com,9876543210,9876543211';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'student_bulk_upload_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    {
      title: 'Student ID',
      dataIndex: 'student_id',
      key: 'student_id',
      width: 120,
      render: (text) => <span className="student-id">#{text}</span>,
    },
    {
      title: 'Admission No',
      dataIndex: 'admission_number',
      key: 'admission_number',
      width: 140,
    },
    {
      title: 'Full Name',
      dataIndex: 'full_name',
      key: 'full_name',
      width: 200,
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Class',
      dataIndex: 'class_id',
      key: 'class_id',
      width: 100,
    },
    {
      title: 'Section',
      dataIndex: 'section_id',
      key: 'section_id',
      width: 100,
    },
    {
      title: 'Academic Year',
      dataIndex: 'academic_year',
      key: 'academic_year',
      width: 140,
    },
    {
      title: 'Status',
      dataIndex: 'academic_status',
      key: 'academic_status',
      width: 120,
      render: (text) => (
        <Tag color={text === 'Active' ? 'green' : 'red'}>
          {text || 'N/A'}
        </Tag>
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
            onClick={() =>
              navigate(`/admin/onboarding/students/${record.student_id}`)
            }
          />
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() =>
              navigate(`/admin/onboarding/students/${record.student_id}/edit`)
            }
          />
          <Popconfirm
            title="Delete this student?"
            onConfirm={() => handleDelete(record.student_id)}
          >
            <Button type="link" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="student-list-container">
      <div className="list-header">
        <div>
          <h1 className="page-title">Student Management</h1>
          <p className="page-subtitle">Manage all students</p>
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
            onClick={() =>
              navigate('/admin/onboarding/students/add')
            }
          >
            Add Student
          </Button>
        </Space>
      </div>

      <Card className="filter-card">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Search by name"
              value={filters.full_name}
              onChange={(e) =>
                setFilters({ ...filters, full_name: e.target.value })
              }
              size="large"
              allowClear
            />
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Admission Number"
              value={filters.admission_number}
              onChange={(e) =>
                setFilters({ ...filters, admission_number: e.target.value })
              }
              size="large"
              allowClear
            />
          </Col>

          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Class"
              value={filters.class_id || undefined}
              onChange={(value) =>
                setFilters({ ...filters, class_id: value })
              }
              size="large"
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="1">Class 1</Option>
              <Option value="2">Class 2</Option>
            </Select>
          </Col>

          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Section"
              value={filters.section_id || undefined}
              onChange={(value) =>
                setFilters({ ...filters, section_id: value })
              }
              size="large"
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="A">A</Option>
              <Option value="B">B</Option>
            </Select>
          </Col>

          <Col xs={24} sm={12} md={4}>
            <Space>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={fetchStudents}
              >
                Search
              </Button>

              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  setFilters({
                    full_name: '',
                    admission_number: '',
                    class_id: '',
                    section_id: '',
                    academic_year: '',
                  });
                  setTimeout(fetchStudents, 100);
                }}
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
          dataSource={students}
          rowKey="student_id"
          loading={loading}
        />
      </Card>

      <Modal
        title="Bulk Upload Students"
        open={bulkModal}
        onCancel={() => setBulkModal(false)}
        footer={null}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button onClick={downloadTemplate}>
            Download Template
          </Button>

          <Upload.Dragger
            customRequest={handleBulkUpload}
            showUploadList={false}
          >
            <p>Upload Excel file</p>
          </Upload.Dragger>
        </Space>
      </Modal>
    </div>
  );
}