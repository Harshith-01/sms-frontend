import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Table, Button, Empty, Spin, message, Select, Tag } from 'antd';
import { ArrowLeftOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import { getChildReportCards, getMyChildren } from '../../../services/parentService';
import './Parent.css';

const { Option } = Select;

export default function ChildReportCards() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [reportCards, setReportCards] = useState([]);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedChild, setSelectedChild] = useState(studentId);

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    if (selectedChild) {
      fetchReportCards();
    }
  }, [selectedChild]);

  const fetchChildren = async () => {
    try {
      const response = await getMyChildren();
      const kids = response.data || [];
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

  const fetchReportCards = async () => {
    try {
      setLoading(true);
      const response = await getChildReportCards(selectedChild);
      setReportCards(response.data || []);
    } catch (error) {
      message.error('Failed to load report cards');
    } finally {
      setLoading(false);
    }
  };

  const selectedChildData = children.find(c => c.student_id === selectedChild);
  const canViewAcademics = selectedChildData?.can_view_academics;

  const columns = [
    {
      title: 'Academic Year',
      dataIndex: 'academic_year',
      key: 'academic_year',
    },
    {
      title: 'Term',
      dataIndex: 'term',
      key: 'term',
    },
    {
      title: 'Class',
      dataIndex: 'class_name',
      key: 'class_name',
    },
    {
      title: 'Overall Grade',
      dataIndex: 'overall_grade',
      key: 'overall_grade',
      render: (grade) => <Tag color="blue">{grade}</Tag>,
    },
    {
      title: 'GPA',
      dataIndex: 'gpa',
      key: 'gpa',
      render: (gpa) => <strong>{gpa}</strong>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'PUBLISHED' ? 'green' : 'orange'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Button size="small" icon={<EyeOutlined />}>
          View Details
        </Button>
      ),
    },
  ];

  if (!canViewAcademics) {
    return (
      <Card>
        <Empty
          description="You don't have permission to view report cards for this child"
        >
          <Button onClick={() => navigate('/parent/children')}>
            Back to My Children
          </Button>
        </Empty>
      </Card>
    );
  }

  return (
    <div className="child-report-cards-container">
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Report Cards</h2>
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
              .filter(c => c.can_view_academics)
              .map(child => (
                <Option key={child.student_id} value={child.student_id}>
                  {child.full_name} ({child.student_id})
                </Option>
              ))}
          </Select>
        </div>
      </Card>

      <Card title="Academic Report Cards">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
          </div>
        ) : reportCards.length === 0 ? (
          <Empty description="No report cards available yet" />
        ) : (
          <Table
            columns={columns}
            dataSource={reportCards}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        )}
      </Card>
    </div>
  );
}