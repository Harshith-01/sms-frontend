import { useState, useEffect } from 'react';
import { Table, Card, Tag, Button, Space, Modal, Image, message, Input, Select } from 'antd';
import { EyeOutlined, CheckOutlined, CloseOutlined, DeleteOutlined, DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import { getStudents } from '../../../../services/studentService';
import { getDocumentsByEntity, verifyDocument, rejectDocument, deleteDocument } from '../../../../services/documentService';
import dayjs from 'dayjs';
import './Documents.css';

export default function StudentDocuments() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterDocuments();
  }, [filterStatus, searchText, documents]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch students with correct pagination
      const studentsRes = await getStudents({ page: 1, page_size: 100 });
      const studentsList = studentsRes.data || [];
      setStudents(studentsList);

      // Fetch documents for each student
      const allDocs = [];
      for (const student of studentsList.slice(0, 30)) {
        try {
          const docsRes = await getDocumentsByEntity('student', student.id);
          const docs = docsRes.data || [];
          docs.forEach(doc => {
            allDocs.push({
              ...doc,
              student_name: student.full_name,
              student_id: student.id,
            });
          });
        } catch (error) {
          console.log(`No docs for student ${student.id}`);
        }
      }
      setDocuments(allDocs);
    } catch (error) {
      message.error('Failed to load student documents');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filterDocuments = () => {
    let filtered = [...documents];
    if (filterStatus !== 'all') {
      filtered = filtered.filter(doc => doc.status === filterStatus);
    }
    if (searchText) {
      filtered = filtered.filter(doc => 
        doc.student_name?.toLowerCase().includes(searchText.toLowerCase()) ||
        doc.document_type?.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    setFilteredDocuments(filtered);
  };

  const handleVerify = async (record) => {
    try {
      await verifyDocument(record.id);
      message.success('Document verified');
      fetchData();
    } catch (error) {
      message.error(error.response?.data?.detail || 'Failed to verify');
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
      message.error(error.response?.data?.detail || 'Failed to reject');
    }
  };

  const handleDelete = async (record) => {
    Modal.confirm({
      title: 'Delete Document',
      content: 'Are you sure?',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteDocument(record.id);
          message.success('Deleted');
          fetchData();
        } catch (error) {
          message.error(error.response?.data?.detail || 'Failed to delete');
        }
      },
    });
  };

  const getStatusTag = (status) => {
    const config = {
      pending_verification: { color: 'orange', text: 'Pending' },
      verified: { color: 'green', text: 'Verified' },
      rejected: { color: 'red', text: 'Rejected' },
    };
    return config[status] || config.pending_verification;
  };

  const columns = [
    { title: 'Student Name', dataIndex: 'student_name', key: 'student_name', sorter: (a, b) => (a.student_name || '').localeCompare(b.student_name || '') },
    { title: 'Document Type', dataIndex: 'document_type', key: 'document_type', render: (text) => <span className="doc-type">{text?.replace(/_/g, ' ')}</span> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={getStatusTag(status).color}>{getStatusTag(status).text}</Tag> },
    { title: 'Uploaded', dataIndex: 'uploaded_at', key: 'uploaded_at', render: (date) => dayjs(date).format('DD MMM YYYY HH:mm') },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => { setSelectedDoc(record); setPreviewVisible(true); }} />
          {record.status === 'pending_verification' && !record.is_profile_photo && (
            <>
              <Button type="primary" size="small" icon={<CheckOutlined />} style={{ background: '#52c41a' }} onClick={() => handleVerify(record)}>Verify</Button>
              <Button danger size="small" icon={<CloseOutlined />} onClick={() => { setSelectedDoc(record); setRejectModalVisible(true); }}>Reject</Button>
            </>
          )}
          <Button danger size="small" icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
        </Space>
      ),
    },
  ];

  return (
    <div className="documents-page">
      <Card title={
        <div className="page-header">
          <h2>Student Documents ({documents.length})</h2>
          <div className="header-actions">
            <Input placeholder="Search..." prefix={<SearchOutlined />} style={{ width: 300 }} onChange={(e) => setSearchText(e.target.value)} />
            <Select value={filterStatus} onChange={setFilterStatus} style={{ width: 150 }}>
              <Select.Option value="all">All Status</Select.Option>
              <Select.Option value="pending_verification">Pending</Select.Option>
              <Select.Option value="verified">Verified</Select.Option>
              <Select.Option value="rejected">Rejected</Select.Option>
            </Select>
          </div>
        </div>
      }>
        <Table columns={columns} dataSource={filteredDocuments} loading={loading} rowKey="id" pagination={{ pageSize: 20 }} />
      </Card>

      <Modal title="Document Preview" open={previewVisible} onCancel={() => setPreviewVisible(false)} footer={[<Button key="download" icon={<DownloadOutlined />} href={selectedDoc?.file_url} target="_blank">Download</Button>, <Button key="close" onClick={() => setPreviewVisible(false)}>Close</Button>]} width={800}>
        {selectedDoc && (
          <div className="document-preview">
            <div className="doc-info">
              <p><strong>Student:</strong> {selectedDoc.student_name}</p>
              <p><strong>Type:</strong> {selectedDoc.document_type?.replace(/_/g, ' ')}</p>
              <p><strong>Status:</strong> <Tag color={getStatusTag(selectedDoc.status).color}>{getStatusTag(selectedDoc.status).text}</Tag></p>
              <p><strong>Uploaded:</strong> {dayjs(selectedDoc.uploaded_at).format('DD MMM YYYY HH:mm')}</p>
              {selectedDoc.verified_at && <p><strong>Verified:</strong> {dayjs(selectedDoc.verified_at).format('DD MMM YYYY HH:mm')}</p>}
              {selectedDoc.rejection_reason && <p><strong>Rejection:</strong> {selectedDoc.rejection_reason}</p>}
            </div>
            <div className="doc-preview-container">
              {selectedDoc.file_url?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                <Image src={selectedDoc.file_url} alt="Document" style={{ maxWidth: '100%' }} />
              ) : (
                <iframe src={selectedDoc.file_url} style={{ width: '100%', height: '500px', border: 'none' }} title="Document" />
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal title="Reject Document" open={rejectModalVisible} onOk={handleReject} onCancel={() => { setRejectModalVisible(false); setRejectReason(''); }} okText="Reject" okButtonProps={{ danger: true }}>
        <p>Rejection reason:</p>
        <Input.TextArea rows={4} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Enter reason..." />
      </Modal>
    </div>
  );
}