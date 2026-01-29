import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Card, Result } from 'antd';
import { MailOutlined, SyncOutlined } from '@ant-design/icons';
import AuthLayout from '../../components/layouts/AuthLayout';

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEmailSent(true);
    }, 1000);
  };

  if (emailSent) {
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
          <Result
            icon={<MailOutlined style={{ color: '#5B7FFF' }} />}
            title="Check Your Email"
            subTitle="We've sent password reset instructions to your email address."
            extra={[
              <Link to="/login" key="back">
                <Button type="primary" size="large" style={{ height: 48, borderRadius: 8 }}>
                  Back to Sign in
                </Button>
              </Link>,
            ]}
          />
        </Card>
      </AuthLayout>
    );
  }

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
            Forgot Password?
          </h1>
          <p style={{ fontSize: 14, color: '#8c8c8c', marginTop: 8 }}>
            Enter your email address and we'll send you instructions to reset your password
          </p>
        </div>

        <Form
          name="forgotPassword"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          requiredMark={false}
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
              Send Reset Link
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Link
            to="/login"
            style={{
              color: '#5B7FFF',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Back to Sign in
          </Link>
        </div>
      </Card>
    </AuthLayout>
  );
}