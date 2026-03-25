import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Table, Button, Empty, Spin, message, Select } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined } from '@ant-design/icons';
import { getChildTimetable, getMyChildren } from '../../../services/parentService';
import './Parent.css';

const { Option } = Select;

export default function ChildTimetable() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [timetable, setTimetable] = useState([]);
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
      fetchTimetable();
    }
  }, [selectedChild]);

  const fetchChildren = async () => {
    try {
      const response = await getMyChildren();
      const kids = response.data || [];
      setChildren(kids);
      
      if (!studentId && kids.length > 0) {
        const childWithAccess = kids.find(c => c.can_view_timetable);
        if (childWithAccess) {
          setSelectedChild(childWithAccess.student_id);
        }
      }
    } catch (error) {
      console.error('Failed to load children');
    }
  };

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const response = await getChildTimetable(selectedChild, {
        class_section_id: classSectionId,
        academic_term_id: academicTermId
      });
      setTimetable(response.data || []);
    } catch (error) {
      message.error('Failed to load timetable');
    } finally {
      setLoading(false);
    }
  };

  const selectedChildData = children.find(c => c.student_id === selectedChild);
  const canViewTimetable = selectedChildData?.can_view_timetable;

  const columns = [
    {
      title: 'Day',
      dataIndex: 'day_of_week',
      key: 'day_of_week',
      width: 100,
    },
    {
      title: 'Period',
      dataIndex: 'period_number',
      key: 'period_number',
      width: 80,
    },
    {
      title: 'Time',
      dataIndex: 'start_time',
      key: 'time',
      render: (start, record) => `${start} - ${record.end_time}`,
      width: 150,
    },
    {
      title: 'Subject',
      dataIndex: 'subject_name',
      key: 'subject_name',
    },
    {
      title: 'Teacher',
      dataIndex: 'teacher_name',
      key: 'teacher_name',
    },
    {
      title: 'Room',
      dataIndex: 'room_number',
      key: 'room_number',
      width: 100,
    },
  ];

  if (!canViewTimetable) {
    return (
      <Card>
        <Empty
          description="You don't have permission to view timetable for this child"
        >
          <Button onClick={() => navigate('/parent/children')}>
            Back to My Children
          </Button>
        </Empty>
      </Card>
    );
  }

  return (
    <div className="child-timetable-container">
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Class Timetable</h2>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/parent/children')}
        >
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
              .filter(c => c.can_view_timetable)
              .map(child => (
                <Option key={child.student_id} value={child.student_id}>
                  {child.full_name} ({child.student_id})
                </Option>
              ))}
          </Select>
        </div>
      </Card>

      <Card 
        title={
          <span>
            <CalendarOutlined /> Weekly Schedule
          </span>
        }
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
          </div>
        ) : timetable.length === 0 ? (
          <Empty description="No timetable available" />
        ) : (
          <Table
            columns={columns}
            dataSource={timetable}
            rowKey="id"
            pagination={false}
            scroll={{ x: 800 }}
          />
        )}
      </Card>
    </div>
  );
}