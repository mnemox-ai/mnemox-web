import { createServiceSupabaseClient } from './supabase/server';

// --- Types ---

export interface StrategyInfo {
  id: string;
  name: string;
  symbol: string;
  timeframe: string;
}

export interface Position {
  id: string;
  strategy_id: string;
  symbol: string;
  side: string;
  entry_price: number;
  entry_time: string;
  quantity: number;
  status: string;
}

export interface EquityPoint {
  time: string;
  equity: number;
  trade_type: string;
}

export interface Trade {
  id: string;
  strategy_id: string;
  symbol: string;
  side: string;
  entry_price: number;
  exit_price: number;
  entry_time: string;
  exit_time: string;
  pnl_pct: number;
  pnl_usd: number;
  trade_type: string;
}

export interface LiveStats {
  total_trades: number;
  win_rate: number;
  total_backtest: number;
  total_paper: number;
}

export interface LiveData {
  strategy: StrategyInfo;
  current_position: Position | null;
  equity_curve: EquityPoint[];
  recent_trades: Trade[];
  stats: LiveStats;
  updated_at: string;
}

// --- Fetcher ---

export async function fetchLiveData(): Promise<LiveData> {
  const supabase = createServiceSupabaseClient();

  const [tradesRes, positionsRes] = await Promise.all([
    supabase
      .from('live_trades')
      .select('*')
      .eq('strategy_id', 'strategy_e')
      .order('entry_time', { ascending: true }),
    supabase
      .from('live_positions')
      .select('*')
      .eq('strategy_id', 'strategy_e')
      .eq('status', 'open')
      .limit(1),
  ]);

  if (tradesRes.error) throw new Error(`live_trades: ${tradesRes.error.message}`);
  if (positionsRes.error) throw new Error(`live_positions: ${positionsRes.error.message}`);

  const trades = (tradesRes.data ?? []) as Trade[];
  const current_position = (positionsRes.data?.[0] as Position) ?? null;

  // Equity curve: start at 1.0, compound pnl_pct
  let equity = 1.0;
  const equity_curve: EquityPoint[] = trades.map((t) => {
    equity *= 1 + t.pnl_pct / 100;
    return { time: t.entry_time, equity, trade_type: t.trade_type };
  });

  // Stats
  const total_trades = trades.length;
  const wins = trades.filter((t) => t.pnl_pct > 0).length;
  const win_rate = total_trades > 0 ? wins / total_trades : 0;
  const total_backtest = trades.filter((t) => t.trade_type === 'backtest').length;
  const total_paper = trades.filter((t) => t.trade_type === 'paper').length;

  return {
    strategy: {
      id: 'strategy_e',
      name: 'Strategy E: Afternoon Engine',
      symbol: 'BTCUSDT',
      timeframe: '1H',
    },
    current_position,
    equity_curve,
    recent_trades: trades.slice(-20).reverse(),
    stats: { total_trades, win_rate, total_backtest, total_paper },
    updated_at: new Date().toISOString(),
  };
}
