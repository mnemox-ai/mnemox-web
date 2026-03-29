// Mock data for interactive demo — all numbers are fictional

// Seeded PRNG to avoid SSR/client hydration mismatch
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// 90-day equity curve with realistic drawdowns (deterministic)
export const EQUITY_DATA = (() => {
  const rand = seededRandom(42);
  const data: { day: number; equity: number; date: string }[] = [];
  let equity = 100000;
  const startDate = new Date('2026-01-01');

  for (let i = 0; i < 90; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    // Simulate realistic PnL with drawdown periods
    let dailyPnl: number;
    if (i >= 15 && i <= 22) {
      dailyPnl = -200 - rand() * 600;
    } else if (i >= 45 && i <= 55) {
      dailyPnl = -300 - rand() * 900;
    } else if (i >= 70 && i <= 74) {
      dailyPnl = -100 - rand() * 400;
    } else {
      dailyPnl = -200 + rand() * 900;
    }

    equity += dailyPnl;
    equity = Math.max(equity, 88000);

    data.push({
      day: i + 1,
      equity: Math.round(equity),
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    });
  }

  return data;
})();

export const STATS = [
  { label: 'Total P&L', value: 47832, prefix: '+$', suffix: '', color: 'text-emerald-400', decimals: 0 },
  { label: 'Win Rate', value: 68.3, prefix: '', suffix: '%', color: 'text-cyan', decimals: 1 },
  { label: 'Sharpe Ratio', value: 2.41, prefix: '', suffix: '', color: 'text-cyan', decimals: 2 },
  { label: 'Max Drawdown', value: 12.4, prefix: '-', suffix: '%', color: 'text-amber-400', decimals: 1 },
] as const;

export interface Decision {
  id: string;
  timestamp: string;
  instrument: string;
  direction: 'LONG' | 'SHORT';
  pnl: number;
  reasoning: string;
  conditions: string[];
  filters: string[];
  hash: string;
}

export const DECISIONS: Decision[] = [
  {
    id: 'TDR-2026-0089',
    timestamp: '2026-03-28 14:23',
    instrument: 'XAUUSD',
    direction: 'LONG',
    pnl: 2847,
    reasoning: 'H14 London session breakout above Asia range high. ATR(D1) expanding, regime: trending_up.',
    conditions: ['price > asia_high + 0.15×ATR(D1)', 'ATR(H1)/ATR(D1) > 0.06', 'hour ∈ [14,15,16]'],
    filters: ['spread < 0.4×ATR(M5)', 'no_existing_position', 'daily_loss < 3%'],
    hash: 'a3f8c2d1e5b7094f6a8d2c1b3e5f7a9d0c4b6e8a1f3d5c7b9e2a4f6d8c0b2e4',
  },
  {
    id: 'TDR-2026-0088',
    timestamp: '2026-03-28 09:41',
    instrument: 'XAUUSD',
    direction: 'SHORT',
    pnl: -412,
    reasoning: 'Spread gate triggered during high-volatility news event. Position closed at SL.',
    conditions: ['price < asia_low - 0.15×ATR(D1)', 'momentum_m5 < -0.3'],
    filters: ['spread_check: FAILED (42pts > 35pts max)', 'force_close: spread_exceeded'],
    hash: 'b4e9d3a2f6c8105e7b9a3d2c4f6e8a0b1d3c5e7a9f2b4d6c8a0e2f4b6d8c1a3',
  },
  {
    id: 'TDR-2026-0087',
    timestamp: '2026-03-27 15:12',
    instrument: 'XAUUSD',
    direction: 'LONG',
    pnl: 1203,
    reasoning: 'Clean Asia range breakout with momentum confirmation. Memory recall: 3 similar trades, avg +$1,400.',
    conditions: ['asia_range > 0.35×ATR(D1)', 'breakout_confirmed', 'volume > avg_20'],
    filters: ['spread: 18pts ✓', 'portfolio: 0/3 positions ✓', 'weekly_pnl: +$3,200 ✓'],
    hash: 'c5f0e4b3a7d9216f8c0b4e3d5a7f9b1c2e4d6a8f0b2c4e6a8d0f2b4a6c8e1d3',
  },
  {
    id: 'TDR-2026-0086',
    timestamp: '2026-03-27 08:55',
    instrument: 'XAUUSD',
    direction: 'LONG',
    pnl: 956,
    reasoning: 'Intraday momentum signal with regime gate confirmation. Trending_up regime, ATR expanding.',
    conditions: ['momentum_h1 > 0.55×ATR(H1)', 'regime: trending_up', 'session: london'],
    filters: ['spread: 16pts ✓', 'daily_loss: 0% ✓', 'max_hold: 288 bars'],
    hash: 'd6a1f5c4b8e0327a9d1c5f4e6b8a0c2d3f5e7b9a1c3d5f7b9e1a3c5d7f9b0e2',
  },
  {
    id: 'TDR-2026-0085',
    timestamp: '2026-03-26 16:30',
    instrument: 'XAUUSD',
    direction: 'SHORT',
    pnl: -289,
    reasoning: 'Counter-trend attempt during ranging regime. Memory warned: 2/3 similar trades were losses.',
    conditions: ['price < vwap', 'rsi_h1 < 35', 'regime: ranging'],
    filters: ['spread: 20pts ✓', 'memory_warning: high_loss_rate', 'confidence: 0.35'],
    hash: 'e7b2a6d5c9f1438b0e2d6a5f7c9b1d3e4a6f8c0b2d4a6e8c0f2a4b6d8e1c3f5',
  },
];

