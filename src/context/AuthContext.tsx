import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { verifyServerAuthorization, checkEmailAuthorizedServer } from '../config/auth';

// ── Types ──────────────────────────────────────────────────────────────────
export type UserRole = 'owner' | 'admin' | 'manager' | 'staff';
export type UserStatus = 'active' | 'suspended' | 'disabled';

export interface UserProfile {
  id: string;
  auth_user_id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: any;
  profile: UserProfile | null;
  isAdmin: boolean;
  isAuthorized: boolean;
  loading: boolean;
  status: UserStatus | null;
  role: UserRole | null;
  loginWithPassword: (email: string, pass: string) => Promise<{ error: string | null; success: boolean; authorized?: boolean }>;
  registerAdminAccount: (data: { fullName: string; email: string; password: string }) => Promise<{ error: string | null; success?: boolean }>;
  sendPasswordReset: (email: string) => Promise<{ error: string | null; success?: boolean }>;
  updateUserPassword: (newPassword: string) => Promise<{ error: string | null; success?: boolean }>;
  logout: () => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
  hasRole: (...roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const OFFLINE_AUTH_KEY = '@dream_love_offline_auth_session_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  // ── Ensure / Fetch Profile from 'profiles' Table ─────────────────────────
  const fetchOrCreateProfile = useCallback(async (authUser: any): Promise<UserProfile | null> => {
    if (!isSupabaseConfigured || !supabase || !authUser) return null;
    try {
      // 1. Try fetching by auth_user_id
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_user_id', authUser.id)
        .maybeSingle();

      if (!error && data) {
        return data as UserProfile;
      }

      // 2. Try fetching by email
      const userEmail = authUser.email?.toLowerCase().trim();
      if (userEmail) {
        const { data: emailData, error: emailErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', userEmail)
          .maybeSingle();

        if (!emailErr && emailData) {
          if (!emailData.auth_user_id || emailData.auth_user_id !== authUser.id) {
            await supabase
              .from('profiles')
              .update({ auth_user_id: authUser.id, updated_at: new Date().toISOString() })
              .eq('id', emailData.id);
          }
          return { ...emailData, auth_user_id: authUser.id } as UserProfile;
        }
      }

      // 3. Auto-create active profile for authorized user (NO owner approval required)
      const defaultName = authUser.user_metadata?.full_name || userEmail?.split('@')[0] || 'Restaurant Staff';
      const { data: newProfile, error: createErr } = await supabase
        .from('profiles')
        .insert([{
          auth_user_id: authUser.id,
          full_name: defaultName,
          email: userEmail || authUser.id,
          role: 'admin',
          status: 'active',
        }])
        .select()
        .single();

      if (!createErr && newProfile) {
        return newProfile as UserProfile;
      }

      // Fallback in-memory profile
      return {
        id: authUser.id,
        auth_user_id: authUser.id,
        full_name: defaultName,
        email: userEmail || '',
        role: 'admin',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } catch {
      return null;
    }
  }, []);

  // ── Server-Side Authorization Validator ──────────────────────────────────
  const validateSessionAuthorization = useCallback(async (session: any): Promise<boolean> => {
    if (!session?.access_token || !session?.user) {
      setIsAuthorized(false);
      return false;
    }

    try {
      const serverResult = await verifyServerAuthorization(session.access_token);
      if (serverResult.authorized) {
        setIsAuthorized(true);
        return true;
      } else {
        setIsAuthorized(false);
        return false;
      }
    } catch (e) {
      console.warn('Authorization verification error:', e);
      setIsAuthorized(false);
      return false;
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user && isSupabaseConfigured && supabase) {
      const p = await fetchOrCreateProfile(user);
      setProfile(p);
    }
  }, [user, fetchOrCreateProfile]);

  // ── Initialize Auth Session on Startup ───────────────────────────────────
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      if (!isSupabaseConfigured || !supabase) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        const authUser = session?.user ?? null;

        if (authUser && session && isMounted) {
          const authorized = await validateSessionAuthorization(session);
          if (authorized && isMounted) {
            setUser(authUser);
            const p = await fetchOrCreateProfile(authUser);
            if (isMounted) setProfile(p);
          } else if (isMounted) {
            // Unauthorized session -> terminate immediately
            await supabase.auth.signOut();
            setUser(null);
            setProfile(null);
            setIsAuthorized(false);
          }
        } else if (isMounted) {
          setUser(null);
          setProfile(null);
          setIsAuthorized(false);
        }
      } catch {
        if (isMounted) {
          setUser(null);
          setProfile(null);
          setIsAuthorized(false);
        }
      } finally {
        if (isMounted) setLoading(false);
      }

      // Listen to auth state changes (e.g. password recovery, logout)
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        const authUser = session?.user ?? null;

        if (authUser && session && isMounted) {
          const authorized = await validateSessionAuthorization(session);
          if (authorized && isMounted) {
            setUser(authUser);
            const p = await fetchOrCreateProfile(authUser);
            if (isMounted) setProfile(p);
          } else if (isMounted) {
            setUser(null);
            setProfile(null);
            setIsAuthorized(false);
          }
        } else if (isMounted) {
          setUser(null);
          setProfile(null);
          setIsAuthorized(false);
        }
        if (isMounted) setLoading(false);
      });

