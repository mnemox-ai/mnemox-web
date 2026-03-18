'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

interface StrategyStats {
  total_trades: number;
  win_rate: number;
  total_backtest: number;
  total_paper: number;
}

interface StrategySummary {
  strategy: { id: string; name: string; symbol: string; timeframe: string };
  stats: StrategyStats;
  has_open_position: boolean;
}

interface AggregatedStats {
  strategyCount: number;
  totalTrades: number;
  weightedWinRate: number;
  totalPaper: number;
}

function aggregate(summaries: StrategySummary[]): AggregatedStats {
  const strategyCount = summaries.length;
  const totalTrades = summaries.reduce((s, x) => s + x.stats.total_trades, 0);
  const totalPaper = summaries.reduce((s, x) => s + x.stats.total_paper, 0);
  const weightedWinRate =
    totalTrades > 0
      ? summaries.reduce((s, x) => s + x.stats.win_rate * x.stats.total_trades, 0) / totalTrades
      : 0;
  return { strategyCount, totalTrades, weightedWinRate, totalPaper };
}

export function LiveBanner() {
  const { t } = useI18n();
  const [stats, setStats] = useState<AggregatedStats | null>(null);

  useEffect(() => {
    fetch('/api/live-summaries')
      .then((r) => r.json())
      .then((data: StrategySummary[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setStats(aggregate(data));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="rounded-xl border border-border bg-bg-card p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left: Strategies label + status */}
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
          </span>
          <div>
            <span className="font-display text-sm font-semibold text-txt">
              {stats
                ? `${stats.strategyCount} ${t('live_banner_strategies')}`
                : t('live_banner_strategies')}
            </span>
            <span className="ml-2 text-xs font-bold text-neon-green">LIVE</span>
            <p className="text-xs text-txt-dim mt-0.5">BTCUSDT 1H</p>
          </div>
        </div>

        {/* Center: Mini stats */}
        {stats && (
          <div className="flex items-center gap-6 text-center">
            <div>
              <p className="font-mono text-sm font-semibold text-txt">
                {(stats.weightedWinRate * 100).toFixed(1)}%
              </p>
              <p className="text-[10px] text-txt-dim uppercase tracking-wider">
                {t('live_win_rate')}
              </p>
            </div>
            <div>
              <p className="font-mono text-sm font-semibold text-txt">
                {stats.totalTrades}
              </p>
              <p className="text-[10px] text-txt-dim uppercase tracking-wider">
                {t('live_total_trades')}
              </p>
            </div>
            <div>
              <p className="font-mono text-sm font-semibold text-cyan">
                {stats.totalPaper}
              </p>
              <p className="text-[10px] text-txt-dim uppercase tracking-wider">
                {t('live_paper_trades')}
              </p>
            </div>
          </div>
        )}

        {/* Right: CTA */}
        <Link
          href="/live"
          className="font-mono text-xs text-cyan no-underline transition-colors hover:underline hover:text-cyan whitespace-nowrap"
        >
          {t('live_banner_view')}
        </Link>
      </div>
    </div>
  );
}
