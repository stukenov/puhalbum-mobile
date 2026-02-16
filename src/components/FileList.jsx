import React from 'react';
import { View, Text, Image, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../constants/theme';
import { formatBytes, formatDate } from '../utils/format';
import { apiService } from '../services/api';

const Badge = ({ type, text, title }) => {
  const badgeStyles = {
    processing: { bg: colors.warning.bg, text: colors.warning.text, border: colors.warning.border },
    validated: { bg: '#D1FAE5', text: '#065F46', border: '#A7F3D0' },
    rejected: { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA' },
    pending: { bg: colors.info.bg, text: colors.info.text, border: colors.info.border }
  };

  const style = badgeStyles[type] || badgeStyles.processing;

  return (
    <View style={[styles.badge, { backgroundColor: style.bg, borderColor: style.border }]}>
      <Text style={[styles.badgeText, { color: style.text }]} numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
};

const FileItem = ({ file, userId }) => {
  const isImage = (file.mimetype || '').startsWith('image/');

  let badge = null;
  if (file.validation) {
    if (file.validation.error) {
      const errorMsg = file.validation.error || 'Ошибка валидации';
      badge = <Badge type="rejected" text={`⚠ Ошибка валидации`} title={errorMsg} />;
    } else if (file.validation.validated) {
      if (file.validation.isAllowed) {
        badge = <Badge type="validated" text="✓ Согласовано" />;
      } else {
        const top1 = file.validation.details?.top3?.[0]?.label || 'Не согласовано';
        badge = <Badge type="rejected" text={`✗ Не согласовано`} title={top1} />;
      }
    }
  } else if (file.processed) {
    badge = <Badge type="pending" text="⏳ Ожидает валидации" />;
  } else {
    badge = <Badge type="processing" text="⚙ Обработка" />;
  }

  const imageUrl = apiService.getFileUrl(userId, file.filename, isImage && file.processed);

  return (
    <View style={styles.fileItem}>
      {isImage ? (
        <Image source={{ uri: imageUrl }} style={styles.filePreview} />
      ) : (
        <View style={[styles.filePreview, styles.filePreviewEmpty]} />
      )}
      <View style={styles.fileInfo}>
        <Text style={styles.fileName} numberOfLines={1}>{file.originalName}</Text>
        <Text style={styles.fileDetails} numberOfLines={1}>
          {formatBytes(file.size)} • {formatDate(file.uploadedAt)}
        </Text>
        <View style={styles.fileBadges}>
          {badge}
        </View>
      </View>
    </View>
  );
};

export const FileList = ({ files, loading, userId }) => {
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Мои файлы</Text>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Загрузка...</Text>
        </View>
      </View>
    );
  }

  if (!files || files.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Мои файлы</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>У вас пока нет загруженных файлов</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Мои файлы</Text>
      <FlatList
        data={files}
        renderItem={({ item }) => <FileItem file={item} userId={userId} />}
        keyExtractor={(item, index) => item.filename + index}
        scrollEnabled={false}
      />
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
    borderColor: colors.outline
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.lg
  },
  loading: {
    padding: spacing.lg,
    alignItems: 'center'
  },
  loadingText: {
    marginTop: spacing.sm,
    fontSize: 14,
    color: colors.textSecondary
  },
  emptyState: {
    padding: 28,
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 14,
    color: colors.textTertiary
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surfaceVariant,
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm
  },
  filePreview: {
    width: 64,
    height: 64,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.outline
  },
  filePreviewEmpty: {
    backgroundColor: '#DDD'
  },
  fileInfo: {
    flex: 1,
    minWidth: 0
  },
  fileName: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4
  },
  fileDetails: {
    fontSize: 12,
    color: colors.textSecondary
  },
  fileBadges: {
    marginTop: 6,
    flexDirection: 'row',
    gap: 6
  },
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    alignSelf: 'flex-start'
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500'
  }
});
