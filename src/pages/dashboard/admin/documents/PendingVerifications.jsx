import { useState, useEffect } from 'react';
import { Table, Card, Tag, Button, Space, Modal, message, Input } from 'antd';
import { EyeOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { getStudents } from '../../../../services/studentService';
import { getTeachers } from '../../../../services/teacherService';
import { getDocumentsByEntity, verifyDocument, rejectDocument } from '../../../../services/documentService';
import dayjs from 'dayjs';
import './Documents.css';

export default function PendingVerifications() {
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fix: Use correct pagination parameters
      const [studentsRes, teachersRes] = await Promise.all([
        getStudents({ page: 1, page_size: 50 }).catch(() => ({ data: [] })),
        getTeachers({ page: 1, page_size: 50 }).catch(() => ({ data: [] }))
      ]);
      
      const students = studentsRes.data || [];
      const teachers = teachersRes.data || [];
      const allDocs = [];
      
      for (const student of students.slice(0, 20)) {
        try {
          const docsRes = await getDocumentsByEntity('student', student.id);
          (docsRes.data || []).forEach(doc => {
            if (doc.status === 'pending_verification' && !doc.is_profile_photo) {
              allDocs.push({ ...doc, entity_name: student.full_name, entity_type: 'Student' });
            }
          });
        } catch (error) {
          console.log('Error fetching student docs');
        }
      }
      
      for (const teacher of teachers.slice(0, 20)) {
        try {
          const docsRes = await getDocumentsByEntity('teacher', teacher.id);
          (docsRes.data || []).forEach(doc => {
            if (doc.status === 'pending_verification' && !doc.is_profile_photo) {
              allDocs.push({ ...doc, entity_name: teacher.full_name, entity_type: 'Teacher' });
            }
          });
        } catch (error) {
          console.log('Error fetching teacher docs');
        }
      }
      
      setDocuments(allDocs);
    } catch (error) {
      message.error('Failed to load pending documents');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (record) => {
    try {
      await verifyDocument(record.id);
      message.success('Document verified');
      fetchData();
    } catch (error) {
      message.error('Failed to verify');
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      message.error('Provide rejection reason');
      return;
    }
    try {
      await rejectDocument(selectedDoc.id, rejectReason);
      message.success('Document rejected');
      setRejectModalVisible(false);
      setRejectReason('');
      fetchData();
    } catch (error) {
      message.error('Failed to reject');
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'entity_name', key: 'entity_name' },
    { title: 'Type', dataIndex: 'entity_type', key: 'entity_type', render: (text) => <Tag color="blue">{text}</Tag> },
    { title: 'Document', dataIndex: 'document_type', key: 'document_type', render: (text) => text?.replace(/_/g, ' ') },
    { title: 'Uploaded', dataIndex: 'uploaded_at', key: 'uploaded_at', render: (date) => dayjs(date).format('DD MMM YYYY') },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="primary" size="small" icon={<CheckOutlined />} style={{ background: '#52c41a' }} onClick={() => handleVerify(record)}>Verify</Button>
          <Button danger size="small" icon={<CloseOutlined />} onClick={() => { setSelectedDoc(record); setRejectModalVisible(true); }}>Reject</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="documents-page">
      <Card title={<h2>Pending Verifications ({documents.length})</h2>}>
        <Table columns={columns} dataSource={documents} loading={loading} rowKey="id" pagination={{ pageSize: 20 }} />
      </Card>
      <Modal title="Reject Document" open={rejectModalVisible} onOk={handleReject} onCancel={() => { setRejectModalVisible(false); setRejectReason(''); }} okText="Reject" okButtonProps={{ danger: true }}>
        <Input.TextArea rows={4} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Enter reason..." />
      </Modal>
    </div>
  );
}