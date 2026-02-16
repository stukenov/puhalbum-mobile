import axios from 'axios';
import { Platform } from 'react-native';
import { API_URL } from '../constants/config';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const apiService = {
  // User Management
  async createUser() {
    try {
      const response = await api.post('/api/user/create');
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // File Upload
  async uploadFile(userId, file) {
    try {
      const formData = new FormData();

      // Prepare file for upload
      const fileUri = file.uri;
      const fileName = file.fileName || `photo_${Date.now()}.jpg`;
      const fileType = file.type || 'image/jpeg';

      if (Platform.OS === 'web') {
        // On web, FormData expects a Blob/File, not the RN { uri, name, type } object
        const response = await fetch(fileUri);
        const blob = await response.blob();
        const effectiveType = fileType || blob.type || 'application/octet-stream';
        const ext = (effectiveType.split('/')[1] || 'bin');
        const effectiveName = fileName || `upload_${Date.now()}.${ext}`;
        const webFile = new File([blob], effectiveName, { type: effectiveType });
        formData.append('file', webFile);
      } else {
        // Native (iOS/Android) can use the RN-style object
        formData.append('file', {
          uri: fileUri,
          name: fileName,
          type: fileType
        });
      }

      const response = await api.post(`/api/upload/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  // Get User Files
  async getUserFiles(userId) {
    try {
      const response = await api.get(`/api/files/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting user files:', error);
      throw error;
    }
  },

  // Get File URL
  getFileUrl(userId, filename, processed = false) {
    const encodedFilename = encodeURIComponent(filename);
    return `${API_URL}/api/file/${userId}/${encodedFilename}${processed ? '?processed=true' : ''}`;
  }
};
