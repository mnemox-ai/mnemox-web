'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="max-w-[1200px] mx-auto px-10 py-10 border-t border-border flex items-center justify-between max-md:flex-col max-md:gap-4 max-md:text-center max-md:px-5">
      <div className="font-mono text-xs text-txt-muted">
        {t('footer_text')}
      </div>
      <div className="flex flex-wrap gap-6">
        <a
          href="https://github.com/mnemox-ai"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-txt-dim no-underline transition-colors hover:text-cyan hover:no-underline"
        >
          {t('nav_github')}
        </a>
        <Link
          href="/blog"
          className="font-mono text-xs text-txt-dim no-underline transition-colors hover:text-cyan hover:no-underline"
        >
          {t('footer_blog')}
        </Link>
        <Link
          href="/services"
          className="font-mono text-xs text-txt-dim no-underline transition-colors hover:text-cyan hover:no-underline"
        >
          {t('nav_services')}
        </Link>
        <Link
          href="/pricing"
          className="font-mono text-xs text-txt-dim no-underline transition-colors hover:text-cyan hover:no-underline"
        >
          {t('footer_pricing')}
        </Link>
        <Link
          href="/privacy"
          className="font-mono text-xs text-txt-dim no-underline transition-colors hover:text-cyan hover:no-underline"
        >
          {t('footer_privacy')}
        </Link>
        <Link
          href="/terms"
          className="font-mono text-xs text-txt-dim no-underline transition-colors hover:text-cyan hover:no-underline"
        >
          {t('footer_terms')}
        </Link>
      </div>
    </footer>
  );
}
