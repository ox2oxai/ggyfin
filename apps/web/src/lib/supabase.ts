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
  publishableKey:
    process.env.NEXT_PUBLIC_GGYF_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_GGYF_SUPABASE_ANON_KEY ||
    ''
};

export function getSupabaseHeaders(customToken?: string): HeadersInit {
  const headers: Record<string, string> = {
    'apikey': GGYF_SUPABASE_CONFIG.anonKey,
    'Authorization': `Bearer ${customToken || GGYF_SUPABASE_CONFIG.anonKey}`
  };
  return headers;
}
