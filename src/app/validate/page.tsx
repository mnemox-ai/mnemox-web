'use client';

import { useState, useCallback } from 'react';
import { useI18n } from '@/lib/i18n';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { trackEvent } from '@/lib/analytics';
import { ValidateForm } from './ValidateForm';
import { ValidateResults } from './ValidateResults';

export interface WalkForwardWindow {
  window: number;
  is_sharpe: number;
  oos_sharpe: number;
  is_trades: number;
  oos_trades: number;
  is_win_rate: number;
  oos_win_rate: number;
}

export interface RegimeBreakdown {
  regime: string;
  trades: number;
  win_rate: number;
  avg_pnl: number;
  sharpe: number;
}

export interface TestResult {
  name: string;
  passed: boolean;
  score: number;
  details: string;
  walk_forward_windows?: WalkForwardWindow[];
  regime_breakdown?: RegimeBreakdown[];
  sub_results?: { label: string; value: string; passed: boolean }[];
}

export interface ValidationResult {
  verdict: 'PASS' | 'CAUTION' | 'FAIL';
  overall_score: number;
  strategy_name: string;
  summary: {
    total_trades: number;
    sharpe_ratio: number;
    win_rate: number;
    max_drawdown: number;
    profit_factor: number;
    avg_trade_pnl: number;
    total_pnl: number;
    avg_hold_time: string;
  };
  tests: TestResult[];
}

type Phase = 'input' | 'loading' | 'results' | 'error';

export default function ValidatePage() {
  const { t } = useI18n();
  const [phase, setPhase] = useState<Phase>('input');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = useCallback(async (formData: FormData) => {
    setPhase('loading');
    setResult(null);
    trackEvent('validate_submit', {
      format: formData.get('format') as string,
    });

    try {
      const res = await fetch('/api/validate', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || t('val_err_generic'));
        setPhase('error');
        trackEvent('validate_error', { status: res.status });
        return;
      }

      const data: ValidationResult = await res.json();
      setResult(data);
      setPhase('results');
      trackEvent('validate_result', {
        verdict: data.verdict,
        score: data.overall_score,
      });
    } catch {
      setErrorMsg(t('val_err_server'));
      setPhase('error');
      trackEvent('validate_error', { status: 0 });
    }
  }, [t]);

  const handleReset = () => {
    setPhase('input');
    setResult(null);
    setErrorMsg('');
    trackEvent('validate_reset');
  };

  return (
    <div className="mx-auto max-w-[880px] px-6 pb-20 pt-16">
      {/* Header */}
      <header className="mb-12 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[3px] text-cyan mb-4">
          Strategy Validator
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-3">
          {t('val_title')}
        </h1>
        <p className="text-txt-dim text-base max-w-[560px] mx-auto">
          {t('val_subtitle')}
        </p>
      </header>

      {/* Input Phase */}
      {phase === 'input' && (
        <ValidateForm onSubmit={handleSubmit} />
      )}

      {/* Loading Phase */}
      {phase === 'loading' && (
        <div className="py-16 text-center">
          <div className="mb-6 flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan border-t-transparent" />
          </div>
          <p className="font-mono text-sm text-txt-dim mb-4">
            {t('val_analyzing')}<span className="animate-pulse">...</span>
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            {['CSV Parse', 'DSR Test', 'Walk-Forward', 'Regime', 'CPCV'].map((step, i) => (
              <span
                key={step}
                className="rounded border border-border px-2.5 py-1 font-mono text-[11px] text-txt-muted animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              >
                {step}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Error Phase */}
      {phase === 'error' && (
        <div className="py-10 text-center">
          <p className="mb-6 text-danger">{errorMsg}</p>
          <button
            onClick={handleReset}
            className="rounded-lg border border-border px-6 py-2.5 font-mono text-sm text-txt-dim transition-colors hover:border-cyan hover:text-cyan"
          >
            {t('val_try_again')}
          </button>
        </div>
      )}

      {/* Results Phase */}
      {phase === 'results' && result && (
        <ValidateResults result={result} onReset={handleReset} />
      )}

      {/* How it works / SEO content */}
      {(phase === 'input' || phase === 'results') && (
        <ScrollReveal>
          <section className="mt-16 space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-txt mb-3">{t('val_how_title')}</h2>
              <p className="text-txt-dim leading-relaxed">{t('val_how_desc')}</p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-txt mb-4">{t('val_tests_title')}</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {([
                  { name: 'val_test_dsr_name' as const, desc: 'val_test_dsr_desc' as const },
                  { name: 'val_test_wf_name' as const, desc: 'val_test_wf_desc' as const },
                  { name: 'val_test_regime_name' as const, desc: 'val_test_regime_desc' as const },
                  { name: 'val_test_cpcv_name' as const, desc: 'val_test_cpcv_desc' as const },
                ]).map((item) => (
                  <div key={item.name} className="rounded-lg border border-border bg-bg-card p-4">
                    <h4 className="font-mono text-sm font-bold text-cyan mb-1">{t(item.name)}</h4>
                    <p className="text-sm text-txt-dim">{t(item.desc)}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* Disclaimer */}
      <div className="mt-12 text-center">
        <p className="font-mono text-[11px] text-txt-muted">
          {t('val_disclaimer')}
        </p>
        <p className="mt-2 font-mono text-[11px] text-txt-muted">
          {t('val_powered_by')}{' '}
          <a
            href="https://github.com/mnemox-ai/tradememory-protocol"
            className="text-cyan hover:underline"
          >
            tradememory-protocol
          </a>
        </p>
      </div>
    </div>
  );
}
