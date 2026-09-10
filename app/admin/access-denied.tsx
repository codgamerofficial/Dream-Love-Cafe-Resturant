import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LogOut, ArrowLeft, ShieldAlert } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../src/theme';
import { useAuth } from '../../src/context/AuthContext';
import { AuthPageShell } from '../../src/components/auth/AuthPageShell';

export default function AccessDeniedPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleSignOutAndSwitch = async () => {
    await logout();
    router.replace('/admin/login');
  };

  return (
    <AuthPageShell>
      <View style={styles.container}>
        {/* Warning Icon */}
        <View style={styles.iconCircle}>
          <ShieldAlert size={36} color={COLORS.errorLight} />
        </View>

        <View style={styles.badgePill}>
          <Text style={styles.badgePillText}>AUTHORIZATION REQUIRED</Text>
        </View>

        <Text style={styles.title}>Admin Access Required</Text>
        <Text style={styles.subtitle}>
          Your account is authenticated, but this email address is not authorized to access the Dream Love Café & Restaurant management system.
        </Text>

        {user?.email && (
          <View style={styles.emailBadge}>
            <Text style={styles.emailBadgeText}>{user.email}</Text>
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.switchAccountBtn}
            onPress={handleSignOutAndSwitch}
            activeOpacity={0.88}
            accessibilityRole="button"
            accessibilityLabel="Sign In with Another Email"
          >
            <LogOut size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.switchAccountBtnText}>Sign In with Another Email</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.backHomeBtn}
            onPress={() => router.replace('/')}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Back to Website"
          >
            <ArrowLeft size={15} color={COLORS.creamMuted} style={{ marginRight: 6 }} />
            <Text style={styles.backHomeText}>Back to Website</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthPageShell>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(239, 83, 80, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(239, 83, 80, 0.30)',
  },
  badgePill: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(239, 83, 80, 0.08)',
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(239, 83, 80, 0.20)',
    marginBottom: SPACING.md,
  },
  badgePillText: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: COLORS.errorLight,
  },
  title: {
    fontFamily: TYPOGRAPHY.fontFamilyDisplay,
    fontSize: 32,
    fontWeight: '600',
    color: COLORS.cream,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13.5,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.lg,
    maxWidth: 400,
  },
  emailBadge: {
    backgroundColor: 'rgba(239, 83, 80, 0.08)',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(239, 83, 80, 0.25)',
    marginBottom: SPACING.xl,
  },
  emailBadgeText: {
    color: COLORS.cream,
    fontSize: 13.5,
    fontWeight: '600',
  },
  actions: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  switchAccountBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.dreamPink,
    height: 50,
    borderRadius: BORDER_RADIUS.md,
    width: '100%',
    shadowColor: COLORS.dreamPink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
    ...(Platform.OS === 'web' ? {
      cursor: 'pointer',
    } as any : {}),
  },
  switchAccountBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700',
  },
  backHomeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  backHomeText: {
    color: COLORS.creamMuted,
    fontSize: 13,
    fontWeight: '600',
  },
});
