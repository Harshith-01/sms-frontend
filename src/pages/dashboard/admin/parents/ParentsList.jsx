import { useState, useEffect } from 'react';
import { Table, Button, Input, Space, Tag, Popconfirm, message, Card, Select, Row, Col } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  LinkOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getParents, deactivateParent } from '../../../../services/parentService';
import './Parents.css';

const { Search } = Input;
const { Option } = Select;

const toArray = (res) => {
  const d = res?.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.items)) return d.items;
  if (Array.isArray(d?.results)) return d.results;
  if (Array.isArray(d?.data)) return d.data;
  return [];
};

export default function ParentsList() {
  const navigate = useNavigate();
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  useEffect(() => {
    fetchParents();
  }, [pagination.current, filterStatus]);

  const fetchParents = async () => {
    try {
      setLoading(true);
      const offset = (pagination.current - 1) * pagination.pageSize;
      const params = {
        limit: pagination.pageSize,
        offset,
      };
      // Only send is_active if a specific filter is chosen (not null = all)
      if (filterStatus !== null) {
        params.is_active = filterStatus;
      }
      const response = await getParents(params);
      const data = toArray(response);
      setParents(data);
      setPagination(prev => ({ ...prev, total: response.data?.total || data.length }));
    } catch (error) {
      message.error(error.response?.data?.detail || 'Failed to load parents');
      setParents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (parent_id) => {
    try {
      await deactivateParent(parent_id);
      message.success('Parent deactivated successfully');
      fetchParents();
    } catch (error) {
      message.error(error.response?.data?.detail || 'Failed to deactivate parent');
    }
  };

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  const filteredParents = parents.filter(parent => {
    if (!searchText) return true;
    const searchLower = searchText.toLowerCase();
    return (
      parent.id?.toLowerCase().includes(searchLower) ||
      parent.father_name?.toLowerCase().includes(searchLower) ||
      parent.mother_name?.toLowerCase().includes(searchLower) ||
      parent.guardian_name?.toLowerCase().includes(searchLower) ||
      parent.email?.toLowerCase().includes(searchLower) ||
      parent.primary_contact?.includes(searchText)
    );
  });

  const columns = [
    {
      title: 'Parent ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (id) => <Tag color="blue">{id}</Tag>,
    },
    {
      title: 'Name',
      key: 'name',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          {record.father_name && (
            <div>
              <UserOutlined style={{ marginRight: 8, color: '#1890ff' }} />
              <strong>Father:</strong> {record.father_name}
            </div>
          )}
          {record.mother_name && (
            <div>
              <UserOutlined style={{ marginRight: 8, color: '#ff1493' }} />
              <strong>Mother:</strong> {record.mother_name}
            </div>
          )}
          {record.guardian_name && (
            <div>
              <UserOutlined style={{ marginRight: 8, color: '#52c41a' }} />
              <strong>Guardian:</strong> {record.guardian_name}
            </div>
          )}
        </Space>
      ),
    },
    {
      title: 'Primary Contact',
      dataIndex: 'primary_contact',
      key: 'primary_contact',
      width: 150,
      render: (phone) => (
        <Space>
          <PhoneOutlined />
          {phone}
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      render: (email) => (
        <Space>
          <MailOutlined />
          {email}
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      width: 100,
      render: (isActive) => (
        <Tag color={isActive ? 'success' : 'default'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/parents/${record.id}`)}
          >
            View
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/parents/${record.id}?mode=edit`)}
          >
            Edit
          </Button>
          <Button
            type="link"
            icon={<LinkOutlined />}
            onClick={() => navigate(`/admin/parents/${record.id}?tab=students`)}
          >
            Link
          </Button>
          {record.is_active && (
            <Popconfirm
              title="Deactivate Parent"
              description="Are you sure you want to deactivate this parent?"
              onConfirm={() => handleDeactivate(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger icon={<DeleteOutlined />}>
                Deactivate
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="parents-list-container">
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <h2 style={{ margin: 0 }}>Parents Management</h2>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/admin/parents/add')}
              size="large"
            >
              Add New Parent
            </Button>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Search by name, email, phone, or ID"
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              style={{ width: '100%' }}
              size="large"
              value={filterStatus}
              onChange={setFilterStatus}
              placeholder="Filter by status"
            >
              <Option value={null}>All Parents</Option>
              <Option value={true}>Active Only</Option>
              <Option value={false}>Inactive Only</Option>
            </Select>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredParents}
          rowKey="id"
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
}