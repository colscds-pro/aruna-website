import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './client';
import { Profile } from '../../types';

const DEMO_ADMIN_SESSION_KEY = 'aruna_demo_admin_session';

export interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  isDemoAuth?: boolean;
}

export const AuthService = {
  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<{ user: User | null; profile: Profile | null; error: Error | null }> {
    if (!isSupabaseConfigured) {
      // In offline / unconfigured mode: provide demo access if passcode/email provided
      if (password === 'aruna2026' || password === 'admin123') {
        const demoUser: any = {
          id: '00000000-0000-0000-0000-000000000001',
          email: email || 'admin@aruna.id',
          user_metadata: { full_name: 'ARUNA Admin' },
        };
        const demoProfile: Profile = {
          id: demoUser.id,
          fullName: 'ARUNA Administrator',
          role: 'admin',
        };
        localStorage.setItem(DEMO_ADMIN_SESSION_KEY, JSON.stringify({ user: demoUser, profile: demoProfile }));
        return { user: demoUser, profile: demoProfile, error: null };
      }
      return {
        user: null,
        profile: null,
        error: new Error('Supabase belum terkonfigurasi. Masukkan password demo: aruna2026 untuk menguji UI CMS.'),
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, profile: null, error };
      }

      if (!data.user) {
        return { user: null, profile: null, error: new Error('Pengguna tidak ditemukan.') };
      }

      // Fetch user profile from profiles table
      const profile = await this.getUserProfile(data.user.id);
      return { user: data.user, profile, error: null };
    } catch (err: any) {
      return { user: null, profile: null, error: err };
    }
  },

  /**
   * Sign out current user
   */
  async signOut(): Promise<{ error: Error | null }> {
    localStorage.removeItem(DEMO_ADMIN_SESSION_KEY);
    if (!isSupabaseConfigured) {
      return { error: null };
    }
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (err: any) {
      return { error: err };
    }
  },

  /**
   * Get current session
   */
  async getSession(): Promise<Session | null> {
    if (!isSupabaseConfigured) {
      const demo = localStorage.getItem(DEMO_ADMIN_SESSION_KEY);
      if (demo) {
        return { user: JSON.parse(demo).user } as any;
      }
      return null;
    }
    try {
      const { data } = await supabase.auth.getSession();
      return data.session;
    } catch {
      return null;
    }
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User | null> {
    if (!isSupabaseConfigured) {
      const demo = localStorage.getItem(DEMO_ADMIN_SESSION_KEY);
      if (demo) {
        return JSON.parse(demo).user;
      }
      return null;
    }
    try {
      const { data } = await supabase.auth.getUser();
      return data.user;
    } catch {
      return null;
    }
  },

  /**
   * Get user profile by userId
   */
  async getUserProfile(userId: string): Promise<Profile | null> {
    if (!isSupabaseConfigured) {
      const demo = localStorage.getItem(DEMO_ADMIN_SESSION_KEY);
      if (demo) {
        return JSON.parse(demo).profile;
      }
      return null;
    }
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        return {
          id: userId,
          fullName: 'Staff Editorial',
          role: 'editor',
        };
      }

      return {
        id: data.id,
        fullName: data.full_name,
        role: data.role as 'admin' | 'editor',
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch {
      return null;
    }
  },

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (user: User | null, session: Session | null) => void): { unsubscribe: () => void } {
    if (!isSupabaseConfigured) {
      const demo = localStorage.getItem(DEMO_ADMIN_SESSION_KEY);
      if (demo) {
        callback(JSON.parse(demo).user, { user: JSON.parse(demo).user } as any);
      } else {
        callback(null, null);
      }
      return { unsubscribe: () => {} };
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null, session);
    });

    return {
      unsubscribe: () => subscription.unsubscribe(),
    };
  },
};
