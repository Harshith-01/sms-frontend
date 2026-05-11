import { useState, useEffect } from 'react';
import { Card, Descriptions, Spin, message, Tag } from 'antd';
import { getMyProfile } from '../../../services/staffService';
import './Staff.css';

export default function StaffMyProfile() {
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
    return <Card>Profile not found</Card>;
  }

  return (
    <div className="staff-my-profile-container">
      <h2>My Profile</h2>

      <Card>
        <Descriptions bordered column={{ xs: 1, sm: 1, md: 2 }}>
          <Descriptions.Item label="Staff ID">
            <Tag color="blue">{profile.id}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Status">
            <Tag color={profile.status === 'ACTIVE' ? 'success' : 'default'}>
              {profile.status}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Full Name">{profile.full_name}</Descriptions.Item>
          <Descriptions.Item label="Email">{profile.email}</Descriptions.Item>

          <Descriptions.Item label="Contact Number">{profile.contact_number || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Emergency Contact">{profile.emergency_contact || 'N/A'}</Descriptions.Item>

          <Descriptions.Item label="Date of Birth">
            {profile.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Gender">{profile.gender || 'N/A'}</Descriptions.Item>

          <Descriptions.Item label="Aadhaar Number">{profile.aadhaar_number || 'N/A'}</Descriptions.Item>

          <Descriptions.Item label="Employment Type">
            <Tag color="blue">{profile.employment_type?.replace('_', ' ')}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Date of Joining">
            {profile.date_of_joining ? new Date(profile.date_of_joining).toLocaleDateString() : 'N/A'}
          </Descriptions.Item>

          <Descriptions.Item label="Address" span={2}>
            {profile.address || 'N/A'}
          </Descriptions.Item>
        </Descriptions>

        <div style={{ marginTop: 16, padding: 12, background: '#f0f2f5', borderRadius: 4 }}>
          <strong>Note:</strong> To update your profile information, please contact the school administration.
        </div>
      </Card>
    </div>
  );
}