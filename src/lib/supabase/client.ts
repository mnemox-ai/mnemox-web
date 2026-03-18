import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Browser-side Supabase client.
 * For client components that need direct Supabase access.
 * Note: most data fetching should go through server components / API routes.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
