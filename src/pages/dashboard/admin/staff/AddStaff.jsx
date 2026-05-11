import { useState, useEffect } from 'react';
import { Card, Form, Input, Select, DatePicker, Button, Row, Col, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { createStaff, getDesignations } from '../../../../services/staffService';
import { getDepartments } from '../../../../services/academicService';
import './Staff.css';

export default function AddStaff() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [designations, setDesignations] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchDesignations();
    fetchDepartments();
  }, []);

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

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      // Explicit payload — DTO has extra="forbid", only allowed fields
      const payload = {
        full_name: values.full_name,
        email: values.email,
        contact_number: values.contact_number || null,
        emergency_contact: values.emergency_contact || null,
        designation_id: values.designation_id ? Number(values.designation_id) : null,
        department_id: values.department_id ? Number(values.department_id) : null,
        address: values.address || null,
        date_of_joining: values.date_of_joining ? values.date_of_joining.format('YYYY-MM-DD') : null,
        employment_type: values.employment_type,
        date_of_birth: values.date_of_birth ? values.date_of_birth.format('YYYY-MM-DD') : null,
        gender: values.gender || null,
        aadhaar_number: values.aadhaar_number || null,
      };

      await createStaff(payload);
      message.success('Staff member created successfully');
      navigate('/admin/staff');
    } catch (error) {
      const detail = error.response?.data?.detail;
      if (Array.isArray(detail)) {
        detail.forEach(e => message.error(`${e.loc?.slice(1).join('.')} — ${e.msg}`));
      } else {
        message.error(typeof detail === 'string' ? detail : 'Failed to create staff member');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-staff-container">
      <h2>Add New Staff Member</h2>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            employment_type: 'FULL_TIME',
            gender: 'MALE'
          }}
        >
          {/* Personal Information */}
          <h3>Personal Information</h3>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="full_name"
                label="Full Name"
                rules={[{ required: true, message: 'Please enter full name' }]}
              >
                <Input placeholder="Enter full name" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please enter email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input placeholder="Enter email address" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="contact_number"
                label="Contact Number"
                rules={[
                  { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit number' }
                ]}
              >
                <Input placeholder="Enter contact number" maxLength={10} />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="emergency_contact"
                label="Emergency Contact"
                rules={[
                  { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit number' }
                ]}
              >
                <Input placeholder="Enter emergency contact" maxLength={10} />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="date_of_birth"
                label="Date of Birth"
              >
                <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="gender"
                label="Gender"
              >
                <Select>
                  <Select.Option value="MALE">Male</Select.Option>
                  <Select.Option value="FEMALE">Female</Select.Option>
                  <Select.Option value="OTHER">Other</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="aadhaar_number"
                label="Aadhaar Number"
                rules={[
                  { pattern: /^[0-9]{12}$/, message: 'Please enter a valid 12-digit Aadhaar number' }
                ]}
              >
                <Input placeholder="Enter Aadhaar number" maxLength={12} />
              </Form.Item>
            </Col>
          </Row>

          {/* Employment Information */}
          <h3 style={{ marginTop: 24 }}>Employment Information</h3>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="designation_id"
                label="Designation"
                rules={[{ required: true, message: 'Please select designation' }]}
              >
                <Select placeholder="Select designation">
                  {designations.map(d => (
                    <Select.Option key={d.id} value={d.id}>{d.title}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="department_id"
                label="Department"
              >
                <Select placeholder="Select department" allowClear>
                  {departments.map(d => (
                    <Select.Option key={d.id} value={d.id}>{d.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="employment_type"
                label="Employment Type"
                rules={[{ required: true, message: 'Please select employment type' }]}
              >
                <Select>
                  <Select.Option value="FULL_TIME">Full Time</Select.Option>
                  <Select.Option value="PART_TIME">Part Time</Select.Option>
                  <Select.Option value="CONTRACT">Contract</Select.Option>
                  <Select.Option value="DAILY_WAGE">Daily Wage</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="date_of_joining"
                label="Date of Joining"
                rules={[{ required: true, message: 'Please select date of joining' }]}
              >
                <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
              </Form.Item>
            </Col>
          </Row>

          {/* Address */}
          <h3 style={{ marginTop: 24 }}>Address</h3>
          <Form.Item
            name="address"
            label="Address"
          >
            <Input.TextArea rows={3} placeholder="Enter complete address" />
          </Form.Item>

          {/* Actions */}
          <Form.Item style={{ marginTop: 24 }}>
            <Button type="primary" htmlType="submit" loading={loading} size="large">
              Create Staff Member
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={() => navigate('/admin/staff')} size="large">
              Cancel
            </Button>
          </Form.Item>

          <div style={{ padding: 12, background: '#f0f2f5', borderRadius: 4, marginTop: 16 }}>
            <strong>Note:</strong>
            <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
              <li>A user account will be created automatically with the email address</li>
              <li>Default password will be the contact number or "Welcome@123"</li>
              <li>Staff member will be assigned the NON_TEACHING_STAFF role</li>
            </ul>
          </div>
        </Form>
      </Card>
    </div>
  );
}