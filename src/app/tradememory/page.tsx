'use client';

import { Terminal } from '@/components/shared/Terminal';
import { StatsBar } from '@/components/shared/StatsBar';
import { FeatureCard } from '@/components/shared/FeatureCard';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { useI18n } from '@/lib/i18n';
import { PRODUCT_STATS } from '@/lib/config';

const terminalLines = [
  { text: 'You: I\'m thinking about buying AAPL. Have I traded it before?', className: 'text-txt' },
  { text: '✓ Recalling from 5 memory layers...', className: 'text-neon-green' },
  { text: '→ 3 similar trades found (OWM score: 0.82, 0.71, 0.65)', className: 'text-cyan' },
  { text: '→ Win rate in this context: 75% | avg pnl: +$820', className: 'text-cyan' },
  { text: '' },
  { text: 'You: Record: bought 100 AAPL at $195, sold at $205, made $1,000', className: 'text-txt' },
  { text: '✓ Trade stored | strategy=EarningsBreakout | pnl=+$1,000', className: 'text-neon-green' },
  { text: '→ 5 memory layers updated automatically', className: 'text-cyan' },
  { text: '' },
  { text: 'You: How\'s my trading state?', className: 'text-txt' },
  { text: '→ Confidence: 0.72 | Drawdown: 3.2% | Action: normal', className: 'text-cyan' },
];

