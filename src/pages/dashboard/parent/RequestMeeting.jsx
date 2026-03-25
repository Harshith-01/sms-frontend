import { useState, useEffect } from 'react';
import { Card, Form, Select, DatePicker, Input, Button, message, Row, Col } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { requestMeeting, getMyChildren } from '../../../services/parentService';
import './Parent.css';

const { Option } = Select;
const { TextArea } = Input;

export default function RequestMeeting() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [children, setChildren] = useState([]);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const response = await getMyChildren();
      setChildren(response.data || []);
    } catch (error) {
      console.error('Failed to load children');
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const data = {
        teacher_id: values.teacher_id,
        student_id: values.student_id || null,
        meeting_at: values.meeting_at.toISOString(),
        duration_minutes: values.duration_minutes,
        mode: values.mode,
        agenda: values.agenda
      };
      
      await requestMeeting(data);
      message.success('Meeting request submitted successfully');
      form.resetFields();
      navigate('/parent/meetings');
    } catch (error) {
      message.error(error.response?.data?.detail || 'Failed to request meeting');
    } finally {
      setLoading(false);
    }
  };

  const disabledDate = (current) => {
    // Disable past dates
    return current && current < new Date().setHours(0, 0, 0, 0);
  };

  return (
    <div className="request-meeting-container">
      <h2>Request Parent-Teacher Meeting</h2>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            duration_minutes: 30,
            mode: 'ONLINE'
          }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="teacher_id"
                label="Select Teacher"
                rules={[{ required: true, message: 'Please select a teacher' }]}
              >
                <Select
                  placeholder="Select teacher"
                  size="large"
                  showSearch
                  optionFilterProp="children"
                >
                  {/* This would come from teacher service */}
                  <Option value="TCH001">Mr. Rajesh Kumar - Mathematics</Option>
                  <Option value="TCH002">Ms. Priya Sharma - English</Option>
                  <Option value="TCH003">Mr. Amit Patel - Science</Option>
                  <Option value="TCH004">Ms. Sunita Reddy - Social Studies</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="student_id"
                label="Regarding Child (Optional)"
              >
                <Select
                  placeholder="Select child (leave blank for general discussion)"
                  size="large"
                  allowClear
                >
                  {children.map(child => (
                    <Option key={child.student_id} value={child.student_id}>
                      {child.full_name} ({child.student_id})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="meeting_at"
                label="Preferred Date & Time"
                rules={[{ required: true, message: 'Please select date and time' }]}
              >
                <DatePicker
                  showTime
                  format="DD-MM-YYYY HH:mm"
                  size="large"
                  style={{ width: '100%' }}
                  disabledDate={disabledDate}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="duration_minutes"
                label="Duration (minutes)"
                rules={[{ required: true, message: 'Please select duration' }]}
              >
                <Select size="large">
                  <Option value={15}>15 minutes</Option>
                  <Option value={30}>30 minutes</Option>
                  <Option value={45}>45 minutes</Option>
                  <Option value={60}>60 minutes</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="mode"
                label="Meeting Mode"
                rules={[{ required: true, message: 'Please select mode' }]}
              >
                <Select size="large">
                  <Option value="ONLINE">Online (Video Call)</Option>
                  <Option value="OFFLINE">In-Person (School)</Option>
                  <Option value="PHONE">Phone Call</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="agenda"
            label="Meeting Agenda / Purpose"
            rules={[{ required: true, message: 'Please describe the purpose of the meeting' }]}
          >
            <TextArea
              rows={4}
              placeholder="Please describe what you would like to discuss..."
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              size="large"
              icon={<CalendarOutlined />}
            >
              Submit Meeting Request
            </Button>
            <Button 
              style={{ marginLeft: 8 }} 
              onClick={() => navigate('/parent/meetings')}
              size="large"
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>

        <div style={{ marginTop: 24, padding: 12, background: '#f0f2f5', borderRadius: 4 }}>
          <strong>Note:</strong>
          <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
            <li>Your meeting request will be sent to the teacher for approval</li>
            <li>You will be notified once the teacher responds to your request</li>
            <li>For online meetings, a meeting link will be provided after approval</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}