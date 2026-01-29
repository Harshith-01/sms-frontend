import { Layout, Card, Statistic, Row, Col } from 'antd';
import { BookOutlined, FileTextOutlined, TrophyOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;

export default function StudentDashboard() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <h2 style={{ margin: '16px 0', color: '#262626' }}>Student Dashboard</h2>
      </Header>
      <Content style={{ padding: '24px', background: '#f5f5f5' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Enrolled Courses"
                value={6}
                prefix={<BookOutlined />}
                valueStyle={{ color: '#5B7FFF' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Pending Assignments"
                value={8}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Average Grade"
                value={85}
                suffix="%"
                prefix={<TrophyOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Study Hours This Week"
                value={24}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#f5222d' }}
              />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}