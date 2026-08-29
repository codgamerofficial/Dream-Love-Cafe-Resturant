import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ShieldCheck, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../src/theme';
import { supabase, isSupabaseConfigured } from '../../src/services/supabase';
import { AuthPageShell } from '../../src/components/auth/AuthPageShell';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    async function handleAuthCallback() {
      if (!isSupabaseConfigured || !supabase) {
        if (isMounted) {
          setStatus('error');
          setErrorMessage('Authentication service is currently unavailable.');
        }
        return;
      }

      try {
        // 1. Process PKCE auth code in query parameters (?code=...)
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search);
          const code = urlParams.get('code');
          const errorParam = urlParams.get('error_description') || urlParams.get('error');

          if (errorParam) {
            if (isMounted) {
              setStatus('error');
              setErrorMessage(decodeURIComponent(errorParam));
            }
            return;
          }

          if (code) {
            const { error: exchangeErr } = await supabase.auth.exchangeCodeForSession(code);
            if (exchangeErr) {
              console.warn('Code exchange note:', exchangeErr.message);
            }
          }
        }

        // 2. Obtain authenticated session
        let { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session?.user) {
          // Fallback check getUser()
          const { data: { user: currentUser } } = await supabase.auth.getUser();
          if (!currentUser) {
            if (isMounted) {
              setStatus('error');
              setErrorMessage('The sign-in link has expired or has already been used. Please request a new link.');
            }
            return;
          }
          session = { user: currentUser } as any;
        }

        const authUser = session?.user;
        if (!authUser) {
          if (isMounted) {
            setStatus('error');
            setErrorMessage('Unable to verify your session. Please try signing in again.');
          }
          return;
        }

        // 3. Ensure active admin profile exists in database
        const userEmail = authUser.email?.toLowerCase().trim();
        const defaultName = authUser.user_metadata?.full_name || userEmail?.split('@')[0] || 'Restaurant Administrator';

        try {
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id, auth_user_id')
            .eq('auth_user_id', authUser.id)
            .maybeSingle();

          if (!existingProfile) {
            // Check if profile exists by email to link
            const { data: profileByEmail } = await supabase
              .from('profiles')
              .select('id')
              .eq('email', userEmail)
              .maybeSingle();

            if (profileByEmail) {
              await supabase
                .from('profiles')
                .update({ 
                  auth_user_id: authUser.id, 
                  status: 'active', 
                  role: 'admin',
                  updated_at: new Date().toISOString() 
                })
                .eq('id', profileByEmail.id);
            } else {
              // Create new active admin profile
              await supabase
                .from('profiles')
                .insert([{
                  auth_user_id: authUser.id,
                  full_name: defaultName,
                  email: userEmail || authUser.id,
                  role: 'admin',
                  status: 'active',
                }]);
            }
          }
        } catch (dbErr) {
          console.warn('Profile initialization note:', dbErr);
        }

        if (!isMounted) return;

        // 4. Immediate Access to /admin
        setStatus('success');
        setTimeout(() => {
          router.replace('/admin');
        }, 500);

      } catch (err: any) {
        if (isMounted) {
          setStatus('error');
          setErrorMessage(err?.message || 'Unable to complete sign-in.');
        }
      }
    }

    handleAuthCallback();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthPageShell>
      {status === 'verifying' && (
        <View style={styles.contentBox}>
          <ActivityIndicator size="large" color={COLORS.brandTurquoise} style={{ marginBottom: SPACING.md }} />
          <Text style={styles.title}>Signing you in...</Text>
          <Text style={styles.subtitle}>Verifying your secure sign-in link.</Text>
        </View>
      )}

      {status === 'success' && (
        <View style={styles.contentBox}>
          <View style={styles.successIconBox}>
            <ShieldCheck size={38} color={COLORS.brandTurquoise} />
          </View>
          <Text style={styles.title}>Authentication Verified</Text>
          <Text style={styles.subtitle}>Welcome! Opening the management dashboard...</Text>
        </View>
      )}

      {status === 'error' && (
        <View style={styles.contentBox}>
          <View style={styles.errorIconBox}>
            <AlertCircle size={38} color={COLORS.errorLight} />
          </View>
          <Text style={styles.title}>Unable to complete sign-in</Text>
          <Text style={styles.subtitle}>
            {errorMessage || 'This sign-in link is invalid or has expired.'}
          </Text>

          <View style={styles.actionRow}>
            <TouchableOpacity 
              style={styles.primaryBtn}
              onPress={() => router.replace('/admin/login')}
            >
              <RefreshCw size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.primaryBtnText}>Try Again</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryBtn}
              onPress={() => router.replace('/admin/login')}
            >
              <ArrowLeft size={15} color={COLORS.cream} style={{ marginRight: 6 }} />
              <Text style={styles.secondaryBtnText}>Back to Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </AuthPageShell>
  );
}

const styles = StyleSheet.create({
  contentBox: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  successIconBox: {
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
  errorIconBox: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(239, 83, 80, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(239, 83, 80, 0.3)',
  },
  title: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: SPACING.xl,
    maxWidth: 380,
  },
  actionRow: {
    width: '100%',
    maxWidth: 360,
    gap: 10,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.brandHeart,
    paddingVertical: 13,
    borderRadius: BORDER_RADIUS.md,
    width: '100%',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700',
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.md,
    width: '100%',
  },
  secondaryBtnText: {
    color: COLORS.cream,
    fontSize: 14,
    fontWeight: '600',
  },
});
