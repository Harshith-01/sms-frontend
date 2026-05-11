import { useState, useEffect } from 'react';
import { Table, Card, Tag, Button, Space, Modal, Image, message, Input, Select } from 'antd';
import { EyeOutlined, CheckOutlined, CloseOutlined, DeleteOutlined, DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import { getTeachers } from '../../../../services/teacherService';
import { getDocumentsByEntity, verifyDocument, rejectDocument, deleteDocument } from '../../../../services/documentService';
import dayjs from 'dayjs';
import './Documents.css';

export default function TeacherDocuments() {
  const [loading, setLoading] = useState(true);
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
      const teachersRes = await getTeachers({ page: 1, page_size: 100 });
      const teachersList = teachersRes.data || [];
      const allDocs = [];
      
      for (const teacher of teachersList.slice(0, 30)) {
        try {
          const docsRes = await getDocumentsByEntity('teacher', teacher.id);
          const docs = docsRes.data || [];
          docs.forEach(doc => {
            allDocs.push({
              ...doc,
              teacher_name: teacher.full_name,
              teacher_id: teacher.id,
            });
          });
        } catch (error) {
          console.log(`No docs for teacher ${teacher.id}`);
        }
      }
      setDocuments(allDocs);
    } catch (error) {
      message.error('Failed to load teacher documents');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filterDocuments = () => {
    let filtered = [...documents];
    if (filterStatus !== 'all') filtered = filtered.filter(doc => doc.status === filterStatus);
    if (searchText) {
      filtered = filtered.filter(doc => 
        doc.teacher_name?.toLowerCase().includes(searchText.toLowerCase()) ||
        doc.document_type?.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    setFilteredDocuments(filtered);
  };

  const handleVerify = async (record) => {
    try {
      await verifyDocument(record.id);
      message.success('Verified');
      fetchData();
    } catch (error) {
      message.error(error.response?.data?.detail || 'Failed');
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      message.error('Provide reason');
      return;
    }
    try {
      await rejectDocument(selectedDoc.id, rejectReason);
      message.success('Rejected');
      setRejectModalVisible(false);
      setRejectReason('');
      fetchData();
    } catch (error) {
      message.error(error.response?.data?.detail || 'Failed');
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
          message.error(error.response?.data?.detail || 'Failed');
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
    { title: 'Teacher Name', dataIndex: 'teacher_name', key: 'teacher_name' },
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
      <Card title={<div className="page-header"><h2>Teacher Documents ({documents.length})</h2><div className="header-actions"><Input placeholder="Search..." prefix={<SearchOutlined />} style={{ width: 300 }} onChange={(e) => setSearchText(e.target.value)} /><Select value={filterStatus} onChange={setFilterStatus} style={{ width: 150 }}><Select.Option value="all">All</Select.Option><Select.Option value="pending_verification">Pending</Select.Option><Select.Option value="verified">Verified</Select.Option><Select.Option value="rejected">Rejected</Select.Option></Select></div></div>}>
        <Table columns={columns} dataSource={filteredDocuments} loading={loading} rowKey="id" pagination={{ pageSize: 20 }} />
      </Card>
      <Modal title="Document Preview" open={previewVisible} onCancel={() => setPreviewVisible(false)} footer={[<Button key="download" icon={<DownloadOutlined />} href={selectedDoc?.file_url} target="_blank">Download</Button>, <Button key="close" onClick={() => setPreviewVisible(false)}>Close</Button>]} width={800}>
        {selectedDoc && (<div className="document-preview"><div className="doc-info"><p><strong>Teacher:</strong> {selectedDoc.teacher_name}</p><p><strong>Type:</strong> {selectedDoc.document_type?.replace(/_/g, ' ')}</p><p><strong>Status:</strong> <Tag color={getStatusTag(selectedDoc.status).color}>{getStatusTag(selectedDoc.status).text}</Tag></p><p><strong>Uploaded:</strong> {dayjs(selectedDoc.uploaded_at).format('DD MMM YYYY HH:mm')}</p></div><div className="doc-preview-container">{selectedDoc.file_url?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? <Image src={selectedDoc.file_url} alt="Document" style={{ maxWidth: '100%' }} /> : <iframe src={selectedDoc.file_url} style={{ width: '100%', height: '500px', border: 'none' }} title="Document" />}</div></div>)}
      </Modal>
      <Modal title="Reject" open={rejectModalVisible} onOk={handleReject} onCancel={() => { setRejectModalVisible(false); setRejectReason(''); }} okText="Reject" okButtonProps={{ danger: true }}><Input.TextArea rows={4} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Reason..." /></Modal>
    </div>
  );
}