'use client';

import { useI18n } from '@/lib/i18n';
import type { ValidationResult } from './page';

interface StatsGridProps {
  summary: ValidationResult['summary'];
}

export function StatsGrid({ summary }: StatsGridProps) {
  const { t } = useI18n();

  const stats = [
    { label: t('val_stat_sharpe'), value: summary.sharpe_ratio.toFixed(2), highlight: summary.sharpe_ratio >= 1.0 },
    { label: t('val_stat_win_rate'), value: `${(summary.win_rate * 100).toFixed(1)}%`, highlight: summary.win_rate >= 0.5 },
    { label: t('val_stat_max_dd'), value: `${(summary.max_drawdown * 100).toFixed(1)}%`, highlight: summary.max_drawdown < 0.2, negative: true },
    { label: t('val_stat_pf'), value: summary.profit_factor.toFixed(2), highlight: summary.profit_factor >= 1.5 },
    { label: t('val_stat_trades'), value: summary.total_trades.toLocaleString(), highlight: summary.total_trades >= 200 },
    { label: t('val_stat_avg_pnl'), value: summary.avg_trade_pnl >= 0 ? `+${summary.avg_trade_pnl.toFixed(2)}` : summary.avg_trade_pnl.toFixed(2), highlight: summary.avg_trade_pnl > 0 },
    { label: t('val_stat_total_pnl'), value: summary.total_pnl >= 0 ? `+${summary.total_pnl.toFixed(2)}` : summary.total_pnl.toFixed(2), highlight: summary.total_pnl > 0 },
    { label: t('val_stat_hold_time'), value: summary.avg_hold_time, highlight: false },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg border border-border bg-bg-card p-4 text-center"
        >
          <div
            className={`font-mono text-xl font-bold ${
              stat.negative
                ? 'text-danger'
                : stat.highlight
                ? 'text-neon-green'
                : 'text-txt'
            }`}
          >
            {stat.value}
          </div>
          <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-txt-dim">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
