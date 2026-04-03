'use client';

import { Hero } from '@/components/home/Hero';
import { ProductCard } from '@/components/home/ProductCard';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { useI18n } from '@/lib/i18n';
import { useGitHubStars } from '@/hooks/useGitHubStars';
import { PRODUCT_STATS, COMBINED_TESTS } from '@/lib/config';

export default function Home() {
  const { t } = useI18n();
  const { stars } = useGitHubStars();

  return (
    <>
      {/* Hero */}
      <Hero />

      {/* Product Cards */}
      <ScrollReveal>
        <section className="mx-auto grid max-w-4xl gap-6 px-6 pb-16 sm:grid-cols-2">
          <ProductCard
            name={t('card_ir_name')}
            description={t('card_ir_desc')}
            cta={t('card_ir_cta')}
            href="/check"
            accentColor="var(--color-accent)"
            stars={stars?.idea_reality ?? null}
            tests={PRODUCT_STATS.ideaReality.tests}
          />
          <ProductCard
            name={t('card_tm_name')}
            description={t('card_tm_desc')}
            cta={t('card_tm_cta')}
            href="/tradememory"
            accentColor="var(--color-cyan)"
            stars={stars?.tradememory ?? null}
            tests={PRODUCT_STATS.tradeMemory.tests}
          />
        </section>
      </ScrollReveal>

      {/* Social Proof Bar */}
      <ScrollReveal>
        <section className="mx-auto max-w-3xl px-6 pb-20">
          <div className="flex flex-wrap items-center justify-center gap-6 rounded-xl border border-border bg-bg-card/60 px-6 py-4 backdrop-blur-sm md:gap-10">
            <div className="flex items-center gap-3">
              <span className="font-mono text-lg font-bold text-cyan md:text-xl">
                {stars ? (
                  <NumberTicker value={stars.combined} />
                ) : (
                  '—'
                )}
              </span>
              <span className="text-xs text-txt-dim md:text-sm">combined</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-lg font-bold text-cyan md:text-xl">
                <NumberTicker value={COMBINED_TESTS} />
              </span>
              <span className="text-xs text-txt-dim md:text-sm">tests passing</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-lg font-bold text-cyan md:text-xl">MIT</span>
              <span className="text-xs text-txt-dim md:text-sm">licensed</span>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}
