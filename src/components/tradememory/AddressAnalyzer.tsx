'use client';

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { useI18n } from '@/lib/i18n';
import {
  ADDRESS_RE,
  analyzeFills,
  fetchFills,
  HyperliquidHttpError,
  NetworkError,
  type Analysis,
} from '@/lib/tradememory';
import { DotMark } from './DotMark';
import { Results } from './Results';
import { RuleSection } from './RuleSection';
import { fmtInt } from './format';

/** A public leaderboard address whose history produces every section, including a proposed rule. */
export const EXAMPLE_ADDRESS = '0x86f8d7ebb8795be0469d0d34d689fc60cd7c159a';

interface Retry {
  attempt: number; // 1-based, for people
  until: number; // epoch ms
  status: number | null;
}

type Failure =
  | { type: 'network' }
  | { type: 'http'; status: number }
  | { type: 'unknown'; message: string }
  | { type: 'nofills' }
  | { type: 'noperp'; spot: number }
  | { type: 'noclosed'; fills: number; open: Record<string, string> };

type Phase =
  | { kind: 'idle' }
  | { kind: 'fetching'; page: number; fills: number; retry: Retry | null }
  | { kind: 'computing'; fills: number }
  | { kind: 'done'; analysis: Analysis; complete: boolean }
  | { kind: 'failed'; failure: Failure };

export function AddressAnalyzer() {
  const { t } = useI18n();
  const [value, setValue] = useState('');
  const [invalid, setInvalid] = useState(false);
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' });
  const [now, setNow] = useState(0);
  const abortRef = useRef<AbortController | null>(null);
  const resultsRef = useRef<HTMLHeadingElement>(null);
  const lastAddress = useRef('');

  const busy = phase.kind === 'fetching' || phase.kind === 'computing';
  const retry = phase.kind === 'fetching' ? phase.retry : null;

  // Countdown for the retry notice; `now` is first set when the notice arrives.
  useEffect(() => {
    if (!retry) return;
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, [retry]);

  // Leaving the page cancels an in-flight fetch.
  useEffect(() => () => abortRef.current?.abort(), []);

  // Move focus to the results once they exist, so keyboard and screen-reader
  // users land on them instead of staying in the form.
  useEffect(() => {
    if (phase.kind === 'done') resultsRef.current?.focus();
  }, [phase.kind]);

  const run = useCallback(async (address: string) => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    lastAddress.current = address;
    setPhase({ kind: 'fetching', page: 0, fills: 0, retry: null });
    try {
      const { fills, complete } = await fetchFills(address, {
        signal: ac.signal,
        onProgress: (p) =>
          setPhase((prev) => (prev.kind === 'fetching' ? { ...prev, page: p.page, fills: p.fills, retry: null } : prev)),
        onRetry: (r) => {
          const at = Date.now();
          setNow(at);
          setPhase((prev) =>
            prev.kind === 'fetching'
              ? { ...prev, retry: { attempt: r.attempt + 1, until: at + r.waitMs, status: r.status } }
              : prev,
          );
        },
      });
      if (ac.signal.aborted) return;
      if (fills.length === 0) {
        setPhase({ kind: 'failed', failure: { type: 'nofills' } });
        return;
      }
      setPhase({ kind: 'computing', fills: fills.length });
      // Let the status paint before the main thread is busy for a moment.
      await new Promise((resolve) => setTimeout(resolve, 60));
      if (ac.signal.aborted) return;
      const analysis = analyzeFills(fills, address);
      if (ac.signal.aborted) return;
      const perp = fills.length - analysis.summary.spot_fills_skipped;
      if (perp === 0) {
        setPhase({ kind: 'failed', failure: { type: 'noperp', spot: analysis.summary.spot_fills_skipped } });
        return;
      }
      if (analysis.summary.closed_trades === 0) {
        setPhase({ kind: 'failed', failure: { type: 'noclosed', fills: perp, open: analysis.summary.open_positions } });
        return;
      }
      setPhase({ kind: 'done', analysis, complete });
    } catch (err) {
      if (ac.signal.aborted) return;
      if (err instanceof NetworkError) setPhase({ kind: 'failed', failure: { type: 'network' } });
      else if (err instanceof HyperliquidHttpError) setPhase({ kind: 'failed', failure: { type: 'http', status: err.status } });
      else setPhase({ kind: 'failed', failure: { type: 'unknown', message: err instanceof Error ? err.message : String(err) } });
    }
  }, []);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const address = value.trim();
    if (!ADDRESS_RE.test(address)) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    void run(address);
  };

  const example = () => {
    setValue(EXAMPLE_ADDRESS);
    setInvalid(false);
    void run(EXAMPLE_ADDRESS);
  };

  const cancel = () => {
    abortRef.current?.abort();
    setPhase({ kind: 'idle' });
  };

  const seconds = retry ? Math.max(0, Math.ceil((retry.until - now) / 1000)) : 0;

  return (
    <>
      <section className="tm-wrap pb-12 pt-14 sm:pt-20">
        <DotMark size={9} gap={4} active={busy} label={t('tm_mark_alt')} />
        <h1 className="tm-h1 mt-8">
          <span className="block">{t('tm_sentence_a')}</span>
          <span className="tm-wide block text-[var(--tm-accent)]">{t('tm_sentence_b')}</span>
        </h1>
        <p className="mt-6 max-w-[38rem] text-[1.0625rem] leading-relaxed text-[var(--tm-dim)]">{t('tm_lead')}</p>

        <form onSubmit={submit} className="mt-10 max-w-[44rem]" noValidate>
          <label htmlFor="tm-address" className="tm-label block">
            {t('tm_address_label')}
          </label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <input
              id="tm-address"
              name="address"
              type="text"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                if (invalid) setInvalid(false);
              }}
              placeholder={t('tm_address_placeholder')}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              inputMode="text"
              aria-invalid={invalid || undefined}
              aria-describedby={`tm-privacy${invalid ? ' tm-address-error' : ''}`}
              className="min-w-0 flex-1 rounded-md border border-[var(--tm-line)] bg-[#07090c] px-4 py-3 font-mono text-[15px] text-[var(--tm-fg)] placeholder:text-[var(--tm-muted)] focus:border-[var(--tm-accent)] focus:outline-none"
            />
            <button
              type="submit"
              disabled={busy}
              className="rounded-md bg-[var(--tm-accent)] px-6 py-3 text-[15px] font-semibold text-black transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
            >
              {busy ? t('tm_analyzing') : t('tm_analyze')}
            </button>
          </div>
          {invalid && (
            <p id="tm-address-error" role="alert" className="mt-2 text-sm text-[var(--tm-loss)]">
              {t('tm_invalid')}
            </p>
          )}
          <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm">
            <button type="button" onClick={example} disabled={busy} className="tm-link disabled:opacity-60">
              {t('tm_try_example')}
            </button>
            <span id="tm-privacy" className="text-[var(--tm-dim)]">
              {t('tm_privacy')}
            </span>
          </div>
          <p className="mt-1 text-xs text-[var(--tm-muted)]">{t('tm_privacy_detail')}</p>
        </form>
      </section>

      <div aria-live="polite" aria-busy={busy || undefined}>
        {(phase.kind === 'fetching' || phase.kind === 'computing') && (
          <section className="tm-wrap tm-hair border-t py-10">
            <div className="flex items-start gap-5">
              <DotMark size={7} gap={3} active label={t('tm_mark_alt')} className="mt-1" />
              <div>
                <p className="tm-label">{phase.kind === 'fetching' ? t('tm_fetching') : t('tm_computing')}</p>
                <p className="mt-2 text-2xl font-semibold tabular-nums">
                  {phase.kind === 'fetching'
                    ? t('tm_fetch_progress', { page: phase.page, fills: fmtInt(phase.fills) })
                    : t('tm_computing_detail', { fills: fmtInt(phase.fills) })}
                </p>
                {retry && (
                  <p className="mt-2 text-sm text-[var(--tm-accent)]">
                    {retry.status === 429
                      ? t('tm_rate_limited', { seconds, attempt: retry.attempt })
                      : retry.status === null
                        ? t('tm_conn_retry', { seconds, attempt: retry.attempt })
                        : t('tm_server_retry', { status: retry.status, seconds, attempt: retry.attempt })}
                  </p>
                )}
                <p className="mt-2 text-sm text-[var(--tm-dim)]">{t('tm_fetch_note')}</p>
                <button type="button" onClick={cancel} className="tm-link mt-4 text-sm">
                  {t('tm_cancel')}
                </button>
              </div>
            </div>
          </section>
        )}

        {phase.kind === 'failed' && <FailureBlock failure={phase.failure} onRetry={() => void run(lastAddress.current)} />}
      </div>

      {phase.kind === 'done' && (
        <>
          <section className="tm-wrap tm-hair border-t py-14">
            <Results analysis={phase.analysis} complete={phase.complete} headingRef={resultsRef} />
          </section>
          <RuleSection analysis={phase.analysis} />
        </>
      )}
    </>
  );
}

