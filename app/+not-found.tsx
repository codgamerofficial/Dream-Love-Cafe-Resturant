import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Utensils, Home, Compass } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../src/theme';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.contentCard}>
        <View style={styles.iconBox}>
          <Compass size={40} color={COLORS.brandTurquoise} />
        </View>

        <Text style={styles.eyebrow}>404 — PAGE NOT FOUND</Text>
        <Text style={styles.title}>A Recipe We Haven't Cooked Yet</Text>
        <Text style={styles.subtitle}>
          The page you are looking for might have been moved, renamed, or is temporarily unavailable.
        </Text>

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => router.replace('/')}
            activeOpacity={0.85}
          >
            <Home size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.primaryBtnText}>Back to Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => router.push('/menu')}
            activeOpacity={0.85}
          >
            <Utensils size={16} color={COLORS.brandTurquoise} style={{ marginRight: 8 }} />
            <Text style={styles.secondaryBtnText}>Explore Menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
    minHeight: 500,
  },
  contentCard: {
    maxWidth: 540,
    width: '100%',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 22,
    padding: 36,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    textAlign: 'center',
    ...SHADOWS.card,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  eyebrow: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.copper,
    letterSpacing: 2,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.cream,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: SPACING.xl,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.brandHeart,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: BORDER_RADIUS.md,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.brandTurquoise + '60',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: BORDER_RADIUS.md,
  },
  secondaryBtnText: {
    color: COLORS.brandTurquoise,
    fontSize: 14,
    fontWeight: '600',
  },
});
