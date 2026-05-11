import { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Select, message, Empty, Spin } from 'antd';
import { CalendarOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getMyMeetings } from '../../../services/parentService';
import './Parent.css';

const { Option } = Select;

export default function MyMeetings() {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState(null);

  useEffect(() => {
    fetchMeetings();
  }, [filterStatus]);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      // Pass status as query param object — GET /parents/me/meetings?status=...
      const params = {};
      if (filterStatus) params.status = filterStatus;
      const response = await getMyMeetings(params);
      const data = response.data;
      setMeetings(Array.isArray(data) ? data : data?.items || data?.results || []);
    } catch (error) {
      message.error('Failed to load meetings');
      setMeetings([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${day} ${month} ${year}, ${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };

  const getStatusColor = (status) => {
    const colors = {
      REQUESTED: 'blue',
      APPROVED: 'green',
      REJECTED: 'red',
      COMPLETED: 'default',
      CANCELLED: 'orange'
    };
    return colors[status] || 'default';
  };

  const getModeIcon = (mode) => {
    const icons = { ONLINE: '💻', OFFLINE: '🏫', PHONE: '📞' };
    return icons[mode] || '📅';
  };

  const columns = [
    {
      title: 'Date & Time',
      dataIndex: 'meeting_at',
      key: 'meeting_at',
      render: (date) => formatDateTime(date),
      sorter: (a, b) => new Date(a.meeting_at) - new Date(b.meeting_at),
    },
    {
      title: 'Teacher',
      dataIndex: 'teacher_name',
      key: 'teacher_name',
      render: (name) => name || 'N/A',
    },
    {
      title: 'Student',
      dataIndex: 'student_name',
      key: 'student_name',
      render: (name) => name || 'General Discussion',
    },
    {
      title: 'Duration',
      dataIndex: 'duration_minutes',
      key: 'duration_minutes',
      render: (mins) => `${mins} min`,
    },
    {
      title: 'Mode',
      dataIndex: 'mode',
      key: 'mode',
      render: (mode) => <span>{getModeIcon(mode)} {mode}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div>
          {record.status === 'APPROVED' && record.meeting_link && (
            <Button type="link" size="small" onClick={() => window.open(record.meeting_link, '_blank')}>
              Join Meeting
            </Button>
          )}
          <Button type="link" size="small">View Details</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="my-meetings-container">
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>My Meetings</h2>
        <div>
          <Button icon={<ReloadOutlined />} onClick={fetchMeetings} style={{ marginRight: 8 }}>
            Refresh
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/parent/meetings/request')}>
            Request New Meeting
          </Button>
        </div>
      </div>

      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span>Filter by Status:</span>
          <Select
            style={{ width: 200 }}
            value={filterStatus}
            onChange={setFilterStatus}
            allowClear
            placeholder="All Statuses"
          >
            <Option value="REQUESTED">Requested</Option>
            <Option value="APPROVED">Approved</Option>
            <Option value="REJECTED">Rejected</Option>
            <Option value="COMPLETED">Completed</Option>
            <Option value="CANCELLED">Cancelled</Option>
          </Select>
        </div>
      </Card>

      <Card>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
          </div>
        ) : meetings.length === 0 ? (
          <Empty description="No meetings found" image={Empty.PRESENTED_IMAGE_SIMPLE}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/parent/meetings/request')}>
              Request Your First Meeting
            </Button>
          </Empty>
        ) : (
          <Table
            columns={columns}
            dataSource={meetings}
            rowKey={(r, i) => r.id ?? i}
            pagination={{ pageSize: 10 }}
          />
        )}
      </Card>

      <div style={{ marginTop: 16, padding: 12, background: '#f0f2f5', borderRadius: 4 }}>
        <strong>Legend:</strong>
        <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          <span><Tag color="blue">REQUESTED</Tag> - Waiting for teacher approval</span>
          <span><Tag color="green">APPROVED</Tag> - Meeting confirmed</span>
          <span><Tag color="red">REJECTED</Tag> - Request declined</span>
          <span><Tag color="default">COMPLETED</Tag> - Meeting finished</span>
          <span><Tag color="orange">CANCELLED</Tag> - Meeting cancelled</span>
        </div>
      </div>
    </div>
  );
}