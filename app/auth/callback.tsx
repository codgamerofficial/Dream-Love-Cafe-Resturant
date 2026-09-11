import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ShieldCheck, AlertCircle, ArrowLeft, ShieldX, CheckCircle2 } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../src/theme';
import { supabase, isSupabaseConfigured } from '../../src/services/supabase';
import { BrandLogo } from '../../src/components/ui/BrandLogo';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'verifying' | 'success' | 'unauthorized' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    async function handleAuthCallback() {
      if (!isSupabaseConfigured || !supabase) {
        if (isMounted) {
          setStatus('error');
          setErrorMessage('Authentication service is currently unavailable. Please verify configuration.');
        }
        return;
      }

      try {
        let authSession: any = null;

        let isRecovery = false;

        if (Platform.OS === 'web' && typeof window !== 'undefined') {
          // ── 1. Handle URL Hash Token Callback (#access_token=...&refresh_token=...) ──
          const hashRaw = window.location.hash;
          if (hashRaw && hashRaw.includes('access_token')) {
            const hashClean = hashRaw.startsWith('#') ? hashRaw.substring(1) : hashRaw;
            const hashParams = new URLSearchParams(hashClean);

            if (hashParams.get('type') === 'recovery') {
              isRecovery = true;
            }

            const errorParam = hashParams.get('error_description') || hashParams.get('error');
            if (errorParam) {
              if (isMounted) {
                setStatus('error');
                setErrorMessage(decodeURIComponent(errorParam));
              }
              return;
            }

            const accessToken = hashParams.get('access_token');
            const refreshToken = hashParams.get('refresh_token');

            if (accessToken && refreshToken) {
              const { data: setSessionData, error: setSessionErr } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              });

              if (!setSessionErr && setSessionData?.session) {
                authSession = setSessionData.session;
              }
            }

            // Immediately sanitize URL hash so tokens are never exposed in address bar
            try {
              window.history.replaceState({}, document.title, window.location.pathname);
            } catch {}
          }

          // ── 2. Handle PKCE Query Code Callback (?code=...) ──
          const queryParams = new URLSearchParams(window.location.search);
          const code = queryParams.get('code');
          const queryError = queryParams.get('error_description') || queryParams.get('error');

          if (queryParams.get('type') === 'recovery') {
            isRecovery = true;
          }

          if (queryError) {
            if (isMounted) {
              setStatus('error');
              setErrorMessage(decodeURIComponent(queryError));
            }
            return;
          }

          if (code) {
            const { data: exchangeData, error: exchangeErr } = await supabase.auth.exchangeCodeForSession(code);
            if (!exchangeErr && exchangeData?.session) {
              authSession = exchangeData.session;
            }

            // Clean query code parameter from URL
            try {
              window.history.replaceState({}, document.title, window.location.pathname);
            } catch {}
          }
        }

        // ── 3. Verify Session If Not Yet Loaded ──
        if (!authSession) {
          const { data: { session: existingSession } } = await supabase.auth.getSession();
          if (existingSession?.user) {
            authSession = existingSession;
          } else {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (currentUser) {
              authSession = { user: currentUser };
            }
          }
        }

        if (!authSession?.user) {
          if (isMounted) {
            setStatus('error');
            setErrorMessage('The authentication link has expired or has already been used. Please request a new link from the login page.');
          }
          return;
        }

        const authUser = authSession.user;
        const userEmail = authUser.email?.toLowerCase().trim();

        // Authenticated user via Supabase Magic Link - Granted Admin Portal Access
        if (isMounted) {
          setStatus('success');
        }

        // ── 5. Ensure Active Database Profile Exists (NO Owner Approval Required) ──
        const defaultName = authUser.user_metadata?.full_name || userEmail?.split('@')[0] || 'Restaurant Staff';

        try {
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id, auth_user_id')
            .eq('auth_user_id', authUser.id)
            .maybeSingle();

          if (!existingProfile) {
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
          console.warn('Profile sync notice:', dbErr);
        }

        // ── 6. Redirect to Reset Password (if recovery) or Dashboard ──
        if (isMounted) {
          setStatus('success');
        }

        setTimeout(() => {
          if (isMounted) {
            if (isRecovery) {
              router.replace('/admin/reset-password');
            } else {
              router.replace('/admin/dashboard');
            }
          }
        }, 800);
      } catch (err: any) {
        if (isMounted) {
          setStatus('error');
          setErrorMessage(err?.message || 'Failed to complete authentication. Please try again.');
        }
      }
    }

    handleAuthCallback();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.logoBox}>
          <BrandLogo size="md" variant="primary" />
        </View>

        {status === 'verifying' && (
          <View style={styles.content}>
            <View style={styles.iconCircle}>
              <ActivityIndicator size="large" color={COLORS.brandTurquoise} />
            </View>
            <Text style={styles.title}>Verifying Credentials</Text>
            <Text style={styles.subtitle}>
              Securing authentication session and validating server authorization...
            </Text>
          </View>
        )}

        {status === 'success' && (
          <View style={styles.content}>
            <View style={[styles.iconCircle, styles.iconCircleSuccess]}>
              <CheckCircle2 size={38} color={COLORS.brandTurquoise} />
            </View>
            <Text style={styles.title}>Access Authorized</Text>
            <Text style={styles.subtitle}>
              Authentication confirmed. Redirecting to management dashboard...
            </Text>
            <ActivityIndicator size="small" color={COLORS.brandTurquoise} style={{ marginTop: 12 }} />
          </View>
        )}

        {status === 'unauthorized' && (
          <View style={styles.content}>
            <View style={[styles.iconCircle, styles.iconCircleError]}>
              <ShieldX size={38} color={COLORS.errorLight} />
            </View>
            <Text style={styles.title}>Access Restricted</Text>
            <Text style={styles.subtitle}>
              {errorMessage || "Admin access isn't available for this email address."}
            </Text>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => router.replace('/admin/access-denied')}
              activeOpacity={0.85}
            >
              <Text style={styles.actionBtnText}>View Access Details</Text>
            </TouchableOpacity>
          </View>
        )}

        {status === 'error' && (
          <View style={styles.content}>
            <View style={[styles.iconCircle, styles.iconCircleError]}>
              <AlertCircle size={38} color={COLORS.errorLight} />
            </View>
            <Text style={styles.title}>Sign In Failed</Text>
            <Text style={styles.subtitle}>
              {errorMessage || 'Unable to authenticate. The link may have expired.'}
            </Text>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => router.replace('/admin/login')}
              activeOpacity={0.85}
            >
              <ArrowLeft size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.actionBtnText}>Return to Admin Login</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDeep,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: 'rgba(28, 23, 21, 0.95)',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 8,
  },
  logoBox: {
    marginBottom: SPACING.lg,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(45, 212, 191, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(45, 212, 191, 0.25)',
  },
  iconCircleSuccess: {
    backgroundColor: 'rgba(45, 212, 191, 0.15)',
    borderColor: 'rgba(45, 212, 191, 0.40)',
  },
  iconCircleError: {
    backgroundColor: 'rgba(239, 83, 80, 0.15)',
    borderColor: 'rgba(239, 83, 80, 0.35)',
  },
  title: {
    fontFamily: TYPOGRAPHY.fontFamilyDisplay,
    fontSize: 28,
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
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.dreamPink,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: 24,
    width: '100%',
    marginTop: 4,
    ...(Platform.OS === 'web' ? {
      cursor: 'pointer',
    } as any : {}),
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700',
  },
});
