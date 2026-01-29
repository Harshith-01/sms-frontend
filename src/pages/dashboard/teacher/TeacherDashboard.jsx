import { Layout, Card, Statistic, Row, Col } from 'antd';
import { BookOutlined, UsergroupAddOutlined, FileTextOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;

export default function TeacherDashboard() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <h2 style={{ margin: '16px 0', color: '#262626' }}>Teacher Dashboard</h2>
      </Header>
      <Content style={{ padding: '24px', background: '#f5f5f5' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="My Classes"
                value={5}
                prefix={<BookOutlined />}
                valueStyle={{ color: '#5B7FFF' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Students"
                value={128}
                prefix={<UsergroupAddOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Pending Assignments"
                value={12}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Graded This Week"
                value={45}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#f5222d' }}
              />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}