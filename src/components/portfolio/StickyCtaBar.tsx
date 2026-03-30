'use client';

import { useState, useEffect, type RefObject } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

interface StickyCtaBarProps {
  sentinelRef: RefObject<HTMLDivElement | null>;
}

export function StickyCtaBar({ sentinelRef }: StickyCtaBarProps) {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show bar when sentinel is NOT visible (user has scrolled past it)
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [sentinelRef]);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-cyan/20 backdrop-blur-xl transition-all duration-300"
      style={{
        background: 'rgba(4,6,11,0.95)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-4 px-6 py-3">
        <div className="max-md:hidden flex items-center gap-2 text-sm text-txt-dim">
          <span>{t('p_sticky_text')}</span>
          <span className="font-mono text-amber-400 text-xs">{t('p_sticky_scarcity')}</span>
        </div>
        <Link
          href="/services#booking"
          className="rounded-lg bg-cyan px-5 py-2 text-sm font-semibold text-bg transition-opacity hover:opacity-90"
        >
          {t('p_sticky_btn')}
        </Link>
      </div>
    </div>
  );
}
