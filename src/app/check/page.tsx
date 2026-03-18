'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useI18n } from '@/lib/i18n';
import { Gauge } from '@/components/check/Gauge';
import { PayPalFlow, PayPalCapture } from '@/components/check/PayPalFlow';
import { PaidReport } from '@/components/check/PaidReport';
import { trackEvent, flushEvents } from '@/lib/analytics';
import { API_BASE } from '@/lib/config';
import type { ReportData } from '@/components/check/PayPalFlow';

const SUGGESTIONS = {
  en: [
    'An MCP server that checks npm for package name conflicts',
    'AI-powered code review tool that catches security vulnerabilities',
    'CLI tool to auto-generate changelogs from git commits',
    'Browser extension that summarizes long articles with AI',
    'Real-time collaborative markdown editor for teams',
    'API gateway with built-in rate limiting and analytics',
    'Personal finance tracker with AI spending insights',
    'Smart recipe app that suggests meals from fridge ingredients',
  ],
  zh: [
    'LINE Bot 自動客服系統，整合 AI 回覆常見問題',
    '檢查 npm 套件名稱衝突的 MCP Server',
    'AI 程式碼審查工具，自動捕捉安全漏洞',
    '從 Git commit 自動產生 CHANGELOG 的 CLI 工具',
    '用 AI 摘要長文章的瀏覽器外掛',
    '即時協作 Markdown 編輯器',
    '個人記帳 App，用 AI 分析消費習慣',
    '智慧食譜，根據冰箱食材推薦菜色',
  ],
};

const SCAN_SOURCES_QUICK = ['GitHub', 'HN'];
const SCAN_SOURCES_DEEP = ['GitHub', 'HN', 'npm', 'PyPI', 'Product Hunt'];

// --- Types ---
interface SourceBreakdown {
  source: string;
  raw_count?: number;
  score?: number;
  items?: Array<{ name?: string; full_name?: string; stars?: number; url?: string; description?: string }>;
}

interface CheckResult {
  reality_signal: number;
  verdict?: string;
  market_momentum?: { trend: string; label: string };
  source_breakdown?: SourceBreakdown[];
  evidence?: string[];
  similar_projects?: Array<{ name: string; url?: string; stars?: number; description?: string }>;
  pivot_hints?: string[];
  idea_hash?: string;
}

interface StatsData {
  total_queries?: number;
  unique_countries?: number;
}

type Phase = 'input' | 'loading' | 'results' | 'error' | 'paypal_capture' | 'paid_report';

