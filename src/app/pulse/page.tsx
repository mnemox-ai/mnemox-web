'use client';

import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { NumberTicker } from '@/components/magicui/number-ticker';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
} from 'recharts';
import { API_BASE } from '@/lib/config';

const COUNTRY_NAMES: Record<string, { en: string; zh: string; flag: string }> = {
  US: { en: 'US', zh: '美國', flag: '🇺🇸' },
  CN: { en: 'China', zh: '中國', flag: '🇨🇳' },
  GB: { en: 'UK', zh: '英國', flag: '🇬🇧' },
  TW: { en: 'Taiwan', zh: '台灣', flag: '🇹🇼' },
  IN: { en: 'India', zh: '印度', flag: '🇮🇳' },
  ES: { en: 'Spain', zh: '西班牙', flag: '🇪🇸' },
  BR: { en: 'Brazil', zh: '巴西', flag: '🇧🇷' },
  DE: { en: 'Germany', zh: '德國', flag: '🇩🇪' },
  FR: { en: 'France', zh: '法國', flag: '🇫🇷' },
  CA: { en: 'Canada', zh: '加拿大', flag: '🇨🇦' },
  HK: { en: 'Hong Kong', zh: '香港', flag: '🇭🇰' },
  NZ: { en: 'New Zealand', zh: '紐西蘭', flag: '🇳🇿' },
  IT: { en: 'Italy', zh: '義大利', flag: '🇮🇹' },
  AT: { en: 'Austria', zh: '奧地利', flag: '🇦🇹' },
  TR: { en: 'Turkey', zh: '土耳其', flag: '🇹🇷' },
  RU: { en: 'Russia', zh: '俄羅斯', flag: '🇷🇺' },
  NG: { en: 'Nigeria', zh: '奈及利亞', flag: '🇳🇬' },
  MM: { en: 'Myanmar', zh: '緬甸', flag: '🇲🇲' },
  IL: { en: 'Israel', zh: '以色列', flag: '🇮🇱' },
  NO: { en: 'Norway', zh: '挪威', flag: '🇳🇴' },
  CZ: { en: 'Czechia', zh: '捷克', flag: '🇨🇿' },
  AU: { en: 'Australia', zh: '澳洲', flag: '🇦🇺' },
  VN: { en: 'Vietnam', zh: '越南', flag: '🇻🇳' },
  SG: { en: 'Singapore', zh: '新加坡', flag: '🇸🇬' },
  PT: { en: 'Portugal', zh: '葡萄牙', flag: '🇵🇹' },
  PL: { en: 'Poland', zh: '波蘭', flag: '🇵🇱' },
  PK: { en: 'Pakistan', zh: '巴基斯坦', flag: '🇵🇰' },
  NL: { en: 'Netherlands', zh: '荷蘭', flag: '🇳🇱' },
  KR: { en: 'South Korea', zh: '韓國', flag: '🇰🇷' },
  JP: { en: 'Japan', zh: '日本', flag: '🇯🇵' },
  HR: { en: 'Croatia', zh: '克羅埃西亞', flag: '🇭🇷' },
  GR: { en: 'Greece', zh: '希臘', flag: '🇬🇷' },
  DZ: { en: 'Algeria', zh: '阿爾及利亞', flag: '🇩🇿' },
};

// Filter out dirty/invalid country codes from DB
const INVALID_COUNTRIES = new Set(['HANS-CN', '419', '第一部分', 'undefined', 'null', '']);

type PulseData = {
  weekly_volume: { week: string; count: number }[];
  top_keywords: { keyword: string; count: number }[];
  countries: { country: string; count: number }[];
  trending_ideas: { idea_text: string; score: number; created_at: string }[];
  total_ideas: number;
  total_countries: number;
};

