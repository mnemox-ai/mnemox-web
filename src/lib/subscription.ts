import { createServiceSupabaseClient } from '@/lib/supabase/server';

export type Plan = 'free' | 'pro';

export interface SubscriptionStatus {
  plan: Plan;
  validationsThisMonth: number;
  maxValidations: number;
  canValidate: boolean;
}

const PLAN_LIMITS: Record<Plan, number> = {
  free: 3,
  pro: -1, // unlimited
};

/**
 * Get subscription status and validation usage for a user.
 * Returns plan, monthly usage count, limit, and whether they can validate.
 */
export async function getSubscriptionStatus(
  userId: string,
): Promise<SubscriptionStatus> {
  const supabase = createServiceSupabaseClient();

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [subRes, usageRes] = await Promise.all([
    supabase
      .from('subscriptions')
      .select('plan')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from('usage_logs')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('endpoint', 'validate')
      .gte('created_at', monthStart),
  ]);

  const plan: Plan = (subRes.data?.plan as Plan) ?? 'free';
  const validationsThisMonth = usageRes.count ?? 0;
  const maxValidations = PLAN_LIMITS[plan];
  const canValidate =
    maxValidations === -1 || validationsThisMonth < maxValidations;

  return { plan, validationsThisMonth, maxValidations, canValidate };
}

/**
 * Log a validation usage entry for a user.
 */
export async function logValidationUsage(userId: string): Promise<void> {
  const supabase = createServiceSupabaseClient();

  const { error } = await supabase.from('usage_logs').insert({
    user_id: userId,
    endpoint: 'validate',
  });

  if (error && process.env.NODE_ENV === 'development') {
    console.error('[logValidationUsage] userId:', userId, 'error:', error.message);
  }
}
