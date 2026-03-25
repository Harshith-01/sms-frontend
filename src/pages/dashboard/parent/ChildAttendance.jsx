import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Statistic, Row, Col, Progress, Button, Empty, Spin, message, Select, DatePicker } from 'antd';
import { 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  ArrowLeftOutlined,
  PercentageOutlined
} from '@ant-design/icons';
import { getChildAttendance, getMyChildren } from '../../../services/parentService';
import './Parent.css';

const { RangePicker } = DatePicker;
const { Option } = Select;

export default function ChildAttendance() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState(null);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedChild, setSelectedChild] = useState(studentId);

  // These would come from dropdowns in real app
  const [classSectionId, setClassSectionId] = useState(1);
  const [academicTermId, setAcademicTermId] = useState(1);

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    if (selectedChild) {
      fetchAttendance();
    }
  }, [selectedChild]);

  const fetchChildren = async () => {
    try {
      const response = await getMyChildren();
      const kids = response.data || [];
      setChildren(kids);
      
      // Set first child with attendance permission as selected
      if (!studentId && kids.length > 0) {
        const childWithAccess = kids.find(c => c.can_view_attendance);
        if (childWithAccess) {
          setSelectedChild(childWithAccess.student_id);
        }
      }
    } catch (error) {
      console.error('Failed to load children');
    }
  };

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await getChildAttendance(selectedChild, {
        class_section_id: classSectionId,
        academic_term_id: academicTermId
      });
      setAttendance(response.data);
    } catch (error) {
      message.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const selectedChildData = children.find(c => c.student_id === selectedChild);
  const canViewAttendance = selectedChildData?.can_view_attendance;

  if (!canViewAttendance) {
    return (
      <Card>
        <Empty
          description="You don't have permission to view attendance for this child"
        >
          <Button onClick={() => navigate('/parent/children')}>
            Back to My Children
          </Button>
        </Empty>
      </Card>
    );
  }

  return (
    <div className="child-attendance-container">
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Child Attendance</h2>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/parent/children')}
        >
          Back
        </Button>
      </div>

      {/* Child Selector */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col xs={24} md={8}>
            <label style={{ display: 'block', marginBottom: 8 }}>Select Child:</label>
            <Select
              style={{ width: '100%' }}
              value={selectedChild}
              onChange={setSelectedChild}
              size="large"
            >
              {children
                .filter(c => c.can_view_attendance)
                .map(child => (
                  <Option key={child.student_id} value={child.student_id}>
                    {child.full_name} ({child.student_id})
                  </Option>
                ))}
            </Select>
          </Col>
        </Row>
      </Card>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin size="large" />
        </div>
      ) : !attendance ? (
        <Card>
          <Empty description="No attendance data available" />
        </Card>
      ) : (
        <>
          {/* Summary Stats */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Total Sessions"
                  value={attendance.total_sessions || 0}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Present"
                  value={attendance.present || 0}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Absent"
                  value={attendance.absent || attendance.absences || 0}
                  prefix={<CloseCircleOutlined />}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Attendance %"
                  value={attendance.percentage || 0}
                  prefix={<PercentageOutlined />}
                  valueStyle={{ color: attendance.percentage >= 75 ? '#52c41a' : '#ff4d4f' }}
                  suffix="%"
                />
              </Card>
            </Col>
          </Row>

          {/* Progress Bar */}
          <Card title="Attendance Overview">
            <div style={{ marginBottom: 24 }}>
              <Progress 
                percent={attendance.percentage || 0} 
                status={attendance.percentage >= 75 ? 'success' : 'exception'}
                strokeColor={attendance.percentage >= 75 ? '#52c41a' : '#ff4d4f'}
              />
            </div>

            <Row gutter={16}>
              <Col span={12}>
                <div style={{ padding: 12, background: '#f0f2f5', borderRadius: 4 }}>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
                    Required Attendance
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: '#1890ff' }}>
                    75%
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ padding: 12, background: '#f0f2f5', borderRadius: 4 }}>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
                    Current Status
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: attendance.percentage >= 75 ? '#52c41a' : '#ff4d4f' }}>
                    {attendance.percentage >= 75 ? 'On Track' : 'Below Requirement'}
                  </div>
                </div>
              </Col>
            </Row>

            {attendance.percentage < 75 && (
              <div style={{ marginTop: 16, padding: 12, background: '#fff2e8', border: '1px solid #ffbb96', borderRadius: 4 }}>
                <strong style={{ color: '#d4380d' }}>⚠️ Attendance Warning:</strong>
                <p style={{ margin: '8px 0 0 0', color: '#666' }}>
                  Attendance is below the required 75%. Please ensure regular attendance to meet academic requirements.
                </p>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}