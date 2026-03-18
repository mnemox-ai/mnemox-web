'use client';

interface StatsCardProps {
  stats: {
    total_trades: number;
    win_rate: number;
    total_backtest: number;
    total_paper: number;
  };
}

export function StatsCard({ stats }: StatsCardProps) {
  const items = [
    {
      label: 'Win Rate',
      value: `${(stats.win_rate * 100).toFixed(1)}%`,
      color: stats.win_rate > 0.5 ? 'text-neon-green' : 'text-danger',
    },
    { label: 'Total Trades', value: stats.total_trades, color: 'text-txt' },
    { label: 'Backtest Trades', value: stats.total_backtest, color: 'text-txt' },
    { label: 'Paper Trades', value: stats.total_paper, color: 'text-txt' },
  ];

  return (
    <div className="rounded-xl border border-border bg-bg-card p-6">
      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.label}>
            <p className="text-xs text-txt-dim">{item.label}</p>
            <p className={`mt-1 font-mono text-2xl ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
