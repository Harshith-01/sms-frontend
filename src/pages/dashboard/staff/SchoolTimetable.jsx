import { useState } from 'react';
import { Card, Table, Select, Button, message, Empty, Spin } from 'antd';
import { CalendarOutlined, ReloadOutlined } from '@ant-design/icons';
import { getMyTimetable } from '../../../services/staffService';
import './Staff.css';

const { Option } = Select;

export default function SchoolTimetable() {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [classSectionId, setClassSectionId] = useState(null);
  const [academicTermId, setAcademicTermId] = useState(null);

  const fetchTimetable = async () => {
    if (!classSectionId || !academicTermId) {
      message.warning('Please select both class section and academic term');
      return;
    }

    try {
      setLoading(true);
      // GET /staff/me/timetable with query params
      const response = await getMyTimetable({
        class_section_id: classSectionId,
        academic_term_id: academicTermId,
      });
      const d = response.data;
      setTimetable(Array.isArray(d) ? d : d?.items || d?.results || []);
    } catch (error) {
      message.error('Failed to load timetable');
      setTimetable([]);
    } finally {
      setLoading(false);
    }
  };

  const getDayName = (dayNum) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNum] || dayNum;
  };

  const columns = [
    {
      title: 'Day',
      dataIndex: 'weekday',
      key: 'weekday',
      render: (day) => getDayName(day),
      sorter: (a, b) => a.weekday - b.weekday
    },
    {
      title: 'Period',
      dataIndex: 'period_no',
      key: 'period_no',
      sorter: (a, b) => a.period_no - b.period_no
    },
    {
      title: 'Subject ID',
      dataIndex: 'subject_id',
      key: 'subject_id'
    },
    {
      title: 'Teacher ID',
      dataIndex: 'teacher_id',
      key: 'teacher_id'
    },
    {
      title: 'Room',
      dataIndex: 'room_code',
      key: 'room_code',
      render: (room) => room || 'N/A'
    },
    {
      title: 'Type',
      dataIndex: 'entry_type',
      key: 'entry_type'
    }
  ];

  return (
    <div className="school-timetable-container">
      <h2>School Timetable</h2>

      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 8 }}>Class Section:</label>
            <Select
              style={{ width: 200 }}
              placeholder="Select class section"
              value={classSectionId}
              onChange={setClassSectionId}
            >
              <Option value={1}>Class 1-A</Option>
              <Option value={2}>Class 1-B</Option>
              <Option value={3}>Class 2-A</Option>
            </Select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 8 }}>Academic Term:</label>
            <Select
              style={{ width: 200 }}
              placeholder="Select term"
              value={academicTermId}
              onChange={setAcademicTermId}
            >
              <Option value={1}>Term 1 - 2024</Option>
              <Option value={2}>Term 2 - 2024</Option>
            </Select>
          </div>

          <div style={{ marginTop: 24 }}>
            <Button
              type="primary"
              icon={<CalendarOutlined />}
              onClick={fetchTimetable}
              loading={loading}
            >
              View Timetable
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchTimetable}
              style={{ marginLeft: 8 }}
            >
              Refresh
            </Button>
          </div>
        </div>
      </Card>

      <Card title="Weekly Schedule">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
          </div>
        ) : timetable.length === 0 ? (
          <Empty description="No timetable data available. Please select class section and term." />
        ) : (
          <Table
            columns={columns}
            dataSource={timetable}
            rowKey={(r, i) => r.id ?? i}
            pagination={false}
          />
        )}
      </Card>
    </div>
  );
}