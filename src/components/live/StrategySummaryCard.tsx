'use client';

interface StrategySummaryCardProps {
  strategy: { id: string; name: string; symbol: string; timeframe: string };
  stats: {
    total_trades: number;
    win_rate: number;
    total_backtest: number;
    total_paper: number;
  };
  hasOpenPosition: boolean;
  selected: boolean;
  onClick: () => void;
}

export default function StrategySummaryCard({
  strategy,
  stats,
  hasOpenPosition,
  selected,
  onClick,
}: StrategySummaryCardProps) {
  const winRatePct = (stats.win_rate * 100).toFixed(1);
  const winRateColor = stats.win_rate > 0.5 ? 'text-neon-green' : 'text-danger';

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl p-5 border transition-colors cursor-pointer ${
        selected
          ? 'border-cyan-500/50 ring-1 ring-cyan-500/30 bg-[#0a1628]'
          : 'border-[#1a1a28] bg-[#0b1120] hover:bg-[#0d1428]'
      }`}
    >
      {/* Strategy name + open position indicator */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-white text-sm">{strategy.name}</h3>
        {hasOpenPosition && (
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-green opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-green" />
          </span>
        )}
      </div>

      {/* Symbol + Timeframe badges */}
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-txt-dim">
          {strategy.symbol}
        </span>
        <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-txt-dim">
          {strategy.timeframe}
        </span>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 mt-3 text-xs">
        <span className={`font-mono font-bold ${winRateColor}`}>{winRatePct}%</span>
        <span className="text-txt-dim">{stats.total_trades} trades</span>
        {stats.total_paper > 0 && (
          <span className="text-cyan-400">{stats.total_paper} paper</span>
        )}
      </div>
    </button>
  );
}
