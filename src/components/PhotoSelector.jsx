import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../constants/theme';

export const PhotoSelector = ({ selectedPhotos, onSelectPhotos, onRemovePhoto, onUpload, uploading, progress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.selectButton}
        onPress={onSelectPhotos}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonIcon}>📸</Text>
        <Text style={styles.buttonText}>Выбрать фотографии</Text>
      </TouchableOpacity>

      {selectedPhotos.length > 0 && (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.photosScroll}
            contentContainerStyle={styles.photosContainer}
          >
            {selectedPhotos.map((photo, index) => (
              <View key={index} style={styles.photoItem}>
                <Image source={{ uri: photo.uri }} style={styles.photoImage} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => onRemovePhoto(index)}
                >
                  <Text style={styles.removeIcon}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={[styles.uploadButton, (uploading || selectedPhotos.length === 0) && styles.uploadButtonDisabled]}
            onPress={onUpload}
            disabled={uploading || selectedPhotos.length === 0}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonIcon}>⬆</Text>
            <Text style={styles.buttonText}>
              {uploading ? 'Загрузка...' : 'Загрузить файлы'}
            </Text>
          </TouchableOpacity>

          {uploading && (
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.xl,
    ...shadows.md,
    borderWidth: 1,
    borderColor: colors.outline,
    marginBottom: spacing.lg
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    borderWidth: 1,
    borderColor: colors.outlineStrong,
    ...shadows.sm
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    borderWidth: 1,
    borderColor: colors.outlineStrong,
    ...shadows.sm,
    marginTop: spacing.lg
  },
  uploadButtonDisabled: {
    opacity: 0.4
  },
  buttonIcon: {
    fontSize: 20
  },
  buttonText: {
    color: colors.primaryContrast,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2
  },
  photosScroll: {
    marginTop: spacing.lg
  },
  photosContainer: {
    gap: spacing.sm
  },
  photoItem: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    backgroundColor: colors.surfaceVariant,
    borderWidth: 1,
    borderColor: colors.outline,
    position: 'relative'
  },
  photoImage: {
    width: '100%',
    height: '100%'
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  removeIcon: {
    color: 'white',
    fontSize: 16
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: colors.outline,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginTop: spacing.lg
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.text
  }
});
