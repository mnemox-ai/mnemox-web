'use client';

import { Terminal } from '@/components/shared/Terminal';
import { StatsBar } from '@/components/shared/StatsBar';
import { FeatureCard } from '@/components/shared/FeatureCard';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { Architecture } from '@/components/tradememory/Architecture';
import { InstallSection } from '@/components/tradememory/InstallSection';
import { MCPTools } from '@/components/tradememory/MCPTools';
import { LiveBanner } from '@/components/live/LiveBanner';
import { useI18n } from '@/lib/i18n';

const terminalLines = [
  { text: 'You: Store my XAUUSD trade: long 0.10 lots, +$1,175', className: 'text-txt' },
  { text: '✓ Trade stored: MT5-2350458751 | strategy=VolBreakout', className: 'text-neon-green' },
  { text: '' },
  { text: 'You: Run a reflection on my last 73 trades', className: 'text-txt' },
  { text: '✓ Analyzing 73 trades across 4 strategies...', className: 'text-neon-green' },
  { text: '→ Pattern: IntradayMomentum BUY  PF=2.11 return=+166% n=73', className: 'text-cyan' },
  { text: '→ Pattern: MeanReversion    SELL PF=0.79 return=−21%  n=36', className: 'text-amber' },
  { text: '' },
  { text: '✓ L3 Adjustment: MeanReversion SELL → disable (consistent losses)', className: 'text-danger' },
  { text: '✓ L3 Adjustment: IntradayMomentum BUY → increase size 1.2x', className: 'text-neon-green' },
  { text: '' },
  { text: 'Memory updated. 3 layers synced. 10,169 trades analyzed.', className: 'text-txt-dim' },
];

export default function TradeMemoryPage() {
  const { t } = useI18n();

  return (
    <>
      {/* Live Banner */}
      <div className="mx-auto max-w-5xl px-6 pt-6">
        <LiveBanner />
      </div>

      {/* Hero */}
      <section className="relative px-6 pt-20 pb-16 text-center">
        {/* Tag */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-dim bg-cyan-glow px-4 py-1.5">
          <span className="h-2 w-2 rounded-full bg-cyan" />
          <span className="font-mono text-xs font-medium tracking-wider text-cyan uppercase">
            {t('tm_hero_tag')}
          </span>
        </div>

        {/* Title */}
        <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
          <span className="text-white">{t('tm_hero_title1')}</span>
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{
              WebkitTextStroke: '1.5px var(--color-cyan)',
              color: 'transparent',
            }}
          >
            {t('tm_hero_title2')}
          </span>
        </h1>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-txt-dim">
          {t('tm_hero_desc')}
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://github.com/mnemox-ai/tradememory-protocol"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-cyan px-6 py-3 font-display text-sm font-semibold text-bg transition-opacity hover:opacity-90"
          >
            {t('tm_hero_cta1')}
          </a>
          <a
            href="https://github.com/mnemox-ai/tradememory-protocol"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border-bright px-6 py-3 font-display text-sm font-semibold text-txt transition-colors hover:border-cyan hover:text-cyan"
          >
            {t('tm_hero_cta2')}
          </a>
        </div>

        {/* Terminal Demo */}
        <div className="mx-auto mt-12 max-w-3xl">
          <Terminal
            lines={terminalLines}
            title="tradememory — claude desktop"
            delay={350}
          />
        </div>
      </section>

      {/* Stats Bar */}
      <ScrollReveal>
        <section className="mx-auto max-w-3xl px-6 pb-16">
          <StatsBar
            items={[
              { value: '1,055', label: t('tm_stat_tests') },
              { value: '5', label: t('tm_stat_memory') },
              { value: '15', label: t('tm_stat_tools') },
              { value: 'MIT', label: t('tm_stat_license') },
            ]}
          />
        </section>
      </ScrollReveal>

      {/* Features */}
      <ScrollReveal>
        <section className="mx-auto max-w-5xl px-6 pb-20">
          <h2 className="mb-3 text-center font-display text-2xl font-bold text-txt sm:text-3xl">
            {t('tm_features_title')}
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-center text-sm text-txt-dim">
            {t('tm_features_subtitle')}
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* 1. Outcome-Weighted Memory */}
            <FeatureCard
              icon="🧠"
              title={t('tm_feat_owm_title')}
              description={t('tm_feat_owm_desc')}
            />
            {/* 2. Reflection Engine */}
            <FeatureCard
              icon="🔍"
              title={t('tm_feat_reflection_title')}
              description={t('tm_feat_reflection_desc')}
            />
            {/* 3. Automatic Pattern Mining */}
            <FeatureCard
              icon="⛏️"
              title={t('tm_feat_pattern_title')}
              description={t('tm_feat_pattern_desc')}
            />
            {/* 4. Automated Daily Reflection */}
            <FeatureCard
              icon="📊"
              title={t('tm_feat_daily_title')}
              description={t('tm_feat_daily_desc')}
            />
            {/* 5. Bias Detection */}
            <FeatureCard
              icon="🎯"
              title={t('tm_feat_bias_title')}
              description={t('tm_feat_bias_desc')}
            />
            {/* 6. Kelly-from-Memory */}
            <FeatureCard
              icon="📐"
              title={t('tm_feat_kelly_title')}
              description={t('tm_feat_kelly_desc')}
            />
            {/* 7. Strategy Evolution — full width with NEW badge */}
            <FeatureCard
              icon="🧬"
              title={t('tm_feat_evolution_title')}
              description={t('tm_feat_evolution_desc')}
              fullWidth
              badge="NEW"
              accentColor="var(--color-neon-green)"
            />
          </div>
        </section>
      </ScrollReveal>

      {/* Architecture */}
      <Architecture />

      {/* Install */}
      <InstallSection />

      {/* MCP Tools */}
      <MCPTools />
    </>
  );
}
