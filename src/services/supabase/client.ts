import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve environment variables using Vite's import.meta.env
// Support both standard VITE_SUPABASE_PUBLISHABLE_KEY and common VITE_SUPABASE_ANON_KEY
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabasePublishableKey = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY
) as string | undefined;

// Validation: check if Supabase is properly configured
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabasePublishableKey &&
  supabaseUrl.trim() !== '' &&
  supabasePublishableKey.trim() !== '' &&
  !supabaseUrl.includes('your-project-id') &&
  !supabasePublishableKey.includes('your-anon-or-publishable-key')
);

// Fallback dummy URL and key to prevent runtime instantiation errors if unconfigured
const fallbackUrl = 'https://placeholder-aruna.supabase.co';
const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder';

export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured && supabaseUrl ? supabaseUrl : fallbackUrl,
  isSupabaseConfigured && supabasePublishableKey ? supabasePublishableKey : fallbackKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

export const SUPABASE_CONFIG_INFO = {
  url: supabaseUrl || '',
  isConfigured: isSupabaseConfigured,
  bucketName: 'aruna-media',
};
