import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  ActivityIndicator, Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import { KeyRound, Mail, AlertCircle, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../src/theme';
import { useAuth } from '../../src/context/AuthContext';
import { AuthPageShell } from '../../src/components/auth/AuthPageShell';

export default function AdminForgotPasswordPage() {
  const router = useRouter();
  const { sendPasswordReset } = useAuth();

  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSendReset = async () => {
    if (isSubmitting) return;
    setErrorMessage('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    const { error, success } = await sendPasswordReset(cleanEmail);
    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error);
    } else if (success) {
      setIsSent(true);
    }
  };

  return (
    <AuthPageShell>
      {!isSent ? (
        <View style={styles.formContainer}>
          {/* Top Badge */}
          <View style={styles.badgeRow}>
            <View style={styles.iconCircle}>
              <KeyRound size={20} color={COLORS.brandTurquoise} />
            </View>
            <View style={styles.badgePill}>
              <Text style={styles.badgePillText}>ACCOUNT RECOVERY</Text>
            </View>
          </View>

          {/* Heading */}
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter your authorized admin email address and we'll send you instructions to reset your password.
          </Text>

          {/* Email Address */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={[
              styles.inputWrapper,
              isFocused && styles.inputWrapperFocused,
              Boolean(errorMessage) && styles.inputWrapperError
            ]}>
              <Mail 
                size={18} 
                color={isFocused ? COLORS.brandTurquoise : COLORS.textSubtle} 
                style={styles.inputIcon} 
              />
              <TextInput
                style={styles.input}
                placeholder="your.email@example.com"
                placeholderTextColor={COLORS.textSubtle}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errorMessage) setErrorMessage('');
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                inputMode="email"
                editable={!isSubmitting}
                returnKeyType="send"
                onSubmitEditing={handleSendReset}
              />
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
            onPress={handleSendReset}
            disabled={isSubmitting}
            activeOpacity={0.88}
            accessibilityRole="button"
            accessibilityLabel="Send Password Reset Instructions"
          >
            {isSubmitting ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 10 }} />
                <Text style={styles.submitBtnText}>Sending Instructions...</Text>
              </View>
            ) : (
              <View style={styles.btnContentRow}>
                <Text style={styles.submitBtnText}>Send Recovery Link</Text>
                <ArrowRight size={17} color="#FFFFFF" style={{ marginLeft: 8 }} />
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Back to Login Link */}
          <TouchableOpacity 
            style={styles.backBtn}
            onPress={() => router.push('/admin/login')}
            activeOpacity={0.7}
          >
            <ArrowLeft size={15} color={COLORS.creamMuted} style={{ marginRight: 6 }} />
            <Text style={styles.backBtnText}>Back to Sign In</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Sent Confirmation State */
        <View style={styles.sentContainer}>
          <View style={styles.sentIconBox}>
            <CheckCircle2 size={40} color={COLORS.brandTurquoise} />
          </View>

          <Text style={styles.sentTitle}>Check Your Inbox</Text>
          <Text style={styles.sentSubtext}>
            If an account exists for <Text style={{ color: COLORS.cream, fontWeight: '600' }}>{email}</Text>, password reset instructions have been sent.
          </Text>

          <View style={styles.instructionCard}>
            <Text style={styles.sentInstructions}>
              Open the email on this device and click the reset link to choose a new password. If you don't see it, check your Spam or Junk folder.
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.submitBtn}
            onPress={() => router.replace('/admin/login')}
            activeOpacity={0.88}
          >
            <View style={styles.btnContentRow}>
              <ArrowLeft size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.submitBtnText}>Return to Sign In</Text>
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
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    width: '100%',
    marginVertical: SPACING.lg,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  backBtnText: {
    color: COLORS.creamMuted,
    fontSize: 13.5,
    fontWeight: '500',
  },

  // ── Sent State ────────────────────────────────────────────────────────────
  sentContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  sentIconBox: {
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
  sentTitle: {
    fontFamily: TYPOGRAPHY.fontFamilyDisplay,
    fontSize: 30,
    fontWeight: '600',
    color: COLORS.cream,
    marginBottom: 8,
    textAlign: 'center',
  },
  sentSubtext: {
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
  sentInstructions: {
    color: COLORS.creamMuted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
});
