'use client';

import { useI18n } from '@/lib/i18n';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { BookingForm } from '@/components/services/BookingForm';
import { SocialProof } from '@/components/services/SocialProof';
import { cn } from '@/lib/utils';

const TIERS = [
  {
    nameKey: 'svc_tier1_name' as const,
    price: '$5,000',
    period: '',
    descKey: 'svc_tier1_desc' as const,
    accentColor: 'var(--color-accent)',
    features: [
      'svc_tier1_f1',
      'svc_tier1_f2',
      'svc_tier1_f3',
      'svc_tier1_f4',
      'svc_tier1_f5',
    ] as const,
    deliveryKey: 'svc_tier1_delivery' as const,
  },
  {
    nameKey: 'svc_tier2_name' as const,
    price: '$20,000',
    period: '',
    descKey: 'svc_tier2_desc' as const,
    accentColor: 'var(--color-cyan)',
    highlight: true,
    badge: 'svc_tier2_badge' as const,
    features: [
      'svc_tier2_f1',
      'svc_tier2_f2',
      'svc_tier2_f3',
      'svc_tier2_f4',
      'svc_tier2_f5',
      'svc_tier2_f6',
    ] as const,
    deliveryKey: 'svc_tier2_delivery' as const,
  },
  {
    nameKey: 'svc_tier3_name' as const,
    price: '$50,000+',
    period: '',
    descKey: 'svc_tier3_desc' as const,
    accentColor: 'var(--color-neon-green)',
    features: [
      'svc_tier3_f1',
      'svc_tier3_f2',
      'svc_tier3_f3',
      'svc_tier3_f4',
      'svc_tier3_f5',
      'svc_tier3_f6',
    ] as const,
    deliveryKey: 'svc_tier3_delivery' as const,
  },
];

const PROOF_STATS = [
  { valueKey: 'svc_proof_1_val' as const, labelKey: 'svc_proof_1_label' as const },
  { valueKey: 'svc_proof_2_val' as const, labelKey: 'svc_proof_2_label' as const },
  { valueKey: 'svc_proof_3_val' as const, labelKey: 'svc_proof_3_label' as const },
  { valueKey: 'svc_proof_4_val' as const, labelKey: 'svc_proof_4_label' as const },
];

const PROCESS_STEPS = [
  { numKey: 'svc_step1_num' as const, titleKey: 'svc_step1_title' as const, descKey: 'svc_step1_desc' as const },
  { numKey: 'svc_step2_num' as const, titleKey: 'svc_step2_title' as const, descKey: 'svc_step2_desc' as const },
  { numKey: 'svc_step3_num' as const, titleKey: 'svc_step3_title' as const, descKey: 'svc_step3_desc' as const },
  { numKey: 'svc_step4_num' as const, titleKey: 'svc_step4_title' as const, descKey: 'svc_step4_desc' as const },
];

