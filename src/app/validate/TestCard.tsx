'use client';

import { useState } from 'react';
import { ChevronDown, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import type { TestResult } from './page';

interface TestCardProps {
  test: TestResult;
}

export function TestCard({ test }: TestCardProps) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);

  const Icon = test.passed ? CheckCircle2 : test.score >= 40 ? AlertTriangle : XCircle;
  const iconColor = test.passed ? 'text-neon-green' : test.score >= 40 ? 'text-amber' : 'text-danger';
  const borderColor = test.passed ? 'border-neon-green/20' : test.score >= 40 ? 'border-amber/20' : 'border-danger/20';

  return (
    <div className={`rounded-lg border ${borderColor} bg-bg-card overflow-hidden transition-all`}>
      {/* Header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-bg-card-hover"
      >
        <Icon className={`h-5 w-5 shrink-0 ${iconColor}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <span className="font-display text-sm font-bold text-txt">{test.name}</span>
            <span className={`font-mono text-xs ${iconColor}`}>
              {test.score}/100
            </span>
          </div>
          <p className="mt-0.5 text-sm text-txt-dim truncate">{test.details}</p>
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-txt-dim transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-border px-5 pb-5 pt-4 space-y-4">
          {/* Sub-results */}
          {test.sub_results && test.sub_results.length > 0 && (
            <div className="space-y-2">
              {test.sub_results.map((sub, i) => (
                <div key={i} className="flex items-center justify-between rounded border border-border bg-black/20 px-3 py-2">
                  <span className="font-mono text-xs text-txt-dim">{sub.label}</span>
                  <span className={`font-mono text-xs font-bold ${sub.passed ? 'text-neon-green' : 'text-danger'}`}>
                    {sub.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Walk-Forward Windows */}
          {test.walk_forward_windows && test.walk_forward_windows.length > 0 && (
            <div>
              <h4 className="font-mono text-[11px] uppercase tracking-wider text-cyan mb-2">
                {t('val_wf_windows')}
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-2 pr-4 text-left font-mono text-txt-dim">#</th>
                      <th className="py-2 pr-4 text-right font-mono text-txt-dim">IS Sharpe</th>
                      <th className="py-2 pr-4 text-right font-mono text-txt-dim">OOS Sharpe</th>
                      <th className="py-2 pr-4 text-right font-mono text-txt-dim">IS Win%</th>
                      <th className="py-2 pr-4 text-right font-mono text-txt-dim">OOS Win%</th>
                      <th className="py-2 pr-4 text-right font-mono text-txt-dim">IS Trades</th>
                      <th className="py-2 text-right font-mono text-txt-dim">OOS Trades</th>
                    </tr>
                  </thead>
                  <tbody>
                    {test.walk_forward_windows.map((w) => (
                      <tr key={w.window} className="border-b border-border/50 hover:bg-bg-card-hover">
                        <td className="py-2 pr-4 font-mono text-txt-dim">{w.window}</td>
                        <td className="py-2 pr-4 text-right font-mono text-txt">{w.is_sharpe.toFixed(2)}</td>
                        <td className={`py-2 pr-4 text-right font-mono font-bold ${w.oos_sharpe > 0 ? 'text-neon-green' : 'text-danger'}`}>
                          {w.oos_sharpe.toFixed(2)}
                        </td>
                        <td className="py-2 pr-4 text-right font-mono text-txt">{(w.is_win_rate * 100).toFixed(1)}%</td>
                        <td className={`py-2 pr-4 text-right font-mono ${w.oos_win_rate >= 0.45 ? 'text-neon-green' : 'text-danger'}`}>
                          {(w.oos_win_rate * 100).toFixed(1)}%
                        </td>
                        <td className="py-2 pr-4 text-right font-mono text-txt-dim">{w.is_trades}</td>
                        <td className="py-2 text-right font-mono text-txt-dim">{w.oos_trades}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Regime Breakdown */}
          {test.regime_breakdown && test.regime_breakdown.length > 0 && (
            <div>
              <h4 className="font-mono text-[11px] uppercase tracking-wider text-cyan mb-2">
                {t('val_regime_breakdown')}
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-2 pr-4 text-left font-mono text-txt-dim">{t('val_regime')}</th>
                      <th className="py-2 pr-4 text-right font-mono text-txt-dim">{t('val_stat_trades')}</th>
                      <th className="py-2 pr-4 text-right font-mono text-txt-dim">{t('val_stat_win_rate')}</th>
                      <th className="py-2 pr-4 text-right font-mono text-txt-dim">{t('val_stat_sharpe')}</th>
                      <th className="py-2 text-right font-mono text-txt-dim">Avg PnL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {test.regime_breakdown.map((r) => (
                      <tr key={r.regime} className="border-b border-border/50 hover:bg-bg-card-hover">
                        <td className="py-2 pr-4 font-mono text-txt capitalize">{r.regime}</td>
                        <td className="py-2 pr-4 text-right font-mono text-txt-dim">{r.trades}</td>
                        <td className={`py-2 pr-4 text-right font-mono ${r.win_rate >= 0.5 ? 'text-neon-green' : 'text-danger'}`}>
                          {(r.win_rate * 100).toFixed(1)}%
                        </td>
                        <td className={`py-2 pr-4 text-right font-mono font-bold ${r.sharpe > 0 ? 'text-neon-green' : 'text-danger'}`}>
                          {r.sharpe.toFixed(2)}
                        </td>
                        <td className={`py-2 text-right font-mono ${r.avg_pnl >= 0 ? 'text-neon-green' : 'text-danger'}`}>
                          {r.avg_pnl >= 0 ? '+' : ''}{r.avg_pnl.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
