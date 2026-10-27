import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Returns a Supabase client configured with the service role key.
 * This client bypasses Row Level Security (RLS) and must ONLY be used on the server.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey || url.includes("placeholder") || serviceKey.includes("placeholder")) {
    return null;
  }

  return createSupabaseClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
