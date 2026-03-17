'use client';

import { useI18n } from '@/lib/i18n';

export function ComparisonSection() {
  const { t } = useI18n();

  return (
    <section className="mx-auto max-w-4xl px-5 sm:px-10">
      <div className="border border-border bg-bg-card p-8 sm:p-12">
        <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
          {t('pricing_diff_title')}
        </h2>
        <p className="mt-3 text-base text-txt-dim">
          {t('pricing_diff_subtitle')}
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="border border-border bg-bg p-6">
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-cyan">
              {t('pricing_diff_free_title')}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-txt-dim">
              {t('pricing_diff_free_text')}
            </p>
          </div>
          <div className="border border-border bg-bg p-6">
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-cyan">
              {t('pricing_diff_paid_title')}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-txt-dim">
              {t('pricing_diff_paid_text')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
