import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Card, Divider, Select, message } from 'antd';
import { GoogleOutlined, SyncOutlined } from '@ant-design/icons';
import AuthLayout from '../../components/layouts/AuthLayout';

const { Option } = Select;

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);

    const loginData = {
      email: values.email,
      password: values.password,
      role: values.role,
    };

    console.log('Login Data:', loginData);

    setTimeout(() => {
      setLoading(false);
      message.success('Login successful!');
      
      if (values.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (values.role === 'teacher') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    }, 1000);
  };

  return (
    <AuthLayout>
      <Card
        style={{
          width: 450,
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        }}
        bodyStyle={{ padding: '48px 40px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div
            style={{
              width: 64,
              height: 64,
              margin: '0 auto 24px',
              background: '#5B7FFF',
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SyncOutlined style={{ fontSize: 32, color: '#fff' }} />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, color: '#262626' }}>
            Sign in
          </h1>
          <p style={{ fontSize: 14, color: '#8c8c8c', marginTop: 8 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#5B7FFF', fontWeight: 500 }}>
              Register as Admin
            </Link>
          </p>
        </div>

        <Button
          icon={<GoogleOutlined />}
          size="large"
          block
          style={{
            marginBottom: 20,
            height: 48,
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 500,
          }}
        >
          Continue with Google
        </Button>

        <Divider style={{ fontSize: 13, color: '#bfbfbf' }}>or sign in using email</Divider>

        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          requiredMark={false}
          initialValues={{ role: 'admin' }}
        >
          <Form.Item
            name="role"
            rules={[{ required: true, message: 'Please select your role' }]}
          >
            <Select
              size="large"
              placeholder="Select your role"
              style={{ height: 48, borderRadius: 8 }}
            >
              <Option value="admin">Admin</Option>
              <Option value="teacher">Teacher</Option>
              <Option value="student">Student</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input
              placeholder="Email address"
              size="large"
              style={{ height: 48, borderRadius: 8, fontSize: 15 }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              placeholder="Password"
              size="large"
              style={{ height: 48, borderRadius: 8, fontSize: 15 }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              style={{
                height: 48,
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600,
                background: '#5B7FFF',
                marginTop: 8,
              }}
            >
              Sign in
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center' }}>
          <Link
            to="/forgot-password"
            style={{
              color: '#5B7FFF',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Forgot your password?
          </Link>
        </div>
      </Card>
    </AuthLayout>
  );
}