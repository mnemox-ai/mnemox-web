'use client';

import { useI18n } from '@/lib/i18n';
import { PricingCard } from '@/components/shared/PricingCard';

export function PricingTable() {
  const { t } = useI18n();

  return (
    <section className="mx-auto max-w-4xl px-5 py-24 sm:px-10">
      {/* Hero */}
      <div className="text-center">
        <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
          {t('pricing_hero_title')}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-txt-dim">
          {t('pricing_hero_subtitle')}
        </p>
      </div>

      {/* 2-tier grid */}
      <div className="mt-16 grid gap-6 sm:grid-cols-2">
        {/* Free */}
        <PricingCard
          tier={t('pricing_tier_free')}
          price="$0"
          period=""
          description={t('pricing_tier_free_desc')}
          features={[
            t('pricing_feat_free_1'),
            t('pricing_feat_free_2'),
            t('pricing_feat_free_3'),
            t('pricing_feat_free_4'),
            t('pricing_feat_free_5'),
          ]}
          cta={t('pricing_cta_free')}
          ctaHref="https://github.com/mnemox-ai/tradememory-protocol"
        />

        {/* Custom / Enterprise */}
        <PricingCard
          tier={t('pricing_tier_enterprise')}
          price={t('pricing_custom_price')}
          period=""
          description={t('pricing_tier_enterprise_desc')}
          highlight
          badge={t('pricing_badge_popular')}
          features={[
            t('pricing_feat_enterprise_1'),
            t('pricing_feat_enterprise_2'),
            t('pricing_feat_enterprise_3'),
            t('pricing_feat_enterprise_4'),
            t('pricing_feat_enterprise_5'),
          ]}
          cta={t('pricing_cta_enterprise')}
          ctaHref="/services"
        />
      </div>
    </section>
  );
}
