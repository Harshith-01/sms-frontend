import { Layout } from 'antd';

const { Content } = Layout;

export default function AuthLayout({ children }) {
  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Content
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
        }}
      >
        {children}
      </Content>
    </Layout>
  );
}