'use server';

import { randomBytes, createHash } from 'crypto';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createServiceSupabaseClient } from '@/lib/supabase/server';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Ensure user exists in Supabase (upsert from Clerk data).
 * Must be called before any operation that references users table via FK.
 */
async function ensureUser(supabase: SupabaseClient, userId: string) {
  const user = await currentUser();
  await supabase.from('users').upsert(
    {
      id: userId,
      email: user?.emailAddresses?.[0]?.emailAddress ?? 'unknown',
      name: [user?.firstName, user?.lastName].filter(Boolean).join(' ') || null,
      image_url: user?.imageUrl ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  );
}

export async function generateApiKey(): Promise<{
  key: string | null;
  error: string | null;
}> {
  const { userId } = await auth();
  if (!userId) return { key: null, error: 'Not authenticated' };

  const supabase = createServiceSupabaseClient();
  await ensureUser(supabase, userId);

  // Generate key: mk_live_ + 32 random bytes hex
  const raw = randomBytes(32).toString('hex');
  const key = `mk_live_${raw}`;

  // Store SHA-256 hash only
  const hash = createHash('sha256').update(key).digest('hex');

  const { error } = await supabase.from('api_keys').insert({
    user_id: userId,
    key_hash: hash,
    key_prefix: key.slice(0, 12), // mk_live_XXXX for display
    is_active: true,
    created_at: new Date().toISOString(),
  });

  if (error) {
    // Log errors only in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[generateApiKey] userId:', userId, 'error:', error.message, error.details);
    }
    return { key: null, error: error.message };
  }
  return { key, error: null };
}

export async function revokeApiKey(
  keyHash: string,
): Promise<{ error: string | null }> {
  const { userId } = await auth();
  if (!userId) return { error: 'Not authenticated' };

  const supabase = createServiceSupabaseClient();

  const { error } = await supabase
    .from('api_keys')
    .delete()
    .eq('key_hash', keyHash)
    .eq('user_id', userId);

  if (error) return { error: error.message };
  return { error: null };
}

export async function getApiKeys(): Promise<{
  keys: Array<{ key_hash: string; key_prefix: string; created_at: string; is_active: boolean }>;
  error: string | null;
}> {
  const { userId } = await auth();
  if (!userId) return { keys: [], error: 'Not authenticated' };

  const supabase = createServiceSupabaseClient();

  const { data, error } = await supabase
    .from('api_keys')
    .select('key_hash, key_prefix, created_at, is_active')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    // Log errors only in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[getApiKeys] userId:', userId, 'error:', error.message, error.details);
    }
    return { keys: [], error: error.message };
  }
  return { keys: data ?? [], error: null };
}

export async function getUsageStats(): Promise<{
  stats: { total_calls: number; month_calls: number; last_call_at: string | null };
  error: string | null;
}> {
  const { userId } = await auth();
  if (!userId)
    return { stats: { total_calls: 0, month_calls: 0, last_call_at: null }, error: 'Not authenticated' };

  const supabase = createServiceSupabaseClient();

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [totalRes, monthRes] = await Promise.all([
    supabase
      .from('usage_logs')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId),
    supabase
      .from('usage_logs')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', monthStart),
  ]);

  const { data: lastCall } = await supabase
    .from('usage_logs')
    .select('created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return {
    stats: {
      total_calls: totalRes.count ?? 0,
      month_calls: monthRes.count ?? 0,
      last_call_at: lastCall?.created_at ?? null,
    },
    error: totalRes.error?.message ?? monthRes.error?.message ?? null,
  };
}

export async function getSubscription(): Promise<{
  plan: string;
  status: string;
  current_period_end: string | null;
  error: string | null;
}> {
  const { userId } = await auth();
  if (!userId)
    return { plan: 'free', status: 'active', current_period_end: null, error: null };

  const supabase = createServiceSupabaseClient();

  const { data, error } = await supabase
    .from('subscriptions')
    .select('plan, status, current_period_end')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return { plan: 'free', status: 'active', current_period_end: null, error: null };
  }

  return {
    plan: data.plan,
    status: data.status,
    current_period_end: data.current_period_end,
    error: null,
  };
}
