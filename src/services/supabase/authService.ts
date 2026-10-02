import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './client';
import { Profile } from '../../types';

export interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
}

export const AuthService = {
  /**
   * Sign in with email and password via Supabase Auth
   */
  async signIn(
    email: string,
    password: string
  ): Promise<{ user: User | null; profile: Profile | null; error: Error | null }> {
    if (!isSupabaseConfigured) {
      return {
        user: null,
        profile: null,
        error: new Error('Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY) belum terkonfigurasi.'),
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { user: null, profile: null, error };
      }

      if (!data.user) {
        return { user: null, profile: null, error: new Error('Pengguna tidak ditemukan.') };
      }

      // Fetch user profile from public.profiles table
      const profile = await this.getUserProfile(data.user.id);

      // Verify that user has an authorized staff role (admin or editor)
      if (profile && profile.role !== 'admin' && profile.role !== 'editor') {
        // Sign out unauthorized user
        await supabase.auth.signOut();
        return {
          user: null,
          profile: null,
          error: new Error('Akses ditolak: Akun Anda tidak memiliki peran administrator atau editor editorial.'),
        };
      }

      return { user: data.user, profile, error: null };
    } catch (err: any) {
      return { user: null, profile: null, error: err };
    }
  },

  /**
   * Register a new editorial staff account via Supabase Auth
   * Note: The database trigger automatically assigns role = 'editor' (hardened)
   */
  async signUp(
    email: string,
    password: string,
    fullName: string
  ): Promise<{ user: User | null; session: Session | null; error: Error | null }> {
    if (!isSupabaseConfigured) {
      return {
        user: null,
        session: null,
        error: new Error('Supabase belum terkonfigurasi.'),
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (error) {
        return { user: null, session: null, error };
      }

      return { user: data.user, session: data.session, error: null };
    } catch (err: any) {
      return { user: null, session: null, error: err };
    }
  },

  /**
   * Sign out current user
   */
  async signOut(): Promise<{ error: Error | null }> {
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
   * Get current session from Supabase
   */
  async getSession(): Promise<Session | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data } = await supabase.auth.getSession();
      return data.session;
    } catch {
      return null;
    }
  },

  /**
   * Get current user from Supabase
   */
  async getCurrentUser(): Promise<User | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data } = await supabase.auth.getUser();
      return data.user;
    } catch {
      return null;
    }
  },

  /**
   * Get user profile from public.profiles table
   */
  async getUserProfile(userId: string): Promise<Profile | null> {
    if (!isSupabaseConfigured) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        // If profile row doesn't exist yet, return a safe minimal editor representation
        return {
          id: userId,
          fullName: 'Staff Editorial',
          role: 'editor',
        };
      }

      return {
        id: data.id,
        fullName: data.full_name || 'Staff Editorial',
        role: data.role as 'admin' | 'editor',
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch {
      return null;
    }
  },

  /**
   * Listen to auth state changes from Supabase Auth
   */
  onAuthStateChange(
    callback: (user: User | null, session: Session | null, profile: Profile | null) => void
  ): { unsubscribe: () => void } {
    if (!isSupabaseConfigured) {
      callback(null, null, null);
      return { unsubscribe: () => {} };
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user ?? null;
      let profile: Profile | null = null;
      if (user) {
        profile = await AuthService.getUserProfile(user.id);
      }
      callback(user, session, profile);
    });

    return {
      unsubscribe: () => subscription.unsubscribe(),
    };
  },
};