function FailureBlock({ failure, onRetry }: { failure: Failure; onRetry: () => void }) {
  const { t } = useI18n();
  let title: string;
  let body: string;
  let extra: string | null = null;
  switch (failure.type) {
    case 'network':
      title = t('tm_err_network_title');
      body = t('tm_err_network_body');
      break;
    case 'http':
      title = t('tm_err_http_title', { status: failure.status });
      body = t('tm_err_http_body');
      break;
    case 'nofills':
      title = t('tm_err_nofills_title');
      body = t('tm_err_nofills_body');
      break;
    case 'noperp':
      title = t('tm_err_noperp_title');
      body = t('tm_err_noperp_body', { spot: fmtInt(failure.spot) });
      break;
    case 'noclosed': {
      title = t('tm_err_noclosed_title');
      body = t('tm_err_noclosed_body', { fills: fmtInt(failure.fills) });
      const open = Object.entries(failure.open)
        .map(([symbol, size]) => `${symbol} ${size}`)
        .join(', ');
      extra = open ? t('tm_err_noclosed_open', { positions: open }) : null;
      break;
    }
    default:
      title = t('tm_err_unknown_title');
      body = failure.message;
  }
  const canRetry = failure.type === 'network' || failure.type === 'http' || failure.type === 'unknown';
  return (
    <section id="tm-failure" className="tm-wrap tm-hair border-t py-10">
      <div className="max-w-[44rem]">
        <p className="text-2xl font-semibold leading-snug">{title}</p>
        <p className="mt-3 text-[var(--tm-dim)]">{body}</p>
        {extra && <p className="mt-2 break-words font-mono text-sm text-[var(--tm-dim)]">{extra}</p>}
        {canRetry && (
          <button type="button" onClick={onRetry} className="tm-link mt-5 text-sm">
            {t('tm_retry')}
          </button>
        )}
      </div>
    </section>
  );
}