export function ServicesContent() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-6xl px-6 py-20 md:px-10">
      {/* Hero */}
      <ScrollReveal>
        <div className="text-center">
          <span className="inline-block rounded-full border border-cyan/30 bg-cyan/5 px-4 py-1 font-mono text-xs tracking-wider text-cyan">
            {t('svc_hero_tag')}
          </span>
          <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-txt md:text-6xl">
            {t('svc_hero_title1')}
            <br />
            <span className="text-cyan">{t('svc_hero_title2')}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-txt-dim">
            {t('svc_hero_desc')}
          </p>
        </div>
      </ScrollReveal>

      {/* Social Proof Bar */}
      <ScrollReveal>
        <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
          {PROOF_STATS.map((stat) => (
            <div
              key={stat.labelKey}
              className="rounded-xl border border-border bg-bg-card p-4 text-center"
            >
              <div className="font-mono text-2xl font-bold text-cyan">
                {t(stat.valueKey)}
              </div>
              <div className="mt-1 text-xs text-txt-dim">{t(stat.labelKey)}</div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* Social Proof — Flags + Testimonials (BEFORE pricing = trust first) */}
      <ScrollReveal>
        <div className="mt-20">
          <SocialProof />
        </div>
      </ScrollReveal>

      {/* Interactive Demo — placeholder for next session */}
      {/* TODO: Mock dashboard preview (Recharts + fake data) goes here */}

      {/* Tier Cards */}
      <ScrollReveal>
        <div className="mt-24 grid gap-6 md:grid-cols-3">
          {TIERS.map((tier) => (
            <div
              key={tier.nameKey}
              className={cn(
                'group relative flex flex-col rounded-xl border bg-bg-card p-8 transition-colors',
                tier.highlight
                  ? 'border-cyan/40 shadow-[0_0_32px_rgba(0,229,255,0.06)]'
                  : 'border-border hover:border-border-bright'
              )}
            >
              {/* Top accent stripe */}
              <div
                className="absolute inset-x-0 top-0 h-[3px] rounded-t-xl opacity-0 transition-opacity group-hover:opacity-100"
                style={{
                  background: `linear-gradient(90deg, transparent, ${tier.accentColor}, transparent)`,
                }}
              />

              {/* Badge */}
              {tier.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-cyan px-3 py-0.5 text-xs font-semibold text-bg">
                  {t(tier.badge)}
                </span>
              )}

              {/* Name */}
              <h3 className="font-display text-lg font-semibold text-txt">
                {t(tier.nameKey)}
              </h3>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-1">
                <span
                  className={cn(
                    'font-display text-4xl font-bold',
                    tier.highlight ? 'text-cyan' : 'text-txt'
                  )}
                >
                  {tier.price}
                </span>
              </div>

              {/* Description */}
              <p className="mt-3 text-sm leading-relaxed text-txt-dim">
                {t(tier.descKey)}
              </p>

              {/* Features */}
              <ul className="mt-6 flex flex-1 flex-col gap-3">
                {tier.features.map((fKey) => (
                  <li
                    key={fKey}
                    className="flex items-start gap-2 text-sm text-txt-dim"
                  >
                    <span className="mt-0.5 text-neon-green">&#10003;</span>
                    <span>{t(fKey)}</span>
                  </li>
                ))}
              </ul>

              {/* Delivery */}
              <div className="mt-6 rounded-lg border border-border bg-bg/50 px-4 py-2 text-center font-mono text-xs text-txt-dim">
                {t(tier.deliveryKey)}
              </div>

              {/* CTA */}
              <a
                href="#booking"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={cn(
                  'mt-6 block cursor-pointer rounded-lg py-3 text-center text-sm font-semibold transition-colors no-underline hover:no-underline',
                  tier.highlight
                    ? 'bg-cyan text-bg hover:bg-cyan/90'
                    : 'border border-border-bright text-txt hover:bg-bg-card-hover'
                )}
              >
                {t('svc_cta')}
              </a>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* Process */}
      <ScrollReveal>
        <div className="mt-24">
          <h2 className="text-center font-display text-2xl font-bold text-txt md:text-4xl">
            {t('svc_process_title')}
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {PROCESS_STEPS.map((step) => (
              <div key={step.numKey} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-cyan/30 bg-cyan/5 font-mono text-lg font-bold text-cyan">
                  {t(step.numKey)}
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-txt">
                  {t(step.titleKey)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-txt-dim">
                  {t(step.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* FAQ */}
      <ScrollReveal>
        <div className="mt-24">
          <h2 className="text-center font-display text-2xl font-bold text-txt md:text-3xl">
            {t('svc_faq_title')}
          </h2>
          <div className="mx-auto mt-10 max-w-3xl space-y-6">
            {([1, 2, 3, 4, 5, 6] as const).map((n) => (
              <div key={n} className="rounded-xl border border-border bg-bg-card p-6">
                <h3 className="font-display text-base font-semibold text-txt">
                  {t(`svc_faq${n}_q` as 'svc_faq1_q')}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-txt-dim">
                  {t(`svc_faq${n}_a` as 'svc_faq1_a')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Booking Form */}
      <ScrollReveal>
        <div className="mt-24">
          <BookingForm />
        </div>
      </ScrollReveal>
    </div>
  );
}
