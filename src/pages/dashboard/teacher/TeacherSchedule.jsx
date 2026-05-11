import { useEffect, useMemo, useState } from 'react';
import { Card, Table, Select, Button, message, Empty, Spin, Switch } from 'antd';
import { CalendarOutlined, ReloadOutlined } from '@ant-design/icons';
import { getClassSections, getAcademicTerms } from '../../../services/academicService';
import { getTimetableEntries } from '../../../services/attendanceService';
import { getTeacherProfile } from '../../../services/teacherService';

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

export default function TeacherSchedule() {
  const [loading, setLoading] = useState(false);
  const [bootLoading, setBootLoading] = useState(true);
  const [entries, setEntries] = useState([]);
  const [classSections, setClassSections] = useState([]);
  const [academicTerms, setAcademicTerms] = useState([]);
  const [classSectionId, setClassSectionId] = useState(null);
  const [academicTermId, setAcademicTermId] = useState(null);
  const [teacherId, setTeacherId] = useState(null);
  const [onlyMine, setOnlyMine] = useState(true);

  useEffect(() => {
    bootstrap();
  }, []);

  const bootstrap = async () => {
    setBootLoading(true);
    try {
      const [sectionsRes, termsRes, profileRes] = await Promise.all([
        getClassSections(),
        getAcademicTerms(),
        getTeacherProfile(),
      ]);

      const sections = toArray(sectionsRes?.data);
      const terms = toArray(termsRes?.data);
      const resolvedTeacherId = profileRes?.data?.details?.id || null;

      setClassSections(sections);
      setAcademicTerms(terms);
      setTeacherId(resolvedTeacherId);

      const firstSection = sections?.[0]?.id || null;
      const firstTerm = terms?.[0]?.id || null;

      setClassSectionId(firstSection);
      setAcademicTermId(firstTerm);

      if (!firstSection || !firstTerm) {
        setEntries([]);
        return;
      }

      await fetchSchedule(firstSection, firstTerm);
    } catch (error) {
      console.error('Teacher schedule bootstrap failed:', error);
      message.error('Failed to initialize schedule page');
      setEntries([]);
    } finally {
      setBootLoading(false);
    }
  };

  const fetchSchedule = async (csId = classSectionId, termId = academicTermId) => {
    if (!csId || !termId) {
      message.warning('Please select class section and academic term');
      return;
    }

    try {
      setLoading(true);
      const response = await getTimetableEntries(csId, termId);
      setEntries(toArray(response?.data));
    } catch (error) {
      console.error('Failed to fetch teacher timetable:', error);
      message.error('Failed to fetch class schedule');
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = useMemo(() => {
    if (!onlyMine || !teacherId) return entries;
    return entries.filter((row) => row?.teacher_id === teacherId);
  }, [entries, onlyMine, teacherId]);

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
            <div style={{ marginBottom: 8 }}>Class Section</div>
            <Select
              style={{ width: 220 }}
              value={classSectionId}
              placeholder="Select class section"
              onChange={(value) => setClassSectionId(value)}
            >
              {classSections.map((cs) => (
                <Option key={cs.id} value={cs.id}>
                  {cs.room_no ? `${cs.id} - ${cs.room_no}` : `Section ${cs.id}`}
                </Option>
              ))}
            </Select>
          </div>

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
            <Button icon={<ReloadOutlined />} onClick={bootstrap} style={{ marginLeft: 8 }}>
              Refresh
            </Button>
          </div>

          <div style={{ marginTop: 24 }}>
            <span style={{ marginRight: 8 }}>Only My Classes</span>
            <Switch checked={onlyMine} onChange={setOnlyMine} />
          </div>
        </div>
      </Card>

      <Card title="Weekly Schedule">
        {bootLoading ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <Spin size="large" />
          </div>
        ) : filteredEntries.length === 0 ? (
          <Empty description={onlyMine ? 'No schedule found for this teacher.' : 'No schedule found for this class.'} />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredEntries}
            rowKey={(row, idx) => row?.id || `${row?.weekday || 'd'}-${row?.period_no || 'p'}-${idx}`}
            pagination={false}
          />
        )}
      </Card>
    </div>
  );
}
