'use client';

import { useEffect, useState } from 'react';

interface Position {
  entry_price: number;
  stop_loss: number;
  take_profit: number;
  direction: 'LONG' | 'SHORT';
  entry_time: string;
  max_exit_time: string;
}

interface StatusCardProps {
  position: Position | null;
  strategyInfo: { symbol: string; timeframe: string };
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return 'Expired';
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function StatusCard({ position, strategyInfo }: StatusCardProps) {
  const [remaining, setRemaining] = useState('');

  useEffect(() => {
    if (!position) return;

    const update = () => {
      const diff = new Date(position.max_exit_time).getTime() - Date.now();
      setRemaining(formatCountdown(diff));
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [position]);

  return (
    <div className="rounded-xl border border-border bg-bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-txt-dim">
          {strategyInfo.symbol} · {strategyInfo.timeframe}
        </h3>
        {position ? (
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-green opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-neon-green" />
            </span>
            <span className="text-xs font-bold text-neon-green">OPEN</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-gray-500" />
            <span className="text-xs text-txt-dim">No open position</span>
          </div>
        )}
      </div>

      {position && (
        <>
          <div className="mb-4">
            <span
              className={`inline-block rounded px-2 py-0.5 text-xs font-bold ${
                position.direction === 'LONG'
                  ? 'bg-neon-green/20 text-neon-green'
                  : 'bg-danger/20 text-danger'
              }`}
            >
              {position.direction}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-txt-dim">Entry</span>
              <span className="font-mono text-cyan">{position.entry_price.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-txt-dim">Stop Loss</span>
              <span className="font-mono text-danger">{position.stop_loss.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-txt-dim">Take Profit</span>
              <span className="font-mono text-neon-green">{position.take_profit.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-4 border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-txt-dim">Time Remaining</span>
              <span
                className={`font-mono text-sm ${
                  remaining === 'Expired' ? 'text-danger' : 'text-txt'
                }`}
              >
                {remaining}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
