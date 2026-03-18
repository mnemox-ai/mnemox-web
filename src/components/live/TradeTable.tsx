'use client';

interface Trade {
  entry_time: string;
  exit_time: string;
  direction: string;
  entry_price: number;
  exit_price: number;
  pnl_pct: number;
  pnl_r: number;
  exit_reason: string;
  trade_type: string;
}

interface TradeTableProps {
  trades: Trade[];
}

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

function formatTime(iso: string) {
  return timeFormatter.format(new Date(iso));
}

function pnlColor(value: number) {
  return value >= 0 ? 'text-neon-green' : 'text-danger';
}

function DirectionBadge({ direction }: { direction: string }) {
  const isLong = direction.toUpperCase() === 'LONG';
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        isLong ? 'bg-neon-green-dim text-neon-green' : 'bg-danger-dim text-danger'
      }`}
    >
      {direction.toUpperCase()}
    </span>
  );
}

function ReasonBadge({ reason }: { reason: string }) {
  const r = reason.toLowerCase();
  let classes = 'bg-amber-dim text-amber';
  if (r === 'sl') classes = 'bg-danger-dim text-danger';
  else if (r === 'tp') classes = 'bg-neon-green-dim text-neon-green';

  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${classes}`}>
      {reason.toUpperCase()}
    </span>
  );
}

function TypeLabel({ type }: { type: string }) {
  const t = type.toLowerCase();
  return (
    <span
      className={`text-xs font-medium ${
        t === 'paper' ? 'text-cyan' : 'text-txt-dim'
      }`}
    >
      {type}
    </span>
  );
}

export default function TradeTable({ trades }: TradeTableProps) {
  if (trades.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-bg-card p-8 text-center text-txt-dim">
        No trades yet
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-bg-card">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-txt-dim">
            <th className="px-4 py-3">Time</th>
            <th className="px-4 py-3">Dir</th>
            <th className="px-4 py-3">Entry</th>
            <th className="px-4 py-3">Exit</th>
            <th className="px-4 py-3">PnL%</th>
            <th className="px-4 py-3">R</th>
            <th className="px-4 py-3">Reason</th>
            <th className="px-4 py-3">Type</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((t, i) => (
            <tr
              key={i}
              className="border-b border-border transition-colors hover:bg-bg-card-hover"
            >
              <td className="whitespace-nowrap px-4 py-3 text-sm">
                {formatTime(t.entry_time)}
              </td>
              <td className="px-4 py-3">
                <DirectionBadge direction={t.direction} />
              </td>
              <td className="px-4 py-3 font-mono text-sm">{t.entry_price}</td>
              <td className="px-4 py-3 font-mono text-sm">{t.exit_price}</td>
              <td className={`px-4 py-3 font-mono text-sm ${pnlColor(t.pnl_pct)}`}>
                {t.pnl_pct >= 0 ? '+' : ''}
                {t.pnl_pct.toFixed(2)}%
              </td>
              <td className={`px-4 py-3 font-mono text-sm ${pnlColor(t.pnl_r)}`}>
                {t.pnl_r >= 0 ? '+' : ''}
                {t.pnl_r.toFixed(2)}
              </td>
              <td className="px-4 py-3">
                <ReasonBadge reason={t.exit_reason} />
              </td>
              <td className="px-4 py-3">
                <TypeLabel type={t.trade_type} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
