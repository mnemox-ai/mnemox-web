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
  direction: string;
  entry_price: number;
  entry_time: string;
  quantity: number;
  status: string;
  stop_loss: number | null;
  take_profit: number | null;
  max_exit_time: string | null;
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
  direction: string;
  entry_price: number;
  exit_price: number;
  entry_time: string;
  exit_time: string;
  pnl_pct: number;
  pnl_usd: number;
  pnl_r: number | null;
  exit_reason: string | null;
  trade_type: string;
}

export interface LiveStats {
  total_trades: number;
  win_rate: number;
  total_backtest: number;
  total_paper: number;
}

export interface StrategySummary {
  strategy: StrategyInfo;
  stats: LiveStats;
  has_open_position: boolean;
}

export interface LiveData {
  strategy: StrategyInfo;
  current_position: Position | null;
  equity_curve: EquityPoint[];
  recent_trades: Trade[];
  stats: LiveStats;
  updated_at: string;
}

// --- Constants ---

export const STRATEGIES: Record<string, StrategyInfo> = {
  strategy_e: {
    id: 'strategy_e',
    name: 'Strategy E: Afternoon Engine',
    symbol: 'BTCUSDT',
    timeframe: '1H',
  },
  strategy_c: {
    id: 'strategy_c',
    name: 'Strategy C: US Session Drain',
    symbol: 'BTCUSDT',
    timeframe: '1H',
  },
};

// --- Fetcher ---

export async function fetchLiveData(strategyId: string = 'strategy_e'): Promise<LiveData> {
  const supabase = createServiceSupabaseClient();

  const [tradesRes, positionsRes] = await Promise.all([
    supabase
      .from('live_trades')
      .select('*')
      .eq('strategy_id', strategyId)
      .order('entry_time', { ascending: true }),
    supabase
      .from('live_positions')
      .select('*')
      .eq('strategy_id', strategyId)
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
    strategy: STRATEGIES[strategyId] ?? {
      id: strategyId,
      name: strategyId,
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

export async function fetchAllStrategySummaries(): Promise<StrategySummary[]> {
  const supabase = createServiceSupabaseClient();

  const results = await Promise.all(
    Object.values(STRATEGIES).map(async (strategy): Promise<StrategySummary> => {
      try {
        const [tradesRes, positionsRes] = await Promise.all([
          supabase
            .from('live_trades')
            .select('pnl_pct, trade_type')
            .eq('strategy_id', strategy.id),
          supabase
            .from('live_positions')
            .select('id')
            .eq('strategy_id', strategy.id)
            .eq('status', 'open')
            .limit(1),
        ]);

        const trades = tradesRes.data ?? [];
        const total_trades = trades.length;
        const wins = trades.filter((t) => t.pnl_pct > 0).length;
        const win_rate = total_trades > 0 ? wins / total_trades : 0;
        const total_backtest = trades.filter((t) => t.trade_type === 'backtest').length;
        const total_paper = trades.filter((t) => t.trade_type === 'paper').length;

        return {
          strategy,
          stats: { total_trades, win_rate, total_backtest, total_paper },
          has_open_position: (positionsRes.data?.length ?? 0) > 0,
        };
      } catch {
        return {
          strategy,
          stats: { total_trades: 0, win_rate: 0, total_backtest: 0, total_paper: 0 },
          has_open_position: false,
        };
      }
    })
  );

  return results;
}
