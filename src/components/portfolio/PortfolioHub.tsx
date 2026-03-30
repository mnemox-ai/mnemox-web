'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { MetricsBar } from './MetricsBar';
import { CaseStudyCard } from './CaseStudyCard';
import { SecondaryCard } from './SecondaryCard';
import { StickyCtaBar } from './StickyCtaBar';
import { FEATURED_CASES, SECONDARY_PROJECTS } from '@/lib/portfolio-data';
import { PORTFOLIO_STATS } from '@/lib/config';
import type { TranslationKey } from '@/lib/translations/en';

const METRICS_ITEMS: { value: number | string; labelKey: TranslationKey }[] = [
  { value: PORTFOLIO_STATS.totalTests, labelKey: 'p_metrics_tests' },
  { value: PORTFOLIO_STATS.shippedSystems, labelKey: 'p_metrics_systems' },
  { value: PORTFOLIO_STATS.countriesReached, labelKey: 'p_metrics_countries' },
  { value: PORTFOLIO_STATS.githubStars, labelKey: 'p_metrics_stars' },
];

export function PortfolioHub() {
  const { t } = useI18n();
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="mx-auto max-w-6xl px-6 py-20 md:px-10">
      {/* Hero */}
      <ScrollReveal>
        <section className="mb-16 text-center">
          <div className="mb-4 inline-block font-mono text-[11px] uppercase tracking-[3px] text-cyan">
            {t('p_hero_eyebrow')}
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-txt md:text-5xl">
            {t('p_hero_title1')}{' '}
            <span className="bg-gradient-to-r from-cyan to-neon-green bg-clip-text text-transparent">
              {t('p_hero_title2')}
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-txt-dim">
            {t('p_hero_desc')}
          </p>
          {/* Founder line */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan to-neon-green font-bold text-bg text-sm">
              S
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-txt">{t('p_hero_founder')}</div>
              <div className="text-xs text-txt-dim">{t('p_hero_founder_role')}</div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Metrics Bar */}
      <ScrollReveal className="mb-20">
        <MetricsBar items={METRICS_ITEMS} />
      </ScrollReveal>

      {/* Featured Cases */}
      <section className="mb-20">
        <div className="flex flex-col gap-20">
          {FEATURED_CASES.map((cs, i) => (
            <ScrollReveal key={cs.id}>
              <CaseStudyCard caseStudy={cs} reversed={i % 2 === 1} />
              {/* Sentinel after first card for sticky bar */}
              {i === 0 && <div ref={sentinelRef} className="h-px" />}
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Secondary Projects */}
      <ScrollReveal className="mb-20">
        <section>
          <div className="mb-8 font-mono text-[11px] uppercase tracking-[3px] text-txt-dim">
            {t('p_label_oss')}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {SECONDARY_PROJECTS.map((project) => (
              <SecondaryCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Bottom CTA */}
      <ScrollReveal className="mb-24">
        <section className="rounded-2xl border border-border bg-gradient-to-br from-bg-card to-bg p-10 text-center">
          <h2 className="font-display text-2xl font-bold text-txt md:text-3xl">
            {t('p_cta_title')}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-txt-dim">
            {t('p_cta_desc')}
          </p>
          <div className="mt-3 font-mono text-xs text-amber-400">
            {t('p_cta_scarcity')}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/services#booking"
              className="rounded-lg bg-cyan px-6 py-3 text-sm font-semibold text-bg transition-opacity hover:opacity-90"
            >
              {t('p_cta_primary')}
            </Link>
            <Link
              href="/services"
              className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-txt transition-colors hover:border-border-bright"
            >
              {t('p_cta_secondary')}
            </Link>
          </div>
        </section>
      </ScrollReveal>

      {/* Sticky CTA Bar */}
      <StickyCtaBar sentinelRef={sentinelRef} />
    </div>
  );
}
