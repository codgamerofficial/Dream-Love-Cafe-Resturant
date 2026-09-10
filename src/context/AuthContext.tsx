import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { verifyServerAuthorization } from '../config/auth';

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
  logout: () => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
  hasRole: (...roles: string[]) => boolean;
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
      console.warn('Authorization verification check error:', e);
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

  // ── Initialize Auth Session ───────────────────────────────────
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
            // Unauthorized session -> terminate
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

      // Listen to real-time auth state changes
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

  // ── Send Passwordless Magic Link ─────────────────────────────────────────
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
      return { error: 'Authentication service is currently unconfigured. Please check environment settings.' };
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
        if (error.message?.includes('rate limit') || error.status === 429) {
          return { error: 'Too many requests. Please wait a moment before requesting another link.' };
        }
        if (
          error.name === 'AuthRetryableFetchError' ||
          error.message?.includes('fetch failed') ||
          error.message?.includes('Failed to fetch') ||
          error.status === 0
        ) {
          return { error: 'Authentication service is temporarily unreachable. Please verify that your Supabase project is active.' };
        }
        return { error: error.message || "We couldn't send the sign-in link. Please try again." };
      }

      return { error: null, success: true };
    } catch (err: any) {
      if (
        err?.name === 'AuthRetryableFetchError' ||
        err?.message?.includes('fetch failed') ||
        err?.message?.includes('Failed to fetch')
      ) {
        return { error: 'Authentication service is temporarily unreachable. Please verify that your Supabase project is active.' };
      }
      return { error: err?.message || "We couldn't send the sign-in link. Please try again." };
    }
  };

  // ── Sign Out & Session Invalidation ──────────────────────────────────────
  const logout = async (): Promise<{ success: boolean; error?: string }> => {
    let logoutError: string | undefined;

    // 1. Clear local session cache
    try {
      await AsyncStorage.removeItem(OFFLINE_AUTH_KEY);
    } catch (storageErr: any) {
      console.warn('Storage clear notice:', storageErr);
    }

    // 2. Terminate remote Supabase session & revoke token
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
