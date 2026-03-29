'use client';

import { useI18n } from '@/lib/i18n';
import { Marquee } from '@/components/magicui/marquee';

// Real countries from idea-reality Discord webhook data (35 countries)
const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'TW', name: 'Taiwan' },
  { code: 'DE', name: 'Germany' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'FR', name: 'France' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'SG', name: 'Singapore' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'SE', name: 'Sweden' },
  { code: 'PL', name: 'Poland' },
  { code: 'IL', name: 'Israel' },
  { code: 'TR', name: 'Turkey' },
  { code: 'MX', name: 'Mexico' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'TH', name: 'Thailand' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'PH', name: 'Philippines' },
  { code: 'AR', name: 'Argentina' },
  { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colombia' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'AE', name: 'UAE' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'PT', name: 'Portugal' },
  { code: 'RO', name: 'Romania' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'HK', name: 'Hong Kong' },
];

// Use case cards — real scenarios, not fake testimonials
const USE_CASES = [
  { key: 'svc_usecase_1' as const, role: 'svc_usecase_1_role' as const, meta: 'svc_usecase_1_meta' as const, accent: 'var(--color-cyan)' },
  { key: 'svc_usecase_2' as const, role: 'svc_usecase_2_role' as const, meta: 'svc_usecase_2_meta' as const, accent: 'var(--color-accent)' },
  { key: 'svc_usecase_3' as const, role: 'svc_usecase_3_role' as const, meta: 'svc_usecase_3_meta' as const, accent: 'var(--color-neon-green)' },
  { key: 'svc_usecase_4' as const, role: 'svc_usecase_4_role' as const, meta: 'svc_usecase_4_meta' as const, accent: 'var(--color-amber)' },
  { key: 'svc_usecase_5' as const, role: 'svc_usecase_5_role' as const, meta: 'svc_usecase_5_meta' as const, accent: 'var(--color-cyan)' },
  { key: 'svc_usecase_6' as const, role: 'svc_usecase_6_role' as const, meta: 'svc_usecase_6_meta' as const, accent: 'var(--color-accent)' },
];

function FlagEmoji({ code }: { code: string }) {
  // Convert country code to flag emoji
  const flag = code
    .toUpperCase()
    .split('')
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join('');
  return <span className="text-2xl">{flag}</span>;
}

export function SocialProof() {
  const { t } = useI18n();

  return (
    <div className="space-y-12">
      {/* Section Title */}
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold text-txt md:text-3xl">
          {t('svc_dogfood_title')}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-txt-dim">
          {t('svc_dogfood_desc')}
        </p>
      </div>

      {/* Flag Marquee — 35 countries */}
      <div className="rounded-xl border border-border bg-bg-card py-5">
        <p className="mb-4 text-center font-mono text-xs uppercase tracking-widest text-txt-dim">
          {t('svc_flags_label')}
        </p>
        <Marquee speed={30} className="py-2">
          {COUNTRIES.map((c) => (
            <div
              key={c.code}
              className="flex items-center gap-2 rounded-full border border-border bg-bg/50 px-3 py-1.5"
              title={c.name}
            >
              <FlagEmoji code={c.code} />
              <span className="font-mono text-xs text-txt-dim">{c.name}</span>
            </div>
          ))}
        </Marquee>
      </div>

      {/* Use Case Testimonial Marquee */}
      <Marquee speed={50} pauseOnHover className="py-2">
        {USE_CASES.map((uc) => (
          <div
            key={uc.key}
            className="group relative w-[320px] shrink-0 overflow-hidden rounded-xl border border-border bg-bg-card p-6 transition-colors hover:border-border-bright"
          >
            {/* Top accent */}
            <div
              className="absolute inset-x-0 top-0 h-[2px] opacity-50"
              style={{ background: `linear-gradient(90deg, transparent, ${uc.accent}, transparent)` }}
            />
            <p className="text-sm leading-relaxed text-txt-dim">
              &ldquo;{t(uc.key)}&rdquo;
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
                style={{ backgroundColor: `color-mix(in srgb, ${uc.accent} 20%, transparent)`, color: uc.accent }}
              >
                {t(uc.role).charAt(0)}
              </div>
              <div>
                <p className="text-xs font-semibold text-txt">{t(uc.role)}</p>
                <p className="text-[10px] text-txt-muted">{t(uc.meta)}</p>
              </div>
            </div>
          </div>
        ))}
      </Marquee>
    </div>
  );
}