export interface MemoryEntry {
  id: string;
  type: 'episodic' | 'semantic' | 'procedural';
  symbol: string;
  context: string;
  owmScore: number;
  breakdown: { Q: number; Sim: number; Rec: number; Conf: number };
  outcome: string;
}

export const MEMORY_ENTRIES: MemoryEntry[] = [
  {
    id: 'EP-042',
    type: 'episodic',
    symbol: 'XAUUSD',
    context: 'London breakout, trending_up, ATR expanding, H14 entry',
    owmScore: 0.87,
    breakdown: { Q: 0.92, Sim: 0.88, Rec: 0.95, Conf: 0.75 },
    outcome: '+$2,847 (2.1R)',
  },
  {
    id: 'EP-038',
    type: 'episodic',
    symbol: 'XAUUSD',
    context: 'Asia breakout, ranging regime, spread spike during NFP',
    owmScore: 0.72,
    breakdown: { Q: 0.45, Sim: 0.91, Rec: 0.82, Conf: 0.80 },
    outcome: '-$412 (-0.6R)',
  },
  {
    id: 'EP-035',
    type: 'episodic',
    symbol: 'XAUUSD',
    context: 'Momentum entry, trending_up, strong H1 candle',
    owmScore: 0.81,
    breakdown: { Q: 0.88, Sim: 0.79, Rec: 0.78, Conf: 0.82 },
    outcome: '+$1,203 (1.4R)',
  },
  {
    id: 'SM-007',
    type: 'semantic',
    symbol: 'XAUUSD',
    context: 'VolBreakout in trending_up: win_rate=72%, avg_pnl=+$1,450, n=18',
    owmScore: 0.65,
    breakdown: { Q: 0.72, Sim: 0.70, Rec: 0.60, Conf: 0.60 },
    outcome: 'Bayesian belief: P(win|trending_up) = 0.72',
  },
  {
    id: 'PR-003',
    type: 'procedural',
    symbol: 'XAUUSD',
    context: 'Avg hold time: 4.2h, disposition ratio: 1.08, lot variance: 0.12',
    owmScore: 0.58,
    breakdown: { Q: 0.60, Sim: 0.55, Rec: 0.65, Conf: 0.55 },
    outcome: 'Behavioral norm: hold winners 1.3x longer than losers',
  },
];
