'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import { useI18n } from '@/lib/i18n';

export function Nav() {
  const { t, toggleLang } = useI18n();
  const { isSignedIn } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [stars, setStars] = useState<{ idea_reality: number; tradememory: number } | null>(null);

  useEffect(() => {
    fetch('/api/github-stars')
      .then((r) => r.json())
      .then(setStars)
      .catch(() => {});
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between px-10 py-4 bg-[rgba(5,5,8,0.85)] backdrop-blur-[20px] border-b border-border max-md:px-5 max-md:py-3">
      <Link
        href="/"
        className="font-mono font-bold text-lg text-cyan tracking-[2px] no-underline hover:no-underline"
      >
        MNEMOX<span className="text-txt-dim">.</span>
      </Link>

      <div className="flex items-center gap-8 max-md:gap-4">
        {/* Products dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <span className="font-mono text-xs tracking-[1.5px] uppercase text-txt-dim cursor-pointer transition-colors hover:text-cyan">
            {t('nav_products')}
          </span>

          <div
            className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-bg-card border border-border rounded-lg p-2 min-w-[240px] z-[1001] transition-all duration-200 ${
              dropdownOpen
                ? 'opacity-100 visible'
                : 'opacity-0 invisible'
            }`}
          >
            <Link
              href="/live"
              className="flex items-center justify-between px-4 py-2.5 rounded-md transition-colors hover:bg-bg-card-hover no-underline hover:no-underline"
            >
              <span className="font-display text-sm font-semibold text-txt flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                {t('live_title')}
              </span>
            </Link>
            <Link
              href="/check"
              className="flex items-center justify-between px-4 py-2.5 rounded-md transition-colors hover:bg-bg-card-hover no-underline hover:no-underline"
            >
              <span className="font-display text-sm font-semibold text-txt">
                Idea Reality
              </span>
              <span className="font-mono text-[11px] text-txt-dim">
                {stars ? `${stars.idea_reality} ★` : '★'}
              </span>
            </Link>
            <Link
              href="/tradememory"
              className="flex items-center justify-between px-4 py-2.5 rounded-md transition-colors hover:bg-bg-card-hover no-underline hover:no-underline"
            >
              <span className="font-display text-sm font-semibold text-txt">
                TradeMemory
              </span>
              <span className="font-mono text-[11px] text-txt-dim">
                {stars ? `${stars.tradememory} ★` : '★'}
              </span>
            </Link>
          </div>
        </div>

        {/* Pricing */}
        <Link
          href="/pricing"
          className="font-mono text-xs tracking-[1.5px] uppercase text-txt-dim no-underline transition-colors hover:text-cyan hover:no-underline max-[600px]:hidden"
        >
          {t('nav_pricing')}
        </Link>

        {/* GitHub */}
        <a
          href="https://github.com/mnemox-ai"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[11px] tracking-[1.5px] uppercase px-5 py-2 border border-cyan text-cyan no-underline transition-all hover:bg-cyan hover:text-bg hover:no-underline"
        >
          {t('nav_github')}
        </a>

        {/* Auth */}
        {isSignedIn ? (
          <>
            <Link
              href="/dashboard"
              className="font-mono text-xs tracking-[1.5px] uppercase text-txt-dim no-underline transition-colors hover:text-cyan hover:no-underline"
            >
              {t('nav_dashboard')}
            </Link>
            <UserButton />
          </>
        ) : (
          <SignInButton mode="redirect">
            <button className="font-mono text-[11px] tracking-[1.5px] uppercase px-4 py-1.5 border border-border text-txt-dim bg-transparent cursor-pointer transition-all hover:text-cyan hover:border-cyan">
              {t('nav_sign_in')}
            </button>
          </SignInButton>
        )}

        {/* Lang toggle */}
        <button
          onClick={toggleLang}
          className="font-mono text-[11px] text-txt-dim bg-transparent border border-border rounded px-2 py-0.5 cursor-pointer tracking-[1px] transition-all hover:text-cyan hover:border-cyan-dim max-[600px]:hidden"
        >
          {t('lang_toggle')}
        </button>
      </div>
    </nav>
  );
}
