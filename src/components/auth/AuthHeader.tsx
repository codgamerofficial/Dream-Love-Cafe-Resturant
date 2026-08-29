import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Shield } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../theme';
import { BrandLogo } from '../ui/BrandLogo';

export const AuthHeader: React.FC = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        {/* Left: Authentic Brand Logo + ADMIN PORTAL Badge */}
        <View style={styles.leftSection}>
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => router.push('/' as any)}
            style={styles.logoTouch}
          >
            <BrandLogo variant={isDesktop ? 'primary' : 'compact'} size="sm" />
          </TouchableOpacity>

          <View style={styles.portalBadge}>
            <Shield size={11} color={COLORS.brandTurquoise} style={{ marginRight: 4 }} />
            <Text style={styles.portalBadgeText}>ADMIN PORTAL</Text>
          </View>
        </View>

        {/* Right: Back to Website CTA */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/' as any)}
          activeOpacity={0.7}
        >
          <ArrowLeft size={14} color={COLORS.creamMuted} style={{ marginRight: 5 }} />
          <Text style={styles.backButtonText}>
            {isDesktop ? 'Back to Website' : 'Back'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: COLORS.surfaceElevated,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    width: '100%',
    zIndex: 100,
  },
  headerContent: {
    maxWidth: 1240,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: Platform.OS === 'web' ? 12 : 10,
    minHeight: 56,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoTouch: {
    flexShrink: 1,
  },
  portalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(45, 212, 191, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(45, 212, 191, 0.25)',
  },
  portalBadgeText: {
    color: COLORS.brandTurquoise,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  backButtonText: {
    color: COLORS.creamMuted,
    fontSize: 12.5,
    fontWeight: '600',
  },
});
