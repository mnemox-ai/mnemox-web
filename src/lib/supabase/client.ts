import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Browser-side Supabase client.
 * For client components that need direct Supabase access.
 * Note: most data fetching should go through server components / API routes.
 *
 * ENV NOTE: This file reads NEXT_PUBLIC_SUPABASE_ANON_KEY (browser-exposed).
 * .env.local.example also lists SUPABASE_ANON_KEY (server-only, without NEXT_PUBLIC_ prefix).
 * Both must be set: NEXT_PUBLIC_SUPABASE_ANON_KEY for this client,
 * SUPABASE_ANON_KEY for any server-side code that reads it without the prefix.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