export default function TradeMemoryPage() {
  const { t } = useI18n();

  return (
    <>
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
            href="https://github.com/mnemox-ai/tradememory-protocol#getting-started"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-cyan px-6 py-3 font-display text-sm font-semibold text-bg transition-opacity hover:opacity-90"
          >
            {t('tm_hero_cta1')}
          </a>
          <a
            href="mailto:dev@mnemox.ai"
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

      {/* Problem */}
      <ScrollReveal>
        <section className="mx-auto max-w-5xl px-6 pb-20">
          <h2 className="mb-10 text-center font-display text-2xl font-bold text-txt sm:text-3xl">
            {t('tm_problem_title')}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon="🔁"
              title={t('tm_problem1_title')}
              description={t('tm_problem1_desc')}
            />
            <FeatureCard
              icon="📋"
              title={t('tm_problem2_title')}
              description={t('tm_problem2_desc')}
            />
            <FeatureCard
              icon="🧩"
              title={t('tm_problem3_title')}
              description={t('tm_problem3_desc')}
            />
          </div>
        </section>
      </ScrollReveal>

      {/* How It Works */}
      <ScrollReveal>
        <section className="mx-auto max-w-5xl px-6 pb-20">
          <h2 className="mb-3 text-center font-display text-2xl font-bold text-txt sm:text-3xl">
            {t('tm_how_title')}
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-center text-sm text-txt-dim">
            {t('tm_how_subtitle')}
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Step 1 */}
            <div className="rounded-xl border border-border bg-surface p-6">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan font-mono text-sm font-bold text-bg">
                  1
                </span>
                <h3 className="font-display text-base font-semibold text-txt">
                  {t('tm_how1_title')}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-txt-dim">{t('tm_how1_desc')}</p>
            </div>
            {/* Step 2 */}
            <div className="rounded-xl border border-border bg-surface p-6">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan font-mono text-sm font-bold text-bg">
                  2
                </span>
                <h3 className="font-display text-base font-semibold text-txt">
                  {t('tm_how2_title')}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-txt-dim">{t('tm_how2_desc')}</p>
            </div>
            {/* Step 3 */}
            <div className="rounded-xl border border-border bg-surface p-6">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan font-mono text-sm font-bold text-bg">
                  3
                </span>
                <h3 className="font-display text-base font-semibold text-txt">
                  {t('tm_how3_title')}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-txt-dim">{t('tm_how3_desc')}</p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Use Cases */}
      <ScrollReveal>
        <section className="mx-auto max-w-5xl px-6 pb-20">
          <h2 className="mb-10 text-center font-display text-2xl font-bold text-txt sm:text-3xl">
            {t('tm_cases_title')}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon="📈"
              title={t('tm_case1_title')}
              description={t('tm_case1_desc')}
              badge={t('tm_case1_badge')}
              accentColor="var(--color-neon-green)"
            />
            <FeatureCard
              icon="🤖"
              title={t('tm_case2_title')}
              description={t('tm_case2_desc')}
              badge={t('tm_case2_badge')}
              accentColor="var(--color-cyan)"
            />
            <FeatureCard
              icon="🔒"
              title={t('tm_case3_title')}
              description={t('tm_case3_desc')}
              badge={t('tm_case3_badge')}
              accentColor="var(--color-neon-green)"
            />
          </div>
          <div className="mt-6 text-center">
            <a
              href="https://github.com/mnemox-ai/tradememory-protocol/blob/master/docs/USE_CASES.md"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-cyan hover:underline"
            >
              {t('tm_cases_link')}
            </a>
          </div>
        </section>
      </ScrollReveal>

      {/* Stats Bar */}
      <ScrollReveal>
        <section className="mx-auto max-w-4xl px-6 pb-16">
          <StatsBar
            items={[
              { value: PRODUCT_STATS.tradeMemory.tests.toLocaleString(), label: t('tm_stat_tests') },
              { value: '19', label: t('tm_stat_tools') },
              { value: 'MIT', label: t('tm_stat_license') },
              { value: t('tm_stat_production_val'), label: t('tm_stat_production') },
            ]}
          />
        </section>
      </ScrollReveal>

      {/* Pricing */}
      <ScrollReveal>
        <section className="mx-auto max-w-5xl px-6 pb-20">
          <h2 className="mb-3 text-center font-display text-2xl font-bold text-txt sm:text-3xl">
            {t('tm_pricing_title')}
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-center text-sm text-txt-dim">
            {t('tm_pricing_subtitle')}
          </p>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-4 text-left font-display text-xs font-semibold uppercase tracking-wider text-txt-dim" />
                  <th className="px-6 py-4 text-center">
                    <div className="font-display text-base font-bold text-txt">{t('tm_pricing_community')}</div>
                    <div className="mt-1 font-mono text-xl font-bold text-cyan">{t('tm_pricing_free')}</div>
                  </th>
                  <th className="relative px-6 py-4 text-center">
                    <div className="absolute inset-x-0 top-0 h-0.5 bg-cyan" />
                    <div className="font-display text-base font-bold text-txt">{t('tm_pricing_pro')}</div>
                    <div className="mt-1 font-mono text-xl font-bold text-cyan">{t('tm_pricing_pro_price')}</div>
                    <div className="mt-1 inline-block rounded-full bg-cyan-glow px-2 py-0.5 font-mono text-xs text-cyan">
                      {t('tm_pricing_coming_soon')}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center">
                    <div className="font-display text-base font-bold text-txt">{t('tm_pricing_enterprise')}</div>
                    <div className="mt-1 font-mono text-xl font-bold text-txt">{t('tm_pricing_contact')}</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-6 py-4 font-mono text-xs text-txt-dim uppercase tracking-wider">{t('tm_pricing_tools')}</td>
                  <td className="px-6 py-4 text-center font-mono text-sm text-cyan">19</td>
                  <td className="px-6 py-4 text-center font-mono text-sm text-cyan">19</td>
                  <td className="px-6 py-4 text-center font-mono text-sm text-cyan">19</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-6 py-4 font-mono text-xs text-txt-dim uppercase tracking-wider">{t('tm_pricing_storage')}</td>
                  <td className="px-6 py-4 text-center text-txt-dim">{t('tm_pricing_storage_free')}</td>
                  <td className="px-6 py-4 text-center text-txt-dim">{t('tm_pricing_storage_pro')}</td>
                  <td className="px-6 py-4 text-center text-txt-dim">{t('tm_pricing_storage_ent')}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-6 py-4 font-mono text-xs text-txt-dim uppercase tracking-wider">{t('tm_pricing_dashboard')}</td>
                  <td className="px-6 py-4 text-center text-txt-dim">{t('tm_pricing_dashboard_none')}</td>
                  <td className="px-6 py-4 text-center text-txt-dim">{t('tm_pricing_dashboard_pro')}</td>
                  <td className="px-6 py-4 text-center text-txt-dim">{t('tm_pricing_dashboard_ent')}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-6 py-4 font-mono text-xs text-txt-dim uppercase tracking-wider">{t('tm_pricing_compliance')}</td>
                  <td className="px-6 py-4 text-center text-txt-dim">{t('tm_pricing_compliance_free')}</td>
                  <td className="px-6 py-4 text-center text-txt-dim">{t('tm_pricing_compliance_free')}</td>
                  <td className="px-6 py-4 text-center text-txt-dim">{t('tm_pricing_compliance_ent')}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-6 py-4 font-mono text-xs text-txt-dim uppercase tracking-wider">{t('tm_pricing_support')}</td>
                  <td className="px-6 py-4 text-center text-txt-dim">{t('tm_pricing_support_free')}</td>
                  <td className="px-6 py-4 text-center text-txt-dim">{t('tm_pricing_support_pro')}</td>
                  <td className="px-6 py-4 text-center text-txt-dim">{t('tm_pricing_support_ent')}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4" />
                  <td className="px-6 py-4 text-center">
                    <a
                      href="https://github.com/mnemox-ai/tradememory-protocol#getting-started"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block rounded-lg bg-cyan px-4 py-2 font-display text-xs font-semibold text-bg transition-opacity hover:opacity-90"
                    >
                      {t('tm_pricing_cta_free')}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block rounded-lg border border-border px-4 py-2 font-display text-xs font-semibold text-txt-dim cursor-not-allowed">
                      {t('tm_pricing_coming_soon')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <a
                      href="mailto:dev@mnemox.ai"
                      className="inline-block rounded-lg border border-border-bright px-4 py-2 font-display text-xs font-semibold text-txt transition-colors hover:border-cyan hover:text-cyan"
                    >
                      {t('tm_pricing_cta_ent')}
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </ScrollReveal>

      {/* CTA Footer */}
      <ScrollReveal>
        <section className="mx-auto max-w-2xl px-6 pb-24 text-center">
          <div className="rounded-2xl border border-cyan-dim bg-cyan-glow p-10">
            <h2 className="mb-3 font-display text-2xl font-bold text-txt sm:text-3xl">
              {t('tm_cta_title')}
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-txt-dim">
              {t('tm_cta_desc')}
            </p>
            <a
              href="mailto:dev@mnemox.ai"
              className="inline-flex items-center gap-2 rounded-lg bg-cyan px-8 py-3 font-display text-sm font-semibold text-bg transition-opacity hover:opacity-90"
            >
              {t('tm_cta_button')}
            </a>
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}
