'use client';

import { useI18n } from '@/lib/i18n';
import { PricingCard } from '@/components/shared/PricingCard';

export function PricingTable() {
  const { t } = useI18n();

  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:px-10">
      {/* Hero */}
      <div className="text-center">
        <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
          {t('pricing_hero_title')}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-txt-dim">
          {t('pricing_hero_subtitle')}
        </p>
      </div>

      {/* 4-tier grid */}
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Free */}
        <PricingCard
          tier={t('pricing_tier_free')}
          price="$0"
          period={t('pricing_tier_period')}
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

        {/* Pro */}
        <PricingCard
          tier={t('pricing_tier_pro')}
          price="$29"
          period={t('pricing_tier_period')}
          description={t('pricing_tier_pro_desc')}
          badge={t('pricing_badge_popular')}
          highlight
          features={[
            t('pricing_feat_pro_1'),
            t('pricing_feat_pro_2'),
            t('pricing_feat_pro_3'),
            t('pricing_feat_pro_4'),
            t('pricing_feat_pro_5'),
          ]}
          cta={t('pricing_cta_pro')}
          ctaHref="mailto:dev@mnemox.ai"
        />

        {/* Team */}
        <PricingCard
          tier={t('pricing_tier_team')}
          price="$79"
          period={t('pricing_tier_period')}
          description={t('pricing_tier_team_desc')}
          features={[
            t('pricing_feat_team_1'),
            t('pricing_feat_team_2'),
            t('pricing_feat_team_3'),
            t('pricing_feat_team_4'),
            t('pricing_feat_team_5'),
          ]}
          cta={t('pricing_cta_team')}
          ctaHref="mailto:dev@mnemox.ai"
        />

        {/* Enterprise */}
        <PricingCard
          tier={t('pricing_tier_enterprise')}
          price="$299"
          period={t('pricing_tier_period')}
          description={t('pricing_tier_enterprise_desc')}
          features={[
            t('pricing_feat_enterprise_1'),
            t('pricing_feat_enterprise_2'),
            t('pricing_feat_enterprise_3'),
            t('pricing_feat_enterprise_4'),
            t('pricing_feat_enterprise_5'),
          ]}
          cta={t('pricing_cta_enterprise')}
          ctaHref="mailto:dev@mnemox.ai"
        />
      </div>
    </section>
  );
}
