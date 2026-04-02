'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { BrowserFrame } from '@/components/services/demo/BrowserFrame';
import { ImpactNumbers } from './ImpactNumbers';
import { SolutionGrid } from './SolutionGrid';
import { TechStackPills } from './TechStackPills';
import type { CaseStudy } from '@/lib/portfolio-data';

interface CaseStudyDetailProps {
  caseStudy: CaseStudy;
}

const ACCENT_COLORS: Record<string, string> = {
  tradememory: '#00e5ff',
  nexusos: '#00ff88',
  'ng-gold': '#ffaa00',
  'strategy-validator': '#a855f7',
};

const TAG_COLORS: Record<string, string> = {
  p_tag_mcp: '#00e5ff',
  p_tag_audit: '#a855f7',
  p_tag_opensource: '#22c55e',
  p_tag_dashboard: '#00ff88',
  p_tag_agentsdk: '#3b82f6',
  p_tag_realtime: '#f59e0b',
  p_tag_mt5: '#ef4444',
  p_tag_risk: '#f97316',
  p_tag_xauusd: '#eab308',
  p_tag_validation: '#a855f7',
  p_tag_statistics: '#6366f1',
  p_tag_backtesting: '#ec4899',
};

export function CaseStudyDetail({ caseStudy }: CaseStudyDetailProps) {
  const { t } = useI18n();
  const accent = ACCENT_COLORS[caseStudy.id] ?? '#00e5ff';

  return (
    <div className="max-w-[960px] mx-auto px-6 py-20">
      {/* Back link */}
      <ScrollReveal>
        <div className="border-b border-border py-8">
          <Link
            href="/portfolio"
            className="text-sm text-cyan hover:underline"
          >
            {t('p_detail_back')}
          </Link>
        </div>
      </ScrollReveal>

      {/* Header */}
      <ScrollReveal>
        <div className="border-b border-border py-8">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {caseStudy.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[10px] px-2 py-0.5 rounded-full border"
                style={{
                  color: TAG_COLORS[tag] ?? accent,
                  borderColor: TAG_COLORS[tag] ?? accent,
                  backgroundColor: `${TAG_COLORS[tag] ?? accent}11`,
                }}
              >
                {t(tag)}
              </span>
            ))}
          </div>
          {/* Project name */}
          <h1 className="text-[32px] font-bold text-txt mt-4">
            {t(caseStudy.nameKey)}
          </h1>
          {/* Tagline */}
          <p className="text-base mt-2" style={{ color: accent }}>
            {t(caseStudy.taglineKey)}
          </p>
          {/* Overview */}
          <p className="text-sm text-txt-dim mt-4 leading-relaxed max-w-[700px]">
            {t(caseStudy.overviewKey)}
          </p>
        </div>
      </ScrollReveal>

      {/* Impact Numbers */}
      <ScrollReveal>
        <div className="border-b border-border py-8">
          <ImpactNumbers items={caseStudy.impactNumbers} accentColor={accent} />
        </div>
      </ScrollReveal>

      {/* The Challenge */}
      <ScrollReveal>
        <div className="border-b border-border py-8">
          <div
            className="font-mono text-[10px] uppercase tracking-[2px] mb-3"
            style={{ color: '#ff3366' }}
          >
            {t('p_label_challenge')}
          </div>
          <h2 className="text-xl font-semibold text-txt">
            {t(caseStudy.problemHeadKey)}
          </h2>
          <p className="text-sm text-txt-dim mt-3 leading-relaxed">
            {t(caseStudy.problemDescKey)}
          </p>
        </div>
      </ScrollReveal>

      {/* The Solution */}
      <ScrollReveal>
        <div className="border-b border-border py-8">
          <div className="font-mono text-[10px] uppercase tracking-[2px] mb-3 text-cyan">
            {t('p_label_solution')}
          </div>
          <h2 className="text-xl font-semibold text-txt mb-4">
            {t(caseStudy.solutionHeadKey)}
          </h2>
          <SolutionGrid items={caseStudy.solutions} accentColor={accent} />
        </div>
      </ScrollReveal>

      {/* In Action */}
      <ScrollReveal>
        <div className="border-b border-border py-8">
          <div className="font-mono text-[10px] uppercase tracking-[2px] mb-3 text-txt-dim">
            {t('p_label_action')}
          </div>
          {caseStudy.screenshots.length === 1 ? (
            <BrowserFrame title={t(caseStudy.nameKey)}>
              <div className="relative w-full" style={{ aspectRatio: '16/10' }}>
                {caseStudy.screenshots[0].endsWith('.svg') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={caseStudy.screenshots[0]}
                    alt={t(caseStudy.nameKey)}
                    className="absolute inset-0 w-full h-full object-cover rounded"
                  />
                ) : (
                  <Image
                    src={caseStudy.screenshots[0]}
                    alt={t(caseStudy.nameKey)}
                    fill
                    className="object-cover rounded"
                    sizes="(max-width: 768px) 100vw, 960px"
                  />
                )}
              </div>
            </BrowserFrame>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {caseStudy.screenshots.map((src, i) => (
                <BrowserFrame key={i} title={`${t(caseStudy.nameKey)} ${i + 1}`}>
                  <div className="relative w-full" style={{ aspectRatio: '16/10' }}>
                    {src.endsWith('.svg') ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={src}
                        alt={`${t(caseStudy.nameKey)} screenshot ${i + 1}`}
                        className="absolute inset-0 w-full h-full object-cover rounded"
                      />
                    ) : (
                      <Image
                        src={src}
                        alt={`${t(caseStudy.nameKey)} screenshot ${i + 1}`}
                        fill
                        className="object-cover rounded"
                        sizes="(max-width: 768px) 100vw, 480px"
                      />
                    )}
                  </div>
                </BrowserFrame>
              ))}
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* Results */}
      <ScrollReveal>
        <div className="border-b border-border py-8">
          <div className="font-mono text-[10px] uppercase tracking-[2px] mb-3 text-neon-green">
            {t('p_label_results')}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {caseStudy.results.map((result, i) => (
              <div
                key={i}
                className="border border-border rounded-lg p-6 text-center"
              >
                <div
                  className="text-[36px] font-mono font-bold leading-none"
                  style={{ color: accent }}
                >
                  {t(result.val)}
                </div>
                <div className="text-xs text-txt-dim mt-2">{t(result.lbl)}</div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Tech Stack */}
      <ScrollReveal>
        <div className="border-b border-border py-8">
          <TechStackPills items={caseStudy.techStack} />
        </div>
      </ScrollReveal>

      {/* CTA */}
      <ScrollReveal>
        <div className="py-10 text-center">
          <h2 className="text-xl font-semibold text-txt">
            {t('p_detail_cta_title')}
          </h2>
          <p className="text-sm font-mono mt-2 text-amber-400">
            {t('p_cta_scarcity')}
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-5">
            <Link
              href="/services#booking"
              className="bg-cyan text-bg px-6 py-3 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90"
            >
              {t('p_detail_cta_primary')}
            </Link>
            {caseStudy.githubUrl && (
              <Link
                href={caseStudy.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-border text-txt px-6 py-3 rounded-lg text-sm transition-colors hover:border-border-bright"
              >
                {t('p_detail_cta_github')}
              </Link>
            )}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
