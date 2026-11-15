import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * GGY Finance Supabase Configuration & Client Helper
 * Prioritizes GGYF_ application-scoped environment variables with standard fallbacks
 */
export const GGYF_SUPABASE_CONFIG = {
  url:
    process.env.NEXT_PUBLIC_GGYF_SUPABASE_URL ||
    process.env.GGYF_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    'https://omlavdowhsnecqoyzxtk.supabase.co',
  anonKey:
    process.env.NEXT_PUBLIC_GGYF_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_GGYF_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    '',
  serviceRoleKey:
    process.env.GGYF_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.GGYF_SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    ''
};

let publicClient: SupabaseClient | null = null;
let adminClient: SupabaseClient | null = null;

export function getSupabasePublicClient(): SupabaseClient {
  if (!publicClient) {
    publicClient = createClient(
      GGYF_SUPABASE_CONFIG.url,
      GGYF_SUPABASE_CONFIG.anonKey || 'dummy_key_for_build',
      { auth: { persistSession: false } }
    );
  }
  return publicClient;
}

export function getSupabaseAdminClient(): SupabaseClient {
  if (!adminClient) {
    const key = GGYF_SUPABASE_CONFIG.serviceRoleKey || GGYF_SUPABASE_CONFIG.anonKey || 'dummy_key_for_build';
    adminClient = createClient(
      GGYF_SUPABASE_CONFIG.url,
      key,
      { auth: { persistSession: false } }
    );
  }
  return adminClient;
}

export function getSupabaseHeaders(customToken?: string): HeadersInit {
  const key = GGYF_SUPABASE_CONFIG.anonKey;
  return {
    'apikey': key,
    'Authorization': `Bearer ${customToken || key}`
  };
}
