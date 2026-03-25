import { useState, useEffect } from 'react';
import { Card, List, Avatar, Tag, Button, Space, Empty, Spin, message, Row, Col } from 'antd';
import { 
  UserOutlined, 
  ClockCircleOutlined, 
  TrophyOutlined, 
  CalendarOutlined,
  BookOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getMyChildren } from '../../../services/parentService';
import './Parent.css';

export default function MyChildren() {
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const response = await getMyChildren();
      setChildren(response.data || []);
    } catch (error) {
      message.error('Failed to load children');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRelationshipColor = (type) => {
    const colors = {
      FATHER: 'blue',
      MOTHER: 'pink',
      GUARDIAN: 'green',
      STEP_PARENT: 'purple',
      OTHER: 'orange'
    };
    return colors[type] || 'default';
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="my-children-container">
      <h2>My Children</h2>

      {children.length === 0 ? (
        <Card>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No children linked to your account"
          >
            <p>Please contact school administration to link your child's account</p>
          </Empty>
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {children.map((child) => (
            <Col xs={24} lg={12} key={child.student_id}>
              <Card className="child-card">
                <div style={{ display: 'flex', gap: 16 }}>
                  <Avatar 
                    size={80} 
                    style={{ backgroundColor: '#1890ff', flexShrink: 0 }}
                  >
                    {getInitials(child.full_name)}
                  </Avatar>

                  <div style={{ flex: 1 }}>
                    <h3 style={{ marginBottom: 8 }}>
                      {child.full_name}
                      {child.is_primary_contact && (
                        <Tag color="gold" style={{ marginLeft: 8 }}>Primary</Tag>
                      )}
                    </h3>

                    <div style={{ marginBottom: 12 }}>
                      <Tag color={getRelationshipColor(child.relationship_type)}>
                        {child.relationship_type}
                      </Tag>
                      <span style={{ color: '#999', marginLeft: 8 }}>
                        ID: {child.student_id}
                      </span>
                    </div>

                    <div style={{ marginBottom: 12 }}>
                      <strong style={{ display: 'block', marginBottom: 8 }}>
                        Access Permissions:
                      </strong>
                      <Space wrap>
                        <Tag 
                          icon={child.can_view_academics ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                          color={child.can_view_academics ? 'green' : 'default'}
                        >
                          Academics
                        </Tag>
                        <Tag 
                          icon={child.can_view_attendance ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                          color={child.can_view_attendance ? 'blue' : 'default'}
                        >
                          Attendance
                        </Tag>
                        <Tag 
                          icon={child.can_view_timetable ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                          color={child.can_view_timetable ? 'orange' : 'default'}
                        >
                          Timetable
                        </Tag>
                      </Space>
                    </div>

                    <Space wrap style={{ marginTop: 12 }}>
                      {child.can_view_attendance && (
                        <Button
                          size="small"
                          icon={<ClockCircleOutlined />}
                          onClick={() => navigate(`/parent/children/${child.student_id}/attendance`)}
                        >
                          Attendance
                        </Button>
                      )}
                      {child.can_view_academics && (
                        <>
                          <Button
                            size="small"
                            icon={<TrophyOutlined />}
                            onClick={() => navigate(`/parent/children/${child.student_id}/report-cards`)}
                          >
                            Reports
                          </Button>
                          <Button
                            size="small"
                            icon={<BookOutlined />}
                            onClick={() => navigate(`/parent/children/${child.student_id}/exams`)}
                          >
                            Exams
                          </Button>
                        </>
                      )}
                      {child.can_view_timetable && (
                        <Button
                          size="small"
                          icon={<CalendarOutlined />}
                          onClick={() => navigate(`/parent/children/${child.student_id}/timetable`)}
                        >
                          Timetable
                        </Button>
                      )}
                    </Space>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}