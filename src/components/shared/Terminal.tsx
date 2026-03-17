'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface TerminalLine {
  text: string;
  className?: string;
}

interface TerminalProps {
  lines: TerminalLine[];
  title?: string;
  delay?: number;
  className?: string;
}

export function Terminal({
  lines,
  title = 'terminal',
  delay = 400,
  className,
}: TerminalProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true;
          observer.disconnect();

          let i = 0;
          const tick = () => {
            i++;
            setVisibleCount(i);
            if (i < lines.length) {
              setTimeout(tick, delay);
            }
          };
          setTimeout(tick, 300);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [lines.length, delay]);

  return (
    <div
      ref={ref}
      className={cn(
        'w-full overflow-hidden rounded-xl border border-border bg-bg-card',
        className
      )}
    >
      {/* macOS title bar */}
      <div className="flex items-center gap-2 bg-border px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-danger" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber" />
        <span className="h-2.5 w-2.5 rounded-full bg-neon-green" />
        <span className="ml-3 font-mono text-[11px] text-txt-dim">
          {title}
        </span>
      </div>

      {/* Body */}
      <div className="p-5 font-mono text-sm leading-relaxed">
        {lines.map((line, i) => (
          <div
            key={i}
            className={cn(
              'mb-1 whitespace-pre-wrap transition-all duration-300',
              i < visibleCount
                ? 'translate-y-0 opacity-100'
                : 'translate-y-1 opacity-0',
              line.className
            )}
          >
            {line.text || '\u00A0'}
          </div>
        ))}

        {/* Blinking cursor */}
        {visibleCount >= lines.length && (
          <span className="inline-block h-[15px] w-2 animate-pulse bg-cyan align-text-bottom" />
        )}
      </div>
    </div>
  );
}
