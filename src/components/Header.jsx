import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../constants/theme';

export const Header = ({ userId }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PuhAlbum</Text>
      <Text style={styles.subtitle}>Загрузка и проверка изображений</Text>
      <View style={styles.userInfo}>
        <Text style={styles.userLabel}>ID: </Text>
        <Text style={styles.userId}>{userId || '...'}</Text>
      </View>
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
    marginBottom: spacing.lg,
    alignItems: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: -0.5,
    marginBottom: spacing.xs
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.lg
  },
  userInfo: {
    backgroundColor: colors.surfaceVariant,
    borderWidth: 1,
    borderColor: colors.outline,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center'
  },
  userLabel: {
    fontSize: 13,
    color: colors.textSecondary
  },
  userId: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'monospace'
  }
});
