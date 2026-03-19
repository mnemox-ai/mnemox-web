'use client';

import { useEffect, useState } from 'react';
import { API_BASE } from '@/lib/config';
import { useI18n } from '@/lib/i18n';

interface CrowdData {
  similar_count: number;
  avg_score: number;
  your_score: number;
  competition_density_relative: number;
  top_categories: { keyword: string; count: number }[];
}

interface GapRadarProps {
  ideaHash: string;
  score: number;
}

export function GapRadar({ ideaHash, score }: GapRadarProps) {
  const { t } = useI18n();
  const [crowdData, setCrowdData] = useState<CrowdData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/crowd-intel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idea_hash: ideaHash }),
    })
      .then((res) => res.json())
      .then((data) => {
        setCrowdData(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [ideaHash]);

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-bg-card p-6 space-y-3">
        <div className="h-4 w-full animate-pulse rounded bg-bg-card-hover" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-bg-card-hover" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-bg-card-hover" />
      </div>
    );
  }

  if (!crowdData) return null;

  return (
    <section className="mb-8">
      <div className="rounded-xl border border-border bg-bg-card p-6">
        <h3 className="mb-2 flex items-center gap-2 font-semibold text-txt">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-cyan">
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="8" cy="8" r="2" fill="currentColor" />
          </svg>
          {t('check_crowd_title')}
        </h3>

        <p className="mb-4 text-sm text-txt-dim">
          {crowdData.similar_count === 0
            ? (score > 50 ? t('check_crowd_no_data') : t('check_crowd_unique'))
            : t('check_crowd_desc', {
                count: String(crowdData.similar_count),
                total: String(crowdData.similar_count + Math.round(crowdData.avg_score * 2)),
              })}
        </p>

        {/* Competition Density — hide when no crowd data */}
        {crowdData.similar_count > 0 && <div className="mb-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-txt-dim">
            {t('check_crowd_density')}
          </p>
          <div className="flex flex-col gap-2">
            <div>
              <span className="mb-1 block text-xs text-txt-dim">
                {t('check_crowd_you')}: {crowdData.your_score}
              </span>
              <div className="h-3 w-full rounded-full bg-bg-card-hover">
                <div
                  className="h-3 rounded-full"
                  style={{
                    width: `${Math.min(crowdData.your_score, 100)}%`,
                    backgroundColor: '#00e5ff',
                  }}
                />
              </div>
            </div>
            <div>
              <span className="mb-1 block text-xs text-txt-dim">
                {t('check_crowd_avg')}: {crowdData.avg_score}
              </span>
              <div className="h-3 w-full rounded-full bg-bg-card-hover">
                <div
                  className="h-3 rounded-full"
                  style={{
                    width: `${Math.min(crowdData.avg_score, 100)}%`,
                    backgroundColor: '#6a6a80',
                  }}
                />
              </div>
            </div>
          </div>
        </div>}

        {/* Top Categories */}
        {crowdData.top_categories && crowdData.top_categories.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-txt-dim">
              {t('check_crowd_categories')}
            </p>
            <div className="flex flex-wrap gap-2">
              {crowdData.top_categories.map((cat) => (
                <span
                  key={cat.keyword}
                  className="rounded-full border border-cyan/30 px-3 py-1 text-xs text-cyan"
                >
                  {cat.keyword}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
