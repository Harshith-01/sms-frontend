import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Tabs,
  Card,
  Button,
  Space,
  Spin,
  message,
  Form,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Avatar,
  Divider,
  Empty,
  Radio,
} from 'antd';
import { EditOutlined, SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { getTeacherById, createTeacher, updateTeacher } from '../../services/api';
import dayjs from 'dayjs';
import './Form.css';

const { Option } = Select;
const { TextArea } = Input;

export default function TeacherForm({ mode = 'view' }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [saving, setSaving] = useState(false);

  const isAddMode = mode === 'add';
  const isEditMode = mode === 'edit';
  const isViewMode = mode === 'view';

  useEffect(() => {
    if (isAddMode) {
      setLoading(false);
    } else if (id) {
      fetchTeacher();
    } else {
      const userId = localStorage.getItem('userId');
      if (userId) fetchTeacher(userId);
    }
  }, [id, mode]);

  const fetchTeacher = async (teacherId) => {
    setLoading(true);
    try {
      const response = await getTeacherById(teacherId || id);
      setTeacher(response.data);
      form.setFieldsValue({
        ...response.data,
        date_of_joining: response.data.date_of_joining ? dayjs(response.data.date_of_joining) : null,
      });
    } catch (error) {
      message.error('Failed to fetch teacher details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values) => {
    setSaving(true);
    try {
      const data = {
        ...values,
        date_of_joining: values.date_of_joining ? dayjs(values.date_of_joining).format('YYYY-MM-DD') : null,
      };

      if (isAddMode) {
        await createTeacher(data);
        message.success('Teacher added successfully');
        navigate('/admin/onboarding/teachers');
      } else if (isEditMode) {
        await updateTeacher(id, data);
        message.success('Teacher updated successfully');
        navigate(`/admin/onboarding/teachers/${id}`);
      }
    } catch (error) {
      message.error(isAddMode ? 'Failed to add teacher' : 'Failed to update teacher');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (isAddMode || isEditMode) {
      navigate('/admin/onboarding/teachers');
    } else {
      const userRole = localStorage.getItem('userRole');
      navigate(userRole === 'TEACHER' ? '/teacher/dashboard' : '/admin/onboarding/teachers');
    }
  };

  if (loading) {
    return (
      <div className="form-loading">
        <Spin size="large" />
      </div>
    );
  }

  const tabItems = [
    {
      key: '1',
      label: 'Teacher Details',
      children: (
        <Card className="tab-card" bordered={false}>
          <div className="card-header">
            <h2 className="card-title">
              {isAddMode ? 'Add New Teacher' : 'Teacher Information'}
            </h2>
            {isEditMode && (
              <Space size="middle">
                <Button onClick={handleBack} size="large">Cancel</Button>
                <Button type="primary" icon={<SaveOutlined />} onClick={() => form.submit()} loading={saving} size="large">
                  Save Changes
                </Button>
              </Space>
            )}
          </div>
          <Divider />
          <Form form={form} layout="vertical" onFinish={handleSave} disabled={isViewMode}>
            <div className="form-layout">
              {!isAddMode && (
                <div className="photo-section">
                  <Avatar
                    size={180}
                    src={teacher?.photo_url || `https://ui-avatars.com/api/?name=${teacher?.full_name || 'Teacher'}&background=667eea&color=fff&size=180&bold=true`}
                    className="form-avatar"
                  />
                </div>
              )}
              <div className="info-section">
                <Row gutter={[32, 24]}>
                  {!isAddMode && teacher && (
                    <Col xs={24} sm={12} lg={8}>
                      <div className="field-group">
                        <label className="field-label">Teacher ID</label>
                        <div className="field-value static">{teacher.id}</div>
                      </div>
                    </Col>
                  )}
                  <Col xs={24} sm={12} lg={8}>
                    <div className="field-group">
                      <label className="field-label">Full Name</label>
                      {isViewMode ? (
                        <div className="field-value">{teacher?.full_name}</div>
                      ) : (
                        <Form.Item name="full_name" noStyle rules={[{ required: true, message: 'Required' }]}>
                          <Input className="field-input" placeholder="Enter full name" />
                        </Form.Item>
                      )}
                    </div>
                  </Col>
                  <Col xs={24} sm={12} lg={8}>
                    <div className="field-group">
                      <label className="field-label">Email</label>
                      {isViewMode ? (
                        <div className="field-value">{teacher?.email}</div>
                      ) : (
                        <Form.Item name="email" noStyle rules={[{ required: true, type: 'email', message: 'Valid email required' }]}>
                          <Input className="field-input" placeholder="Enter email" />
                        </Form.Item>
                      )}
                    </div>
                  </Col>
                  <Col xs={24} sm={12} lg={8}>
                    <div className="field-group">
                      <label className="field-label">Contact Number</label>
                      {isViewMode ? (
                        <div className="field-value">{teacher?.phone_number || '—'}</div>
                      ) : (
                        <Form.Item name="phone_number" noStyle>
                          <Input className="field-input" placeholder="Enter contact number" />
                        </Form.Item>
                      )}
                    </div>
                  </Col>
                  <Col xs={24} sm={12} lg={8}>
                    <div className="field-group">
                      <label className="field-label">Designation</label>
                      {isViewMode ? (
                        <div className="field-value"><span className="badge badge-blue">{teacher?.designation || '—'}</span></div>
                      ) : (
                        <Form.Item name="designation" noStyle>
                          <Select className="field-input" placeholder="Select designation">
                            <Option value="Teacher">Teacher</Option>
                            <Option value="Senior Teacher">Senior Teacher</Option>
                            <Option value="Head of Department">Head of Department</Option>
                            <Option value="Principal">Principal</Option>
                          </Select>
                        </Form.Item>
                      )}
                    </div>
                  </Col>
                  <Col xs={24} sm={12} lg={8}>
                    <div className="field-group">
                      <label className="field-label">Department</label>
                      {isViewMode ? (
                        <div className="field-value"><span className="badge badge-purple">{teacher?.department || '—'}</span></div>
                      ) : (
                        <Form.Item name="department" noStyle>
                          <Select className="field-input" placeholder="Select department">
                            <Option value="Mathematics">Mathematics</Option>
                            <Option value="English">English</Option>
                            <Option value="Science">Science</Option>
                            <Option value="Physics">Physics</Option>
                            <Option value="Chemistry">Chemistry</Option>
                          </Select>
                        </Form.Item>
                      )}
                    </div>
                  </Col>
                  <Col xs={24} sm={12} lg={8}>
                    <div className="field-group">
                      <label className="field-label">Employment Type</label>
                      {isViewMode ? (
                        <div className="field-value"><span className={`badge ${teacher?.employment_type === 'Permanent' ? 'badge-green' : 'badge-orange'}`}>{teacher?.employment_type || '—'}</span></div>
                      ) : (
                        <Form.Item name="employment_type" noStyle>
                          <Radio.Group>
                            <Radio value="Permanent">Permanent</Radio>
                            <Radio value="Contract">Contract</Radio>
                          </Radio.Group>
                        </Form.Item>
                      )}
                    </div>
                  </Col>
                  <Col xs={24} sm={12} lg={8}>
                    <div className="field-group">
                      <label className="field-label">Date of Joining</label>
                      {isViewMode ? (
                        <div className="field-value">{teacher?.date_of_joining ? dayjs(teacher.date_of_joining).format('DD/MM/YYYY') : '—'}</div>
                      ) : (
                        <Form.Item name="date_of_joining" noStyle>
                          <DatePicker format="DD/MM/YYYY" className="field-input" style={{ width: '100%' }} />
                        </Form.Item>
                      )}
                    </div>
                  </Col>
                  {!isAddMode && (
                    <Col xs={24} sm={12} lg={8}>
                      <div className="field-group">
                        <label className="field-label">Status</label>
                        {isViewMode ? (
                          <div className="field-value"><span className={`badge ${teacher?.is_active ? 'badge-success' : 'badge-error'}`}>{teacher?.is_active ? 'Active' : 'Inactive'}</span></div>
                        ) : (
                          <Form.Item name="is_active" noStyle>
                            <Select className="field-input">
                              <Option value={true}>Active</Option>
                              <Option value={false}>Inactive</Option>
                            </Select>
                          </Form.Item>
                        )}
                      </div>
                    </Col>
                  )}
                  <Col span={24}>
                    <div className="field-group">
                      <label className="field-label">Communication Address</label>
                      {isViewMode ? (
                        <div className="field-value">{teacher?.address || '—'}</div>
                      ) : (
                        <Form.Item name="address" noStyle>
                          <TextArea rows={2} className="field-input" placeholder="Enter address" />
                        </Form.Item>
                      )}
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
            {isAddMode && (
              <Row gutter={16} style={{ marginTop: 32 }}>
                <Col>
                  <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large" loading={saving}>
                    Add Teacher
                  </Button>
                </Col>
                <Col>
                  <Button onClick={() => form.resetFields()} size="large">Reset</Button>
                </Col>
                <Col>
                  <Button onClick={handleBack} size="large">Cancel</Button>
                </Col>
              </Row>
            )}
          </Form>
        </Card>
      ),
    },
    {
      key: '2',
      label: 'Qualifications',
      children: (
        <Card className="tab-card" bordered={false}>
          <div className="empty-state">
            <Empty description="Qualifications data not available" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        </Card>
      ),
    },
    {
      key: '3',
      label: 'Academic Details',
      children: (
        <Card className="tab-card" bordered={false}>
          <div className="empty-state">
            <Empty description="Academic details not available" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        </Card>
      ),
    },
  ];

  return (
    <div className="form-container">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">
            {isAddMode ? 'Add New Teacher' : isEditMode ? 'Edit Teacher' : 'Teacher Management'}
          </h1>
          <p className="page-description">
            {isAddMode ? 'Fill in teacher information' : isEditMode ? 'Update teacher information' : 'View teacher information'}
          </p>
        </div>
        <Button icon={<ArrowLeftOutlined />} onClick={handleBack} size="large" className="back-btn">
          Back
        </Button>
      </div>
      <div className="page-content">
        {isAddMode ? (
          tabItems[0].children
        ) : (
          <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} size="large" className="form-tabs" />
        )}
      </div>
    </div>
  );
}