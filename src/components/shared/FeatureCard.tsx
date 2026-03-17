import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  accentColor?: string;
  fullWidth?: boolean;
  badge?: string;
  className?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  accentColor = 'var(--color-cyan)',
  fullWidth = false,
  badge,
  className,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border border-border bg-bg-card p-6 transition-colors hover:border-border-bright',
        fullWidth && 'col-span-full',
        className
      )}
    >
      {/* Top accent stripe */}
      <div
        className="absolute inset-x-0 top-0 h-[3px] opacity-0 transition-opacity group-hover:opacity-100"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
        }}
      />

      <div className="flex items-start gap-4">
        {/* Icon */}
        <span className="text-2xl leading-none">{icon}</span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-base font-semibold text-txt">
              {title}
            </h3>
            {badge && (
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                style={{
                  color: accentColor,
                  backgroundColor: `color-mix(in srgb, ${accentColor} 15%, transparent)`,
                }}
              >
                {badge}
              </span>
            )}
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-txt-dim">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
