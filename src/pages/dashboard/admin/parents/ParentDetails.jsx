import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Descriptions, Button, Row, Col, Tabs, message, Form, Input, Table, Space, Popconfirm, Tag, Modal } from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  LinkOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import {
  getParentById,
  updateParent,
  getParentChildren,
  unlinkStudentFromParent
} from '../../../../services/parentService';
import LinkStudentModal from './LinkStudentModal';
import './Parents.css';

const { TextArea } = Input;

export default function ParentDetails() {
  const { id } = useParams(); // id = parent_id from URL
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();

  const [parent, setParent] = useState(null);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(searchParams.get('mode') === 'edit');
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') === 'students' ? '2' : '1');
  const [linkModalVisible, setLinkModalVisible] = useState(searchParams.get('tab') === 'students');

  useEffect(() => {
    if (!id) {
      message.error('Invalid parent ID');
      navigate('/admin/parents');
      return;
    }
    fetchParentDetails();
  }, [id]);

  useEffect(() => {
    if (activeTab === '2') {
      fetchChildren();
    }
  }, [activeTab]);

  const fetchParentDetails = async () => {
    try {
      setLoading(true);
      const response = await getParentById(id);
      setParent(response.data);
      form.setFieldsValue(response.data);
    } catch (error) {
      message.error(error.response?.data?.detail || 'Failed to load parent details');
      navigate('/admin/parents');
    } finally {
      setLoading(false);
    }
  };

  const fetchChildren = async () => {
    try {
      // Admin endpoint: GET /parents/{parent_id}/children
      const response = await getParentChildren(id);
      const data = response.data;
      setChildren(Array.isArray(data) ? data : data?.items || data?.results || []);
    } catch (error) {
      message.error('Failed to load linked students');
    }
  };

  const handleUpdate = async (values) => {
    try {
      setLoading(true);
      // Explicit payload — only fields allowed by PUT /parents/{parent_id} DTO
      const payload = {
        email: values.email,
        primary_contact: values.primary_contact,
        father_name: values.father_name || null,
        mother_name: values.mother_name || null,
        guardian_name: values.guardian_name || null,
        secondary_contact: values.secondary_contact || null,
        guardian_contact: values.guardian_contact || null,
        guardian_email: values.guardian_email || null,
        address: values.address || null,
        permanent_address: values.permanent_address || null,
        occupation: values.occupation || null,
        annual_income: values.annual_income || null,
      };
      await updateParent(id, payload);
      message.success('Parent updated successfully');
      setEditMode(false);
      fetchParentDetails();
    } catch (error) {
      const detail = error.response?.data?.detail;
      if (Array.isArray(detail)) {
        detail.forEach(e => message.error(`${e.loc?.slice(1).join('.')} — ${e.msg}`));
      } else {
        message.error(typeof detail === 'string' ? detail : 'Failed to update parent');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUnlink = async (student_id) => {
    try {
      await unlinkStudentFromParent(id, student_id);
      message.success('Student unlinked successfully');
      fetchChildren();
    } catch (error) {
      message.error(error.response?.data?.detail || 'Failed to unlink student');
    }
  };

  const childrenColumns = [
    {
      title: 'Student ID',
      dataIndex: 'student_id',
      key: 'student_id',
      render: (sid) => <Tag color="blue">{sid}</Tag>,
    },
    {
      title: 'Student Name',
      dataIndex: 'full_name',
      key: 'full_name',
    },
    {
      title: 'Relationship',
      dataIndex: 'relationship_type',
      key: 'relationship_type',
      render: (type) => <Tag color="purple">{type}</Tag>,
    },
    {
      title: 'Primary Contact',
      dataIndex: 'is_primary_contact',
      key: 'is_primary_contact',
      render: (isPrimary) => isPrimary
        ? <CheckCircleOutlined style={{ color: '#52c41a' }} />
        : <CloseCircleOutlined style={{ color: '#999' }} />,
    },
    {
      title: 'Permissions',
      key: 'permissions',
      render: (_, record) => (
        <Space wrap>
          {record.can_view_academics && <Tag color="green">Academics</Tag>}
          {record.can_view_attendance && <Tag color="blue">Attendance</Tag>}
          {record.can_view_timetable && <Tag color="orange">Timetable</Tag>}
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Popconfirm
          title="Unlink Student"
          description="Are you sure you want to unlink this student?"
          onConfirm={() => handleUnlink(record.student_id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" danger icon={<DeleteOutlined />}>
            Unlink
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const tabItems = [
    {
      key: '1',
      label: 'Parent Details',
      children: (
        <Card>
          {!editMode ? (
            <>
              <Row justify="end" style={{ marginBottom: 16 }}>
                <Button type="primary" icon={<EditOutlined />} onClick={() => setEditMode(true)}>
                  Edit Details
                </Button>
              </Row>
              <Descriptions bordered column={{ xs: 1, sm: 1, md: 2 }}>
                <Descriptions.Item label="Parent ID">{parent?.id}</Descriptions.Item>
                <Descriptions.Item label="Father's Name">{parent?.father_name || '-'}</Descriptions.Item>
                <Descriptions.Item label="Mother's Name">{parent?.mother_name || '-'}</Descriptions.Item>
                <Descriptions.Item label="Guardian's Name">{parent?.guardian_name || '-'}</Descriptions.Item>
                <Descriptions.Item label="Primary Contact">{parent?.primary_contact}</Descriptions.Item>
                <Descriptions.Item label="Secondary Contact">{parent?.secondary_contact || '-'}</Descriptions.Item>
                <Descriptions.Item label="Guardian Contact">{parent?.guardian_contact || '-'}</Descriptions.Item>
                <Descriptions.Item label="Email">{parent?.email}</Descriptions.Item>
                <Descriptions.Item label="Guardian Email">{parent?.guardian_email || '-'}</Descriptions.Item>
                <Descriptions.Item label="Occupation">{parent?.occupation || '-'}</Descriptions.Item>
                <Descriptions.Item label="Annual Income">{parent?.annual_income || '-'}</Descriptions.Item>
                <Descriptions.Item label="Current Address" span={2}>{parent?.address || '-'}</Descriptions.Item>
                <Descriptions.Item label="Permanent Address" span={2}>{parent?.permanent_address || '-'}</Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag color={parent?.is_active ? 'success' : 'default'}>
                    {parent?.is_active ? 'Active' : 'Inactive'}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </>
          ) : (
            <Form form={form} layout="vertical" onFinish={handleUpdate}>
              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item name="father_name" label="Father's Name">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name="mother_name" label="Mother's Name">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name="guardian_name" label="Guardian's Name">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item name="primary_contact" label="Primary Contact" rules={[{ required: true, message: 'Required' }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name="secondary_contact" label="Secondary Contact">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name="guardian_contact" label="Guardian Contact">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Required' }, { type: 'email' }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="guardian_email" label="Guardian Email" rules={[{ type: 'email' }]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item name="address" label="Current Address">
                    <TextArea rows={3} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="permanent_address" label="Permanent Address">
                    <TextArea rows={3} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item name="occupation" label="Occupation">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="annual_income" label="Annual Income">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                  Save Changes
                </Button>
                <Button style={{ marginLeft: 8 }} icon={<CloseOutlined />} onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
              </Form.Item>
            </Form>
          )}
        </Card>
      ),
    },
    {
      key: '2',
      label: 'Linked Students',
      children: (
        <Card>
          <Row justify="end" style={{ marginBottom: 16 }}>
            <Button type="primary" icon={<LinkOutlined />} onClick={() => setLinkModalVisible(true)}>
              Link New Student
            </Button>
          </Row>
          <Table
            columns={childrenColumns}
            dataSource={children}
            rowKey="student_id"
            pagination={false}
          />
        </Card>
      ),
    },
  ];

  return (
    <div className="parent-details-container">
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <h2 style={{ margin: 0 }}>Parent Details</h2>
          </Col>
          <Col>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/parents')}>
              Back to List
            </Button>
          </Col>
        </Row>

        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
      </Card>

      <LinkStudentModal
        visible={linkModalVisible}
        parentId={id}
        onClose={() => setLinkModalVisible(false)}
        onSuccess={() => {
          setLinkModalVisible(false);
          fetchChildren();
        }}
      />
    </div>
  );
}