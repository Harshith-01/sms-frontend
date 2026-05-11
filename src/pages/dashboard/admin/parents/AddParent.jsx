import { useState } from 'react';
import { Form, Input, Button, Card, Row, Col, message, Divider } from 'antd';
import { SaveOutlined, ArrowLeftOutlined, UserOutlined, PhoneOutlined, MailOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { createParent } from '../../../../services/parentService';
import './Parents.css';

const { TextArea } = Input;

export default function AddParent() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      // Explicit payload — DTO has extra="forbid", only send allowed fields
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
      await createParent(payload);
      message.success('Parent created successfully');
      navigate('/admin/parents');
    } catch (error) {
      const detail = error.response?.data?.detail;
      if (Array.isArray(detail)) {
        detail.forEach(e => message.error(`${e.loc?.slice(1).join('.')} — ${e.msg}`));
      } else {
        message.error(typeof detail === 'string' ? detail : 'Failed to create parent');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-parent-container">
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <h2 style={{ margin: 0 }}>Add New Parent</h2>
          </Col>
          <Col>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/parents')}>
              Back to List
            </Button>
          </Col>
        </Row>

        <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
          <Divider orientation="left">Personal Information</Divider>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item name="father_name" label="Father's Name">
                <Input prefix={<UserOutlined />} placeholder="Enter father's name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="mother_name" label="Mother's Name">
                <Input prefix={<UserOutlined />} placeholder="Enter mother's name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="guardian_name" label="Guardian's Name">
                <Input prefix={<UserOutlined />} placeholder="Enter guardian's name" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Contact Information</Divider>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="primary_contact"
                label="Primary Contact"
                rules={[
                  { required: true, message: 'Primary contact is required' },
                  { pattern: /^[0-9]{10}$/, message: 'Enter valid 10-digit phone number' }
                ]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="10-digit phone number" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="secondary_contact"
                label="Secondary Contact"
                rules={[{ pattern: /^[0-9]{10}$/, message: 'Enter valid 10-digit phone number' }]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="10-digit phone number" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="guardian_contact"
                label="Guardian Contact"
                rules={[{ pattern: /^[0-9]{10}$/, message: 'Enter valid 10-digit phone number' }]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="10-digit phone number" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="email"
                label="Email (Login Credentials)"
                rules={[
                  { required: true, message: 'Email is required' },
                  { type: 'email', message: 'Enter valid email address' }
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="parent@example.com" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="guardian_email"
                label="Guardian Email"
                rules={[{ type: 'email', message: 'Enter valid email address' }]}
              >
                <Input prefix={<MailOutlined />} placeholder="guardian@example.com" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Address Information</Divider>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="address" label="Current Address">
                <TextArea rows={3} placeholder="Enter current residential address" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="permanent_address" label="Permanent Address">
                <TextArea rows={3} placeholder="Enter permanent address" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Other Information</Divider>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="occupation" label="Occupation">
                <Input placeholder="Enter occupation" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="annual_income" label="Annual Income">
                <Input placeholder="e.g., 500000-1000000" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: 24 }}>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading} size="large">
              Create Parent
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={() => navigate('/admin/parents')} size="large">
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}