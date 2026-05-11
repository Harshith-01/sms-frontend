import { useState, useEffect } from 'react';
import { Card, Table, Button, Input, Select, Tag, Space, Popconfirm, message } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getStaff, deactivateStaff, getDesignations, toArray } from '../../../../services/staffService';
import { getDepartments } from '../../../../services/academicService';
import './Staff.css';

const { Option } = Select;

export default function StaffList() {
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    designation_id: null,
    department_id: null,
    status: 'ACTIVE'
  });

  useEffect(() => {
    fetchDesignations();
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchStaffList();
  }, [filters]);

  const fetchStaffList = async () => {
    try {
      setLoading(true);
      const response = await getStaff({
        ...filters,
        full_name: searchText || null,
        limit: 50,
      });
      setStaff(toArray(response));
    } catch (error) {
      message.error('Failed to load staff');
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDesignations = async () => {
    try {
      const response = await getDesignations();
      const d = response.data;
      setDesignations(Array.isArray(d) ? d : d?.items || d?.results || []);
    } catch (error) {
      console.error('Failed to load designations');
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await getDepartments();
      const d = response.data;
      setDepartments(Array.isArray(d) ? d : d?.items || d?.results || []);
    } catch (error) {
      console.error('Failed to load departments');
    }
  };

  const handleDeactivate = async (staff_id) => {
    try {
      await deactivateStaff(staff_id);
      message.success('Staff member deactivated successfully');
      fetchStaffList();
    } catch (error) {
      message.error('Failed to deactivate staff member');
    }
  };

  const handleSearch = () => {
    fetchStaffList();
  };

  const getStatusColor = (status) => {
    const colors = { ACTIVE: 'success', INACTIVE: 'default', ON_LEAVE: 'warning', TERMINATED: 'error' };
    return colors[status] || 'default';
  };

  const getEmploymentTypeColor = (type) => {
    const colors = { FULL_TIME: 'blue', PART_TIME: 'cyan', CONTRACT: 'purple', DAILY_WAGE: 'orange' };
    return colors[type] || 'default';
  };

  const getDesignationName = (id) => {
    const designation = designations.find(d => d.id === id);
    return designation ? designation.title : 'N/A';
  };

  const getDepartmentName = (id) => {
    const department = departments.find(d => d.id === id);
    return department ? department.name : 'N/A';
  };

  const columns = [
    {
      title: 'Staff ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <Tag color="blue">{id}</Tag>
    },
    {
      title: 'Name',
      dataIndex: 'full_name',
      key: 'full_name',
      sorter: (a, b) => a.full_name.localeCompare(b.full_name)
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Designation',
      dataIndex: 'designation_id',
      key: 'designation_id',
      render: (id) => getDesignationName(id)
    },
    {
      title: 'Department',
      dataIndex: 'department_id',
      key: 'department_id',
      render: (id) => getDepartmentName(id)
    },
    {
      title: 'Employment Type',
      dataIndex: 'employment_type',
      key: 'employment_type',
      render: (type) => (
        <Tag color={getEmploymentTypeColor(type)}>
          {type?.replace('_', ' ')}
        </Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/staff/${record.id}`)}
          >
            View
          </Button>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/staff/${record.id}?mode=edit`)}
          >
            Edit
          </Button>
          {record.status === 'ACTIVE' && (
            <Popconfirm
              title="Deactivate Staff Member"
              description="Are you sure you want to deactivate this staff member?"
              onConfirm={() => handleDeactivate(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button size="small" danger icon={<DeleteOutlined />}>
                Deactivate
              </Button>
            </Popconfirm>
          )}
        </Space>
      )
    }
  ];

  return (
    <div className="staff-list-container">
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Staff Management</h2>
        <Space>
          <Button
            type="default"
            icon={<UploadOutlined />}
            onClick={() => navigate('/admin/staff/bulk-upload')}
          >
            Bulk Upload
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/admin/staff/add')}
          >
            Add New Staff
          </Button>
        </Space>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Input
              placeholder="Search by name..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
              style={{ width: 300 }}
              allowClear
            />

            <Select
              placeholder="Filter by Designation"
              style={{ width: 200 }}
              value={filters.designation_id}
              onChange={(value) => setFilters({ ...filters, designation_id: value })}
              allowClear
            >
              {designations.map(d => (
                <Option key={d.id} value={d.id}>{d.title}</Option>
              ))}
            </Select>

            <Select
              placeholder="Filter by Department"
              style={{ width: 200 }}
              value={filters.department_id}
              onChange={(value) => setFilters({ ...filters, department_id: value })}
              allowClear
            >
              {departments.map(d => (
                <Option key={d.id} value={d.id}>{d.name}</Option>
              ))}
            </Select>

            <Select
              placeholder="Filter by Status"
              style={{ width: 150 }}
              value={filters.status}
              onChange={(value) => setFilters({ ...filters, status: value })}
            >
              <Option value="ACTIVE">Active</Option>
              <Option value="INACTIVE">Inactive</Option>
              <Option value="ON_LEAVE">On Leave</Option>
              <Option value="TERMINATED">Terminated</Option>
              <Option value={null}>All</Option>
            </Select>

            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>
        </Space>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={staff}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 20, showSizeChanger: true, showTotal: (total) => `Total ${total} staff members` }}
        />
      </Card>
    </div>
  );
}