'use client';

import { useI18n } from '@/lib/i18n';
import type { SolutionComponent } from '@/lib/portfolio-data';

interface SolutionGridProps {
  items: SolutionComponent[];
  accentColor: string;
}

export function SolutionGrid({ items, accentColor }: SolutionGridProps) {
  const { t } = useI18n();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {items.map((item, i) => (
        <div key={i} className="border border-border rounded-lg p-4">
          <div className="text-sm font-semibold" style={{ color: accentColor }}>
            {t(item.title)}
          </div>
          <div className="text-xs text-txt-dim mt-1 leading-relaxed">
            {t(item.desc)}
          </div>
        </div>
      ))}
    </div>
  );
}
