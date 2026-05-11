import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Table, Button, Empty, Spin, message, Select, Tag } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined } from '@ant-design/icons';
import { getChildExamSchedule, getMyChildren } from '../../../services/parentService';
import './Parent.css';

const { Option } = Select;

export default function ChildExamSchedule() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedChild, setSelectedChild] = useState(studentId || null);
  const [classSectionId] = useState(1);
  const [academicYearId] = useState(1);
  const [academicTermId] = useState(1);

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    if (selectedChild && children.length > 0) {
      const childData = children.find(c => c.student_id === selectedChild);
      // Check can_view_academics permission before calling API
      if (childData?.can_view_academics) {
        fetchExamSchedule();
      }
    }
  }, [selectedChild, children]);

  const fetchChildren = async () => {
    try {
      const response = await getMyChildren();
      const kids = Array.isArray(response.data) ? response.data : [];
      setChildren(kids);

      if (!studentId && kids.length > 0) {
        const childWithAccess = kids.find(c => c.can_view_academics);
        if (childWithAccess) {
          setSelectedChild(childWithAccess.student_id);
        }
      }
    } catch (error) {
      console.error('Failed to load children');
    }
  };

  const fetchExamSchedule = async () => {
    try {
      setLoading(true);
      const response = await getChildExamSchedule(selectedChild, {
        class_section_id: classSectionId,
        academic_year_id: academicYearId,
        academic_term_id: academicTermId,
      });
      setExams(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      message.error('Failed to load exam schedule');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${day} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  const isToday = (dateString) => {
    const date = new Date(dateString);
    return date.toDateString() === new Date().toDateString();
  };

  const isFuture = (dateString) => new Date(dateString) > new Date();

  const selectedChildData = children.find(c => c.student_id === selectedChild);
  const canViewAcademics = selectedChildData?.can_view_academics;

  const columns = [
    { title: 'Exam Name', dataIndex: 'exam_name', key: 'exam_name' },
    { title: 'Subject', dataIndex: 'subject_name', key: 'subject_name' },
    { title: 'Date', dataIndex: 'exam_date', key: 'exam_date', render: (date) => formatDate(date) },
    {
      title: 'Time',
      dataIndex: 'start_time',
      key: 'start_time',
      render: (time, record) => `${time} - ${record.end_time}`,
    },
    {
      title: 'Duration',
      dataIndex: 'duration_minutes',
      key: 'duration_minutes',
      render: (mins) => `${mins} min`,
    },
    { title: 'Total Marks', dataIndex: 'total_marks', key: 'total_marks' },
    {
      title: 'Status',
      dataIndex: 'exam_date',
      key: 'status',
      render: (date) => {
        if (isFuture(date)) return <Tag color="blue">Upcoming</Tag>;
        if (isToday(date)) return <Tag color="orange">Today</Tag>;
        return <Tag color="default">Completed</Tag>;
      },
    },
  ];

  if (children.length > 0 && selectedChild && canViewAcademics === false) {
    return (
      <Card>
        <Empty description="You don't have permission to view exam schedule for this child">
          <Button onClick={() => navigate('/parent/children')}>
            Back to My Children
          </Button>
        </Empty>
      </Card>
    );
  }

  return (
    <div className="child-exam-schedule-container">
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Exam Schedule</h2>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/parent/children')}>
          Back
        </Button>
      </div>

      <Card style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>Select Child:</label>
          <Select
            style={{ width: 300 }}
            value={selectedChild}
            onChange={setSelectedChild}
            size="large"
          >
            {children
              .filter(c => c.can_view_academics)
              .map(child => (
                <Option key={child.student_id} value={child.student_id}>
                  {child.full_name} ({child.student_id})
                </Option>
              ))}
          </Select>
        </div>
      </Card>

      <Card title={<span><CalendarOutlined /> Upcoming Exams</span>}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
          </div>
        ) : exams.length === 0 ? (
          <Empty description="No exams scheduled" />
        ) : (
          <Table
            columns={columns}
            dataSource={exams}
            rowKey={(r, i) => r.id ?? i}
            pagination={{ pageSize: 10 }}
          />
        )}
      </Card>
    </div>
  );
}