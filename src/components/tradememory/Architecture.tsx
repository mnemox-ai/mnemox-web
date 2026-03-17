'use client';

import { useI18n } from '@/lib/i18n';
import { ScrollReveal } from '@/components/shared/ScrollReveal';

const layers = [
  { key: 'l1' as const, tag: 'L1', color: 'var(--color-cyan)' },
  { key: 'l2' as const, tag: 'L2', color: 'var(--color-accent)' },
  { key: 'l3' as const, tag: 'L3', color: 'var(--color-neon-green)' },
];

const owmTypes = [
  { key: 'episodic' as const, icon: '📖' },
  { key: 'semantic' as const, icon: '🧠' },
  { key: 'procedural' as const, icon: '⚙️' },
  { key: 'affective' as const, icon: '💭' },
  { key: 'prospective' as const, icon: '🔮' },
];

export function Architecture() {
  const { t } = useI18n();

  return (
    <ScrollReveal>
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <h2 className="mb-3 text-center font-display text-2xl font-bold text-txt sm:text-3xl">
          {t('tm_arch_title')}
        </h2>
        <p className="mx-auto mb-10 max-w-xl text-center text-sm text-txt-dim">
          {t('tm_arch_subtitle')}
        </p>

        {/* L1 / L2 / L3 cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          {layers.map(({ key, tag, color }) => (
            <div
              key={key}
              className="group relative overflow-hidden rounded-xl border border-border bg-bg-card p-6 transition-colors hover:border-border-bright"
            >
              {/* Top accent stripe */}
              <div
                className="absolute inset-x-0 top-0 h-[3px] opacity-0 transition-opacity group-hover:opacity-100"
                style={{
                  background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                }}
              />
              <div
                className="mb-3 inline-flex rounded-md px-2.5 py-1 font-mono text-xs font-bold"
                style={{
                  color,
                  backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
                }}
              >
                {tag}
              </div>
              <h3 className="font-display text-base font-semibold text-txt">
                {t(`tm_arch_${key}_title`)}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-txt-dim">
                {t(`tm_arch_${key}_desc`)}
              </p>
            </div>
          ))}
        </div>

        {/* Flow arrows */}
        <div className="my-4 flex items-center justify-center gap-2">
          <span className="h-px flex-1 max-w-16 bg-border-bright" />
          <span className="font-mono text-xs text-txt-muted">feeds into</span>
          <span className="h-px flex-1 max-w-16 bg-border-bright" />
        </div>

        {/* OWM full-width card */}
        <div className="group relative overflow-hidden rounded-xl border border-border bg-bg-card p-6 transition-colors hover:border-border-bright">
          <div
            className="absolute inset-x-0 top-0 h-[3px] opacity-0 transition-opacity group-hover:opacity-100"
            style={{
              background: 'linear-gradient(90deg, transparent, var(--color-amber), transparent)',
            }}
          />
          <div className="mb-4 flex items-center gap-3">
            <div className="inline-flex rounded-md bg-amber-dim px-2.5 py-1 font-mono text-xs font-bold text-amber">
              OWM
            </div>
            <h3 className="font-display text-base font-semibold text-txt">
              {t('tm_arch_owm_title')}
            </h3>
          </div>
          <p className="mb-5 text-sm leading-relaxed text-txt-dim">
            {t('tm_arch_owm_desc')}
          </p>

          {/* 5 memory types */}
          <div className="grid gap-3 sm:grid-cols-5">
            {owmTypes.map(({ key, icon }) => (
              <div
                key={key}
                className="rounded-lg border border-border bg-bg p-3 text-center transition-colors hover:border-border-bright"
              >
                <span className="text-xl">{icon}</span>
                <p className="mt-1 font-mono text-xs font-semibold text-txt">
                  {t(`tm_owm_${key}_name`)}
                </p>
                <p className="mt-0.5 text-[11px] leading-snug text-txt-dim">
                  {t(`tm_owm_${key}_desc`)}
                </p>
              </div>
            ))}
          </div>

          {/* Formula */}
          <p className="mt-4 text-center font-mono text-xs text-txt-muted">
            Score = Q &times; Sim &times; Rec &times; Conf &times; Aff
          </p>
        </div>
      </section>
    </ScrollReveal>
  );
}
