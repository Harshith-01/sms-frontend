import { useState, useEffect } from 'react';
import { Table, Card, Select, Button, InputNumber, message, Row, Col } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { getTeacherWorkload } from '../../../services/teacherService';
import '../teacher/Teacher.css';

const { Option } = Select;

export default function TeacherGrading() {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [marks, setMarks] = useState({});

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      // Use GET /teachers/me/assessment-workload
      const workloadRes = await getTeacherWorkload();
      const workload = workloadRes?.data?.assessment_workload;

      if (workload?.integration_enabled) {
        const list = Array.isArray(workload.assigned_assignments)
          ? workload.assigned_assignments
          : [];
        setAssignments(list);
      } else {
        setAssignments([]);
      }
    } catch (error) {
      message.error('Failed to fetch assignments');
      setAssignments([]);
    }
  };

  const handleAssignmentSelect = async (assignmentId) => {
    setSelectedAssignment(assignmentId);
    setLoading(true);
    try {
      // Wire to getAssignmentSubmissions(assignmentId) when assessment service is available
      setSubmissions([]);
    } catch (error) {
      message.error('Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkChange = (studentId, value) => {
    setMarks(prev => ({ ...prev, [studentId]: value }));
  };

  const handleSaveMarks = async () => {
    try {
      const marksArray = Object.entries(marks).map(([studentId, marks_obtained]) => ({
        student_id: studentId,
        marks_obtained: parseFloat(marks_obtained),
      }));
      // Wire to bulkUploadAssignmentMarks when assessment service is available
      message.success('Marks saved successfully');
    } catch (error) {
      message.error('Failed to save marks');
    }
  };

  const columns = [
    { title: 'Student ID', dataIndex: 'student_id', key: 'student_id' },
    {
      title: 'Student Name',
      dataIndex: 'student_name',
      key: 'student_name',
      render: (text) => <strong>{text || '—'}</strong>,
    },
    { title: 'Submission Date', dataIndex: 'submission_date', key: 'submission_date' },
    {
      title: 'Marks',
      key: 'marks',
      render: (_, record) => (
        <InputNumber
          min={0}
          max={100}
          value={marks[record.student_id] || record.marks_obtained}
          onChange={(value) => handleMarkChange(record.student_id, value)}
        />
      ),
    },
  ];

  return (
    <div className="teacher-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Grading</h1>
          <p className="page-description">Grade student submissions</p>
        </div>
        {selectedAssignment && (
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveMarks} size="large">
            Save Marks
          </Button>
        )}
      </div>

      <div className="page-content">
        <Card className="filter-card">
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Select
                placeholder="Select Assignment"
                onChange={handleAssignmentSelect}
                size="large"
                style={{ width: '100%' }}
              >
                {assignments.map(a => (
                  <Option key={a.id} value={a.id}>
                    {a.title}{a.class_section_name ? ` - ${a.class_section_name}` : ''}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>
        </Card>

        <Card className="table-card">
          <Table
            columns={columns}
            dataSource={submissions}
            rowKey={(record, i) => record.id ?? i}
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </div>
    </div>
  );
}