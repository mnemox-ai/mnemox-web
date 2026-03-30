'use client';

import { useI18n } from '@/lib/i18n';
import { NumberTicker } from '@/components/magicui/number-ticker';
import type { TranslationKey } from '@/lib/translations/en';

interface MetricsBarItem {
  value: number | string;
  labelKey: TranslationKey;
}

interface MetricsBarProps {
  items: MetricsBarItem[];
}

export function MetricsBar({ items }: MetricsBarProps) {
  const { t } = useI18n();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 border-t border-b border-border">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex flex-col items-center justify-center py-6 px-4 text-center"
        >
          <div className="font-mono text-2xl font-bold text-cyan">
            {typeof item.value === 'number' ? (
              <NumberTicker value={item.value} />
            ) : (
              <span>{item.value}</span>
            )}
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-widest text-txt-dim">
            {t(item.labelKey)}
          </div>
        </div>
      ))}
    </div>
  );
}
