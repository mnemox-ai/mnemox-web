'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { getSubscription } from '../actions';

const PLAN_LABELS: Record<string, string> = {
  free: 'Free',
  pro: 'Pro',
  team: 'Team',
  enterprise: 'Enterprise',
};

const PLAN_LIMITS: Record<string, string> = {
  free: '—',
  pro: '1,000 / mo',
  team: '10,000 / mo',
  enterprise: 'Custom',
};

export function SubscriptionCard() {
  const { t } = useI18n();
  const [plan, setPlan] = useState('free');
  const [periodEnd, setPeriodEnd] = useState<string | null>(null);

  useEffect(() => {
    getSubscription().then((r) => {
      setPlan(r.plan);
      setPeriodEnd(r.current_period_end);
    });
  }, []);

  const isFree = plan === 'free';

  return (
    <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-6">
      <h2 className="text-lg font-semibold text-white mb-4">
        {t('dash_subscription')}
      </h2>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xl font-bold text-white">
            {PLAN_LABELS[plan] ?? plan}
          </p>
          <p className="text-xs text-[rgba(255,255,255,0.4)] mt-1">
            {t('dash_api_limit')}: {PLAN_LIMITS[plan] ?? '—'}
          </p>
          {periodEnd && (
            <p className="text-xs text-[rgba(255,255,255,0.4)] mt-1">
              {t('dash_renews')}: {new Date(periodEnd).toLocaleDateString()}
            </p>
          )}
        </div>
        {isFree && (
          <Link
            href="/pricing"
            className="font-mono text-xs px-4 py-2 bg-[#00b4ff] text-[#0a0a0f] rounded font-semibold no-underline transition-opacity hover:opacity-90 hover:no-underline"
          >
            {t('dash_upgrade')}
          </Link>
        )}
      </div>
    </div>
  );
}
