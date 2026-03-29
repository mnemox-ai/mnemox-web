'use client';

import { NumberTicker } from '@/components/magicui/number-ticker';
import { STATS } from './mock-data';

export function StatCards() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {STATS.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg border border-border bg-bg/60 p-3 text-center transition-colors hover:border-border-bright"
        >
          <div className={`font-mono text-xl font-bold md:text-2xl ${stat.color}`}>
            {stat.prefix}
            <NumberTicker value={stat.value} delay={200} duration={1500} decimalPlaces={stat.decimals} />
            {stat.suffix}
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-wider text-txt-dim">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
