import { useEffect, useState } from 'react';
import { Card, Table, Select, Button, message, Empty, Spin } from 'antd';
import { CalendarOutlined, ReloadOutlined } from '@ant-design/icons';
import { getStudentProfile } from '../../../services/studentService';
import { getAcademicTerms } from '../../../services/academicService';
import { getTimetableEntries } from '../../../services/attendanceService';

const { Option } = Select;

function toArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}

function dayName(day) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[day] || String(day);
}

export default function StudentSchedule() {
  const [loading, setLoading] = useState(false);
  const [bootLoading, setBootLoading] = useState(true);
  const [entries, setEntries] = useState([]);
  const [academicTerms, setAcademicTerms] = useState([]);
  const [classSectionId, setClassSectionId] = useState(null);
  const [academicTermId, setAcademicTermId] = useState(null);

  useEffect(() => {
    bootstrap();
  }, []);

  const bootstrap = async () => {
    setBootLoading(true);
    try {
      const [profileRes, termsRes] = await Promise.all([
        getStudentProfile(),
        getAcademicTerms(),
      ]);

      const profile = profileRes?.data || {};
      const classSection = profile?.academic_current?.class_section_id || null;
      const terms = toArray(termsRes?.data);
      const termId = terms?.[0]?.id || null;

      setClassSectionId(classSection);
      setAcademicTerms(terms);
      setAcademicTermId(termId);

      if (!classSection) {
        message.warning('No class section is linked to this student profile yet.');
        setEntries([]);
        return;
      }

      if (!termId) {
        message.warning('No academic terms found.');
        setEntries([]);
        return;
      }

      await fetchSchedule(classSection, termId);
    } catch (error) {
      console.error('Student schedule bootstrap failed:', error);
      message.error('Failed to load class schedule');
      setEntries([]);
    } finally {
      setBootLoading(false);
    }
  };

  const fetchSchedule = async (csId = classSectionId, termId = academicTermId) => {
    if (!csId || !termId) {
      message.warning('Class section or academic term missing');
      return;
    }

    try {
      setLoading(true);
      const response = await getTimetableEntries(csId, termId);
      setEntries(toArray(response?.data));
    } catch (error) {
      console.error('Failed to fetch student timetable:', error);
      message.error('Failed to fetch class schedule');
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Day',
      dataIndex: 'weekday',
      key: 'weekday',
      render: (value) => dayName(value),
      sorter: (a, b) => Number(a?.weekday || 0) - Number(b?.weekday || 0),
    },
    {
      title: 'Period',
      dataIndex: 'period_no',
      key: 'period_no',
      sorter: (a, b) => Number(a?.period_no || 0) - Number(b?.period_no || 0),
    },
    {
      title: 'Subject',
      dataIndex: 'subject_id',
      key: 'subject_id',
    },
    {
      title: 'Teacher',
      dataIndex: 'teacher_id',
      key: 'teacher_id',
      render: (value) => value || 'TBA',
    },
    {
      title: 'Room',
      dataIndex: 'room_code',
      key: 'room_code',
      render: (value) => value || 'N/A',
    },
  ];

  return (
    <div>
      <h2>Class Schedule</h2>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <div style={{ marginBottom: 8 }}>Academic Term</div>
            <Select
              style={{ width: 220 }}
              value={academicTermId}
              placeholder="Select academic term"
              onChange={(value) => setAcademicTermId(value)}
            >
              {academicTerms.map((term) => (
                <Option key={term.id} value={term.id}>
                  {term.term_name || `Term ${term.id}`}
                </Option>
              ))}
            </Select>
          </div>

          <div style={{ marginTop: 24 }}>
            <Button
              type="primary"
              icon={<CalendarOutlined />}
              onClick={() => fetchSchedule()}
              loading={loading}
            >
              Load Schedule
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={bootstrap}
              style={{ marginLeft: 8 }}
            >
              Refresh
            </Button>
          </div>
        </div>
      </Card>

      <Card title="Weekly Schedule">
        {bootLoading ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <Spin size="large" />
          </div>
        ) : entries.length === 0 ? (
          <Empty description="No timetable found for this student." />
        ) : (
          <Table
            columns={columns}
            dataSource={entries}
            rowKey={(row, idx) => row?.id || `${row?.weekday || 'd'}-${row?.period_no || 'p'}-${idx}`}
            pagination={false}
          />
        )}
      </Card>
    </div>
  );
}
