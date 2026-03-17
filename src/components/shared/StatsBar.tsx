import { cn } from '@/lib/utils';

interface StatItem {
  label: string;
  value: string;
}

interface StatsBarProps {
  items: StatItem[];
  className?: string;
}

export function StatsBar({ items, className }: StatsBarProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-center gap-6 rounded-xl border border-border bg-bg-card/60 px-6 py-4 backdrop-blur-sm md:gap-10',
        className
      )}
    >
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="font-mono text-lg font-bold text-cyan md:text-xl">
            {item.value}
          </span>
          <span className="text-xs text-txt-dim md:text-sm">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