export default function PulsePage() {
  const { t, lang } = useI18n();
  const [pulseData, setPulseData] = useState<PulseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadPulse(retries = 2) {
      for (let i = 0; i <= retries; i++) {
        try {
          const r = await fetch(`${API_BASE}/api/pulse`);
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          const data = await r.json();
          if (!cancelled) setPulseData(data);
          return;
        } catch (err) {
          console.error(`[Pulse] attempt ${i + 1} failed:`, (err as Error).message);
          if (i < retries) await new Promise((r) => setTimeout(r, 2000));
        }
      }
    }

    loadPulse().finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen px-6 py-24 max-w-6xl mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="h-10 w-64 bg-bg-card rounded-lg mx-auto" />
          <div className="h-5 w-96 bg-bg-card rounded-lg mx-auto" />
          <div className="flex gap-8 justify-center mt-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 w-32 bg-bg-card rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <div className="h-[360px] bg-bg-card rounded-xl" />
            <div className="h-[360px] bg-bg-card rounded-xl" />
          </div>
          <div className="h-40 bg-bg-card rounded-xl mt-10" />
          <div className="h-60 bg-bg-card rounded-xl mt-10" />
        </div>
      </div>
    );
  }

  if (!pulseData) {
    return (
      <div className="min-h-screen px-6 py-24 max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-display text-white font-bold">
          {t('pulse_title')}
        </h1>
        <p className="text-txt-dim mt-6 text-lg">{t('pulse_empty')}</p>
        <button
          onClick={() => { setLoading(true); location.reload(); }}
          className="mt-4 px-4 py-2 rounded-lg border border-border text-txt-dim hover:text-white hover:border-cyan transition-colors text-sm"
        >
          {lang === 'zh' ? '重新載入' : 'Reload'}
        </button>
      </div>
    );
  }

  const thisWeekCount =
    pulseData.weekly_volume.length > 0
      ? pulseData.weekly_volume[pulseData.weekly_volume.length - 1].count
      : 0;

  const maxCountryCount = pulseData.countries.length > 0
    ? Math.max(...pulseData.countries.map((c) => c.count))
    : 1;

  const scoreColor = (score: number) => {
    if (score >= 60) return '#00ff88';
    if (score >= 40) return '#ffaa00';
    return '#ff3366';
  };

  return (
    <div className="min-h-screen px-6 py-24 max-w-6xl mx-auto">
      <ScrollReveal>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display text-white font-bold">
            {t('pulse_title')}
          </h1>
          <p className="text-txt-dim mt-3 text-lg">
            {t('pulse_subtitle', {
              total: String(pulseData.total_ideas),
              countries: String(pulseData.total_countries),
            })}
          </p>
        </div>

        {/* Stats row */}
        <div className="flex gap-8 justify-center flex-wrap">
          <div className="text-center">
            <div className="text-3xl font-mono font-bold text-cyan">
              <NumberTicker value={pulseData.total_ideas} />
            </div>
            <div className="text-txt-dim text-xs uppercase tracking-wider mt-1">
              {t('pulse_stat_scans')}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-mono font-bold text-cyan">
              <NumberTicker value={pulseData.total_countries} />
            </div>
            <div className="text-txt-dim text-xs uppercase tracking-wider mt-1">
              {t('pulse_stat_countries')}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-mono font-bold text-cyan">
              <NumberTicker value={thisWeekCount} />
            </div>
            <div className="text-txt-dim text-xs uppercase tracking-wider mt-1">
              {t('pulse_stat_week')}
            </div>
          </div>
        </div>

        {/* Charts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          {/* Weekly Volume */}
          <div className="bg-bg-card border border-border rounded-xl p-6">
            <h3 className="text-white font-display text-lg mb-4">
              {t('pulse_volume')}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={pulseData.weekly_volume}>
                <CartesianGrid stroke="#1a1a28" strokeDasharray="3 3" />
                <XAxis
                  dataKey="week"
                  tick={{ fill: '#6a6a80', fontSize: 12 }}
                />
                <YAxis tick={{ fill: '#6a6a80' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0b1120',
                    border: '1px solid #1a1a28',
                    borderRadius: 8,
                    color: '#e0e0e8',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#00e5ff"
                  strokeWidth={2}
                  dot={{ fill: '#00b4ff', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top Keywords */}
          <div className="bg-bg-card border border-border rounded-xl p-6">
            <h3 className="text-white font-display text-lg mb-4">
              {t('pulse_keywords')}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={pulseData.top_keywords.slice(0, 10)}
                layout="vertical"
              >
                <XAxis type="number" tick={{ fill: '#6a6a80' }} />
                <YAxis
                  dataKey="keyword"
                  type="category"
                  width={120}
                  tick={{ fill: '#6a6a80', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0b1120',
                    border: '1px solid #1a1a28',
                    borderRadius: 8,
                    color: '#e0e0e8',
                  }}
                />
                <Bar dataKey="count" fill="#00e5ff" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Countries */}
        <div className="mt-10 bg-bg-card border border-border rounded-xl p-6">
          <h3 className="text-white font-display text-lg mb-4">
            {t('pulse_countries')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {pulseData.countries
              .filter((c) => !INVALID_COUNTRIES.has(c.country))
              .map((c) => {
                const info = COUNTRY_NAMES[c.country];
                const displayName = info
                  ? (lang === 'zh' ? info.zh : info.en)
                  : c.country;
                const flag = info?.flag ?? '🌐';
                return (
                  <span
                    key={c.country}
                    className="px-3 py-1.5 rounded-full border border-border text-sm"
                    style={{
                      opacity: Math.max(0.4, c.count / maxCountryCount),
                      color: '#e0e0e8',
                    }}
                  >
                    {flag} {displayName}{' '}
                    <span className="text-txt-dim text-xs">{c.count}</span>
                  </span>
                );
              })}
          </div>
        </div>

        {/* Trending Ideas */}
        <div className="mt-10">
          <h3 className="text-white font-display text-lg mb-4">
            {t('pulse_trending')}
          </h3>
          <div className="grid gap-3">
            {pulseData.trending_ideas.map((idea, i) => (
              <div
                key={i}
                className="bg-bg-card border border-border rounded-lg p-4 flex justify-between items-center"
              >
                <span className="text-txt text-sm truncate mr-4">
                  {String(idea.idea_text ?? '').slice(0, 60)}{idea.idea_text?.length > 60 ? '...' : ''}
                </span>
                <span
                  className="px-2 py-1 rounded text-xs font-mono shrink-0"
                  style={{ color: scoreColor(idea.score) }}
                >
                  {idea.score}
                </span>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
