'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DECISIONS, type Decision } from './mock-data';

function DecisionRow({ d }: { d: Decision }) {
  const [expanded, setExpanded] = useState(false);
  const isProfit = d.pnl > 0;

  return (
    <div
      className="cursor-pointer border-b border-border/50 last:border-b-0"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center gap-2 px-3 py-2 text-xs transition-colors hover:bg-bg/40 md:gap-3">
        <span className={isProfit ? 'text-emerald-400' : 'text-red-400'}>
          {isProfit ? '✓' : '✗'}
        </span>
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
        <span className="ml-auto font-mono font-semibold tabular-nums">
          <span className={isProfit ? 'text-emerald-400' : 'text-red-400'}>
            {isProfit ? '+' : ''}${d.pnl.toLocaleString()}
          </span>
        </span>
        <span className="text-txt-dim">{expanded ? '▴' : '▾'}</span>
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
            <div className="space-y-2 bg-bg/30 px-3 py-3 text-[11px]">
              <p className="text-txt-dim">
                <span className="text-txt/70">Reasoning:</span> {d.reasoning}
              </p>
              <div>
                <span className="text-txt/70">Conditions:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {d.conditions.map((c) => (
                    <span
                      key={c}
                      className="rounded bg-cyan/10 px-1.5 py-0.5 font-mono text-[10px] text-cyan"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-txt/70">Filters:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {d.filters.map((f) => (
                    <span
                      key={f}
                      className={`rounded px-1.5 py-0.5 font-mono text-[10px] ${
                        f.includes('FAILED')
                          ? 'bg-red-500/10 text-red-400'
                          : 'bg-emerald-500/10 text-emerald-400/80'
                      }`}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
              <div className="font-mono text-[10px] text-txt-dim/50">
                SHA-256: {d.hash}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DecisionLog() {
  return (
    <div className="mt-4 rounded-lg border border-border bg-bg/40">
      <div className="border-b border-border px-3 py-2">
        <span className="font-mono text-xs text-txt-dim">Recent Decisions</span>
      </div>
      {DECISIONS.map((d) => (
        <DecisionRow key={d.id} d={d} />
      ))}
    </div>
  );
}
