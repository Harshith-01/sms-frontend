import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import './Auth.css';

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (values) => {
    setLoading(true);

    // Backend not implemented yet
    setTimeout(() => {
      message.success('Password reset link will be sent to your email');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-logo">
          <div className="logo-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
        </div>

        <h1 className="auth-title">Forgot Password?</h1>
        <p className="auth-description">
          Enter your email address and we'll send you instructions to reset your password
        </p>

        <Form
          name="forgot-password"
          onFinish={handleForgotPassword}
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
            <Input
              placeholder="Email address"
              size="large"
              className="auth-input"
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
              Send Reset Link
            </Button>
          </Form.Item>

          <div className="auth-footer-link">
            <Link to="/login">Back to Sign in</Link>
          </div>
        </Form>
      </div>
    </div>
  );
}