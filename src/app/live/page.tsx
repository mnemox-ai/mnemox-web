'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import EquityChart from '@/components/live/EquityChart';
import { StatusCard } from '@/components/live/StatusCard';
import { StatsCard } from '@/components/live/StatsCard';
import TradeTable from '@/components/live/TradeTable';
import type { Position, Trade } from '@/lib/live-data';

interface LiveData {
  strategy: { id: string; name: string; symbol: string; timeframe: string };
  current_position: Position | null;
  equity_curve: { time: string; equity: number; trade_type: string }[];
  recent_trades: Trade[];
  stats: { total_trades: number; win_rate: number; total_backtest: number; total_paper: number };
  updated_at: string;
}

export default function LivePage() {
  const { t } = useI18n();
  const [data, setData] = useState<LiveData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/live-status')
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center justify-center h-[400px] text-txt-dim text-sm">
          Loading...
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center justify-center h-[400px] text-txt-dim text-sm">
          Unable to load live data. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-display font-bold text-txt">
            {t('live_strategy_name')}
          </h1>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-green opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-neon-green" />
            </span>
            <span className="text-xs font-bold text-neon-green">{t('live_badge')}</span>
          </div>
        </div>
        <p className="mt-2 text-txt-dim">
          {t('live_subtitle')}
        </p>
      </div>

      {/* Equity Chart */}
      <div className="mt-8">
        <EquityChart data={data.equity_curve} />
      </div>

      {/* Status + Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <StatusCard
          position={data.current_position}
          strategyInfo={data.strategy}
        />
        <StatsCard stats={data.stats} />
      </div>

      {/* Trade Table */}
      <div className="mt-8">
        <TradeTable trades={data.recent_trades} />
      </div>

      {/* Disclaimer */}
      <div className="mt-12 p-4 rounded-lg bg-bg-card border border-border text-txt-dim text-sm">
        Backtest: 2024-01 ~ 2026-03. Paper Trading: 2026-03-19 ~.{' '}
        {t('live_disclaimer')}
      </div>
    </div>
  );
}
