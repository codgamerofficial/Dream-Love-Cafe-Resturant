import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  ActivityIndicator, Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  UserPlus, AlertCircle, Mail, ArrowRight, User, 
  Lock, Eye, EyeOff, ShieldCheck, CheckCircle2 
} from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../src/theme';
import { useAuth } from '../../src/context/AuthContext';
import { AuthPageShell } from '../../src/components/auth/AuthPageShell';

export default function AdminSignupPage() {
  const router = useRouter();
  const { user, isAuthorized, loading, registerAdminAccount, loginWithPassword } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<'name' | 'email' | 'password' | 'confirm' | null>(null);

  // Auto-redirect if already signed in and authorized
  useEffect(() => {
    if (!loading && user && isAuthorized) {
      router.replace('/admin/dashboard');
    }
  }, [isAuthorized, user, loading, router]);

  // Auto-redirect to login after success countdown
  useEffect(() => {
    let timer: any;
    if (isSuccess) {
      timer = setTimeout(() => {
        router.replace('/admin/login');
      }, 3500);
    }
    return () => clearTimeout(timer);
  }, [isSuccess, router]);

  const handleSignup = async () => {
    if (isSubmitting) return;
    setErrorMessage('');

    const cleanFullName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanFullName || cleanFullName.length < 2) {
      setErrorMessage('Please enter your full name (at least 2 characters).');
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
    if (!password || password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    setIsSubmitting(true);
    const { error, success, sessionEstablished } = await registerAdminAccount({
      fullName: cleanFullName,
      email: cleanEmail,
      password: password
    });

    if (error) {
      setIsSubmitting(false);
      setErrorMessage(error);
    } else if (success) {
      if (sessionEstablished) {
        setIsSubmitting(false);
        router.replace('/admin/dashboard');
      } else {
        // Attempt immediate login with password
        const loginRes = await loginWithPassword(cleanEmail, password);
        setIsSubmitting(false);
        if (loginRes.success) {
          router.replace('/admin/dashboard');
        } else {
          setIsSuccess(true);
        }
      }
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthPageShell>
      {!isSuccess ? (
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
            Set up your secure Dream Love Café & Restaurant management account.
          </Text>

          <View style={styles.formContent}>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={[
                styles.inputWrapper,
                focusedField === 'name' && styles.inputWrapperFocused,
                Boolean(errorMessage && !fullName.trim()) && styles.inputWrapperError
              ]}>
                <User 
                  size={18} 
                  color={focusedField === 'name' ? COLORS.brandTurquoise : COLORS.textSubtle} 
                  style={styles.inputIcon} 
                />
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
                Boolean(errorMessage && !email.trim()) && styles.inputWrapperError
              ]}>
                <Mail 
                  size={18} 
                  color={focusedField === 'email' ? COLORS.brandTurquoise : COLORS.textSubtle} 
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
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  inputMode="email"
                  editable={!isSubmitting}
                  returnKeyType="next"
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password (minimum 8 characters)</Text>
              <View style={[
                styles.inputWrapper,
                focusedField === 'password' && styles.inputWrapperFocused,
                Boolean(errorMessage && password.length < 8) && styles.inputWrapperError
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

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={[
                styles.inputWrapper,
                focusedField === 'confirm' && styles.inputWrapperFocused,
                Boolean(errorMessage && password !== confirmPassword) && styles.inputWrapperError
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
                  onSubmitEditing={handleSignup}
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
              onPress={handleSignup}
              disabled={isSubmitting}
              activeOpacity={0.88}
              accessibilityRole="button"
              accessibilityLabel="Create Account"
            >
              {isSubmitting ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 10 }} />
                  <Text style={styles.submitBtnText}>Creating Account...</Text>
                </View>
              ) : (
                <View style={styles.btnContentRow}>
                  <Text style={styles.submitBtnText}>Create Account</Text>
                  <ArrowRight size={17} color="#FFFFFF" style={{ marginLeft: 8 }} />
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Back to Login Link */}
            <TouchableOpacity 
              style={styles.linkBtn}
              onPress={() => router.push('/admin/login')}
              activeOpacity={0.7}
            >
              <Text style={styles.linkText}>
                Already have an account? <Text style={styles.linkHighlight}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Security Notice */}
          <View style={styles.securityNotice}>
            <Text style={styles.securityNoticeText}>
              Dream Love Café & Restaurant • Contai, West Bengal
            </Text>
            <Text style={styles.securitySubnoticeText}>
              Registration is verified against the authorized management roster.
            </Text>
          </View>
        </View>
      ) : (
        /* Success State */
        <View style={styles.successContainer}>
          <View style={styles.successIconBox}>
            <CheckCircle2 size={40} color={COLORS.brandTurquoise} />
          </View>

          <Text style={styles.successTitle}>Account Created Successfully</Text>
          <Text style={styles.successSubtext}>
            Your administrator account for <Text style={{ color: COLORS.cream, fontWeight: '600' }}>{email}</Text> has been created.
          </Text>

          <View style={styles.instructionCard}>
            <Text style={styles.successInstructions}>
              You can now sign in immediately using your email and password. Redirecting to login...
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.submitBtn}
            onPress={() => router.replace('/admin/login')}
            activeOpacity={0.88}
          >
            <View style={styles.btnContentRow}>
              <Text style={styles.submitBtnText}>Proceed to Sign In</Text>
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
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    width: '100%',
    marginVertical: SPACING.lg,
  },
  linkBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
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
