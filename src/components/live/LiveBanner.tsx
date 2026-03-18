'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

interface BannerStats {
  win_rate: number;
  total_trades: number;
  total_paper: number;
}

export function LiveBanner() {
  const { t } = useI18n();
  const [stats, setStats] = useState<BannerStats | null>(null);

  useEffect(() => {
    fetch('/api/live-status')
      .then((r) => r.json())
      .then((d) => {
        if (d?.stats) setStats(d.stats);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="rounded-xl border border-border bg-bg-card p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left: Strategy name + status */}
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
          </span>
          <div>
            <span className="font-display text-sm font-semibold text-txt">
              {t('live_banner_strategy')}
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
                {(stats.win_rate * 100).toFixed(1)}%
              </p>
              <p className="text-[10px] text-txt-dim uppercase tracking-wider">
                {t('live_win_rate')}
              </p>
            </div>
            <div>
              <p className="font-mono text-sm font-semibold text-txt">
                {stats.total_trades}
              </p>
              <p className="text-[10px] text-txt-dim uppercase tracking-wider">
                {t('live_total_trades')}
              </p>
            </div>
            <div>
              <p className="font-mono text-sm font-semibold text-cyan">
                {stats.total_paper}
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
