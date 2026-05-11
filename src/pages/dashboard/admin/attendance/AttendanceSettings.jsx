import { useState, useEffect } from 'react';
import { Form, Input, message, Card, Select, InputNumber, Switch, Button } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { getAttendanceSetting, upsertAttendanceSetting } from '../../../../services/attendanceService';
import { getClassSections } from '../../../../services/academicService';
import './Attendance.css';

const { Option } = Select;

const extractRows = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

const classSectionLabel = (cs) => {
  const room = cs?.room_number ? ` (${cs.room_number})` : '';
  return `Class ${cs?.class_id ?? '-'} - Section ${cs?.section_id ?? '-'}${room}`;
};

export default function AttendanceSettings() {
  const [classSections, setClassSections] = useState([]);
  const [selectedClassSection, setSelectedClassSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchClassSections();
  }, []);

  useEffect(() => {
    if (selectedClassSection) {
      fetchSettings();
    }
  }, [selectedClassSection]);

  const fetchClassSections = async () => {
    try {
      const response = await getClassSections();
      const rows = extractRows(response?.data);
      setClassSections(rows);
      if (rows.length > 0) {
        setSelectedClassSection(rows[0].id);
      }
    } catch (error) {
      message.error('Failed to fetch class sections');
    }
  };

  const fetchSettings = async () => {
    if (!selectedClassSection) return;
    setLoading(true);
    try {
      const response = await getAttendanceSetting(selectedClassSection);
      if (response.data) {
        form.setFieldsValue({
          ...response.data,
          special_leave_types: response.data.special_leave_types?.types || []
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          class_section_id: selectedClassSection,
          min_attendance_percent: 75,
          require_justification: true,
          allow_medical_leave: true,
          lock_after_days: 7,
          correction_window_days: 3,
          special_leave_types: []
        });
      }
    } catch (error) {
      form.resetFields();
      form.setFieldsValue({
        class_section_id: selectedClassSection,
        min_attendance_percent: 75,
        require_justification: true,
        allow_medical_leave: true,
        lock_after_days: 7,
        correction_window_days: 3,
        special_leave_types: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await upsertAttendanceSetting({
        ...values,
        class_section_id: selectedClassSection,
        special_leave_types: values.special_leave_types || []
      });
      message.success('Attendance settings saved successfully');
    } catch (error) {
      message.error(error.response?.data?.detail || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="attendance-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Attendance Settings</h1>
          <p className="page-description">Configure attendance rules and policies</p>
        </div>
      </div>

      <div className="page-content">
        <Card className="table-card">
          <div className="filter-section" style={{ marginBottom: 24 }}>
            <Select
              style={{ width: 300 }}
              placeholder="Select Class Section"
              value={selectedClassSection}
              onChange={setSelectedClassSection}
              size="large"
            >
              {classSections.map(cs => (
                <Option key={cs.id} value={cs.id}>
                  {classSectionLabel(cs)}
                </Option>
              ))}
            </Select>
          </div>

          <Form 
            form={form} 
            layout="vertical" 
            onFinish={handleSubmit}
            initialValues={{
              min_attendance_percent: 75,
              require_justification: true,
              allow_medical_leave: true,
              lock_after_days: 7,
              correction_window_days: 3,
              special_leave_types: []
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <Form.Item 
                name="min_attendance_percent" 
                label="Minimum Attendance Percentage (%)"
                rules={[{ required: true, message: 'Please enter minimum attendance percentage' }]}
              >
                <InputNumber 
                  min={0} 
                  max={100} 
                  style={{ width: '100%' }} 
                  size="large"
                  addonAfter="%"
                />
              </Form.Item>

              <Form.Item 
                name="lock_after_days" 
                label="Lock Attendance After (Days)"
                rules={[{ required: true, message: 'Please enter lock after days' }]}
                help="Attendance cannot be edited after this many days"
              >
                <InputNumber 
                  min={0} 
                  max={120} 
                  style={{ width: '100%' }} 
                  size="large"
                  addonAfter="days"
                />
              </Form.Item>

              <Form.Item 
                name="correction_window_days" 
                label="Correction Window (Days)"
                rules={[{ required: true, message: 'Please enter correction window' }]}
                help="Teachers can correct attendance within this window"
              >
                <InputNumber 
                  min={0} 
                  max={30} 
                  style={{ width: '100%' }} 
                  size="large"
                  addonAfter="days"
                />
              </Form.Item>

              <Form.Item 
                name="require_justification" 
                label="Require Justification for Absences"
                valuePropName="checked"
              >
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>

              <Form.Item 
                name="allow_medical_leave" 
                label="Allow Medical Leave"
                valuePropName="checked"
              >
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>
            </div>

            <Form.Item 
              name="special_leave_types" 
              label="Special Leave Types"
              help="Select allowed special leave categories"
            >
              <Select 
                mode="tags" 
                placeholder="Add or select special leave types"
                size="large"
              >
                <Option value="Medical Leave">Medical Leave</Option>
                <Option value="Sports Events">Sports Events</Option>
                <Option value="Cultural Activities">Cultural Activities</Option>
                <Option value="Family Emergency">Family Emergency</Option>
                <Option value="School Representation">School Representation</Option>
                <Option value="Bereavement">Bereavement</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SaveOutlined />} 
                size="large"
                loading={loading}
              >
                Save Settings
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}