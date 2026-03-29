'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';

type Phase = 'form' | 'submitting' | 'success' | 'error';

const PLATFORMS = ['mt5', 'binance', 'ib', 'other'] as const;
const TIERS = ['audit', 'system', 'warroom', 'unsure'] as const;

export function BookingForm() {
  const { t } = useI18n();
  const [phase, setPhase] = useState<Phase>('form');
  const [errorMsg, setErrorMsg] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [platform, setPlatform] = useState('');
  const [tier, setTier] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedDesc = description.trim();

    if (!trimmedName || !trimmedEmail || !platform || !tier || !trimmedDesc) {
      setErrorMsg(t('svc_form_err_required'));
      setPhase('error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMsg(t('svc_form_err_email'));
      setPhase('error');
      return;
    }

    setPhase('submitting');

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          platform,
          service_tier: tier,
          description: trimmedDesc,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 429) {
          setErrorMsg(t('svc_form_err_limit'));
        } else {
          setErrorMsg(data.error || t('svc_form_err_generic'));
        }
        setPhase('error');
        return;
      }

      setPhase('success');
    } catch {
      setErrorMsg(t('svc_form_err_generic'));
      setPhase('error');
    }
  };

  if (phase === 'success') {
    return (
      <div id="booking" className="rounded-xl border border-neon-green/30 bg-neon-green/5 p-10 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neon-green/10">
          <svg className="h-8 w-8 text-neon-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display text-2xl font-bold text-txt">
          {t('svc_form_success_title')}
        </h3>
        <p className="mt-3 text-sm text-txt-dim">
          {t('svc_form_success_desc')}
        </p>
      </div>
    );
  }

  return (
    <div id="booking" className="rounded-xl border border-cyan/20 bg-bg-card p-8 md:p-10">
      <h2 className="text-center font-display text-2xl font-bold text-txt md:text-3xl">
        {t('svc_form_title')}
      </h2>
      <p className="mx-auto mt-3 max-w-lg text-center text-sm text-txt-dim">
        {t('svc_form_subtitle')}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {/* Name + Email row */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-txt-dim">
              {t('svc_form_name')} *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              className="w-full rounded-lg border border-border bg-bg/50 px-4 py-2.5 text-sm text-txt outline-none transition-colors placeholder:text-txt-muted focus:border-cyan"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-txt-dim">
              {t('svc_form_email')} *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={200}
              className="w-full rounded-lg border border-border bg-bg/50 px-4 py-2.5 text-sm text-txt outline-none transition-colors placeholder:text-txt-muted focus:border-cyan"
              placeholder="you@example.com"
            />
          </div>
        </div>

        {/* Platform */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-txt-dim">
            {t('svc_form_platform')} *
          </label>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {PLATFORMS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlatform(p)}
                className={cn(
                  'rounded-lg border px-4 py-2.5 text-sm transition-colors',
                  platform === p
                    ? 'border-cyan bg-cyan/10 text-cyan'
                    : 'border-border bg-bg/50 text-txt-dim hover:border-border-bright'
                )}
              >
                {t(`svc_form_platform_${p}` as 'svc_form_platform_mt5')}
              </button>
            ))}
          </div>
        </div>

        {/* Service Tier */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-txt-dim">
            {t('svc_form_tier')} *
          </label>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {TIERS.map((tierOpt) => (
              <button
                key={tierOpt}
                type="button"
                onClick={() => setTier(tierOpt)}
                className={cn(
                  'rounded-lg border px-4 py-2.5 text-sm transition-colors',
                  tier === tierOpt
                    ? 'border-cyan bg-cyan/10 text-cyan'
                    : 'border-border bg-bg/50 text-txt-dim hover:border-border-bright'
                )}
              >
                {t(`svc_form_tier_${tierOpt}` as 'svc_form_tier_audit')}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-txt-dim">
            {t('svc_form_desc')} *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
            rows={4}
            className="w-full resize-none rounded-lg border border-border bg-bg/50 px-4 py-2.5 text-sm text-txt outline-none transition-colors placeholder:text-txt-muted focus:border-cyan"
            placeholder={t('svc_form_desc_placeholder')}
          />
          <div className="mt-1 text-right text-xs text-txt-muted">
            {description.length}/500
          </div>
        </div>

        {/* Error */}
        {phase === 'error' && (
          <div className="rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
            {errorMsg}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={phase === 'submitting'}
          className={cn(
            'w-full rounded-lg py-3.5 text-center font-semibold transition-colors',
            phase === 'submitting'
              ? 'cursor-not-allowed bg-cyan/50 text-bg'
              : 'bg-cyan text-bg hover:bg-cyan/90'
          )}
        >
          {phase === 'submitting' ? t('svc_form_submitting') : t('svc_form_submit')}
        </button>
      </form>
    </div>
  );
}
