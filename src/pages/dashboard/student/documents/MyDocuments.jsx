import { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Space, Modal, Image, message } from 'antd';
import { UploadOutlined, EyeOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getStudentProfile } from '../../../../services/profileService';
import { getDocumentsByEntity, deleteDocument } from '../../../../services/documentService';
import dayjs from 'dayjs';
import './Documents.css';

export default function MyDocuments() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [entityId, setEntityId] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      
      // Get student entity ID first
      const profileRes = await getStudentProfile();
      const studentData = profileRes.data.basic || profileRes.data;
      const studentId = studentData.id;
      setEntityId(studentId);
      
      // Fetch documents using entity ID
      const response = await getDocumentsByEntity('student', studentId);
      setDocuments(response.data || []);
    } catch (error) {
      message.error('Failed to load documents');
      console.error(error);
    } finally {
      setLoading(false);
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
          fetchDocuments();
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
    { title: 'Document Type', dataIndex: 'document_type', key: 'document_type', render: (text) => <span style={{ textTransform: 'capitalize' }}>{text?.replace(/_/g, ' ')}</span> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={getStatusTag(status).color}>{getStatusTag(status).text}</Tag> },
    { title: 'Uploaded', dataIndex: 'uploaded_at', key: 'uploaded_at', render: (date) => dayjs(date).format('DD MMM YYYY HH:mm') },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />} onClick={() => { setSelectedDoc(record); setPreviewVisible(true); }}>View</Button>
          <Button size="small" icon={<DownloadOutlined />} href={record.file_url} target="_blank">Download</Button>
          <Button danger size="small" icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="documents-page">
      <Card title={<div className="page-header"><h2>My Documents ({documents.length})</h2><Button type="primary" icon={<UploadOutlined />} onClick={() => navigate('/student/documents/upload')}>Upload Document</Button></div>}>
        <Table columns={columns} dataSource={documents} loading={loading} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
      <Modal title="Document Preview" open={previewVisible} onCancel={() => setPreviewVisible(false)} footer={[<Button key="close" onClick={() => setPreviewVisible(false)}>Close</Button>]} width={800}>
        {selectedDoc && (
          <div className="document-preview">
            <div className="doc-info">
              <p><strong>Type:</strong> {selectedDoc.document_type?.replace(/_/g, ' ')}</p>
              <p><strong>Status:</strong> <Tag color={getStatusTag(selectedDoc.status).color}>{getStatusTag(selectedDoc.status).text}</Tag></p>
              <p><strong>Uploaded:</strong> {dayjs(selectedDoc.uploaded_at).format('DD MMM YYYY HH:mm')}</p>
              {selectedDoc.rejection_reason && <p><strong>Rejection:</strong> {selectedDoc.rejection_reason}</p>}
            </div>
            <div className="doc-preview-container">
              {selectedDoc.file_url?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                <Image src={selectedDoc.file_url} alt="Document" style={{ width: '100%' }} />
              ) : (
                <iframe src={selectedDoc.file_url} style={{ width: '100%', height: '500px', border: 'none' }} title="Document" />
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}