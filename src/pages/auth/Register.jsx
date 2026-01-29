import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Card, Divider, message } from 'antd';
import { GoogleOutlined, SyncOutlined } from '@ant-design/icons';
import AuthLayout from '../../components/layouts/AuthLayout';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);

    const registerData = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      password: values.password,
      role: 'admin',
    };

    console.log('Register Data:', registerData);

    setTimeout(() => {
      setLoading(false);
      message.success('Admin account created successfully!');
      navigate('/admin/dashboard');
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
            Create Admin Account
          </h1>
          <p style={{ fontSize: 14, color: '#8c8c8c', marginTop: 8 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#5B7FFF', fontWeight: 500 }}>
              Sign in
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

        <Divider style={{ fontSize: 13, color: '#bfbfbf' }}>or register using email</Divider>

        <Form
          name="register"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          requiredMark={false}
        >
          <Form.Item
            name="name"
            rules={[
              { required: true, message: 'Please enter your name' },
              { min: 2, message: 'Name must be at least 2 characters' },
            ]}
          >
            <Input
              placeholder="Full Name"
              size="large"
              style={{ height: 48, borderRadius: 8, fontSize: 15 }}
            />
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
            name="phone"
            rules={[
              { required: true, message: 'Please enter your phone number' },
              { 
                pattern: /^[0-9]{10}$/, 
                message: 'Please enter a valid 10-digit phone number' 
              },
            ]}
          >
            <Input
              placeholder="Phone Number"
              size="large"
              maxLength={10}
              style={{ height: 48, borderRadius: 8, fontSize: 15 }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please enter your password' },
              { min: 8, message: 'Password must be at least 8 characters' },
            ]}
          >
            <Input.Password
              placeholder="Password"
              size="large"
              style={{ height: 48, borderRadius: 8, fontSize: 15 }}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Confirm Password"
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
              Create Admin Account
            </Button>
          </Form.Item>
        </Form>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#8c8c8c', marginTop: 16 }}>
          By registering, you agree to our Terms of Service and Privacy Policy
        </p>
      </Card>
    </AuthLayout>
  );
}