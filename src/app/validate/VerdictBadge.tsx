'use client';

interface VerdictBadgeProps {
  verdict: 'PASS' | 'CAUTION' | 'FAIL';
  score: number;
}

const VERDICT_CONFIG = {
  PASS: {
    bg: 'bg-neon-green/10',
    border: 'border-neon-green/40',
    text: 'text-neon-green',
    glow: 'shadow-[0_0_30px_rgba(0,255,136,0.15)]',
    label: 'PASS',
  },
  CAUTION: {
    bg: 'bg-amber/10',
    border: 'border-amber/40',
    text: 'text-amber',
    glow: 'shadow-[0_0_30px_rgba(255,170,0,0.15)]',
    label: 'CAUTION',
  },
  FAIL: {
    bg: 'bg-danger/10',
    border: 'border-danger/40',
    text: 'text-danger',
    glow: 'shadow-[0_0_30px_rgba(255,51,102,0.15)]',
    label: 'FAIL',
  },
};

export function VerdictBadge({ verdict, score }: VerdictBadgeProps) {
  const config = VERDICT_CONFIG[verdict];

  return (
    <div className={`inline-flex flex-col items-center gap-3 rounded-2xl border-2 ${config.border} ${config.bg} ${config.glow} px-10 py-6`}>
      <span className={`font-mono text-4xl font-black tracking-wider ${config.text}`}>
        {config.label}
      </span>
      <div className="flex items-baseline gap-1.5">
        <span className={`font-mono text-5xl font-black ${config.text}`}>
          {score}
        </span>
        <span className="font-mono text-lg text-txt-dim">/100</span>
      </div>
    </div>
  );
}
