'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import type { TranslationKey } from '@/lib/translations/en';

const FAQ_ITEMS: { q: TranslationKey; a: TranslationKey }[] = [
  { q: 'pricing_faq1_q', a: 'pricing_faq1_a' },
  { q: 'pricing_faq2_q', a: 'pricing_faq2_a' },
  { q: 'pricing_faq3_q', a: 'pricing_faq3_a' },
  { q: 'pricing_faq4_q', a: 'pricing_faq4_a' },
];

export function FAQ() {
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mx-auto max-w-4xl px-5 py-24 sm:px-10">
      <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
        {t('pricing_faq_title')}
      </h2>
      <p className="mt-3 text-base text-txt-dim">
        {t('pricing_faq_subtitle')}
      </p>

      <div className="mt-10 flex flex-col gap-4">
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="border border-border bg-bg-card transition-colors hover:bg-bg-card-hover"
            >
              <button
                type="button"
                className="flex w-full items-center justify-between px-8 py-6 text-left"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                <h3 className="text-lg font-bold text-white">{t(item.q)}</h3>
                <span className="ml-4 shrink-0 text-xl text-txt-dim transition-transform duration-200"
                  style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
                >
                  +
                </span>
              </button>
              {isOpen && (
                <div className="px-8 pb-6">
                  <p className="text-[15px] leading-relaxed text-txt-dim">
                    {t(item.a)}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
