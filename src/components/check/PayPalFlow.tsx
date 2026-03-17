'use client';

import { useState, useEffect, useRef } from 'react';
import { useI18n } from '@/lib/i18n';

const API_BASE = 'https://idea-reality-mcp.onrender.com';

interface PayPalFlowProps {
  ideaText: string;
  ideaHash?: string;
  depth: 'quick' | 'deep';
  onReportReady: (reportData: ReportData) => void;
}

export interface ReportData {
  idea_text?: string;
  report_id?: string;
  report_data?: {
    report?: {
      score_breakdown?: {
        score?: number;
        summary?: string;
        explanation?: string;
        duplicate_likelihood?: string;
        source_bars?: Array<{ source: string; signals: number; percentage: number }>;
      };
      sub_scores?: Record<string, number>;
      competitors?: Array<{
        name: string;
        url?: string;
        stars?: number;
        description?: string;
        language?: string;
        activity?: { badge?: string; label?: string; days_since_update?: number };
        found_via_angles?: string[];
      }>;
      strategic_analysis?: string;
      crowd_intelligence?: {
        similar_count?: number;
        avg_score?: number;
        total_database_queries?: number;
        message?: string;
        score_comparison?: string;
        depth_breakdown?: Record<string, number>;
      };
      search_angles?: string[];
      verified_at?: string;
    };
  };
}

type PayPalPhase = 'idle' | 'creating' | 'capturing' | 'error';

const CAPTURE_STEPS_EN = ['Scanning sources...', 'Analyzing competitors...', 'Generating strategic analysis...', 'Finalizing report...'];
const CAPTURE_STEPS_ZH = ['掃描來源中...', '分析競品中...', '生成策略分析中...', '完成報告中...'];

export function PayPalFlow({ ideaText, ideaHash, depth, onReportReady }: PayPalFlowProps) {
  const { t, lang } = useI18n();
  const [phase, setPhase] = useState<PayPalPhase>('idle');
  const [error, setError] = useState('');

  const startCheckout = async () => {
    setPhase('creating');
    setError('');

    // Save to localStorage for post-redirect recovery
    try {
      localStorage.setItem('ir_pending_idea', ideaText);
      localStorage.setItem('ir_pending_hash', ideaHash || '');
      localStorage.setItem('ir_pending_depth', depth);
    } catch { /* ignore */ }

    try {
      const res = await fetch(`${API_BASE}/api/create-paypal-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea_text: ideaText, idea_hash: ideaHash || '', depth }),
      });

      if (!res.ok) throw new Error('Failed to create PayPal order');
      const data = await res.json();

      if (data.approve_url) {
        window.location.href = data.approve_url;
      } else {
        throw new Error('No approval URL returned');
      }
    } catch (e) {
      setPhase('error');
      setError(e instanceof Error ? e.message : 'Payment error');
    }
  };

  return (
    <div className="rounded-xl border border-cyan-dim bg-bg-card p-8 text-center">
      <h3 className="text-xl font-bold text-txt mb-1">
        {t('check_cta_single_title')}
      </h3>
      <p className="text-txt-dim text-sm mb-4">{t('check_cta_single_sub')}</p>

      <div className="text-4xl font-extrabold text-cyan mb-6">$9.99</div>

      <ul className="text-left max-w-[320px] mx-auto space-y-2 mb-6">
        {(['check_cta_s1', 'check_cta_s2', 'check_cta_s3', 'check_cta_s4', 'check_cta_s5'] as const).map(key => (
          <li key={key} className="flex items-start gap-2 text-sm text-txt-dim">
            <span className="text-neon-green mt-0.5">✓</span>
            <span>{t(key)}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={startCheckout}
        disabled={phase === 'creating'}
        className="w-full max-w-[320px] rounded-lg bg-cyan px-8 py-3.5 font-display text-[15px] font-bold text-black transition-colors hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {phase === 'creating' ? (lang === 'zh' ? '跳轉中...' : 'Redirecting...') : t('check_cta_buy_now')}
      </button>

      {phase === 'error' && error && (
        <p className="mt-3 text-sm text-danger">{error}</p>
      )}

      <p className="mt-4 text-[11px] text-txt-muted font-mono">
        {lang === 'zh' ? '透過 PayPal 安全付款 · 一次性收費' : 'Secure PayPal checkout · One-time charge'}
      </p>
    </div>
  );
}

/** Capture flow — called when user returns from PayPal with ?paypal_complete=1 */
export function PayPalCapture({ onReportReady }: { onReportReady: (data: ReportData) => void }) {
  const { lang } = useI18n();
  const [stepIdx, setStepIdx] = useState(0);
  const [error, setError] = useState('');
  const steps = lang === 'zh' ? CAPTURE_STEPS_ZH : CAPTURE_STEPS_EN;
  const onReportReadyRef = useRef(onReportReady);
  onReportReadyRef.current = onReportReady;

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setStepIdx(prev => Math.min(prev + 1, steps.length - 1));
    }, 4000);

    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('token') || '';
    const storedText = safeGet('ir_pending_idea');
    const storedHash = safeGet('ir_pending_hash');
    const storedDepth = safeGet('ir_pending_depth') || 'deep';

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/capture-paypal-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order_id: orderId,
            idea_hash: storedHash,
            idea_text: storedText,
            depth: storedDepth,
            language: lang === 'zh' ? 'zh' : 'en',
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.status === 'complete' && data.report_data) {
            clearInterval(stepTimer);
            onReportReadyRef.current({
              idea_text: storedText,
              report_id: data.report_id,
              report_data: typeof data.report_data === 'string'
                ? JSON.parse(data.report_data)
                : data.report_data,
            });
            window.history.replaceState({}, '', '/check');
            return;
          }
        }
        throw new Error('Capture failed');
      } catch {
        clearInterval(stepTimer);
        setError(lang === 'zh'
          ? '報告載入失敗，請聯繫 support@mnemox.ai'
          : 'Failed to load report. Contact support@mnemox.ai');
      }
    })();

    return () => clearInterval(stepTimer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="text-danger mb-4">{error}</p>
        <a href="/check" className="text-cyan hover:underline font-mono text-sm">
          {lang === 'zh' ? '返回檢測頁' : 'Back to Check'}
        </a>
      </div>
    );
  }

  return (
    <div className="py-16 text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-cyan border-t-transparent mb-4" />
      <p className="font-mono text-sm text-txt-dim">{steps[stepIdx]}</p>
      <div className="mt-4 mx-auto w-48 h-1 rounded-full bg-border overflow-hidden">
        <div
          className="h-full bg-cyan transition-all duration-500 rounded-full"
          style={{ width: `${Math.min(((stepIdx + 1) / steps.length) * 95, 95)}%` }}
        />
      </div>
    </div>
  );
}

function safeGet(key: string): string {
  try { return localStorage.getItem(key) || ''; } catch { return ''; }
}
