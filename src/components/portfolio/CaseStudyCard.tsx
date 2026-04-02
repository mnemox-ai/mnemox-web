'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n';
import { BrowserFrame } from '@/components/services/demo/BrowserFrame';
import type { CaseStudy } from '@/lib/portfolio-data';

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
  reversed: boolean;
}

const ACCENT_COLORS: Record<string, string> = {
  tradememory: '#00e5ff',
  nexusos: '#00ff88',
  'ng-gold': '#ffaa00',
  'strategy-validator': '#a855f7',
};

export function CaseStudyCard({ caseStudy, reversed }: CaseStudyCardProps) {
  const { t } = useI18n();
  const accent = ACCENT_COLORS[caseStudy.id] ?? '#00e5ff';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
      {/* Text side */}
      <div className={reversed ? 'md:order-2' : ''}>
        <div
          className="text-[10px] font-mono uppercase tracking-[2px] mb-3"
          style={{ color: '#ff3366' }}
        >
          {t('p_label_problem')}
        </div>
        <h3 className="text-xl font-semibold text-txt">
          {t(caseStudy.challengeKey)}
        </h3>
        <p className="text-sm text-txt-dim mt-2 leading-relaxed">
          {t(caseStudy.challengeDescKey)}
        </p>

        {/* Metrics row */}
        {caseStudy.heroMetrics.length > 0 && (
          <div className="flex flex-wrap gap-5 mt-5">
            {caseStudy.heroMetrics.map((metric, i) => (
              <div key={i} className="flex flex-col">
                <span
                  className="font-mono font-bold text-lg"
                  style={{ color: accent }}
                >
                  {t(metric.val)}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-txt-dim mt-0.5">
                  {t(metric.lbl)}
                </span>
              </div>
            ))}
          </div>
        )}

        <Link
          href={`/portfolio/${caseStudy.id}`}
          className="text-sm text-cyan hover:underline mt-4 inline-block no-underline hover:no-underline"
        >
          {t('p_detail_back').includes('Back') ? 'Read full case study →' : '閱讀完整案例 →'}
        </Link>
      </div>

      {/* Visual side */}
      <div className={reversed ? 'md:order-1' : ''}>
        <BrowserFrame title={t(caseStudy.nameKey)}>
          <div
            className="relative w-full overflow-hidden rounded-lg"
            style={{
              aspectRatio: '16/10',
              boxShadow: `0 0 40px ${accent}22`,
            }}
          >
            {/* Use <img> for SVGs (next/image doesn't render SVG content), Image for raster */}
            {caseStudy.screenshots[0]?.endsWith('.svg') ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={caseStudy.screenshots[0]}
                alt={t(caseStudy.nameKey)}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <Image
                src={caseStudy.screenshots[0] ?? '/portfolio/placeholder.svg'}
                alt={t(caseStudy.nameKey)}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
          </div>
        </BrowserFrame>
      </div>
    </div>
  );
}
