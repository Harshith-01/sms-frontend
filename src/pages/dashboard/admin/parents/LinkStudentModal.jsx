import { useState, useEffect } from 'react';
import { Modal, Form, Select, Checkbox, message, Row, Col } from 'antd';
import { linkStudentToParent } from '../../../../services/parentService';
import { getStudents } from '../../../../services/studentService';

const { Option } = Select;

// Safe array extractor
const toArray = (res) => {
  const d = res?.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.items)) return d.items;
  if (Array.isArray(d?.results)) return d.results;
  if (Array.isArray(d?.data)) return d.data;
  return [];
};

export default function LinkStudentModal({ visible, parentId, onClose, onSuccess }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchStudents();
    }
  }, [visible]);

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);
      const response = await getStudents();
      setStudents(toArray(response));
    } catch (error) {
      message.error('Failed to load students');
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Payload matches POST /parents/{parent_id}/link-student DTO exactly
      const data = {
        student_id: values.student_id,
        relationship_type: values.relationship_type,
        is_primary_contact: values.is_primary_contact || false,
        can_view_academics: values.can_view_academics || false,
        can_view_attendance: values.can_view_attendance || false,
        can_view_timetable: values.can_view_timetable || false,
      };

      await linkStudentToParent(parentId, data);
      message.success('Student linked successfully');
      form.resetFields();
      onSuccess();
    } catch (error) {
      if (error.errorFields) {
        message.error('Please fill all required fields');
      } else {
        const detail = error.response?.data?.detail;
        message.error(typeof detail === 'string' ? detail : 'Failed to link student');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Link Student to Parent"
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          is_primary_contact: false,
          can_view_academics: true,
          can_view_attendance: true,
          can_view_timetable: true,
        }}
      >
        <Form.Item
          name="student_id"
          label="Select Student"
          rules={[{ required: true, message: 'Please select a student' }]}
        >
          <Select
            showSearch
            placeholder="Search and select student"
            loading={loadingStudents}
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          >
            {students.map((student) => (
              <Option
                key={student.student_id}
                value={student.student_id}
                label={`${student.full_name} (${student.student_id})`}
              >
                {student.full_name} - {student.student_id}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="relationship_type"
          label="Relationship Type"
          rules={[{ required: true, message: 'Please select relationship type' }]}
        >
          <Select placeholder="Select relationship type">
            <Option value="FATHER">Father</Option>
            <Option value="MOTHER">Mother</Option>
            <Option value="GUARDIAN">Guardian</Option>
            <Option value="STEP_PARENT">Step Parent</Option>
            <Option value="SIBLING_GUARDIAN">Sibling Guardian</Option>
            <Option value="OTHER">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item name="is_primary_contact" valuePropName="checked">
          <Checkbox>Mark as Primary Contact</Checkbox>
        </Form.Item>

        <div style={{ marginBottom: 16 }}>
          <strong>Access Permissions:</strong>
        </div>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="can_view_academics" valuePropName="checked">
              <Checkbox>View Academics</Checkbox>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="can_view_attendance" valuePropName="checked">
              <Checkbox>View Attendance</Checkbox>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="can_view_timetable" valuePropName="checked">
              <Checkbox>View Timetable</Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}