import { cn } from '@/lib/utils';

interface PricingCardProps {
  tier: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  cta: string;
  ctaHref?: string;
  badge?: string;
  highlight?: boolean;
  className?: string;
}

export function PricingCard({
  tier,
  price,
  period = '/mo',
  description,
  features,
  cta,
  ctaHref = '#',
  badge,
  highlight = false,
  className,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col rounded-xl border bg-bg-card p-6 transition-colors',
        highlight
          ? 'border-cyan/40 shadow-[0_0_24px_rgba(0,229,255,0.08)]'
          : 'border-border hover:border-border-bright',
        className
      )}
    >
      {/* Badge */}
      {badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-cyan px-3 py-0.5 text-xs font-semibold text-bg">
          {badge}
        </span>
      )}

      {/* Tier */}
      <h3 className="font-display text-lg font-semibold text-txt">{tier}</h3>

      {/* Price */}
      <div className="mt-4 flex items-baseline gap-1">
        <span
          className={cn(
            'font-display text-4xl font-bold',
            highlight ? 'text-cyan' : 'text-txt'
          )}
        >
          {price}
        </span>
        {price !== 'Custom' && (
          <span className="text-sm text-txt-dim">{period}</span>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="mt-3 text-sm leading-relaxed text-txt-dim">{description}</p>
      )}

      {/* Features */}
      <ul className="mt-6 flex flex-1 flex-col gap-3">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-txt-dim">
            <span className="mt-0.5 text-neon-green">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href={ctaHref}
        className={cn(
          'mt-8 block rounded-lg py-2.5 text-center text-sm font-semibold transition-colors',
          highlight
            ? 'bg-cyan text-bg hover:bg-cyan/90'
            : 'border border-border-bright text-txt hover:bg-bg-card-hover'
        )}
      >
        {cta}
      </a>
    </div>
  );
}
