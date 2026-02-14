import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, message, Select } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import axios from 'axios';
import './Auth.css';

const { Option } = Select;
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Decode JWT to get role
  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const handleLogin = async (values) => {
    setLoading(true);

    try {
      // ⚠️ DEVELOPMENT ONLY - REMOVE BEFORE PRODUCTION ⚠️
      if (values.email === 'admin@test.com' && values.password === 'Admin@123') {
        const testToken = 'test_token_admin';
        localStorage.setItem('token', testToken);
        localStorage.setItem('userRole', 'ADMIN');
        message.success('Login successful (Test Mode)');
        navigate('/admin/dashboard');
        setLoading(false);
        return;
      }
      // ⚠️ END DEVELOPMENT ONLY CODE ⚠️

      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: values.email,
        password: values.password,
      });

      const { access_token, token_type } = response.data;

      localStorage.setItem('token', access_token);
      localStorage.setItem('tokenType', token_type);

      const decoded = decodeToken(access_token);
      
      if (decoded && decoded.role) {
        const role = decoded.role.toUpperCase();
        localStorage.setItem('userRole', role);
        localStorage.setItem('userId', decoded.user_id || decoded.sub);
        localStorage.setItem('userEmail', decoded.email || values.email);

        message.success('Login successful');

        switch (role) {
          case 'ADMIN':
            navigate('/admin/dashboard');
            break;
          case 'TEACHER':
            navigate('/teacher/dashboard');
            break;
          case 'STUDENT':
            navigate('/student/dashboard');
            break;
          default:
            navigate('/admin/dashboard');
        }
      } else {
        message.error('Invalid token received');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response) {
        const status = error.response.status;
        const detail = error.response.data?.detail || 'Login failed';
        
        if (status === 401) {
          message.error('Invalid email or password');
        } else if (status === 422) {
          message.error('Please check your email and password format');
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

        <h1 className="auth-title">Sign in</h1>
        <p className="auth-subtitle">
          Don't have an account? <Link to="/register">Register as Admin</Link>
        </p>

        <Form
          name="login"
          onFinish={handleLogin}
          layout="vertical"
          requiredMark={false}
          className="auth-form"
        >
          <Form.Item
            name="role"
            initialValue="Admin"
          >
            <Select size="large" className="role-select">
              <Option value="Admin">Admin</Option>
              <Option value="Teacher">Teacher</Option>
              <Option value="Student">Student</Option>
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
              className="auth-input"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              placeholder="Password"
              size="large"
              className="auth-input"
              iconRender={(visible) =>
                visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              className="auth-btn"
            >
              Sign in
            </Button>
          </Form.Item>

          <div className="auth-footer-link">
            <Link to="/forgot-password">Forgot your password?</Link>
          </div>
        </Form>
      </div>
    </div>
  );
}