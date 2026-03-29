'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DECISIONS, type Decision } from './mock-data';

function AuditRow({ d }: { d: Decision }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="cursor-pointer border-b border-border/50 last:border-b-0"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center gap-2 px-3 py-2.5 text-[11px] transition-colors hover:bg-bg/40 md:gap-3">
        <span className="font-mono text-cyan/60">{d.id}</span>
        <span className="font-mono text-txt-dim">{d.timestamp}</span>
        <span className="font-mono text-txt">{d.instrument}</span>
        <span
          className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold ${
            d.direction === 'LONG'
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-red-500/10 text-red-400'
          }`}
        >
          {d.direction}
        </span>
        <span className="ml-auto text-txt-dim">{expanded ? '▴' : '▾'}</span>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 bg-bg/30 px-3 py-3">
              {/* Decision chain */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-wider text-txt-dim">
                  Decision Chain
                </span>
                <div className="flex items-center gap-1 text-[10px]">
                  {['Signal', 'Conditions', 'Filters', 'Risk Gate', 'Execute'].map(
                    (step, i) => (
                      <span key={step} className="flex items-center gap-1">
                        <span
                          className={`rounded px-1.5 py-0.5 font-mono ${
                            i === 2 && d.pnl < 0 && d.filters.some((f) => f.includes('FAILED'))
                              ? 'bg-red-500/10 text-red-400'
                              : 'bg-cyan/10 text-cyan/80'
                          }`}
                        >
                          {step}
                        </span>
                        {i < 4 && <span className="text-txt-dim/30">→</span>}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* Conditions */}
              <div>
                <span className="text-[10px] uppercase tracking-wider text-txt-dim">
                  Entry Conditions
                </span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {d.conditions.map((c) => (
                    <code
                      key={c}
                      className="rounded bg-bg px-1.5 py-0.5 font-mono text-[10px] text-txt/70"
                    >
                      {c}
                    </code>
                  ))}
                </div>
              </div>

              {/* Hash */}
              <div className="rounded-lg border border-border/50 bg-bg/60 p-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-emerald-400">✓ Verified</span>
                  <span className="font-mono text-[9px] text-txt-dim/50">
                    SHA-256: {d.hash}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AuditView() {
  return (
    <div>
      {/* Header stats */}
      <div className="mb-4 flex items-center gap-4">
        <div className="rounded-lg border border-border bg-bg/60 px-3 py-2 text-center">
          <div className="font-mono text-lg font-bold text-cyan">89</div>
          <div className="text-[9px] uppercase tracking-wider text-txt-dim">Total Records</div>
        </div>
        <div className="rounded-lg border border-border bg-bg/60 px-3 py-2 text-center">
          <div className="font-mono text-lg font-bold text-emerald-400">89/89</div>
          <div className="text-[9px] uppercase tracking-wider text-txt-dim">Hash Verified</div>
        </div>
        <div className="rounded-lg border border-border bg-bg/60 px-3 py-2 text-center">
          <div className="font-mono text-lg font-bold text-txt">0</div>
          <div className="text-[9px] uppercase tracking-wider text-txt-dim">Tampered</div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-bg/40">
        <div className="border-b border-border px-3 py-2">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-txt-dim">
            <span className="w-24">Record ID</span>
            <span className="w-28">Timestamp</span>
            <span className="w-16">Instrument</span>
            <span>Direction</span>
          </div>
        </div>
        {DECISIONS.map((d) => (
          <AuditRow key={d.id} d={d} />
        ))}
      </div>

      {/* Compliance note */}
      <div className="mt-3 rounded-lg border border-cyan/10 bg-cyan/5 px-3 py-2 text-[10px] text-cyan/70">
        Every decision is cryptographically hashed at creation time. Tamper detection via SHA-256 recomputation.
      </div>
    </div>
  );
}
