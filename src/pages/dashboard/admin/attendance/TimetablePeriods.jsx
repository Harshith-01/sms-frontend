import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Card, Select, TimePicker, InputNumber } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getTimetablePeriods, createTimetablePeriod } from '../../../../services/attendanceService';
import { getClassSections, getAcademicTerms } from '../../../../services/academicService';
import dayjs from 'dayjs';
import './Attendance.css';
 
const { Option } = Select;
 
const weekdayNames = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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
 
export default function TimetablePeriods() {
  const [data, setData] = useState([]);
  const [classSections, setClassSections] = useState([]);
  const [academicTerms, setAcademicTerms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClassSection, setSelectedClassSection] = useState(null);
  const [selectedAcademicTerm, setSelectedAcademicTerm] = useState(null);
  const [selectedWeekday, setSelectedWeekday] = useState(1);
  const [form] = Form.useForm();
 
  useEffect(() => {
    fetchClassSections();
    fetchAcademicTerms();
  }, []);
 
  useEffect(() => {
    if (selectedClassSection && selectedAcademicTerm) {
      fetchData();
    }
  }, [selectedClassSection, selectedAcademicTerm]);
 
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
 
  const fetchAcademicTerms = async () => {
    try {
      const response = await getAcademicTerms();
      const rows = extractRows(response?.data);
      setAcademicTerms(rows);
      const current = rows.find(t => t.is_current);
      if (current) {
        setSelectedAcademicTerm(current.id);
      } else if (rows.length > 0) {
        setSelectedAcademicTerm(rows[0].id);
      }
    } catch (error) {
      message.error('Failed to fetch academic terms');
    }
  };
 
  const fetchData = async () => {
    if (!selectedClassSection || !selectedAcademicTerm) return;
    setLoading(true);
    try {
      const response = await getTimetablePeriods(selectedClassSection, selectedAcademicTerm);
      setData(extractRows(response?.data));
    } catch (error) {
      message.error('Failed to fetch timetable periods');
    } finally {
      setLoading(false);
    }
  };
 
  const handleAdd = () => {
    form.resetFields();
    form.setFieldsValue({
      academic_term_id: selectedAcademicTerm,
      class_section_id: selectedClassSection,
      weekday: selectedWeekday,
      period_type: 'CLASS'
    });
    setModalOpen(true);
  };
 
  const handleSubmit = async (values) => {
    try {
      await createTimetablePeriod({
        ...values,
        start_time: values.start_time.format('HH:mm:ss'),
        end_time: values.end_time.format('HH:mm:ss'),
      });
      message.success('Period created successfully');
      setModalOpen(false);
      fetchData();
    } catch (error) {
      message.error(error.response?.data?.detail || 'Failed to create period');
    }
  };
 
  const filteredData = data.filter(p => p.weekday === selectedWeekday);
 
  const columns = [
    { title: 'Period No', dataIndex: 'period_no', key: 'period_no', width: 100 },
    { 
      title: 'Start Time', 
      dataIndex: 'start_time', 
      key: 'start_time', 
      render: (text) => dayjs(text, 'HH:mm:ss').format('hh:mm A') 
    },
    { 
      title: 'End Time', 
      dataIndex: 'end_time', 
      key: 'end_time', 
      render: (text) => dayjs(text, 'HH:mm:ss').format('hh:mm A') 
    },
    { 
      title: 'Type', 
      dataIndex: 'period_type', 
      key: 'period_type', 
      render: (text) => (
        <span className={`status-badge ${text.toLowerCase()}`}>
          {text}
        </span>
      )
    },
  ];
 
  return (
    <div className="attendance-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Timetable Periods</h1>
          <p className="page-description">Define period structure for classes</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="large">
          Create Period
        </Button>
      </div>
 
      <div className="page-content">
        <Card className="table-card">
          <div className="filter-section">
            <Select
              style={{ width: 200 }}
              placeholder="Select Class Section"
              value={selectedClassSection}
              onChange={setSelectedClassSection}
            >
              {classSections.map(cs => (
                <Option key={cs.id} value={cs.id}>
                  {classSectionLabel(cs)}
                </Option>
              ))}
            </Select>
 
            <Select
              style={{ width: 180 }}
              placeholder="Select Academic Term"
              value={selectedAcademicTerm}
              onChange={setSelectedAcademicTerm}
            >
              {academicTerms.map(t => (
                <Option key={t.id} value={t.id}>
                  {t.term_name}
                </Option>
              ))}
            </Select>
 
            <Select
              style={{ width: 150 }}
              value={selectedWeekday}
              onChange={setSelectedWeekday}
            >
              {[1, 2, 3, 4, 5, 6, 7].map(day => (
                <Option key={day} value={day}>
                  {weekdayNames[day]}
                </Option>
              ))}
            </Select>
          </div>
 
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            loading={loading}
            pagination={false}
          />
        </Card>
      </div>
 
      <Modal
        title="Create Period"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="academic_term_id" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="class_section_id" hidden>
            <Input />
          </Form.Item>
 
          <Form.Item name="weekday" label="Weekday" rules={[{ required: true }]}>
            <Select>
              {[1, 2, 3, 4, 5, 6, 7].map(day => (
                <Option key={day} value={day}>
                  {weekdayNames[day]}
                </Option>
              ))}
            </Select>
          </Form.Item>
 
          <Form.Item name="period_no" label="Period Number" rules={[{ required: true }]}>
            <InputNumber min={1} max={20} style={{ width: '100%' }} />
          </Form.Item>
 
          <Form.Item name="start_time" label="Start Time" rules={[{ required: true }]}>
            <TimePicker format="HH:mm" style={{ width: '100%' }} />
          </Form.Item>
 
          <Form.Item name="end_time" label="End Time" rules={[{ required: true }]}>
            <TimePicker format="HH:mm" style={{ width: '100%' }} />
          </Form.Item>
 
          <Form.Item name="period_type" label="Period Type" rules={[{ required: true }]}>
            <Select>
              <Option value="CLASS">Class</Option>
              <Option value="BREAK">Break</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}