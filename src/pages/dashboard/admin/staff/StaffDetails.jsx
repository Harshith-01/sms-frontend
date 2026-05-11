import { useState, useEffect } from 'react';
import { Card, Descriptions, Button, Form, Input, Select, DatePicker, message, Spin, Tag } from 'antd';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getStaffById, updateStaff, getDesignations } from '../../../../services/staffService';
import { getDepartments } from '../../../../services/academicService';
import { ArrowLeftOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import './Staff.css';

export default function StaffDetails() {
  const { id } = useParams(); // id = staff_id
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();

  const [staff, setStaff] = useState(null);
  const [designations, setDesignations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(searchParams.get('mode') === 'edit');

  useEffect(() => {
    if (!id) {
      message.error('Invalid staff ID');
      navigate('/admin/staff');
      return;
    }
    fetchStaff();
    fetchDesignations();
    fetchDepartments();
  }, [id]);

  useEffect(() => {
    if (staff && isEditMode) {
      form.setFieldsValue({
        full_name: staff.full_name,
        email: staff.email,
        contact_number: staff.contact_number,
        emergency_contact: staff.emergency_contact,
        date_of_birth: staff.date_of_birth ? dayjs(staff.date_of_birth) : null,
        gender: staff.gender,
        aadhaar_number: staff.aadhaar_number,
        designation_id: staff.designation_id,
        department_id: staff.department_id,
        employment_type: staff.employment_type,
        date_of_joining: staff.date_of_joining ? dayjs(staff.date_of_joining) : null,
        status: staff.status,
        address: staff.address,
      });
    }
  }, [staff, isEditMode, form]);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await getStaffById(id);
      setStaff(response.data);
    } catch (error) {
      message.error('Failed to load staff details');
      navigate('/admin/staff');
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

  const handleSave = async (values) => {
    try {
      setSaving(true);
      // Explicit payload — PUT /staff/{staff_id}, all fields optional
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
        status: values.status,
      };

      await updateStaff(id, payload);
      message.success('Staff member updated successfully');
      setIsEditMode(false);
      fetchStaff();
    } catch (error) {
      const detail = error.response?.data?.detail;
      if (Array.isArray(detail)) {
        detail.forEach(e => message.error(`${e.loc?.slice(1).join('.')} — ${e.msg}`));
      } else {
        message.error(typeof detail === 'string' ? detail : 'Failed to update staff member');
      }
    } finally {
      setSaving(false);
    }
  };

  const getDesignationName = (designationId) => {
    const designation = designations.find(d => d.id === designationId);
    return designation ? designation.title : 'N/A';
  };

  const getDepartmentName = (departmentId) => {
    const department = departments.find(d => d.id === departmentId);
    return department ? department.name : 'N/A';
  };

  const getStatusColor = (status) => {
    const colors = { ACTIVE: 'success', INACTIVE: 'default', ON_LEAVE: 'warning', TERMINATED: 'error' };
    return colors[status] || 'default';
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!staff) {
    return <Card>Staff member not found</Card>;
  }

  return (
    <div className="staff-details-container">
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Staff Details</h2>
        <div>
          {!isEditMode ? (
            <>
              <Button
                icon={<EditOutlined />}
                onClick={() => setIsEditMode(true)}
                style={{ marginRight: 8 }}
              >
                Edit
              </Button>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/admin/staff')}
              >
                Back
              </Button>
            </>
          ) : (
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => {
                setIsEditMode(false);
                form.resetFields();
              }}
            >
              Cancel Edit
            </Button>
          )}
        </div>
      </div>

      <Card>
        {!isEditMode ? (
          <Descriptions bordered column={{ xs: 1, sm: 1, md: 2 }}>
            <Descriptions.Item label="Staff ID">
              <Tag color="blue">{staff.id}</Tag>
            </Descriptions.Item>

            <Descriptions.Item label="User ID">
              <Tag color="green">{staff.user_id}</Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Full Name">{staff.full_name}</Descriptions.Item>
            <Descriptions.Item label="Email">{staff.email}</Descriptions.Item>

            <Descriptions.Item label="Contact Number">{staff.contact_number || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Emergency Contact">{staff.emergency_contact || 'N/A'}</Descriptions.Item>

            <Descriptions.Item label="Date of Birth">
              {staff.date_of_birth ? new Date(staff.date_of_birth).toLocaleDateString() : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Gender">{staff.gender || 'N/A'}</Descriptions.Item>

            <Descriptions.Item label="Aadhaar Number">{staff.aadhaar_number || 'N/A'}</Descriptions.Item>

            <Descriptions.Item label="Designation">{getDesignationName(staff.designation_id)}</Descriptions.Item>
            <Descriptions.Item label="Department">{getDepartmentName(staff.department_id)}</Descriptions.Item>

            <Descriptions.Item label="Employment Type">
              <Tag color="blue">{staff.employment_type?.replace('_', ' ')}</Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Date of Joining">
              {staff.date_of_joining ? new Date(staff.date_of_joining).toLocaleDateString() : 'N/A'}
            </Descriptions.Item>

            <Descriptions.Item label="Status">
              <Tag color={getStatusColor(staff.status)}>{staff.status}</Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Address" span={2}>
              {staff.address || 'N/A'}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <Form form={form} layout="vertical" onFinish={handleSave}>
            <Form.Item name="full_name" label="Full Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
              <Input />
            </Form.Item>

            <Form.Item name="contact_number" label="Contact Number">
              <Input maxLength={10} />
            </Form.Item>

            <Form.Item name="emergency_contact" label="Emergency Contact">
              <Input maxLength={10} />
            </Form.Item>

            <Form.Item name="date_of_birth" label="Date of Birth">
              <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
            </Form.Item>

            <Form.Item name="gender" label="Gender">
              <Select>
                <Select.Option value="MALE">Male</Select.Option>
                <Select.Option value="FEMALE">Female</Select.Option>
                <Select.Option value="OTHER">Other</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="aadhaar_number" label="Aadhaar Number">
              <Input maxLength={12} />
            </Form.Item>

            <Form.Item name="designation_id" label="Designation" rules={[{ required: true }]}>
              <Select>
                {designations.map(d => (
                  <Select.Option key={d.id} value={d.id}>{d.title}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="department_id" label="Department">
              <Select allowClear>
                {departments.map(d => (
                  <Select.Option key={d.id} value={d.id}>{d.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="employment_type" label="Employment Type" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="FULL_TIME">Full Time</Select.Option>
                <Select.Option value="PART_TIME">Part Time</Select.Option>
                <Select.Option value="CONTRACT">Contract</Select.Option>
                <Select.Option value="DAILY_WAGE">Daily Wage</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="date_of_joining" label="Date of Joining" rules={[{ required: true }]}>
              <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
            </Form.Item>

            <Form.Item name="status" label="Status" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="ACTIVE">Active</Select.Option>
                <Select.Option value="INACTIVE">Inactive</Select.Option>
                <Select.Option value="ON_LEAVE">On Leave</Select.Option>
                <Select.Option value="TERMINATED">Terminated</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="address" label="Address">
              <Input.TextArea rows={3} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={saving} icon={<SaveOutlined />}>
                Save Changes
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
}