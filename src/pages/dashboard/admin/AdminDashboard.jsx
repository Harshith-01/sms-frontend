import { Layout, Card, Statistic, Row, Col } from 'antd';
import { UserOutlined, TeamOutlined, BookOutlined, CalendarOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;

export default function AdminDashboard() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <h2 style={{ margin: '16px 0', color: '#262626' }}>Admin Dashboard</h2>
      </Header>
      <Content style={{ padding: '24px', background: '#f5f5f5' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Students"
                value={1234}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#5B7FFF' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Teachers"
                value={89}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Courses"
                value={156}
                prefix={<BookOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Events This Month"
                value={24}
                prefix={<CalendarOutlined />}
                valueStyle={{ color: '#f5222d' }}
              />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}