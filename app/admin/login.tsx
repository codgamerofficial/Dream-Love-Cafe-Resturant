import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  ActivityIndicator, Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Shield, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, 
  Sparkles, CheckCircle2, RotateCcw, ChevronDown, ChevronUp
} from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../src/theme';
import { useAuth } from '../../src/context/AuthContext';
import { AuthPageShell } from '../../src/components/auth/AuthPageShell';

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, loading, sendMagicLink, loginWithPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);

  // Magic Link Sent State
  const [isMagicLinkSent, setIsMagicLinkSent] = useState(false);
  const [sentToEmail, setSentToEmail] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Password fallback mode
  const [showPasswordMode, setShowPasswordMode] = useState(false);

  // Auto-redirect if already signed in
  useEffect(() => {
    if (!loading && user) {
      router.replace('/admin/dashboard');
    }
  }, [user, loading, router]);

  // Countdown timer for resending magic link
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Handle Send Magic Link
  const handleSendMagicLink = async () => {
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
    const { error, success } = await sendMagicLink(cleanEmail);
    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error);
    } else if (success) {
      setSentToEmail(cleanEmail);
      setIsMagicLinkSent(true);
      setCountdown(30);
    }
  };

  // Handle Fallback Password Sign In
  const handlePasswordLogin = async () => {
    if (isSubmitting) return;
    setErrorMessage('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    const { error, success } = await loginWithPassword(cleanEmail, password);
    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error);
    } else if (success) {
      router.replace('/admin/dashboard');
    }
  };

  return (
    <AuthPageShell>
      <View style={styles.formContainer}>
        {/* Top Badge */}
        <View style={styles.badgeRow}>
          <View style={styles.iconCircle}>
            <Sparkles size={18} color={COLORS.brandTurquoise} />
          </View>
          <View style={styles.badgePill}>
            <Shield size={11} color={COLORS.brandTurquoise} style={{ marginRight: 5 }} />
            <Text style={styles.badgePillText}>ADMIN PORTAL • MAGIC SIGN-IN</Text>
          </View>
        </View>

        {/* Heading */}
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          Sign in instantly to the Dream Love Café & Restaurant administration portal.
        </Text>

        {/* ── Magic Link Sent Confirmation View ── */}
        {isMagicLinkSent ? (
          <View style={styles.sentCard}>
            <View style={styles.sentIconCircle}>
              <CheckCircle2 size={36} color={COLORS.brandTurquoise} />
            </View>

            <Text style={styles.sentTitle}>Check Your Email</Text>
            <Text style={styles.sentDesc}>
              We've dispatched an instant sign-in link to:
            </Text>

            <View style={styles.sentEmailPill}>
              <Mail size={14} color={COLORS.brandTurquoise} style={{ marginRight: 6 }} />
              <Text style={styles.sentEmailText}>{sentToEmail}</Text>
            </View>

            <Text style={styles.sentInstruction}>
              Click the button inside your email to immediately open the admin dashboard. Check your spam or promotions folder if it doesn't arrive right away.
            </Text>

            <View style={styles.sentActions}>
              <TouchableOpacity
                style={[styles.resendBtn, countdown > 0 && styles.resendBtnDisabled]}
                onPress={handleSendMagicLink}
                disabled={countdown > 0 || isSubmitting}
                activeOpacity={0.8}
              >
                <RotateCcw size={15} color={countdown > 0 ? COLORS.textSubtle : COLORS.brandTurquoise} style={{ marginRight: 6 }} />
                <Text style={[styles.resendBtnText, countdown > 0 && styles.resendBtnTextDisabled]}>
                  {countdown > 0 ? `Resend Link (${countdown}s)` : 'Resend Magic Link'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.changeEmailBtn}
                onPress={() => {
                  setIsMagicLinkSent(false);
                  setErrorMessage('');
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.changeEmailText}>Use a different email</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* ── Main Login Form ── */
          <>
            {/* Email Address */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={[
                styles.inputWrapper,
                focusedField === 'email' && styles.inputWrapperFocused,
                Boolean(errorMessage && !email.trim()) && styles.inputWrapperError
              ]}>
                <Mail 
                  size={18} 
                  color={focusedField === 'email' ? COLORS.brandTurquoise : COLORS.textSubtle} 
                  style={styles.inputIcon} 
                />
                <TextInput
                  style={styles.input}
                  placeholder="admin@dreamlovecafe.com"
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
                  returnKeyType={showPasswordMode ? "next" : "send"}
                  onSubmitEditing={showPasswordMode ? undefined : handleSendMagicLink}
                />
              </View>
            </View>

            {/* Optional Password Field (if toggled) */}
            {showPasswordMode && (
              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Password</Text>
                  <TouchableOpacity
                    onPress={() => router.push('/admin/forgot-password')}
                    activeOpacity={0.7}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={styles.forgotPasswordLink}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>
                <View style={[
                  styles.inputWrapper,
                  focusedField === 'password' && styles.inputWrapperFocused,
                  Boolean(errorMessage && !password) && styles.inputWrapperError
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
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (errorMessage) setErrorMessage('');
                    }}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="password"
                    editable={!isSubmitting}
                    returnKeyType="done"
                    onSubmitEditing={handlePasswordLogin}
                  />
                  <TouchableOpacity
                    style={styles.eyeBtn}
                    onPress={() => setShowPassword(!showPassword)}
                    activeOpacity={0.7}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    {showPassword ? (
                      <EyeOff size={18} color={COLORS.textSubtle} />
                    ) : (
                      <Eye size={18} color={COLORS.textSubtle} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Error Message Box */}
            {errorMessage ? (
              <View style={styles.errorBox}>
                <AlertCircle size={16} color={COLORS.errorLight} style={styles.errorIcon} />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Primary Action Button */}
            {!showPasswordMode ? (
              <TouchableOpacity 
                style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
                onPress={handleSendMagicLink}
                disabled={isSubmitting}
                activeOpacity={0.88}
                accessibilityRole="button"
                accessibilityLabel="Send Magic Sign-In Link"
              >
                {isSubmitting ? (
                  <View style={styles.loadingRow}>
                    <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 10 }} />
                    <Text style={styles.submitBtnText}>Dispatching Magic Link...</Text>
                  </View>
                ) : (
                  <View style={styles.btnContentRow}>
                    <Sparkles size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={styles.submitBtnText}>Send Magic Sign-In Link</Text>
                    <ArrowRight size={17} color="#FFFFFF" style={{ marginLeft: 8 }} />
                  </View>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
                onPress={handlePasswordLogin}
                disabled={isSubmitting}
                activeOpacity={0.88}
                accessibilityRole="button"
                accessibilityLabel="Sign In with Password"
              >
                {isSubmitting ? (
                  <View style={styles.loadingRow}>
                    <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 10 }} />
                    <Text style={styles.submitBtnText}>Signing In...</Text>
                  </View>
                ) : (
                  <View style={styles.btnContentRow}>
                    <Text style={styles.submitBtnText}>Sign In with Password</Text>
                    <ArrowRight size={17} color="#FFFFFF" style={{ marginLeft: 8 }} />
                  </View>
                )}
              </TouchableOpacity>
            )}

            {/* Password Fallback Toggle */}
            <View style={styles.toggleRow}>
              <TouchableOpacity 
                style={styles.toggleBtn}
                onPress={() => {
                  setShowPasswordMode(!showPasswordMode);
                  setErrorMessage('');
                }}
                activeOpacity={0.7}
              >
                {showPasswordMode ? (
                  <View style={styles.toggleContent}>
                    <ChevronUp size={14} color={COLORS.creamMuted} style={{ marginRight: 4 }} />
                    <Text style={styles.toggleText}>Switch back to Magic Link sign-in</Text>
                  </View>
                ) : (
                  <View style={styles.toggleContent}>
                    <ChevronDown size={14} color={COLORS.creamMuted} style={{ marginRight: 4 }} />
                    <Text style={styles.toggleText}>Prefer to sign in with password?</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            {/* Security Notice */}
            <View style={styles.securityNotice}>
              <Text style={styles.securityNoticeText}>
                Dream Love Café & Restaurant • Contai, West Bengal
              </Text>
              <Text style={styles.securitySubnoticeText}>
                Fast, secure sign-in via Supabase. Click the magic link in your email to open the admin panel.
              </Text>
            </View>
          </>
        )}
      </View>
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
  inputGroup: {
    width: '100%',
    marginBottom: SPACING.md,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 12.5,
    color: COLORS.creamMuted,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  forgotPasswordLink: {
    fontSize: 12,
    color: COLORS.brandTurquoise,
    fontWeight: '600',
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } as any : {}),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    borderRadius: BORDER_RADIUS.md,
    height: 52,
    paddingHorizontal: 14,
  },
  inputWrapperFocused: {
    borderColor: COLORS.brandTurquoise,
    backgroundColor: 'rgba(45, 212, 191, 0.05)',
  },
  inputWrapperError: {
    borderColor: COLORS.errorLight,
    backgroundColor: 'rgba(239, 83, 80, 0.05)',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: COLORS.cream,
    fontSize: 14.5,
    height: '100%',
    ...(Platform.OS === 'web' ? {
      outlineStyle: 'none',
    } as any : {}),
  },
  eyeBtn: {
    padding: 6,
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } as any : {}),
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(239, 83, 80, 0.10)',
    borderWidth: 1,
    borderColor: 'rgba(239, 83, 80, 0.25)',
    borderRadius: BORDER_RADIUS.sm,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: SPACING.md,
  },
  errorIcon: {
    marginRight: 8,
    marginTop: 2,
    flexShrink: 0,
  },
  errorText: {
    flex: 1,
    color: COLORS.errorLight,
    fontSize: 12.5,
    lineHeight: 18,
    fontWeight: '500',
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
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } as any : {}),
  },
  submitBtnDisabled: {
    opacity: 0.65,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleRow: {
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  toggleBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } as any : {}),
  },
  toggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 12.5,
    color: COLORS.creamMuted,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: SPACING.lg,
  },
  securityNotice: {
    alignItems: 'center',
  },
  securityNoticeText: {
    fontSize: 11.5,
    color: COLORS.creamMuted,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  securitySubnoticeText: {
    fontSize: 11,
    color: COLORS.textSubtle,
    textAlign: 'center',
    lineHeight: 16,
  },

  // Sent Card Styles
  sentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(45, 212, 191, 0.20)',
    padding: SPACING.lg,
    alignItems: 'center',
  },
  sentIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(45, 212, 191, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(45, 212, 191, 0.3)',
  },
  sentTitle: {
    fontSize: 22,
    fontFamily: TYPOGRAPHY.fontFamilyDisplay,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 6,
    textAlign: 'center',
  },
  sentDesc: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 10,
  },
  sentEmailPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(45, 212, 191, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(45, 212, 191, 0.25)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.md,
  },
  sentEmailText: {
    color: COLORS.brandTurquoise,
    fontSize: 13.5,
    fontWeight: '700',
  },
  sentInstruction: {
    fontSize: 12.5,
    color: COLORS.creamMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: SPACING.lg,
  },
  sentActions: {
    width: '100%',
    gap: 10,
    alignItems: 'center',
  },
  resendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 212, 191, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(45, 212, 191, 0.3)',
    borderRadius: BORDER_RADIUS.md,
    height: 44,
    width: '100%',
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } as any : {}),
  },
  resendBtnDisabled: {
    opacity: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  resendBtnText: {
    color: COLORS.brandTurquoise,
    fontSize: 13.5,
    fontWeight: '600',
  },
  resendBtnTextDisabled: {
    color: COLORS.textSubtle,
  },
  changeEmailBtn: {
    paddingVertical: 6,
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } as any : {}),
  },
  changeEmailText: {
    color: COLORS.creamMuted,
    fontSize: 12.5,
    fontWeight: '500',
  },
});
