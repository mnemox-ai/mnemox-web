'use client';

import { Hero } from '@/components/home/Hero';
import { ProductCard } from '@/components/home/ProductCard';
import { StatsBar } from '@/components/shared/StatsBar';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { useI18n } from '@/lib/i18n';

export default function Home() {
  const { t } = useI18n();

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
            stars={290}
            tests={275}
          />
          <ProductCard
            name={t('card_tm_name')}
            description={t('card_tm_desc')}
            cta={t('card_tm_cta')}
            href="/tradememory"
            accentColor="var(--color-cyan)"
            stars={null}
            tests={1055}
          />
        </section>
      </ScrollReveal>

      {/* Social Proof Bar */}
      <ScrollReveal>
        <section className="mx-auto max-w-3xl px-6 pb-20">
          <StatsBar
            items={[
              { value: '290+', label: t('social_stars', { count: '290+' }).replace('290+ ', '') },
              { value: '1,330', label: t('social_tests', { count: '1,330' }).replace('1,330 ', '') },
              { value: 'MIT', label: t('social_license').replace('MIT ', '') },
            ]}
          />
        </section>
      </ScrollReveal>
    </>
  );
}
