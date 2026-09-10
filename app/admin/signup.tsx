import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  ActivityIndicator, Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import { UserPlus, AlertCircle, Mail, ArrowLeft, RefreshCw, User, ShieldCheck, CheckCircle2 } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../src/theme';
import { useAuth } from '../../src/context/AuthContext';
import { AuthPageShell } from '../../src/components/auth/AuthPageShell';

export default function AdminSignupPage() {
  const router = useRouter();
  const { user, isAuthorized, loading, sendMagicLink } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [focusedField, setFocusedField] = useState<'name' | 'email' | null>(null);

  // Auto-redirect if already signed in and authorized
  useEffect(() => {
    if (!loading && user && isAuthorized) {
      router.replace('/admin/dashboard');
    }
  }, [isAuthorized, user, loading, router]);

  // Resend cooldown timer
  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const maskEmail = (rawEmail: string): string => {
    if (!rawEmail || !rawEmail.includes('@')) return rawEmail;
    const [name, domain] = rawEmail.split('@');
    if (name.length <= 2) return `${name.charAt(0)}••••@${domain}`;
    return `${name.slice(0, 2)}••••@${domain}`;
  };

  const handleSignup = async () => {
    if (isSubmitting) return;
    setErrorMessage('');

    const cleanFullName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanFullName) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    const { error, success } = await sendMagicLink(cleanEmail, cleanFullName);
    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error);
    } else if (success) {
      setSubmittedEmail(cleanEmail);
      setIsSubmitted(true);
      setCooldown(30);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || !submittedEmail || isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage('');
    const { error } = await sendMagicLink(submittedEmail, fullName.trim());
    setIsSubmitting(false);
    if (error) {
      setErrorMessage(error);
    } else {
      setCooldown(30);
    }
  };

  return (
    <AuthPageShell>
      {!isSubmitted ? (
        <View style={styles.formContainer}>
          {/* Top Badge */}
          <View style={styles.badgeRow}>
            <View style={styles.iconCircle}>
              <UserPlus size={20} color={COLORS.brandTurquoise} />
            </View>
            <View style={styles.badgePill}>
              <ShieldCheck size={11} color={COLORS.brandTurquoise} style={{ marginRight: 5 }} />
              <Text style={styles.badgePillText}>ADMIN REGISTRATION</Text>
            </View>
          </View>

          {/* Heading */}
          <Text style={styles.title}>Create Admin Account</Text>
          <Text style={styles.subtitle}>
            Enter your details to register. Authorized restaurant staff receive instant, passwordless dashboard access.
          </Text>

          <View style={styles.formContent}>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={[
                styles.inputWrapper,
                focusedField === 'name' && styles.inputWrapperFocused
              ]}>
                <User size={18} color={focusedField === 'name' ? COLORS.brandTurquoise : COLORS.textSubtle} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Rahul Sen"
                  placeholderTextColor={COLORS.textSubtle}
                  value={fullName}
                  onChangeText={(text) => {
                    setFullName(text);
                    if (errorMessage) setErrorMessage('');
                  }}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="name"
                  editable={!isSubmitting}
                  returnKeyType="next"
                />
              </View>
            </View>

            {/* Email Address */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={[
                styles.inputWrapper,
                focusedField === 'email' && styles.inputWrapperFocused,
                Boolean(errorMessage) && styles.inputWrapperError
              ]}>
                <Mail size={18} color={focusedField === 'email' ? COLORS.brandTurquoise : COLORS.textSubtle} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="your.email@example.com"
                  placeholderTextColor={COLORS.textSubtle}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errorMessage) setErrorMessage('');
                  }}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  inputMode="email"
                  editable={!isSubmitting}
                  returnKeyType="send"
                  onSubmitEditing={handleSignup}
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
              onPress={handleSignup}
              disabled={isSubmitting}
              activeOpacity={0.88}
              accessibilityRole="button"
              accessibilityLabel="Create Account & Send Magic Link"
            >
              {isSubmitting ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 10 }} />
                  <Text style={styles.submitBtnText}>Creating Account...</Text>
                </View>
              ) : (
                <View style={styles.btnContentRow}>
                  <Mail size={17} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.submitBtnText}>Create Account & Send Magic Link</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.passwordlessHelper}>
              <CheckCircle2 size={13} color={COLORS.brandTurquoise} style={{ marginRight: 6 }} />
              <Text style={styles.passwordlessHelperText}>
                Instant access upon email verification. No owner approval delays.
              </Text>
            </View>

            <View style={styles.divider} />

            {/* Back to Login Link */}
            <TouchableOpacity 
              style={styles.linkBtn}
              onPress={() => router.push('/admin/login')}
              activeOpacity={0.7}
            >
              <Text style={styles.linkText}>
                Already registered? <Text style={styles.linkHighlight}>Sign In Here</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Security Notice */}
          <View style={styles.securityNotice}>
            <Text style={styles.securityNoticeText}>
              Dream Love Cafe & Restaurant • Contai, West Bengal
            </Text>
            <Text style={styles.securitySubnoticeText}>
              Access is granted automatically to authorized emails on the restaurant management roster.
            </Text>
          </View>
        </View>
      ) : (
        /* Sent Confirmation State */
        <View style={styles.sentContainer}>
          <View style={styles.mailSentIconBox}>
            <Mail size={36} color={COLORS.brandTurquoise} />
          </View>

          <Text style={styles.sentTitle}>Magic link sent</Text>
          <Text style={styles.sentSubtext}>
            We've sent a secure verification link to:
          </Text>

          <View style={styles.maskedEmailBadge}>
            <Text style={styles.maskedEmailText}>{maskEmail(submittedEmail)}</Text>
          </View>

          <View style={styles.instructionCard}>
            <Text style={styles.sentInstructions}>
              Open your email and click the secure link to verify your identity. You will be automatically authenticated and directed straight to the restaurant management dashboard.
            </Text>
          </View>

          {errorMessage ? (
            <View style={styles.errorBox}>
              <AlertCircle size={15} color={COLORS.errorLight} style={styles.errorIcon} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Resend Action */}
          <TouchableOpacity 
            style={[styles.resendBtn, (cooldown > 0 || isSubmitting) && styles.resendBtnDisabled]}
            onPress={handleResend}
            disabled={cooldown > 0 || isSubmitting}
            activeOpacity={0.85}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color={COLORS.cream} />
            ) : (
              <View style={styles.btnContentRow}>
                <RefreshCw 
                  size={14} 
                  color={cooldown > 0 ? COLORS.textSubtle : COLORS.cream} 
                  style={{ marginRight: 8 }} 
                />
                <Text style={[styles.resendBtnText, cooldown > 0 && styles.resendBtnTextDisabled]}>
                  {cooldown > 0 ? `Didn't receive it? Resend (${cooldown}s)` : "Didn't receive it? Resend"}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Use Different Email */}
          <TouchableOpacity 
            style={styles.changeEmailBtn}
            onPress={() => { 
              setIsSubmitted(false); 
              setErrorMessage(''); 
            }}
            activeOpacity={0.7}
          >
            <ArrowLeft size={14} color={COLORS.copper} style={{ marginRight: 6 }} />
            <Text style={styles.changeEmailText}>Use a different email</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
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
  formContent: {
    width: '100%',
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
    marginTop: 4,
    shadowColor: COLORS.dreamPink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
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
  passwordlessHelper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  passwordlessHelperText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    width: '100%',
    marginVertical: SPACING.lg,
  },
  linkBtn: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  linkText: {
    color: COLORS.textMuted,
    fontSize: 13.5,
  },
  linkHighlight: {
    color: COLORS.brandTurquoise,
    fontWeight: '600',
  },
  securityNotice: {
    marginTop: SPACING.xl,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    width: '100%',
    alignItems: 'center',
  },
  securityNoticeText: {
    color: COLORS.textSubtle,
    fontSize: 11.5,
    fontWeight: '500',
    marginBottom: 2,
  },
  securitySubnoticeText: {
    color: 'rgba(120, 113, 108, 0.7)',
    fontSize: 11,
    textAlign: 'center',
  },

  // ── Sent State ────────────────────────────────────────────────────────────
  sentContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  mailSentIconBox: {
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
    marginBottom: 6,
    textAlign: 'center',
  },
  sentSubtext: {
    fontSize: 13.5,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 10,
  },
  maskedEmailBadge: {
    backgroundColor: 'rgba(45, 212, 191, 0.08)',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(45, 212, 191, 0.30)',
    marginBottom: SPACING.md,
  },
  maskedEmailText: {
    color: COLORS.brandTurquoise,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
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
    fontSize: 12.5,
    textAlign: 'center',
    lineHeight: 19,
  },
  resendBtn: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: BORDER_RADIUS.md,
    width: '100%',
    marginBottom: SPACING.md,
  },
  resendBtnDisabled: {
    opacity: 0.55,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  resendBtnText: {
    color: COLORS.cream,
    fontSize: 13.5,
    fontWeight: '600',
  },
  resendBtnTextDisabled: {
    color: COLORS.textSubtle,
  },
  changeEmailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  changeEmailText: {
    color: COLORS.copper,
    fontSize: 13,
    fontWeight: '600',
  },
});
