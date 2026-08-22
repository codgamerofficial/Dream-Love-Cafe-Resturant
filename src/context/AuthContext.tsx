import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';

interface AuthContextType {
  user: any;
  isAdmin: boolean;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      // Offline fallback state check
      const localAdminSession = typeof window !== 'undefined' ? localStorage.getItem('@dream_love_admin_demo') : null;
      if (localAdminSession) {
        setUser({ id: 'demo-admin-id', email: 'admin@dreamlove.com' });
      }
      setLoading(false);
      return;
    }

    // Check active Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string): Promise<{ error: string | null }> => {
    if (!isSupabaseConfigured || !supabase) {
      // Local fallback auth for demo testing
      if (email.trim() === 'admin@dreamlove.com' && pass === 'admin123') {
        setUser({ id: 'demo-admin-id', email: 'admin@dreamlove.com' });
        if (typeof window !== 'undefined') {
          localStorage.setItem('@dream_love_admin_demo', 'true');
        }
        return { error: null };
      }
      return { error: 'Invalid credentials. Demo mode: use admin@dreamlove.com / admin123' };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error) {
      return { error: error.message };
    }

    setUser(data.user);
    return { error: null };
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('@dream_love_admin_demo');
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: Boolean(user),
        loading,
        loginWithEmail,
        logout,
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
