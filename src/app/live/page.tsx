'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import EquityChart from '@/components/live/EquityChart';
import { StatusCard } from '@/components/live/StatusCard';
import { StatsCard } from '@/components/live/StatsCard';
import TradeTable from '@/components/live/TradeTable';
import StrategySummaryCard from '@/components/live/StrategySummaryCard';
import type { StrategySummary, LiveData } from '@/lib/live-data';

export default function LivePage() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedId = searchParams.get('strategy') ?? 'strategy_e';

  const [summaries, setSummaries] = useState<StrategySummary[]>([]);
  const [detailData, setDetailData] = useState<LiveData | null>(null);
  const [loadingSummaries, setLoadingSummaries] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(true);

  // Fetch summaries
  const fetchSummaries = useCallback(() => {
    fetch('/api/live-summaries')
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setSummaries(d); })
      .catch(() => {})
      .finally(() => setLoadingSummaries(false));
  }, []);

  useEffect(() => {
    fetchSummaries();
    const interval = setInterval(fetchSummaries, 60000);
    return () => clearInterval(interval);
  }, [fetchSummaries]);

  // Fetch detail for selected strategy
  const fetchDetail = useCallback(() => {
    setLoadingDetail(true);
    fetch(`/api/live-status?strategy=${selectedId}`)
      .then((r) => r.json())
      .then((d) => setDetailData(d))
      .catch(() => setDetailData(null))
      .finally(() => setLoadingDetail(false));
  }, [selectedId]);

  useEffect(() => {
    fetchDetail();
    const interval = setInterval(fetchDetail, 60000);
    return () => clearInterval(interval);
  }, [fetchDetail]);

  const handleSelectStrategy = (id: string) => {
    router.replace(`/live?strategy=${id}`, { scroll: false });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-display font-bold text-txt">
            {t('live_strategies_title') || 'Live Strategies'}
          </h1>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-green opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-neon-green" />
            </span>
            <span className="text-xs font-bold text-neon-green">{t('live_badge')}</span>
          </div>
        </div>
        <p className="mt-2 text-txt-dim">{t('live_subtitle')}</p>
      </div>

      {/* Strategy Summary Cards */}
      {loadingSummaries ? (
        <div className="mt-6 text-txt-dim text-sm">{t('live_loading')}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {summaries.map((s) => (
            <StrategySummaryCard
              key={s.strategy.id}
              strategy={s.strategy}
              stats={s.stats}
              hasOpenPosition={s.has_open_position}
              selected={s.strategy.id === selectedId}
              onClick={() => handleSelectStrategy(s.strategy.id)}
            />
          ))}
        </div>
      )}

      {/* Detail Section */}
      <div className="mt-8">
        {loadingDetail ? (
          <div className="flex items-center justify-center h-[300px] text-txt-dim text-sm">
            {t('live_loading')}
          </div>
        ) : detailData ? (
          <>
            {/* Equity Chart */}
            <EquityChart data={detailData.equity_curve} />

            {/* Status + Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <StatusCard
                position={detailData.current_position}
                strategyInfo={detailData.strategy}
              />
              <StatsCard stats={detailData.stats} />
            </div>

            {/* Trade Table */}
            <div className="mt-8">
              <TradeTable trades={detailData.recent_trades} />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-txt-dim text-sm">
            {t('live_error')}
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="mt-12 p-4 rounded-lg bg-bg-card border border-border text-txt-dim text-sm">
        {t('live_disclaimer_prefix')}{' '}
        {t('live_disclaimer')}
        <p className="text-txt-dim text-xs mt-1">{t('live_auto_refresh')}</p>
      </div>
    </div>
  );
}