export default function CheckPage() {
  const { t, lang } = useI18n();

  // --- State ---
  const [idea, setIdea] = useState('');
  const [isDeep, setIsDeep] = useState(false);
  const [phase, setPhase] = useState<Phase>('input');
  const [result, setResult] = useState<CheckResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeSources, setActiveSources] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState<StatsData | null>(null);
  const [copied, setCopied] = useState(false);
  const [paidReport, setPaidReport] = useState<ReportData | null>(null);

  // Placeholder rotation
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [placeholderFade, setPlaceholderFade] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // --- Detect PayPal return on mount ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('paypal_complete') === '1') {
      setPhase('paypal_capture');
      trackEvent('paypal_return');
    }
  }, []);

  // --- Fetch stats on mount ---
  useEffect(() => {
    fetch(`${API_BASE}/api/stats`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setStats(data); })
      .catch(() => {});
    trackEvent('check_page_view');
  }, []);

  // --- Placeholder rotation (only during input phase) ---
  useEffect(() => {
    if (phase !== 'input') return;
    timerRef.current = setInterval(() => {
      setPlaceholderFade(true);
      setTimeout(() => {
        setPlaceholderIdx(prev => prev + 1);
        setPlaceholderFade(false);
      }, 300);
    }, 4000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  const suggestions = SUGGESTIONS[lang] || SUGGESTIONS.en;
  const prefix = lang === 'zh' ? '例如：' : 'e.g. ';
  const currentPlaceholder = prefix + suggestions[placeholderIdx % suggestions.length];

  // --- Submit ---
  const handleCheck = useCallback(async () => {
    const trimmed = idea.trim();
    if (!trimmed || trimmed.length > 500) {
      setErrorMsg(t('check_err_input'));
      setPhase('error');
      return;
    }

    setPhase('loading');
    setActiveSources(new Set());
    setResult(null);
    trackEvent('check_submit', { depth: isDeep ? 'deep' : 'quick', length: trimmed.length });

    const sources = isDeep ? SCAN_SOURCES_DEEP : SCAN_SOURCES_QUICK;

    // Animate source indicators
    let idx = 0;
    const sourceTimer = setInterval(() => {
      if (idx < sources.length) {
        setActiveSources(prev => new Set([...prev, sources[idx]]));
        idx++;
      } else {
        clearInterval(sourceTimer);
      }
    }, 600);

    try {
      const res = await fetch(`${API_BASE}/api/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea_text: trimmed, depth: isDeep ? 'deep' : 'quick' }),
      });

      clearInterval(sourceTimer);

      if (!res.ok) {
        if (res.status === 503 || res.status === 0) {
          setErrorMsg(t('check_err_server'));
        } else {
          setErrorMsg(t('check_err_generic'));
        }
        setPhase('error');
        trackEvent('check_error', { status: res.status });
        return;
      }

      const data: CheckResult = await res.json();
      setResult(data);
      setActiveSources(new Set(sources));
      setPhase('results');
      trackEvent('check_result', { score: data.reality_signal, depth: isDeep ? 'deep' : 'quick' });
    } catch {
      clearInterval(sourceTimer);
      setErrorMsg(t('check_err_server'));
      setPhase('error');
      trackEvent('check_error', { status: 0 });
    }
  }, [idea, isDeep, t]);

  const handleReset = () => {
    setPhase('input');
    setIdea('');
    setResult(null);
    setErrorMsg('');
    setActiveSources(new Set());
    setCopied(false);
    setPaidReport(null);
    trackEvent('check_reset');
  };

  const handleCopyToAI = () => {
    if (!result) return;
    const text = [
      `Reality Signal: ${result.reality_signal}/100`,
      result.verdict ? `Verdict: ${result.verdict}` : '',
      result.evidence?.length ? `\nEvidence:\n${result.evidence.map(e => `- ${e}`).join('\n')}` : '',
      result.similar_projects?.length ? `\nSimilar Projects:\n${result.similar_projects.map(p => `- ${p.name}${p.stars ? ` (${p.stars}★)` : ''}`).join('\n')}` : '',
      result.pivot_hints?.length ? `\nPivot Hints:\n${result.pivot_hints.map(h => `- ${h}`).join('\n')}` : '',
    ].filter(Boolean).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
    trackEvent('copy_to_ai');
  };

  const handlePaidReportReady = (data: ReportData) => {
    setPaidReport(data);
    setPhase('paid_report');
    trackEvent('paid_report_loaded');
    flushEvents();
  };

  // --- Render ---
  return (
    <div className="mx-auto max-w-[720px] px-6 pb-20 pt-16">
      {/* Header */}
      <header className="mb-12 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[3px] text-cyan mb-4">
          Idea Reality Check
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-3">
          {t('check_title')}
        </h1>
        <p className="text-txt-dim text-base max-w-[480px] mx-auto">
          {t('check_subtitle')}
        </p>

        {/* Live stats */}
        {stats && (
          <div className="mt-6 flex justify-center gap-8 flex-wrap">
            {stats.total_queries != null && (
              <div className="text-center">
                <div className="font-mono text-lg font-bold text-cyan">{stats.total_queries.toLocaleString()}</div>
                <div className="font-mono text-[11px] text-txt-dim uppercase tracking-wider">{t('check_stat_ideas')}</div>
              </div>
            )}
            <div className="text-center">
              <div className="font-mono text-lg font-bold text-cyan">5</div>
              <div className="font-mono text-[11px] text-txt-dim uppercase tracking-wider">{t('check_stat_sources')}</div>
            </div>
            {stats.unique_countries != null && (
              <div className="text-center">
                <div className="font-mono text-lg font-bold text-cyan">{stats.unique_countries}</div>
                <div className="font-mono text-[11px] text-txt-dim uppercase tracking-wider">{t('check_stat_countries')}</div>
              </div>
            )}
          </div>
        )}
      </header>

      {/* PayPal Capture (returning from PayPal) */}
      {phase === 'paypal_capture' && (
        <PayPalCapture onReportReady={handlePaidReportReady} />
      )}

      {/* Paid Report */}
      {phase === 'paid_report' && paidReport && (
        <PaidReport data={paidReport} onReset={handleReset} />
      )}

      {/* Input Section */}
      {phase === 'input' && (
        <div className="rounded-xl border border-border bg-bg-card p-8 mb-8">
          <textarea
            value={idea}
            onChange={e => setIdea(e.target.value)}
            maxLength={500}
            rows={4}
            className={`w-full resize-y rounded-lg border border-border bg-black/30 p-4 font-display text-[15px] text-txt leading-relaxed transition-colors focus:border-cyan focus:outline-none placeholder:text-txt-muted ${placeholderFade ? 'placeholder:opacity-0' : 'placeholder:opacity-100'} placeholder:transition-opacity`}
            placeholder={currentPlaceholder}
          />

          <div className="mt-4 flex items-center justify-between gap-4">
            {/* Depth toggle */}
            <label className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-wider text-txt-dim cursor-pointer select-none">
              <span>{t('check_quick')}</span>
              <button
                type="button"
                role="switch"
                aria-checked={isDeep}
                onClick={() => setIsDeep(!isDeep)}
                className={`relative h-[22px] w-10 rounded-full transition-colors ${isDeep ? 'bg-cyan-dim' : 'bg-border'}`}
              >
                <span
                  className={`absolute top-[3px] h-4 w-4 rounded-full transition-all ${isDeep ? 'left-[21px] bg-cyan' : 'left-[3px] bg-txt-dim'}`}
                />
              </button>
              <span>{t('check_deep')}</span>
            </label>

            {/* Char counter */}
            <span className="font-mono text-[11px] text-txt-muted">
              {idea.length}/500
            </span>

            {/* Submit button */}
            <button
              onClick={handleCheck}
              disabled={!idea.trim()}
              className="whitespace-nowrap rounded-lg bg-cyan px-8 py-3 font-display text-[15px] font-bold text-black transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t('check_btn')}
            </button>
          </div>

          <p className={`mt-1.5 text-center font-mono text-[11px] tracking-wide ${isDeep ? 'text-cyan' : 'text-txt-muted'}`}>
            {isDeep ? t('check_depth_desc_deep') : t('check_depth_desc_quick')}
          </p>
          <p className="mt-1 text-center font-mono text-[11px] text-txt-dim opacity-70">
            {t('check_llm_hint')}
          </p>
        </div>
      )}

      {/* Loading State */}
      {phase === 'loading' && (
        <div className="py-10 text-center">
          <p className="font-mono text-sm text-txt-dim mb-4">
            {t('check_scanning')}<span className="animate-pulse">...</span>
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            {(isDeep ? SCAN_SOURCES_DEEP : SCAN_SOURCES_QUICK).map(source => (
              <span
                key={source}
                className={`rounded border px-2.5 py-1 font-mono text-[11px] transition-all duration-500 ${
                  activeSources.has(source)
                    ? 'border-cyan-dim bg-cyan-glow text-cyan'
                    : 'border-border text-txt-muted'
                }`}
              >
                {activeSources.has(source) && (
                  <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-cyan" />
                )}
                {source}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {phase === 'error' && (
        <div className="py-10 text-center">
          <p className="mb-6 text-danger">{errorMsg}</p>
          <button
            onClick={handleReset}
            className="rounded-lg border border-border px-6 py-2.5 font-mono text-sm text-txt-dim transition-colors hover:border-cyan hover:text-cyan"
          >
            {t('check_try_again')}
          </button>
        </div>
      )}

      {/* Free Results */}
      {phase === 'results' && result && (
        <div>
          {/* Gauge */}
          <div className="mb-8 text-center">
            <Gauge score={result.reality_signal} label={t('check_reality_signal')} />
            {result.verdict && (
              <p className="mt-4 font-mono text-sm text-txt-dim">{result.verdict}</p>
            )}
            {result.market_momentum && (
              <p className="mt-2 font-mono text-xs text-txt-muted">
                {t('check_comp_trend')}: {result.market_momentum.label}
              </p>
            )}
          </div>

          {/* Evidence Cards */}
          {result.evidence && result.evidence.length > 0 && (
            <section className="mb-8">
              <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[2px] text-cyan">
                {t('check_evidence')}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {result.evidence.map((ev, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-border bg-bg-card p-4 text-sm text-txt-dim"
                  >
                    {ev}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Source Breakdown */}
          {result.source_breakdown && result.source_breakdown.length > 0 && (
            <section className="mb-8">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {result.source_breakdown.map((src) => (
                  <div
                    key={src.source}
                    className="rounded-lg border border-border bg-bg-card p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs uppercase tracking-wider text-cyan">
                        {src.source}
                      </span>
                      {src.raw_count != null && (
                        <span className="font-mono text-xs text-txt-dim">
                          {src.raw_count} found
                        </span>
                      )}
                    </div>
                    {src.items && src.items.length > 0 && (
                      <ul className="space-y-1.5">
                        {src.items.slice(0, 3).map((item, j) => (
                          <li key={j} className="text-sm text-txt-dim truncate">
                            {item.url ? (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent hover:underline"
                              >
                                {item.name || item.full_name}
                              </a>
                            ) : (
                              <span>{item.name || item.full_name}</span>
                            )}
                            {item.stars != null && (
                              <span className="ml-1 text-amber text-xs">
                                {item.stars.toLocaleString()}★
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Similar Projects */}
          {result.similar_projects && result.similar_projects.length > 0 && (
            <section className="mb-8">
              <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[2px] text-cyan">
                {t('check_similar_projects')}
              </h3>
              <div className="space-y-3">
                {result.similar_projects.map((proj, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-between gap-4 rounded-lg border border-border bg-bg-card p-4"
                  >
                    <div className="min-w-0 flex-1">
                      {proj.url ? (
                        <a
                          href={proj.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-accent hover:underline"
                        >
                          {proj.name}
                        </a>
                      ) : (
                        <span className="font-medium text-txt">{proj.name}</span>
                      )}
                      {proj.description && (
                        <p className="mt-1 text-sm text-txt-dim line-clamp-2">{proj.description}</p>
                      )}
                    </div>
                    {proj.stars != null && (
                      <span className="shrink-0 font-mono text-xs text-amber">
                        {proj.stars.toLocaleString()}★
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Pivot Hints */}
          {result.pivot_hints && result.pivot_hints.length > 0 && (
            <section className="mb-8">
              <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[2px] text-cyan">
                {t('check_pivot_hints')}
              </h3>
              <ul className="space-y-2">
                {result.pivot_hints.map((hint, i) => (
                  <li
                    key={i}
                    className="rounded-lg border border-border bg-bg-card p-4 text-sm text-txt-dim"
                  >
                    {hint}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Blurred Preview Teasers */}
          {isDeep && (
            <section className="mb-8">
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { title: t('check_preview_subdim'), text: t('check_blur_subdim_text') },
                  { title: t('check_preview_comp'), text: t('check_blur_comp_text') },
                  { title: t('check_preview_strat'), text: t('check_blur_strat_text') },
                ].map((card, i) => (
                  <div key={i} className="rounded-lg border border-border bg-bg-card p-4 relative overflow-hidden">
                    <h4 className="font-mono text-[11px] uppercase tracking-wider text-cyan mb-2">
                      {card.title}
                    </h4>
                    <p className="text-sm text-txt-muted select-none pointer-events-none" style={{ filter: 'blur(5px)' }}>
                      {card.text}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={handleCopyToAI}
              className="rounded-lg border border-cyan-dim bg-cyan-glow px-6 py-2.5 font-mono text-sm text-cyan transition-colors hover:bg-cyan hover:text-black"
            >
              {copied ? t('check_copied') : t('check_copy_to_ai')}
            </button>
            <button
              onClick={handleReset}
              className="rounded-lg border border-border px-6 py-2.5 font-mono text-sm text-txt-dim transition-colors hover:border-cyan hover:text-cyan"
            >
              {t('check_another')}
            </button>
          </div>

          {/* PayPal CTA (deep mode only) */}
          {isDeep && (
            <div className="mt-10">
              <PayPalFlow
                ideaText={idea}
                ideaHash={result.idea_hash}
                depth="deep"
              />
            </div>
          )}

          {/* Agent CTA */}
          <div className="mt-8 text-center font-mono text-xs text-txt-dim">
            <span>{t('check_agent_cta')}</span>{' '}
            <a
              href="https://github.com/mnemox-ai/idea-reality-mcp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan hover:underline"
            >
              {t('check_agent_cta_link')}
            </a>
          </div>
        </div>
      )}

      {/* SEO Content Section */}
      {(phase === 'input' || phase === 'results') && (
        <section className="mt-16 space-y-12">
          {/* What is Idea Reality Check? */}
          <div>
            <h2 className="text-2xl font-bold text-txt mb-3">{t('check_sc_what_title')}</h2>
            <p className="text-txt-dim leading-relaxed">{t('check_sc_what_desc')}</p>
          </div>

          {/* How It Works */}
          <div>
            <h2 className="text-2xl font-bold text-txt mb-4">{t('check_sc_how_title')}</h2>
            <ol className="space-y-3">
              {(['check_sc_how_1', 'check_sc_how_2', 'check_sc_how_3'] as const).map((key, i) => (
                <li key={key} className="flex gap-3 text-txt-dim">
                  <span className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full border border-cyan-dim bg-cyan-glow font-mono text-xs text-cyan">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{t(key)}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Comparison Table */}
          <div>
            <h2 className="text-2xl font-bold text-txt mb-4">{t('check_sc_compare_title')}</h2>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-bg-card">
                    <th className="p-3 text-left font-mono text-[11px] uppercase tracking-wider text-txt-dim">{t('check_sc_compare_feature')}</th>
                    <th className="p-3 text-left font-mono text-[11px] uppercase tracking-wider text-cyan">{t('check_sc_compare_ir')}</th>
                    <th className="p-3 text-left font-mono text-[11px] uppercase tracking-wider text-txt-dim">{t('check_sc_compare_manual')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {([1, 2, 3, 4, 5] as const).map(n => (
                    <tr key={n} className="hover:bg-bg-card/50">
                      <td className="p-3 text-txt-dim">{t(`check_sc_compare_row${n}_feat` as 'check_sc_compare_row1_feat')}</td>
                      <td className="p-3 text-txt font-medium">{t(`check_sc_compare_row${n}_ir` as 'check_sc_compare_row1_ir')}</td>
                      <td className="p-3 text-txt-muted">{t(`check_sc_compare_row${n}_manual` as 'check_sc_compare_row1_manual')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Footer privacy note */}
      <div className="mt-12 text-center">
        <p className="font-mono text-[11px] text-txt-muted">
          {t('check_privacy_note')}
        </p>
        <p className="mt-2 font-mono text-[11px] text-txt-muted">
          {t('check_powered_by')}{' '}
          <a
            href="https://github.com/mnemox-ai/idea-reality-mcp"
            className="text-cyan hover:underline"
          >
            idea-reality-mcp
          </a>
        </p>
      </div>
    </div>
  );
}
