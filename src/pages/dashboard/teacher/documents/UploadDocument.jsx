import { useState } from 'react';
import { Card, Form, Select, Upload, Button, message, Progress, Space } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { uploadDocument, createDocumentFormData } from '../../../../services/documentService';
import './Documents.css';

const { Dragger } = Upload;

export default function UploadDocument() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileList, setFileList] = useState([]);

  const documentTypes = [
    { value: 'id_proof', label: 'ID Proof' },
    { value: 'resume', label: 'Resume/CV' },
    { value: 'certificate', label: 'Certificate' },
    { value: 'degree', label: 'Degree' },
    { value: 'experience_letter', label: 'Experience Letter' },
    { value: 'profile_photo', label: 'Profile Photo' },
    { value: 'other', label: 'Other' },
  ];

  const uploadProps = {
    name: 'file',
    multiple: false,
    maxCount: 1,
    accept: '.pdf,.jpg,.jpeg,.png',
    fileList: fileList,
    beforeUpload: (file) => {
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('File must be smaller than 5MB!');
        return Upload.LIST_IGNORE;
      }
      
      const isValidType = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
      if (!isValidType) {
        message.error('Only PDF, JPG, PNG files are allowed!');
        return Upload.LIST_IGNORE;
      }
      
      setFileList([file]);
      return false;
    },
    onRemove: () => {
      setFileList([]);
    },
  };

  const handleUpload = async (values) => {
    const { documentType } = values;
    
    if (!fileList || fileList.length === 0) {
      message.error('Please select a file to upload');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(30);
      
      const isProfilePhoto = documentType === 'profile_photo';
      const formData = createDocumentFormData({
        entityType: 'teacher',
        file: fileList[0],
        documentType,
        isProfilePhoto,
      });
      
      setUploadProgress(60);
      await uploadDocument(formData);
      setUploadProgress(100);
      message.success('Document uploaded successfully!');
      
      form.resetFields();
      setFileList([]);
      
      setTimeout(() => {
        navigate('/teacher/documents');
      }, 1500);
    } catch (error) {
      console.error('Upload error:', error);
      message.error(error.response?.data?.detail || 'Upload failed. Please try again.');
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="documents-page">
      <Card title={<h2>Upload Document</h2>}>
        <Form form={form} layout="vertical" onFinish={handleUpload}>
          <Form.Item 
            name="documentType" 
            label="Document Type" 
            rules={[{ required: true, message: 'Please select document type' }]}
          >
            <Select 
              placeholder="Select document type" 
              options={documentTypes}
              size="large"
            />
          </Form.Item>
          
          <Form.Item label="File">
            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">
                Support for PDF, JPG, PNG files. Maximum file size: 5MB
              </p>
            </Dragger>
          </Form.Item>

          {uploadProgress > 0 && (
            <Form.Item>
              <Progress 
                percent={uploadProgress} 
                status={uploading ? 'active' : 'success'} 
              />
            </Form.Item>
          )}

          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<UploadOutlined />} 
                loading={uploading}
                disabled={fileList.length === 0}
              >
                Upload Document
              </Button>
              <Button onClick={() => navigate('/teacher/documents')}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}