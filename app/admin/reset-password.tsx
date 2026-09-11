import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  ActivityIndicator, Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import { KeyRound, Lock, Eye, EyeOff, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../src/theme';
import { useAuth } from '../../src/context/AuthContext';
import { AuthPageShell } from '../../src/components/auth/AuthPageShell';

export default function AdminResetPasswordPage() {
  const router = useRouter();
  const { updateUserPassword } = useAuth();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<'password' | 'confirm' | null>(null);

  // Auto-redirect to login after success
  useEffect(() => {
    let timer: any;
    if (isSuccess) {
      timer = setTimeout(() => {
        router.replace('/admin/login');
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [isSuccess, router]);

  const handleResetPassword = async () => {
    if (isSubmitting) return;
    setErrorMessage('');

    if (!newPassword || newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    setIsSubmitting(true);
    const { error, success } = await updateUserPassword(newPassword);
    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error);
    } else if (success) {
      setIsSuccess(true);
    }
  };

  return (
    <AuthPageShell>
      {!isSuccess ? (
        <View style={styles.formContainer}>
          {/* Top Badge */}
          <View style={styles.badgeRow}>
            <View style={styles.iconCircle}>
              <KeyRound size={20} color={COLORS.brandTurquoise} />
            </View>
            <View style={styles.badgePill}>
              <Text style={styles.badgePillText}>SECURITY UPDATE</Text>
            </View>
          </View>

          {/* Heading */}
          <Text style={styles.title}>Set New Password</Text>
          <Text style={styles.subtitle}>
            Choose a strong new password for your Dream Love admin account.
          </Text>

          {/* New Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>New Password (minimum 8 characters)</Text>
            <View style={[
              styles.inputWrapper,
              focusedField === 'password' && styles.inputWrapperFocused,
              Boolean(errorMessage && newPassword.length < 8) && styles.inputWrapperError
            ]}>
              <Lock 
                size={18} 
                color={focusedField === 'password' ? COLORS.brandTurquoise : COLORS.textSubtle} 
                style={styles.inputIcon} 
              />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={COLORS.textSubtle}
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text);
                  if (errorMessage) setErrorMessage('');
                }}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="new-password"
                editable={!isSubmitting}
                returnKeyType="next"
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityRole="button"
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff size={18} color={COLORS.textSubtle} />
                ) : (
                  <Eye size={18} color={COLORS.textSubtle} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm New Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm New Password</Text>
            <View style={[
              styles.inputWrapper,
              focusedField === 'confirm' && styles.inputWrapperFocused,
              Boolean(errorMessage && newPassword !== confirmPassword) && styles.inputWrapperError
            ]}>
              <Lock 
                size={18} 
                color={focusedField === 'confirm' ? COLORS.brandTurquoise : COLORS.textSubtle} 
                style={styles.inputIcon} 
              />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={COLORS.textSubtle}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errorMessage) setErrorMessage('');
                }}
                onFocus={() => setFocusedField('confirm')}
                onBlur={() => setFocusedField(null)}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoComplete="new-password"
                editable={!isSubmitting}
                returnKeyType="done"
                onSubmitEditing={handleResetPassword}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityRole="button"
                accessibilityLabel={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} color={COLORS.textSubtle} />
                ) : (
                  <Eye size={18} color={COLORS.textSubtle} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {errorMessage ? (
            <View style={styles.errorBox}>
              <AlertCircle size={16} color={COLORS.errorLight} style={styles.errorIcon} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Submit Button */}
          <TouchableOpacity 
            style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
            onPress={handleResetPassword}
            disabled={isSubmitting}
            activeOpacity={0.88}
            accessibilityRole="button"
            accessibilityLabel="Update Password"
          >
            {isSubmitting ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 10 }} />
                <Text style={styles.submitBtnText}>Updating Password...</Text>
              </View>
            ) : (
              <View style={styles.btnContentRow}>
                <Text style={styles.submitBtnText}>Update Password</Text>
                <ArrowRight size={17} color="#FFFFFF" style={{ marginLeft: 8 }} />
              </View>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        /* Success State */
        <View style={styles.successContainer}>
          <View style={styles.successIconBox}>
            <CheckCircle2 size={40} color={COLORS.brandTurquoise} />
          </View>

          <Text style={styles.successTitle}>Password Updated</Text>
          <Text style={styles.successSubtext}>
            Your administrator password has been updated securely.
          </Text>

          <View style={styles.instructionCard}>
            <Text style={styles.successInstructions}>
              You can now use your new password to sign in to the Dream Love admin dashboard.
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.submitBtn}
            onPress={() => router.replace('/admin/login')}
            activeOpacity={0.88}
          >
            <View style={styles.btnContentRow}>
              <Text style={styles.submitBtnText}>Sign In to Dashboard</Text>
              <ArrowRight size={17} color="#FFFFFF" style={{ marginLeft: 8 }} />
            </View>
          </TouchableOpacity>
        </View>
      )}
    </AuthPageShell>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
    alignItems: 'stretch',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: 8,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(45, 212, 191, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(45, 212, 191, 0.25)',
  },
  badgePill: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(45, 212, 191, 0.08)',
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(45, 212, 191, 0.20)',
  },
  badgePillText: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: COLORS.brandTurquoise,
  },
  title: {
    fontFamily: TYPOGRAPHY.fontFamilyDisplay,
    fontSize: 32,
    fontWeight: '600',
    color: COLORS.cream,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13.5,
    color: COLORS.textMuted,
    lineHeight: 20,
    marginBottom: SPACING.xl,
  },
  inputGroup: {
    width: '100%',
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 12.5,
    color: COLORS.creamMuted,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.035)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: 14,
    height: 52,
    ...(Platform.OS === 'web' ? {
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    } as any : {}),
  },
  inputWrapperFocused: {
    borderColor: COLORS.brandTurquoise,
    backgroundColor: 'rgba(45, 212, 191, 0.03)',
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 0 0 3px rgba(45, 212, 191, 0.15)',
    } as any : {}),
  },
  inputWrapperError: {
    borderColor: 'rgba(239, 83, 80, 0.6)',
  },
  inputIcon: {
    marginRight: 10,
  },
  eyeBtn: {
    padding: 6,
    marginLeft: 6,
  },
  input: {
    flex: 1,
    color: COLORS.cream,
    fontSize: 15,
    height: '100%',
    ...(Platform.OS === 'web' ? {
      outlineStyle: 'none',
    } as any : {}),
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(239, 83, 80, 0.12)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(239, 83, 80, 0.30)',
  },
  errorIcon: {
    marginRight: 8,
    marginTop: 2,
    flexShrink: 0,
  },
  errorText: {
    color: COLORS.errorLight,
    fontSize: 12.5,
    flex: 1,
    lineHeight: 18,
  },
  submitBtn: {
    backgroundColor: COLORS.dreamPink,
    height: 52,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: COLORS.dreamPink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
    width: '100%',
    ...(Platform.OS === 'web' ? {
      cursor: 'pointer',
      transition: 'transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease',
    } as any : {}),
  },
  submitBtnDisabled: {
    opacity: 0.65,
    shadowOpacity: 0,
  },
  btnContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.4,
  },

  // ── Success State ─────────────────────────────────────────────────────────
  successContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  successIconBox: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(45, 212, 191, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(45, 212, 191, 0.3)',
  },
  successTitle: {
    fontFamily: TYPOGRAPHY.fontFamilyDisplay,
    fontSize: 28,
    fontWeight: '600',
    color: COLORS.cream,
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtext: {
    fontSize: 13.5,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 20,
  },
  instructionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    marginBottom: SPACING.lg,
    width: '100%',
  },
  successInstructions: {
    color: COLORS.creamMuted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
});