      return () => {
        subscription?.unsubscribe();
      };
    }

    initAuth();

    return () => {
      isMounted = false;
    };
  }, [fetchOrCreateProfile, validateSessionAuthorization]);

  // ── Email + Password Authentication (Sign In) ───────────────────────────
  const loginWithPassword = async (
    email: string,
    pass: string
  ): Promise<{ error: string | null; success: boolean; authorized?: boolean }> => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      return { error: 'Please enter your email address.', success: false };
    }
    if (!pass) {
      return { error: 'Please enter your password.', success: false };
    }

    if (!isSupabaseConfigured || !supabase) {
      return { error: 'Authentication service is currently unconfigured. Please check environment settings.', success: false };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: pass,
      });

      if (error) {
        if (
          error.message?.includes('Invalid login credentials') ||
          error.message?.includes('invalid_grant') ||
          error.message?.includes('credentials')
        ) {
          return { error: 'Invalid email or password.', success: false };
        }
        if (
          error.name === 'AuthRetryableFetchError' ||
          error.message?.includes('fetch failed') ||
          error.message?.includes('Failed to fetch') ||
          error.status === 0
        ) {
          return { error: 'Authentication service is temporarily unreachable. Please verify your connection.', success: false };
        }
        return { error: error.message || 'Invalid email or password.', success: false };
      }

      if (!data.session || !data.user) {
        return { error: 'Failed to establish an authenticated session.', success: false };
      }

      // Perform server-side authorization check against allowlist
      const authorized = await validateSessionAuthorization(data.session);
      if (!authorized) {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setIsAuthorized(false);
        return { error: 'This email is not authorized for the Dream Love admin portal.', success: false, authorized: false };
      }

      // Establish verified authorized session
      setUser(data.user);
      const p = await fetchOrCreateProfile(data.user);
      setProfile(p);
      setIsAuthorized(true);

      return { error: null, success: true, authorized: true };
    } catch (err: any) {
      if (
        err?.name === 'AuthRetryableFetchError' ||
        err?.message?.includes('fetch failed') ||
        err?.message?.includes('Failed to fetch')
      ) {
        return { error: 'Authentication service is temporarily unreachable. Please check connection.', success: false };
      }
      return { error: err?.message || 'Invalid email or password.', success: false };
    }
  };

  // ── Create Admin Account (Sign Up) ───────────────────────────────────────
  const registerAdminAccount = async (data: {
    fullName: string;
    email: string;
    password: string;
  }): Promise<{ error: string | null; success?: boolean }> => {
    const cleanFullName = data.fullName.trim();
    const cleanEmail = data.email.trim().toLowerCase();
    const password = data.password;

    if (!cleanFullName) {
      return { error: 'Please enter your full name.' };
    }
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return { error: 'Please enter a valid email address.' };
    }
    if (!password || password.length < 8) {
      return { error: 'Password must be at least 8 characters long.' };
    }

    // Step 1: Server-side pre-check against AUTHORIZED_STAFF_EMAILS
    const authCheck = await checkEmailAuthorizedServer(cleanEmail);
    if (!authCheck.authorized) {
      return { error: authCheck.error || 'This email is not authorized for the Dream Love admin portal.' };
    }

    if (!isSupabaseConfigured || !supabase) {
      return { error: 'Authentication service is unconfigured.' };
    }

    // Step 2: Register user with Supabase Auth (hashes password securely)
    try {
      const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: cleanFullName,
          },
        },
      });

      if (signUpErr) {
        if (
          signUpErr.message?.includes('User already registered') ||
          signUpErr.message?.includes('already exists')
        ) {
          return { error: 'An account already exists with this email.' };
        }
        if (signUpErr.message?.includes('Password should be at least')) {
          return { error: 'Password must be at least 8 characters long.' };
        }
        return { error: signUpErr.message || "We couldn't create your account. Please try again." };
      }

      if (signUpData.user) {
        // Automatically insert/update profile with active status
        try {
          await supabase.from('profiles').upsert({
            auth_user_id: signUpData.user.id,
            full_name: cleanFullName,
            email: cleanEmail,
            role: 'admin',
            status: 'active',
          }, { onConflict: 'auth_user_id' });
        } catch (dbErr) {
          console.warn('Profile creation notice:', dbErr);
        }
      }

      return { error: null, success: true };
    } catch (err: any) {
      return { error: err?.message || "We couldn't create your account. Please try again." };
    }
  };

  // ── Password Reset Request (Forgot Password) ─────────────────────────────
  const sendPasswordReset = async (
    email: string
  ): Promise<{ error: string | null; success?: boolean }> => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return { error: 'Please enter a valid email address.' };
    }

    // Server-side authorization check
    const authCheck = await checkEmailAuthorizedServer(cleanEmail);
    if (!authCheck.authorized) {
      return { error: 'This email is not authorized for the Dream Love admin portal.' };
    }

    if (!isSupabaseConfigured || !supabase) {
      return { error: 'Authentication service is unconfigured.' };
    }

    try {
      const origin = typeof window !== 'undefined' && window.location?.origin
        ? window.location.origin
        : (process.env.EXPO_PUBLIC_SITE_URL || 'http://localhost:8081');

      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${origin}/admin/reset-password`,
      });

      if (error) {
        return { error: error.message || 'Failed to send password reset instructions.' };
      }

      return { error: null, success: true };
    } catch (err: any) {
      return { error: err?.message || 'Failed to send password reset instructions.' };
    }
  };

  // ── Update Password (After Reset Link) ────────────────────────────────────
  const updateUserPassword = async (
    newPassword: string
  ): Promise<{ error: string | null; success?: boolean }> => {
    if (!newPassword || newPassword.length < 8) {
      return { error: 'Password must be at least 8 characters long.' };
    }

    if (!isSupabaseConfigured || !supabase) {
      return { error: 'Authentication service is unconfigured.' };
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { error: error.message || 'Failed to update password.' };
      }

      return { error: null, success: true };
    } catch (err: any) {
      return { error: err?.message || 'Failed to update password.' };
    }
  };

  // ── Sign Out & Session Invalidation ──────────────────────────────────────
  const logout = async (): Promise<{ success: boolean; error?: string }> => {
    let logoutError: string | undefined;

    // 1. Clear local cache
    try {
      await AsyncStorage.removeItem(OFFLINE_AUTH_KEY);
    } catch (storageErr: any) {
      console.warn('Storage clear notice:', storageErr);
    }

    // 2. Terminate remote Supabase session
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) {
          logoutError = error.message;
        }
      } catch (err: any) {
        logoutError = err?.message || 'Failed to terminate remote session';
      }
    }

    // 3. Reset in-memory state unconditionally
    setUser(null);
    setProfile(null);
    setIsAuthorized(false);

    return { success: true, error: logoutError };
  };

  // ── Role & Permission Helpers ──────────────────────────────────────────
  const hasRole = (...roles: string[]): boolean => {
    if (!user || !isAuthorized) return false;
    if (roles.length === 0) return true;
    return roles.includes(profile?.role || 'admin');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAdmin: isAuthorized,
        isAuthorized,
        loading,
        status: profile?.status ?? (user ? 'active' : null),
        role: profile?.role ?? (user ? 'admin' : null),
        loginWithPassword,
        registerAdminAccount,
        sendPasswordReset,
        updateUserPassword,
        logout,
        refreshProfile,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
