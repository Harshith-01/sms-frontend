import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { register } from '../../services/authService';
import './Auth.css';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (values) => {
    setLoading(true);

    try {
      // Using authService for registration
      const response = await register({
        name: values.name,
        email: values.email,
        password: values.password,
        phone: null,
        designation: null,
        address: null,
      });

      const { access_token, token_type } = response.data;

      localStorage.setItem('token', access_token);
      localStorage.setItem('tokenType', token_type);
      localStorage.setItem('userRole', 'ADMIN');
      localStorage.setItem('userName', values.name);
      localStorage.setItem('userEmail', values.email);

      message.success('Admin account created successfully');
      navigate('/admin/dashboard', { replace: true });
    } catch (error) {
      console.error('Registration error:', error);

      if (error.response) {
        const status = error.response.status;
        const detail = error.response.data?.detail || 'Registration failed';

        if (status === 409) {
          message.error('Email already registered');
        } else if (status === 422) {
          message.error('Please check all fields and try again');
        } else {
          message.error(detail);
        }
      } else if (error.request) {
        message.error('Cannot connect to server. Please check your connection.');
      } else {
        message.error('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-logo">
          <div className="logo-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
          </div>
        </div>

        <h1 className="auth-title">Create Admin Account</h1>
        <p className="auth-subtitle">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>

        <p className="auth-divider">or register using email</p>

        <Form
          name="register"
          onFinish={handleRegister}
          layout="vertical"
          requiredMark={false}
          className="auth-form"
        >
          <Form.Item
            name="name"
            rules={[
              { required: true, message: 'Please enter your full name' },
              { min: 2, message: 'Name must be at least 2 characters' },
            ]}
          >
            <Input placeholder="Full Name" size="large" className="auth-input" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input placeholder="Email address" size="large" className="auth-input" />
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
              className="auth-input"
              iconRender={(visible) => visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
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
              className="auth-input"
              iconRender={(visible) => visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block loading={loading} className="auth-btn">
              Create Admin Account
            </Button>
          </Form.Item>

          <p className="auth-terms">
            By registering, you agree to our Terms of Service and Privacy Policy
          </p>
        </Form>
      </div>
    </div>
  );
}