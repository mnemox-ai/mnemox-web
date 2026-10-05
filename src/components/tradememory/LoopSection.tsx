'use client';

import { useI18n } from '@/lib/i18n';
import type { TranslationKey } from '@/lib/translations/en';

const STEPS: { title: TranslationKey; desc: TranslationKey }[] = [
  { title: 'tm_loop_1', desc: 'tm_loop_1_desc' },
  { title: 'tm_loop_2', desc: 'tm_loop_2_desc' },
  { title: 'tm_loop_3', desc: 'tm_loop_3_desc' },
  { title: 'tm_loop_4', desc: 'tm_loop_4_desc' },
  { title: 'tm_loop_5', desc: 'tm_loop_5_desc' },
];

export function LoopSection() {
  const { t } = useI18n();
  return (
    <section className="tm-wrap tm-hair border-t py-14">
      <h2 className="tm-h2">{t('tm_sec_loop')}</h2>
      <ol className="tm-loop mt-10 grid gap-8 md:grid-cols-5 md:gap-6">
        {STEPS.map((step) => (
          <li key={step.title}>
            <h3 className="text-base font-semibold">{t(step.title)}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--tm-dim)]">{t(step.desc)}</p>
          </li>
        ))}
      </ol>
      <p className="mt-10 max-w-[44rem] text-sm text-[var(--tm-dim)]">{t('tm_loop_note')}</p>
    </section>
  );
}
