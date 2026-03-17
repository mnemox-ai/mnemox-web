'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  name: string;
  description: string;
  cta: string;
  href: string;
  accentColor: string;
  stars?: number | null;
  tests?: number;
  className?: string;
}

export function ProductCard({
  name,
  description,
  cta,
  href,
  accentColor,
  stars,
  tests,
  className,
}: ProductCardProps) {
  return (
    <div
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl border border-border bg-bg-card p-6 transition-colors hover:border-border-bright',
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

      {/* Name */}
      <h3 className="font-display text-xl font-bold text-txt">{name}</h3>

      {/* Meta badges */}
      <div className="mt-3 flex flex-wrap gap-2">
        {stars != null && (
          <span className="rounded-full border border-border-bright px-2.5 py-0.5 font-mono text-xs text-txt-dim">
            {stars.toLocaleString()} ★
          </span>
        )}
        {tests != null && tests > 0 && (
          <span className="rounded-full border border-border-bright px-2.5 py-0.5 font-mono text-xs text-neon-green">
            {tests} tests
          </span>
        )}
      </div>

      {/* Description */}
      <p className="mt-4 flex-1 text-sm leading-relaxed text-txt-dim">
        {description}
      </p>

      {/* CTA */}
      <Link
        href={href}
        className="mt-5 inline-flex items-center text-sm font-semibold transition-colors"
        style={{ color: accentColor }}
      >
        {cta}
      </Link>
    </div>
  );
}
