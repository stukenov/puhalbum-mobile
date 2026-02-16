import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native';

import { Header } from '../components/Header';
import { PhotoSelector } from '../components/PhotoSelector';
import { FileList } from '../components/FileList';
import { apiService } from '../services/api';
import { storageService } from '../services/storage';
import { colors, spacing } from '../constants/theme';

export const HomeScreen = () => {
  const [userId, setUserId] = useState(null);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // Initialize user
  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  // Auto-refresh files
  useEffect(() => {
    if (!userId) return;

    const interval = setInterval(() => {
      loadUserFiles(false);
    }, 5000);

    return () => clearInterval(interval);
  }, [userId, loadUserFiles]);

  const initializeUser = useCallback(async () => {
    try {
      let storedUserId = await storageService.getUserId();

      if (!storedUserId) {
        try {
          const response = await apiService.createUser();
          storedUserId = response.userId;
          await storageService.setUserId(storedUserId);
        } catch (error) {
          // Fallback to anonymous ID
          storedUserId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          await storageService.setUserId(storedUserId);
        }
      }

      setUserId(storedUserId);
      try {
        const response = await apiService.getUserFiles(storedUserId);
        setFiles(response.files || []);
      } catch (error) {
        console.error('Error loading files after init:', error);
      }
    } catch (error) {
      console.error('Error initializing user:', error);
      Alert.alert('Ошибка', 'Не удалось инициализировать пользователя');
    }
  }, []);

  const loadUserFiles = useCallback(async (showLoading = true) => {
    if (!userId) return;

    try {
      if (showLoading) setLoading(true);
      const response = await apiService.getUserFiles(userId);
      setFiles(response.files || []);
    } catch (error) {
      console.error('Error loading files:', error);
      if (showLoading) {
        Alert.alert('Ошибка', 'Не удалось загрузить список файлов');
      }
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [userId]);

  const handleSelectPhotos = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Ошибка', 'Необходимо разрешение для доступа к галерее');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        // MediaTypeOptions is deprecated in expo-image-picker@17
        // Use MediaType or an array of MediaType
        mediaTypes: [ImagePicker.MediaType.Images],
        allowsMultipleSelection: true,
        quality: 0.9,
        selectionLimit: 20
      });

      if (!result.canceled && result.assets) {
        const newPhotos = result.assets.map(asset => {
          const inferredType = asset.mimeType || (asset.type === 'image' ? 'image/jpeg' : 'video/mp4');
          // Keep fileName if present; otherwise derive an extension from mime type
          const extFromMime = inferredType.split('/')[1] || 'jpg';
          const derivedName = `photo_${Date.now()}.${extFromMime}`;
          return {
            uri: asset.uri,
            fileName: asset.fileName || derivedName,
            type: inferredType
          };
        });
        setSelectedPhotos(prev => [...prev, ...newPhotos]);
      }
    } catch (error) {
      console.error('Error selecting photos:', error);
      Alert.alert('Ошибка', 'Не удалось выбрать фотографии');
    }
  };

  const handleRemovePhoto = (index) => {
    setSelectedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!userId || selectedPhotos.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    let uploaded = 0;
    const total = selectedPhotos.length;

    for (const photo of selectedPhotos) {
      try {
        await apiService.uploadFile(userId, photo);
        uploaded++;
        setUploadProgress((uploaded / total) * 100);
      } catch (error) {
        console.error('Error uploading photo:', error);
      }
    }

    setUploading(false);
    setUploadProgress(0);

    if (uploaded > 0) {
      Alert.alert('Успех', `Успешно загружено ${uploaded} из ${total} файлов`);
      setSelectedPhotos([]);
      await loadUserFiles();
    } else {
      Alert.alert('Ошибка', 'Не удалось загрузить файлы');
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadUserFiles(false);
    setRefreshing(false);
  }, [loadUserFiles]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Header userId={userId} />

        <PhotoSelector
          selectedPhotos={selectedPhotos}
          onSelectPhotos={handleSelectPhotos}
          onRemovePhoto={handleRemovePhoto}
          onUpload={handleUpload}
          uploading={uploading}
          progress={uploadProgress}
        />

        <FileList
          files={files}
          loading={loading}
          userId={userId}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  container: {
    flex: 1
  },
  contentContainer: {
    padding: spacing.lg
  }
});
