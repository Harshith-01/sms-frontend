import axios from 'axios';

const DOCUMENT_SERVICE_URL = import.meta.env.VITE_DOCUMENT_SERVICE_URL || 'https://sms-document-service.onrender.com';

const documentAPI = axios.create({
  baseURL: DOCUMENT_SERVICE_URL,
  timeout: 30000,
});

documentAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

documentAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const uploadDocument = async (formData) => {
  return documentAPI.post('/api/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const createDocumentFormData = ({ entityType, entityId = null, file, documentType, isProfilePhoto = false, metadata = {} }) => {
  const formData = new FormData();
  formData.append('entity_type', entityType);
  if (entityId) formData.append('entity_id', entityId);
  formData.append('document_type', documentType);
  formData.append('is_profile_photo', isProfilePhoto);
  formData.append('metadata_json', JSON.stringify(metadata));
  formData.append('file', file);
  return formData;
};

export const getDocumentsByEntity = async (entityType, entityId) => {
  return documentAPI.get(`/api/documents/${entityType}/${entityId}`);
};

export const deleteDocument = async (documentId) => {
  return documentAPI.delete(`/api/documents/${documentId}`);
};

export const updateDocumentStatus = async (documentId, statusUpdate) => {
  return documentAPI.patch(`/api/documents/${documentId}/status`, statusUpdate);
};

export const verifyDocument = async (documentId, verifiedBy = null) => {
  return updateDocumentStatus(documentId, { status: 'verified', verified_by: verifiedBy });
};

export const rejectDocument = async (documentId, rejectionReason) => {
  return updateDocumentStatus(documentId, { status: 'rejected', rejection_reason: rejectionReason });
};

export const getProfilePhoto = async (entityType, entityId) => {
  try {
    const response = await getDocumentsByEntity(entityType, entityId);
    const profilePhoto = response.data.find((doc) => doc.is_profile_photo === true);
    return profilePhoto ? profilePhoto.file_url : null;
  } catch (error) {
    return null;
  }
};

export const uploadProfilePhoto = async (entityType, entityId = null, file) => {
  const formData = createDocumentFormData({
    entityType,
    entityId,
    file,
    documentType: 'profile_photo',
    isProfilePhoto: true,
  });
  return uploadDocument(formData);
};