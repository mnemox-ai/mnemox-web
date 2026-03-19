'use client';

import { useI18n } from '@/lib/i18n';

interface StatsCardProps {
  stats: {
    total_trades: number;
    win_rate: number;
    total_backtest: number;
    total_paper: number;
  };
  updatedAt?: string;
}

export function StatsCard({ stats, updatedAt }: StatsCardProps) {
  const { t } = useI18n();

  const paperDisplay = stats.total_paper > 0
    ? String(stats.total_paper)
    : t('live_waiting_signal');

  const items = [
    {
      label: t('live_win_rate'),
      value: `${(stats.win_rate * 100).toFixed(1)}%`,
      color: 'text-txt-dim',
      small: false,
    },
    { label: t('live_total_trades'), value: String(stats.total_trades), color: 'text-txt', small: false },
    { label: t('live_backtest_trades'), value: String(stats.total_backtest), color: 'text-txt', small: false },
    { label: t('live_paper_trades'), value: paperDisplay, color: stats.total_paper > 0 ? 'text-txt' : 'text-txt-dim', small: stats.total_paper === 0 },
  ];

  const lastCheckStr = updatedAt
    ? new Date(updatedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div className="rounded-xl border border-border bg-bg-card p-6">
      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.label}>
            <p className="text-xs text-txt-dim">{item.label}</p>
            <p className={`mt-1 font-mono ${item.small ? 'text-sm' : 'text-2xl'} ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>
      {lastCheckStr && (
        <div className="mt-4 border-t border-border pt-3 flex items-center justify-between">
          <span className="text-xs text-txt-dim">{t('live_last_check')}</span>
          <span className="text-xs font-mono text-txt-dim">{lastCheckStr}</span>
        </div>
      )}
    </div>
  );
}
