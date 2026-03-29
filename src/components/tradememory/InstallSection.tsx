'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { ScrollReveal } from '@/components/shared/ScrollReveal';

const tabs = [
  {
    key: 'claude_desktop' as const,
    i18nKey: 'tm_install_claude_desktop' as const,
    lang: 'json',
    code: `{
  "mcpServers": {
    "tradememory": {
      "command": "uvx",
      "args": ["tradememory-protocol"]
    }
  }
}`,
  },
  {
    key: 'claude_code' as const,
    i18nKey: 'tm_install_claude_code' as const,
    lang: 'bash',
    code: `claude mcp add tradememory -- uvx tradememory-protocol`,
  },
  {
    key: 'pip' as const,
    i18nKey: 'tm_install_pip' as const,
    lang: 'bash',
    code: `pip install tradememory-protocol
# or
uvx tradememory-protocol`,
  },
];

export function InstallSection() {
  const { t } = useI18n();
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(tabs[active].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ScrollReveal>
      <section id="install" className="mx-auto max-w-3xl px-6 pb-20 scroll-mt-24">
        <h2 className="mb-3 text-center font-display text-2xl font-bold text-txt sm:text-3xl">
          {t('tm_install_title')}
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-center text-sm text-txt-dim">
          {t('tm_install_subtitle')}
        </p>

        {/* Tabs */}
        <div className="flex gap-1 rounded-lg border border-border bg-bg-card p-1">
          {tabs.map((tab, i) => (
            <button
              key={tab.key}
              onClick={() => { setActive(i); setCopied(false); }}
              className={`flex-1 rounded-md px-4 py-2 font-mono text-xs font-medium transition-colors ${
                active === i
                  ? 'bg-cyan text-bg'
                  : 'text-txt-dim hover:text-txt'
              }`}
            >
              {t(tab.i18nKey)}
            </button>
          ))}
        </div>

        {/* Code block */}
        <div className="relative mt-4 overflow-hidden rounded-xl border border-border bg-bg-card">
          <div className="flex items-center justify-between border-b border-border px-4 py-2">
            <span className="font-mono text-[11px] text-txt-muted">
              {tabs[active].lang}
            </span>
            <button
              onClick={handleCopy}
              className="rounded-md border border-border px-3 py-1 font-mono text-[11px] text-txt-dim transition-colors hover:border-cyan hover:text-cyan"
            >
              {copied ? '✓ Copied' : t('tm_install_copy')}
            </button>
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-txt">
            {tabs[active].code}
          </pre>
        </div>
      </section>
    </ScrollReveal>
  );
}
