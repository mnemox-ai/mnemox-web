'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { getUsageStats } from '../actions';

export function UsageStats() {
  const { t } = useI18n();
  const [stats, setStats] = useState({
    total_calls: 0,
    month_calls: 0,
    last_call_at: null as string | null,
  });

  useEffect(() => {
    getUsageStats().then((r) => {
      if (!r.error) setStats(r.stats);
    });
  }, []);

  return (
    <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-6">
      <h2 className="text-lg font-semibold text-white mb-4">
        {t('dash_usage')}
      </h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-[#00b4ff] font-mono">
            {stats.month_calls}
          </p>
          <p className="text-xs text-[rgba(255,255,255,0.4)] mt-1">
            {t('dash_this_month')}
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-white font-mono">
            {stats.total_calls}
          </p>
          <p className="text-xs text-[rgba(255,255,255,0.4)] mt-1">
            {t('dash_total_calls')}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm font-mono text-white">
            {stats.last_call_at
              ? new Date(stats.last_call_at).toLocaleDateString()
              : '—'}
          </p>
          <p className="text-xs text-[rgba(255,255,255,0.4)] mt-1">
            {t('dash_last_call')}
          </p>
        </div>
      </div>
    </div>
  );
}
