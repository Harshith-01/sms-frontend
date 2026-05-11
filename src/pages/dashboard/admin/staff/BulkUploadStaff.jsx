import { useState } from 'react';
import { Card, Upload, Button, Alert, Table, message, Space } from 'antd';
import { UploadOutlined, DownloadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { bulkUploadStaff } from '../../../../services/staffService';
import './Staff.css';

export default function BulkUploadStaff() {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  const downloadTemplate = () => {
    const template = `full_name,email,contact_number,designation_id,department_id,employment_type,date_of_joining,address,date_of_birth,gender,aadhaar_number
John Doe,john@example.com,9876543210,1,1,FULL_TIME,2024-01-15,123 Street City,1990-05-20,MALE,123456789012
Jane Smith,jane@example.com,9876543211,2,2,PART_TIME,2024-02-01,456 Avenue Town,1992-08-15,FEMALE,234567890123`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'staff_upload_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    message.success('Template downloaded successfully');
  };

  const handleUpload = async (file) => {
    // Validate file type
    const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      || file.type === 'application/vnd.ms-excel'
      || file.name.endsWith('.xlsx')
      || file.name.endsWith('.xls');

    if (!isExcel) {
      message.error('Only .xlsx and .xls files are accepted');
      return false;
    }

    // Validate file size (5MB max)
    const isUnder5MB = file.size / 1024 / 1024 < 5;
    if (!isUnder5MB) {
      message.error('File size must be less than 5MB');
      return false;
    }

    try {
      setUploading(true);
      setResult(null);

      const response = await bulkUploadStaff(file);
      setResult(response.data);

      if (response.data.error_count === 0) {
        message.success(`Successfully uploaded ${response.data.success_count} staff members`);
      } else {
        message.warning(`Uploaded ${response.data.success_count} staff members with ${response.data.error_count} errors`);
      }
    } catch (error) {
      message.error(error.response?.data?.detail || 'Failed to upload file');
    } finally {
      setUploading(false);
    }

    return false; // Prevent auto upload by antd
  };

  const errorColumns = [
    {
      title: 'Error',
      dataIndex: 'error',
      key: 'error',
    }
  ];

  return (
    <div className="bulk-upload-staff-container">
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Bulk Upload Staff</h2>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/admin/staff')}
        >
          Back to Staff List
        </Button>
      </div>

      <Card style={{ marginBottom: 24 }}>
        <Alert
          message="Bulk Upload Instructions"
          description={
            <div>
              <p><strong>Steps to upload staff in bulk:</strong></p>
              <ol>
                <li>Download the Excel template using the button below</li>
                <li>Fill in the staff details following the template format</li>
                <li>Save the file</li>
                <li>Upload the completed file using the upload button</li>
              </ol>
              <p><strong>Important Notes:</strong></p>
              <ul>
                <li>Maximum file size: 5MB</li>
                <li>Maximum rows: 500</li>
                <li>Only .xlsx files are accepted</li>
                <li>Required columns: full_name, email, contact_number, designation_id, employment_type, date_of_joining</li>
                <li>Date format: YYYY-MM-DD (e.g., 2024-01-15)</li>
              </ul>
            </div>
          }
          type="info"
          showIcon
        />
      </Card>

      <Card>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Button
              icon={<DownloadOutlined />}
              onClick={downloadTemplate}
              size="large"
              type="default"
            >
              Download Excel Template
            </Button>
          </div>

          <Upload
            beforeUpload={handleUpload}
            accept=".xlsx,.xls"
            showUploadList={false}
          >
            <Button
              icon={<UploadOutlined />}
              size="large"
              type="primary"
              loading={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload Excel File'}
            </Button>
          </Upload>

          {result && (
            <div>
              <Alert
                message="Upload Results"
                description={
                  <div>
                    <p><strong>Success Count:</strong> {result.success_count}</p>
                    <p><strong>Error Count:</strong> {result.error_count}</p>
                  </div>
                }
                type={result.error_count === 0 ? 'success' : 'warning'}
                showIcon
              />

              {result.errors && result.errors.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <h4>Errors:</h4>
                  <Table
                    columns={errorColumns}
                    dataSource={result.errors.map((error, index) => ({ key: index, error }))}
                    pagination={false}
                    size="small"
                  />
                </div>
              )}
            </div>
          )}
        </Space>
      </Card>
    </div>
  );
}