'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';

const REPO = 'https://github.com/mnemox-ai/tradememory-protocol';
const PYPI = 'https://pypi.org/project/tradememory-protocol/';
const ISSUE = 'https://github.com/mnemox-ai/tradememory-protocol/issues/new?template=brake_integration.yml';

const SYNC = `pip install tradememory-protocol
tradememory sync hyperliquid --address 0x...`;

const RULES = `tradememory rules list
tradememory rules approve <id>`;

const BRAKE = `pip install "tradememory-protocol[proxy]"
tradememory proxy init --account-id <ALPACA_ACCOUNT_ID> --symbols AAPL,MSFT
tradememory proxy run --env-file ~/.secrets/alpaca-paper.env`;

export function InstallSection() {
  const { t } = useI18n();
  return (
    <section id="install" className="tm-wrap tm-hair scroll-mt-24 border-t py-14">
      <h2 className="tm-h2">{t('tm_sec_install')}</h2>
      <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="min-w-0 space-y-10">
          <div className="min-w-0">
            <h3 className="tm-h3 mb-3">{t('tm_install_sync')}</h3>
            <CodeBlock code={SYNC} />
          </div>
          <div className="min-w-0">
            <h3 className="tm-h3 mb-3">{t('tm_install_rules')}</h3>
            <CodeBlock code={RULES} />
          </div>
        </div>
        <div className="min-w-0">
          <h3 className="tm-h3 mb-3">
            {t('tm_install_brake')} <span className="ml-2 font-normal text-[var(--tm-muted)]">{t('tm_install_py')}</span>
          </h3>
          <CodeBlock code={BRAKE} />
        </div>
      </div>

      <div className="mt-12 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <a href={REPO} target="_blank" rel="noopener noreferrer" className="tm-link">
          GitHub
        </a>
        <a href={PYPI} target="_blank" rel="noopener noreferrer" className="tm-link">
          PyPI
        </a>
        <a href={ISSUE} target="_blank" rel="noopener noreferrer" className="tm-link">
          {t('tm_links_issue')}
        </a>
      </div>
      <p className="mt-4 max-w-[44rem] text-sm text-[var(--tm-muted)]">{t('tm_licence')}</p>
    </section>
  );
}

function CodeBlock({ code }: { code: string }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard access can be refused; the text stays selectable.
    }
  };
  return (
    <div className="tm-codeblock">
      <pre tabIndex={0}>
        <code>{code}</code>
      </pre>
      <button
        type="button"
        onClick={copy}
        aria-label={t('tm_copy_aria')}
        className="tm-copy rounded border border-[var(--tm-line)] bg-black px-2.5 py-1 font-mono text-[11px] text-[var(--tm-dim)] transition-colors hover:border-[var(--tm-accent)] hover:text-[var(--tm-accent)]"
      >
        {copied ? t('tm_copied') : t('tm_copy')}
      </button>
    </div>
  );
}
