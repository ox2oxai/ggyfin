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
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tbGF2ZG93aHNuZWNxb3l6eHRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ2Nzg5OTcsImV4cCI6MjExMDI1NDk5N30.fGerQwgZwsvb_lbx1M7xLX_5V-_MA5CcN9RbMpIf-BM',
  serviceRoleKey:
    process.env.GGYF_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.GGYF_SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tbGF2ZG93aHNuZWNxb3l6eHRrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5NDY3ODk5NywiZXhwIjoyMTEwMjU0OTk3fQ.yhnEpIItO5nPB3QNgk-DUANwnCJ5Ii_Wt67bjRIpdIc'
};

let publicClient: SupabaseClient | null = null;
let adminClient: SupabaseClient | null = null;

export function getSupabasePublicClient(): SupabaseClient {
  if (!publicClient) {
    publicClient = createClient(
      GGYF_SUPABASE_CONFIG.url,
      GGYF_SUPABASE_CONFIG.anonKey,
      { auth: { persistSession: false } }
    );
  }
  return publicClient;
}

export function getSupabaseAdminClient(): SupabaseClient {
  if (!adminClient) {
    const key = GGYF_SUPABASE_CONFIG.serviceRoleKey || GGYF_SUPABASE_CONFIG.anonKey;
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
