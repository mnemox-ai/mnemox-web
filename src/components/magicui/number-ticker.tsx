'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface NumberTickerProps {
  value: number;
  direction?: 'up' | 'down';
  delay?: number;
  duration?: number;
  className?: string;
}

export function NumberTicker({
  value,
  direction = 'up',
  delay = 0,
  duration = 1200,
  className,
}: NumberTickerProps) {
  const [display, setDisplay] = useState(direction === 'up' ? 0 : value);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          observer.disconnect();

          const timeout = setTimeout(() => {
            const start = performance.now();
            const from = direction === 'up' ? 0 : value;
            const to = direction === 'up' ? value : 0;

            function tick(now: number) {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              // ease-out cubic
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = Math.round(from + (to - from) * eased);
              setDisplay(current);
              if (progress < 1) requestAnimationFrame(tick);
            }

            requestAnimationFrame(tick);
          }, delay);

          return () => clearTimeout(timeout);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, direction, delay, duration]);

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {display.toLocaleString()}
    </span>
  );
}
