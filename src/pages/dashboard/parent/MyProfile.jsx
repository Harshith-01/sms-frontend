import { useState, useEffect } from 'react';
import { Card, Descriptions, Tag, Spin, message } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, HomeOutlined } from '@ant-design/icons';
import { getMyProfile } from '../../../services/parentService';
import './Parent.css';

export default function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getMyProfile();
      setProfile(response.data);
    } catch (error) {
      message.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!profile) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <p>Profile not found</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="parent-profile-container">
      <h2>My Profile</h2>

      <Card>
        <Descriptions bordered column={{ xs: 1, sm: 1, md: 2 }}>
          <Descriptions.Item label={<><UserOutlined /> Parent ID</>}>
            <Tag color="blue">{profile.id}</Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label={<><UserOutlined /> Status</>}>
            <Tag color={profile.is_active ? 'success' : 'default'}>
              {profile.is_active ? 'Active' : 'Inactive'}
            </Tag>
          </Descriptions.Item>

          {profile.father_name && (
            <Descriptions.Item label="Father's Name">
              {profile.father_name}
            </Descriptions.Item>
          )}

          {profile.mother_name && (
            <Descriptions.Item label="Mother's Name">
              {profile.mother_name}
            </Descriptions.Item>
          )}

          {profile.guardian_name && (
            <Descriptions.Item label="Guardian's Name">
              {profile.guardian_name}
            </Descriptions.Item>
          )}

          <Descriptions.Item label={<><PhoneOutlined /> Primary Contact</>}>
            {profile.primary_contact}
          </Descriptions.Item>

          {profile.secondary_contact && (
            <Descriptions.Item label={<><PhoneOutlined /> Secondary Contact</>}>
              {profile.secondary_contact}
            </Descriptions.Item>
          )}

          {profile.guardian_contact && (
            <Descriptions.Item label={<><PhoneOutlined /> Guardian Contact</>}>
              {profile.guardian_contact}
            </Descriptions.Item>
          )}

          <Descriptions.Item label={<><MailOutlined /> Email</>}>
            {profile.email}
          </Descriptions.Item>

          {profile.guardian_email && (
            <Descriptions.Item label={<><MailOutlined /> Guardian Email</>}>
              {profile.guardian_email}
            </Descriptions.Item>
          )}

          {profile.occupation && (
            <Descriptions.Item label="Occupation">
              {profile.occupation}
            </Descriptions.Item>
          )}

          {profile.annual_income && (
            <Descriptions.Item label="Annual Income">
              ₹{profile.annual_income}
            </Descriptions.Item>
          )}

          {profile.address && (
            <Descriptions.Item label={<><HomeOutlined /> Current Address</>} span={2}>
              {profile.address}
            </Descriptions.Item>
          )}

          {profile.permanent_address && (
            <Descriptions.Item label={<><HomeOutlined /> Permanent Address</>} span={2}>
              {profile.permanent_address}
            </Descriptions.Item>
          )}
        </Descriptions>

        <div style={{ marginTop: 16, padding: '12px', background: '#f0f2f5', borderRadius: '4px' }}>
          <p style={{ margin: 0, color: '#666' }}>
            <strong>Note:</strong> To update your profile information, please contact the school administration.
          </p>
        </div>
      </Card>
    </div>
  );
}