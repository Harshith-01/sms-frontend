import { useState, useEffect } from 'react';
import { Card, Table, Tag, Spin, Empty, Select, message } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import { getStudentProfile } from '../../../services/studentService';
import { getTimetableEntries, getTimetablePeriods } from '../../../services/attendanceService';
import { getAcademicTerms } from '../../../services/academicService';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function ClassSchedule() {
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [terms, setTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [classSectionId, setClassSectionId] = useState(null);
  const [sectionLabel, setSectionLabel] = useState('');

  useEffect(() => {
    loadInitial();
  }, []);

  const loadInitial = async () => {
    setLoading(true);
    try {
      // Get student profile to find their class section
      const profileRes = await getStudentProfile();
      const profile = profileRes?.data;
      const csId = profile?.academic_current?.class_section_id;
      if (!csId) {
        setLoading(false);
        return;
      }
      setClassSectionId(csId);
      setSectionLabel(
        profile?.academic_current?.program_name ||
        `Class ${profile?.academic_current?.class_id} - Sec ${profile?.academic_current?.section_id}` ||
        `Section ${csId}`
      );

      // Load academic terms
      const termsRes = await getAcademicTerms();
      const termsData = Array.isArray(termsRes?.data)
        ? termsRes.data
        : Array.isArray(termsRes?.data?.data)
        ? termsRes.data.data
        : [];
      setTerms(termsData);

      const firstTerm = termsData[0];
      if (firstTerm) {
        setSelectedTerm(firstTerm.id);
        await loadSchedule(csId, firstTerm.id);
      }
    } catch (err) {
      console.error('Failed to load schedule:', err);
      message.error('Failed to load class schedule');
    } finally {
      setLoading(false);
    }
  };

  const loadSchedule = async (csId, termId) => {
    try {
      const [entriesRes, periodsRes] = await Promise.all([
        getTimetableEntries(csId, termId),
        getTimetablePeriods(csId, termId),
      ]);
      const entriesData = Array.isArray(entriesRes?.data)
        ? entriesRes.data
        : Array.isArray(entriesRes?.data?.data)
        ? entriesRes.data.data
        : [];
      const periodsData = Array.isArray(periodsRes?.data)
        ? periodsRes.data
        : Array.isArray(periodsRes?.data?.data)
        ? periodsRes.data.data
        : [];
      setEntries(entriesData);
      setPeriods(periodsData);
    } catch (err) {
      console.error('Failed to load timetable:', err);
    }
  };

  const handleTermChange = async (termId) => {
    setSelectedTerm(termId);
    if (classSectionId) {
      setLoading(true);
      await loadSchedule(classSectionId, termId);
      setLoading(false);
    }
  };

  // Build a day → period map for table display
  const buildGrid = () => {
    const grid = {};
    DAYS.forEach((day, idx) => {
      grid[idx + 1] = {};
    });
    entries.forEach((e) => {
      const day = e.day_of_week; // 1=Mon … 6=Sat
      const period = e.period_id || e.period_number;
      if (day && period) {
        if (!grid[day]) grid[day] = {};
        grid[day][period] = e;
      }
    });
    return grid;
  };

  const grid = buildGrid();
  const periodIds = [...new Set(entries.map((e) => e.period_id || e.period_number))].sort(
    (a, b) => a - b
  );

  const columns = [
    {
      title: 'Day',
      dataIndex: 'day',
      key: 'day',
      width: 110,
      render: (d) => <strong>{d}</strong>,
    },
    ...periodIds.map((pid) => {
      const period = periods.find((p) => p.id === pid || p.period_number === pid);
      const label = period
        ? `P${period.period_number || pid} (${period.start_time?.slice(0, 5) || ''}-${period.end_time?.slice(0, 5) || ''})`
        : `Period ${pid}`;
      return {
        title: label,
        dataIndex: `p${pid}`,
        key: `p${pid}`,
        render: (entry) =>
          entry ? (
            <Tag color="blue" style={{ whiteSpace: 'normal' }}>
              {entry.subject_name || entry.subject_id || '–'}
            </Tag>
          ) : (
            <span style={{ color: '#ccc' }}>—</span>
          ),
      };
    }),
  ];

  const dataSource = DAYS.map((day, idx) => {
    const dayNum = idx + 1;
    const row = { key: dayNum, day };
    periodIds.forEach((pid) => {
      row[`p${pid}`] = grid[dayNum]?.[pid] || null;
    });
    return row;
  });

  return (
    <div style={{ padding: '0 8px' }}>
      <Card
        title={
          <span>
            <CalendarOutlined style={{ marginRight: 8 }} />
            Class Schedule {sectionLabel && `– ${sectionLabel}`}
          </span>
        }
        extra={
          terms.length > 0 && (
            <Select
              value={selectedTerm}
              onChange={handleTermChange}
              style={{ width: 200 }}
              placeholder="Select Term"
            >
              {terms.map((t) => (
                <Select.Option key={t.id} value={t.id}>
                  {t.term_name}
                </Select.Option>
              ))}
            </Select>
          )
        }
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin size="large" />
          </div>
        ) : entries.length === 0 ? (
          <Empty description="No timetable entries found for this term" />
        ) : (
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            bordered
            size="small"
            scroll={{ x: 'max-content' }}
          />
        )}
      </Card>
    </div>
  );
}
