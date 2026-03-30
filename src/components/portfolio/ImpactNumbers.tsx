'use client';

import { useI18n } from '@/lib/i18n';
import type { CaseStudyMetric } from '@/lib/portfolio-data';

interface ImpactNumbersProps {
  items: CaseStudyMetric[];
  accentColor: string;
}

export function ImpactNumbers({ items, accentColor }: ImpactNumbersProps) {
  const { t } = useI18n();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-border rounded-lg overflow-hidden">
      {items.map((item, i) => (
        <div key={i} className="bg-bg px-6 py-5 flex flex-col">
          <span
            className="text-[28px] font-mono font-bold leading-none"
            style={{ color: accentColor }}
          >
            {t(item.val)}
          </span>
          <span className="text-[11px] text-txt-dim uppercase tracking-wider mt-2">
            {t(item.lbl)}
          </span>
        </div>
      ))}
    </div>
  );
}
