import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, options?: any) => Promise<any>;
  signOut: () => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  updatePassword: (password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signInWithApple: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return result;
  };

  const signUp = async (email: string, password: string, options?: any) => {
    const redirectUrl = `${window.location.origin}/auth?verified=true`;
    
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          email_confirm: true,
        },
        ...options,
      },
    });
    
    // Auto-sign in after successful signup (since email confirmation is now auto-enabled)
    if (!result.error && result.data.user) {
      const signInResult = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return signInResult;
    }
    
    return result;
  };

  const resetPassword = async (email: string) => {
    const redirectUrl = `${window.location.origin}/reset-password`;
    
    try {
      // First, call Supabase to generate the reset token
      const result = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      // Let Supabase handle sending the password reset email
      // The email will contain the proper reset link with tokens
      // You can customize Supabase email templates in Authentication > Email Templates

      return result;
    } catch (error) {
      return { error: error as any };
    }
  };

  const updatePassword = async (password: string) => {
    const result = await supabase.auth.updateUser({ password });
    return result;
  };

  const signOut = async () => {
    const result = await supabase.auth.signOut();
    return result;
  };

  const signInWithGoogle = async () => {
    const redirectUrl = `${window.location.origin}/`;
    const result = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    });
    return result;
  };

  const signInWithApple = async () => {
    const redirectUrl = `${window.location.origin}/`;
    const result = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: redirectUrl,
      },
    });
    return result;
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    signInWithGoogle,
    signInWithApple,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};