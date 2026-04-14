'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { trackEvent } from '@/lib/analytics';

interface EmailGateProps {
  ideaHash: string;
  score: number;
  ideaText: string;
  onUnlock: () => void;
}

type Phase = 'idle' | 'submitting' | 'success' | 'error';

const BULLETS = [
  { icon: '\u{1F4CA}', key: 'check_gate_bullet1' as const },
  { icon: '\u{1F9ED}', key: 'check_gate_bullet2' as const },
  { icon: '\u{1F4C8}', key: 'check_gate_bullet3' as const },
];

export function EmailGate({ ideaHash, score, ideaText, onUnlock }: EmailGateProps) {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();

    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErrorMsg(t('check_gate_err_email'));
      setPhase('error');
      return;
    }

    setPhase('submitting');
    trackEvent('email_gate_submit', { score, ideaHash: ideaHash.slice(0, 8) });

    try {
      const res = await fetch('/api/check/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, ideaHash, score, ideaText }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed');
      }

      setPhase('success');
      localStorage.setItem('emailGateUnlocked', 'true');
      trackEvent('email_gate_success');

      // Unlock after a brief moment so user sees the success message
      setTimeout(() => onUnlock(), 1500);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setPhase('error');
      trackEvent('email_gate_error');
    }
  };

  if (phase === 'success') {
    return (
      <div className="my-8 rounded-xl border border-cyan-dim bg-cyan-glow/20 p-8 text-center">
        <div className="text-3xl mb-3">{'\u2728'}</div>
        <p className="text-cyan font-display text-lg font-bold">{t('check_gate_success')}</p>
      </div>
    );
  }

  return (
    <div className="my-8 rounded-xl border border-border bg-gradient-to-b from-bg-card to-[#0a0e1a] p-8 md:p-10">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-display font-bold text-white mb-2">
          {t('check_gate_title')}
        </h3>
        <p className="text-txt-dim text-sm max-w-md mx-auto leading-relaxed">
          {t('check_gate_subtitle')}
        </p>
      </div>

      {/* Bullets */}
      <div className="flex flex-col gap-3 max-w-md mx-auto mb-8">
        {BULLETS.map(({ icon, key }) => (
          <div key={key} className="flex items-start gap-3">
            <span className="text-lg shrink-0 mt-0.5">{icon}</span>
            <span className="text-txt-dim text-sm">{t(key)}</span>
          </div>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setPhase('idle'); }}
          placeholder={t('check_gate_email_placeholder')}
          className="flex-1 rounded-lg border border-border bg-black/40 px-4 py-3 font-display text-sm text-txt placeholder:text-txt-muted focus:border-cyan focus:outline-none transition-colors"
          disabled={phase === 'submitting'}
        />
        <button
          type="submit"
          disabled={phase === 'submitting' || !email.trim()}
          className="whitespace-nowrap rounded-lg bg-cyan px-6 py-3 font-display text-sm font-bold text-black transition-all hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {phase === 'submitting' ? '...' : t('check_gate_submit')}
        </button>
      </form>

      {/* Error */}
      {phase === 'error' && (
        <p className="mt-3 text-center text-xs text-danger">{errorMsg}</p>
      )}

      {/* Footer */}
      <p className="mt-4 text-center font-mono text-[10px] text-txt-muted tracking-wide">
        {t('check_gate_footer')}
      </p>
    </div>
  );
}
