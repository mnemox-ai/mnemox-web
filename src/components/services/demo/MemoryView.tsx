'use client';

import { MEMORY_ENTRIES, type MemoryEntry } from './mock-data';

const TYPE_STYLES = {
  episodic: { bg: 'bg-cyan/10', text: 'text-cyan', label: 'Episodic' },
  semantic: { bg: 'bg-purple-500/10', text: 'text-purple-400', label: 'Semantic' },
  procedural: { bg: 'bg-amber-500/10', text: 'text-amber-400', label: 'Procedural' },
} as const;

function ScoreBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-8 text-right font-mono text-[9px] text-txt-dim">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-bg">
        <div
          className="h-full rounded-full bg-cyan transition-all"
          style={{ width: `${value * 100}%`, opacity: 0.4 + value * 0.6 }}
        />
      </div>
      <span className="w-7 font-mono text-[9px] text-txt-dim">{value.toFixed(2)}</span>
    </div>
  );
}

function MemoryCard({ entry }: { entry: MemoryEntry }) {
  const style = TYPE_STYLES[entry.type];

  return (
    <div className="rounded-lg border border-border bg-bg/40 p-3 transition-colors hover:border-border-bright">
      <div className="flex items-center gap-2">
        <span className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold ${style.bg} ${style.text}`}>
          {style.label}
        </span>
        <span className="font-mono text-[10px] text-txt-dim">{entry.id}</span>
        <span className="ml-auto font-mono text-xs font-bold text-cyan">
          {entry.owmScore.toFixed(2)}
        </span>
      </div>

      <p className="mt-2 text-[11px] leading-relaxed text-txt-dim">{entry.context}</p>

      {/* OWM Score breakdown */}
      <div className="mt-2 space-y-1">
        <ScoreBar value={entry.breakdown.Q} label="Q" />
        <ScoreBar value={entry.breakdown.Sim} label="Sim" />
        <ScoreBar value={entry.breakdown.Rec} label="Rec" />
        <ScoreBar value={entry.breakdown.Conf} label="Conf" />
      </div>

      <div className="mt-2 font-mono text-[10px] text-txt-dim/70">
        Outcome: {entry.outcome}
      </div>
    </div>
  );
}

export function MemoryView() {
  return (
    <div>
      {/* Memory layer diagram */}
      <div className="mb-4 flex items-center justify-center gap-2 text-[10px]">
        <span className="rounded-lg border border-cyan/20 bg-cyan/5 px-3 py-1.5 font-mono text-cyan">
          L1 Episodic
        </span>
        <span className="text-txt-dim/30">→</span>
        <span className="rounded-lg border border-purple-500/20 bg-purple-500/5 px-3 py-1.5 font-mono text-purple-400">
          L2 Semantic
        </span>
        <span className="text-txt-dim/30">→</span>
        <span className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-1.5 font-mono text-amber-400">
          L3 Procedural
        </span>
      </div>

      {/* OWM formula */}
      <div className="mb-4 rounded-lg border border-border bg-bg/60 px-3 py-2 text-center">
        <span className="font-mono text-[10px] text-txt-dim">
          OWM Score = <span className="text-cyan">Q</span> × <span className="text-cyan">Similarity</span> × <span className="text-cyan">Recency</span> × <span className="text-cyan">Confidence</span>
        </span>
      </div>

      {/* Memory entries */}
      <div className="space-y-3">
        {MEMORY_ENTRIES.map((entry) => (
          <MemoryCard key={entry.id} entry={entry} />
        ))}
      </div>

      {/* Stats */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="rounded-lg border border-border bg-bg/60 p-2 text-center">
          <div className="font-mono text-sm font-bold text-cyan">12</div>
          <div className="text-[9px] text-txt-dim">Episodic</div>
        </div>
        <div className="rounded-lg border border-border bg-bg/60 p-2 text-center">
          <div className="font-mono text-sm font-bold text-purple-400">4</div>
          <div className="text-[9px] text-txt-dim">Semantic</div>
        </div>
        <div className="rounded-lg border border-border bg-bg/60 p-2 text-center">
          <div className="font-mono text-sm font-bold text-amber-400">2</div>
          <div className="text-[9px] text-txt-dim">Procedural</div>
        </div>
      </div>
    </div>
  );
}
