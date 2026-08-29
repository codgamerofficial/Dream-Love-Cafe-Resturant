import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
import { UserPlus, AlertCircle, Mail, ArrowLeft, RefreshCw } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../src/theme';
import { useAuth } from '../../src/context/AuthContext';
import { AuthPageShell } from '../../src/components/auth/AuthPageShell';

export default function AdminSignupPage() {
  const router = useRouter();
  const { isAuthorized, loading, sendMagicLink } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [cooldown, setCooldown] = useState(0);

  // Auto-redirect if already signed in
  useEffect(() => {
    if (!loading && isAuthorized) {
      router.replace('/admin');
    }
  }, [isAuthorized, loading]);

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
      setErrorMessage('Enter a valid email address.');
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
    if (cooldown > 0 || !submittedEmail) return;
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
          {/* Top Icon */}
          <View style={styles.iconContainer}>
            <UserPlus size={34} color={COLORS.brandTurquoise} />
          </View>

          {/* Heading */}
          <Text style={styles.title}>Create Your Admin Account</Text>
          <Text style={styles.subtitle}>
            Set up your secure Dream Love Cafe & Restaurant management account.
          </Text>

          <View style={styles.formContent}>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Your full name"
                placeholderTextColor={COLORS.textSubtle}
                value={fullName}
                onChangeText={setFullName}
                autoComplete="name"
                editable={!isSubmitting}
              />
            </View>

            {/* Email Address */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="your.email@example.com"
                placeholderTextColor={COLORS.textSubtle}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                inputMode="email"
                editable={!isSubmitting}
              />
            </View>

            {errorMessage ? (
              <View style={styles.errorBox}>
                <AlertCircle size={15} color={COLORS.errorLight} style={{ marginRight: 6 }} />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Submit Button */}
            <TouchableOpacity 
              style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
              onPress={handleSignup}
              disabled={isSubmitting}
              activeOpacity={0.85}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Mail size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.submitBtnText}>Send Magic Link</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Back to Login Link */}
            <TouchableOpacity 
              style={styles.linkBtn}
              onPress={() => router.push('/admin/login' as any)}
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
              Authorized restaurant staff only.
            </Text>
          </View>
        </View>
      ) : (
        /* Sent Confirmation State */
        <View style={styles.sentContainer}>
          <View style={styles.mailSentIconBox}>
            <Mail size={38} color={COLORS.brandTurquoise} />
          </View>

          <Text style={styles.title}>Check your email</Text>
          <Text style={styles.sentSubtext}>
            We've sent a secure sign-in link to your email address:
          </Text>

          <View style={styles.maskedEmailBadge}>
            <Text style={styles.maskedEmailText}>{maskEmail(submittedEmail)}</Text>
          </View>

          <Text style={styles.sentInstructions}>
            Open your email and click the link to immediately enter the restaurant management portal.
          </Text>

          {errorMessage ? (
            <View style={styles.errorBox}>
              <AlertCircle size={15} color={COLORS.errorLight} style={{ marginRight: 6 }} />
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
              <>
                <RefreshCw size={14} color={cooldown > 0 ? COLORS.textSubtle : COLORS.cream} style={{ marginRight: 6 }} />
                <Text style={[styles.resendBtnText, cooldown > 0 && styles.resendBtnTextDisabled]}>
                  {cooldown > 0 ? `Resend available in ${cooldown}s` : 'Resend Magic Link'}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Use Different Email */}
          <TouchableOpacity 
            style={styles.changeEmailBtn}
            onPress={() => { setIsSubmitted(false); setErrorMessage(''); }}
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
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(45, 212, 191, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(45, 212, 191, 0.25)',
  },
  title: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.lg,
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
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: COLORS.cream,
    fontSize: 15,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.brandHeart,
    width: '100%',
    paddingVertical: 13,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.xs,
    shadowColor: COLORS.brandHeart,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  submitBtnDisabled: {
    opacity: 0.65,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    width: '100%',
    marginVertical: SPACING.lg,
  },
  linkBtn: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  linkText: {
    color: COLORS.creamMuted,
    fontSize: 13,
  },
  linkHighlight: {
    color: COLORS.brandTurquoise,
    fontWeight: '700',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 83, 80, 0.15)',
    padding: 10,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(239, 83, 80, 0.35)',
    width: '100%',
  },
  errorText: {
    color: COLORS.errorLight,
    fontSize: 12.5,
    flex: 1,
    lineHeight: 17,
  },
  securityNotice: {
    marginTop: SPACING.xl,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    width: '100%',
    alignItems: 'center',
  },
  securityNoticeText: {
    color: COLORS.textSubtle,
    fontSize: 11.5,
    fontStyle: 'italic',
  },

  // Sent State
  sentContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  mailSentIconBox: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(45, 212, 191, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(45, 212, 191, 0.3)',
  },
  sentSubtext: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 8,
  },
  maskedEmailBadge: {
    backgroundColor: COLORS.surface,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.brandTurquoise + '40',
    marginBottom: SPACING.md,
  },
  maskedEmailText: {
    color: COLORS.brandTurquoise,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  sentInstructions: {
    color: COLORS.creamMuted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.xl,
    maxWidth: 380,
  },
  resendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: BORDER_RADIUS.md,
    width: '100%',
    marginBottom: SPACING.md,
  },
  resendBtnDisabled: {
    opacity: 0.6,
    borderColor: COLORS.border,
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
    paddingVertical: 6,
  },
  changeEmailText: {
    color: COLORS.copper,
    fontSize: 13,
    fontWeight: '600',
  },
});
