import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

/**
 * Authenticated Supabase client for server-side use.
 * Passes the Clerk JWT to Supabase so RLS policies work via requesting_user_id().
 */
export async function createServerSupabaseClient() {
  const { getToken } = await auth();
  const token = await getToken({ template: 'supabase' });

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
}

/**
 * Service-role Supabase client — bypasses RLS.
 * Use only in webhooks and server-side admin operations.
 */
export function createServiceSupabaseClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    console.error('[Supabase] SUPABASE_SERVICE_ROLE_KEY is not set!');
  }
  return createClient(supabaseUrl, serviceRoleKey ?? '', {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
