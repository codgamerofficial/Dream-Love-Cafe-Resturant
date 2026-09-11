import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  ActivityIndicator, Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, UserPlus } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../src/theme';
import { useAuth } from '../../src/context/AuthContext';
import { AuthPageShell } from '../../src/components/auth/AuthPageShell';

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, isAuthorized, loading, loginWithPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);

  // Auto-redirect if already signed in and authorized
  useEffect(() => {
    if (!loading && user && isAuthorized) {
      router.replace('/admin/dashboard');
    }
  }, [isAuthorized, user, loading, router]);

  const handleLogin = async () => {
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
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    const { error, success, authorized } = await loginWithPassword(cleanEmail, password);
    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error);
    } else if (success) {
      if (authorized === false) {
        router.replace('/admin/access-denied');
      } else {
        router.replace('/admin/dashboard');
      }
    }
  };

  return (
    <AuthPageShell>
      <View style={styles.formContainer}>
        {/* Top Badge */}
        <View style={styles.badgeRow}>
          <View style={styles.iconCircle}>
            <Shield size={20} color={COLORS.brandTurquoise} />
          </View>
          <View style={styles.badgePill}>
            <Lock size={11} color={COLORS.brandTurquoise} style={{ marginRight: 5 }} />
            <Text style={styles.badgePillText}>ADMIN PORTAL</Text>
          </View>
        </View>

        {/* Heading */}
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          Sign in to your restaurant management dashboard.
        </Text>

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
              onSubmitEditing={handleLogin}
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

        {/* Error Message Box */}
        {errorMessage ? (
          <View style={styles.errorBox}>
            <AlertCircle size={16} color={COLORS.errorLight} style={styles.errorIcon} />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        {/* Sign In Button */}
        <TouchableOpacity 
          style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
          onPress={handleLogin}
          disabled={isSubmitting}
          activeOpacity={0.88}
          accessibilityRole="button"
          accessibilityLabel="Sign In to Dashboard"
        >
          {isSubmitting ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 10 }} />
              <Text style={styles.submitBtnText}>Signing In...</Text>
            </View>
          ) : (
            <View style={styles.btnContentRow}>
              <Text style={styles.submitBtnText}>Sign In to Dashboard</Text>
              <ArrowRight size={17} color="#FFFFFF" style={{ marginLeft: 8 }} />
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Create Account Link */}
        <View style={styles.footerAction}>
          <Text style={styles.footerActionText}>New administrator or staff member?</Text>
          <TouchableOpacity 
            style={styles.createAccountBtn}
            onPress={() => router.push('/admin/signup')}
            activeOpacity={0.8}
          >
            <UserPlus size={15} color={COLORS.brandTurquoise} style={{ marginRight: 6 }} />
            <Text style={styles.createAccountBtnText}>Create Admin / Staff Account</Text>
          </TouchableOpacity>
        </View>

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <Text style={styles.securityNoticeText}>
            Dream Love Café & Restaurant • Contai, West Bengal
          </Text>
          <Text style={styles.securitySubnoticeText}>
            Restricted access. Only authorized staff credentials will be admitted.
          </Text>
        </View>
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
    color: COLORS.copper,
    fontWeight: '600',
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
  footerAction: {
    width: '100%',
    alignItems: 'center',
    gap: 10,
  },
  footerActionText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  createAccountBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 212, 191, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(45, 212, 191, 0.25)',
    width: '100%',
    paddingVertical: 13,
    borderRadius: BORDER_RADIUS.md,
  },
  createAccountBtnText: {
    color: COLORS.brandTurquoise,
    fontSize: 13.5,
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
});
