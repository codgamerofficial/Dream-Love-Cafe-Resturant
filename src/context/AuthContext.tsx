import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';

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
  sendMagicLink: (email: string, fullName?: string) => Promise<{ error: string | null; success?: boolean }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  hasRole: (...roles: string[]) => boolean;
  // Legacy / fallback helpers
  requestStaffAccess?: (data: { fullName: string; email: string; phone?: string }) => Promise<{ error: string | null; success?: boolean; message?: string }>;
  loginWithEmail?: (email: string, pass: string) => Promise<{ error: string | null }>;
  signUp?: (email: string, password: string, fullName: string) => Promise<{ error: string | null; message?: string }>;
  sendPasswordReset?: (email: string) => Promise<{ error: string | null; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const getRedirectUrl = (): string => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}/auth/callback`;
  }
  return process.env.EXPO_PUBLIC_SITE_URL
    ? `${process.env.EXPO_PUBLIC_SITE_URL}/auth/callback`
    : 'https://dreamlove.restaurant/auth/callback';
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
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

      // 3. If no profile exists, automatically create an active admin profile
      const defaultName = authUser.user_metadata?.full_name || userEmail?.split('@')[0] || 'Restaurant Administrator';
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

      // Fallback in-memory profile if database insert fails
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

  const refreshProfile = useCallback(async () => {
    if (user) {
      const p = await fetchOrCreateProfile(user);
      setProfile(p);
    }
  }, [user, fetchOrCreateProfile]);

  // ── Initialize Supabase Auth Session ───────────────────────────────────
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    // Check active session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const authUser = session?.user ?? null;
      setUser(authUser);
      if (authUser) {
        const p = await fetchOrCreateProfile(authUser);
        setProfile(p);
      }
      setLoading(false);
    }).catch(() => {
      setUser(null);
      setProfile(null);
      setLoading(false);
    });

    // Listen to real-time auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const authUser = session?.user ?? null;
      setUser(authUser);
      if (authUser) {
        const p = await fetchOrCreateProfile(authUser);
        setProfile(p);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [fetchOrCreateProfile]);

  // ── Send Passwordless Magic Link (OTP) ──────────────────────────────────
  const sendMagicLink = async (
    email: string,
    fullName?: string
  ): Promise<{ error: string | null; success?: boolean }> => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      return { error: 'Please enter your email address.' };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return { error: 'Enter a valid email address.' };
    }

    if (!isSupabaseConfigured || !supabase) {
      return { error: 'Authentication service unavailable. Please check system configuration.' };
    }

    try {
      const redirectTo = getRedirectUrl();

      const options: any = {
        emailRedirectTo: redirectTo,
        shouldCreateUser: true,
      };

      if (fullName?.trim()) {
        options.data = { full_name: fullName.trim() };
      }

      const { error } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options,
      });

      if (error) {
        if (error.message.includes('rate limit') || error.status === 429) {
          return { error: 'Please wait a moment before requesting another link.' };
        }
        return { error: "We couldn't send the sign-in link. Please try again." };
      }

      return { error: null, success: true };
    } catch {
      return { error: "We couldn't send the sign-in link. Please try again." };
    }
  };

  // ── Sign Out ───────────────────────────────────────────────────────────
  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Logout error:', err);
      }
    }
    setUser(null);
    setProfile(null);
  };

  // ── Role & Permission Helpers ──────────────────────────────────────────
  const hasRole = (...roles: string[]): boolean => {
    if (!user) return false;
    if (roles.length === 0) return true;
    return roles.includes(profile?.role || 'admin');
  };

  // Every authenticated user has immediate admin access
  const isAuthorized = Boolean(user);

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
        sendMagicLink,
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


