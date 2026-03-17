import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { login } from '../../services/authService';
import './Auth.css';

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
      // ⚠️ TESTING ONLY - REMOVE BEFORE PRODUCTION ⚠️
      if (values.email === 'admin@test.com' && values.password === 'admin123') {
        localStorage.setItem('token', 'dummy_token_admin');
        localStorage.setItem('userRole', 'ADMIN');
        localStorage.setItem('userId', 'admin_001');
        localStorage.setItem('userEmail', values.email);
        message.success('Login successful (Admin - Test Mode)');
        navigate('/admin/dashboard', { replace: true });
        setLoading(false);
        return;
      }

      if (values.email === 'teacher@test.com' && values.password === 'teacher123') {
        localStorage.setItem('token', 'dummy_token_teacher');
        localStorage.setItem('userRole', 'TEACHER');
        localStorage.setItem('userId', 'T2901');
        localStorage.setItem('userEmail', values.email);
        message.success('Login successful (Teacher - Test Mode)');
        navigate('/teacher/dashboard', { replace: true });
        setLoading(false);
        return;
      }

      if (values.email === 'student@test.com' && values.password === 'student123') {
        localStorage.setItem('token', 'dummy_token_student');
        localStorage.setItem('userRole', 'STUDENT');
        localStorage.setItem('userId', 'S2024001');
        localStorage.setItem('userEmail', values.email);
        message.success('Login successful (Student - Test Mode)');
        navigate('/student/dashboard', { replace: true });
        setLoading(false);
        return;
      }
      // ⚠️ END TESTING ONLY CODE ⚠️

      // Real backend login using authService
      const response = await login(values.email, values.password);
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
            navigate('/admin/dashboard', { replace: true });
            break;
          case 'TEACHER':
            navigate('/teacher/dashboard', { replace: true });
            break;
          case 'STUDENT':
            navigate('/student/dashboard', { replace: true });
            break;
          default:
            message.warning('Unknown role, redirecting to admin dashboard');
            navigate('/admin/dashboard', { replace: true });
        }
      } else {
        message.error('Invalid token: role not found');
        localStorage.clear();
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

        {/* ⚠️ TESTING INFO - REMOVE BEFORE PRODUCTION ⚠️ */}
        <div style={{ 
          background: '#fff3cd', 
          border: '1px solid #ffc107', 
          borderRadius: '8px', 
          padding: '12px', 
          marginBottom: '20px',
          fontSize: '13px',
          color: '#856404'
        }}>
          <strong>Test Credentials:</strong><br />
          Admin: admin@test.com / admin123<br />
          Teacher: teacher@test.com / teacher123<br />
          Student: student@test.com / student123
        </div>
        {/* ⚠️ END TESTING INFO ⚠️ */}

        <Form
          name="login"
          onFinish={handleLogin}
          layout="vertical"
          requiredMark={false}
          className="auth-form"
        >
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
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              placeholder="Password"
              size="large"
              className="auth-input"
              iconRender={(visible) => visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block loading={loading} className="auth-btn">
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