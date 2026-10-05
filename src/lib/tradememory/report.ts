/**
 * Where a trader's own history loses money. Descriptive statistics only.
 *
 * Port of tradememory-protocol `src/tradememory/sync/report.py`. Every
 * number here describes trades that already happened in one account.
 * Nothing in it says what to trade next.
 */
import type { Dec } from './decimal';
import { D } from './decimal';
import type { RoundTrip } from './fills';
import { pyIso } from './pyfmt';

export const STREAK = 2; // losses in a row before the next trade counts as "after a losing streak"
export const SIZE_UP = 1.5; // notional at least this many times the trader's median counts as sizing up
export const MIN_SAMPLE = 5; // below this a pattern is reported as "not enough trades"
export const MORE_THAN_USUAL_P = 0.1; // below this, sizing up after a streak is called "more often than usual"
export const MIN_LIFT = 0.05; // ...and only when it is at least 5 points above the usual share: a huge history
// makes a 2-point difference "significant" without it meaning anything

export interface Summary {
  trades: number;
  win_rate: number | null;
  net_pnl: number;
}

export interface StreakStats {
  trades_after_streak: number;
  sized_up: number;
  sized_up_share: number | null;
  baseline_sized_up_share: number;
  sized_up_p_value: number | null;
  sized_up_result: Summary;
  after_streak_result: Summary;
  enough_data: boolean;
  more_often_than_usual: boolean;
}

export interface HoldStats {
  median_hold_winners_s: number | null;
  median_hold_losers_s: number | null;
  enough_data: boolean;
}

export interface SymbolRow extends Summary {
  symbol: string;
}

export interface HourRow extends Summary {
  hour_utc: number;
}

export interface BigLoss {
  symbol: string;
  direction: string;
  entry_time: string; // Python isoformat, UTC
  net_pnl: number;
  notional: number;
  hold_seconds: number;
}

export interface LossPatterns extends Summary {
  fees: number;
  median_notional: number;
  after_losing_streak: StreakStats;
  holding: HoldStats;
  worst_symbols: SymbolRow[];
  worst_entry_hours_utc: HourRow[];
  biggest_losses: BigLoss[];
}

export type Patterns = { trades: 0 } | LossPatterns;

export function hasTrades(p: Patterns): p is LossPatterns {
  return p.trades > 0;
}

function f(x: Dec): number {
  return x.toNumber();
}

function summary(trips: RoundTrip[]): Summary {
  if (!trips.length) return { trades: 0, win_rate: null, net_pnl: 0 };
  let wins = 0;
  let net = new D(0);
  for (const t of trips) {
    if (t.netPnl.gt(0)) wins += 1;
    net = net.plus(t.netPnl);
  }
  return { trades: trips.length, win_rate: wins / trips.length, net_pnl: f(net) };
}

/** Python `statistics.median` over numbers. */
function median(values: number[]): number {
  const data = [...values].sort((a, b) => a - b);
  const n = data.length;
  if (n === 0) throw new Error('no median for empty data');
  const i = Math.floor(n / 2);
  if (n % 2 === 1) return data[i];
  return (data[i - 1] + data[i]) / 2;
}

/**
 * P(X >= successes) for X ~ Binomial(trials, rate), summed in log space so
 * long histories do not underflow. Operations are in the reference's order.
 */
export function binomialTail(successes: number, trials: number, rate: number): number | null {
  if (trials <= 0) return null;
  if (successes <= 0) return 1;
  if (rate <= 0) return 0;
  if (rate >= 1) return 1;
  const logP = Math.log(rate);
  const logQ = Math.log1p(-rate);
  let logPmf = trials * logQ; // k = 0
  let tail = 0;
  for (let k = 0; k <= trials; k++) {
    if (k >= successes) tail += Math.exp(logPmf);
    if (k < trials) logPmf += Math.log(trials - k) - Math.log(k + 1) + logP - logQ;
  }
  return Math.min(1, tail);
}

export function lossPatterns(trips: RoundTrip[]): Patterns {
  if (!trips.length) return { trades: 0 };
  const byEntry = [...trips].sort((a, b) => a.entryMs - b.entryMs);
  const byExit = [...trips].sort((a, b) => a.exitMs - b.exitMs);
  const medianNotional = median(trips.map((t) => f(t.notional)));

  // 1. What happens to size right after losses in a row.
  const afterStreak: RoundTrip[] = [];
  let recent: RoundTrip[] = []; // the last STREAK trips closed before the current entry
  let j = 0;
  for (const trip of byEntry) {
    while (j < byExit.length && byExit[j].exitMs <= trip.entryMs) {
      if (byExit[j] !== trip) recent = [...recent, byExit[j]].slice(-STREAK);
      j += 1;
    }
    if (recent.length === STREAK && recent.every((t) => t.netPnl.lt(0))) afterStreak.push(trip);
  }
  const sizedUp = afterStreak.filter((t) => medianNotional && f(t.notional) >= SIZE_UP * medianNotional);
  // How often the trader sizes up at all: a streak only says something if it moves this.
  let baseline = 0;
  for (const t of trips) if (medianNotional && f(t.notional) >= SIZE_UP * medianNotional) baseline += 1;
  const pValue = binomialTail(sizedUp.length, afterStreak.length, baseline / trips.length);
  const sizedUpShare = afterStreak.length ? sizedUp.length / afterStreak.length : null;
  const baselineShare = baseline / trips.length;
  const enough = afterStreak.length >= MIN_SAMPLE;
  const streak: StreakStats = {
    trades_after_streak: afterStreak.length,
    sized_up: sizedUp.length,
    sized_up_share: sizedUpShare,
    baseline_sized_up_share: baselineShare,
    // Chance of sizing up this often after a streak if streaks changed nothing.
    sized_up_p_value: pValue,
    sized_up_result: summary(sizedUp),
    after_streak_result: summary(afterStreak),
    enough_data: enough,
    more_often_than_usual: Boolean(
      enough && pValue !== null && pValue <= MORE_THAN_USUAL_P && (sizedUpShare as number) - baselineShare >= MIN_LIFT,
    ),
  };

  // 2. Holding losers longer than winners.
  const winners = trips.filter((t) => t.netPnl.gt(0)).map((t) => t.holdSeconds);
  const losers = trips.filter((t) => t.netPnl.lt(0)).map((t) => t.holdSeconds);
  const hold: HoldStats = {
    median_hold_winners_s: winners.length ? median(winners) : null,
    median_hold_losers_s: losers.length ? median(losers) : null,
    enough_data: winners.length >= MIN_SAMPLE && losers.length >= MIN_SAMPLE,
  };

  // 3. Where it loses: symbols and entry hours (UTC).
  const perSymbol = new Map<string, RoundTrip[]>();
  const perHour = new Map<number, RoundTrip[]>();
  for (const t of trips) {
    const s = perSymbol.get(t.symbol);
    if (s) s.push(t);
    else perSymbol.set(t.symbol, [t]);
    const hour = new Date(t.entryMs).getUTCHours();
    const h = perHour.get(hour);
    if (h) h.push(t);
    else perHour.set(hour, [t]);
  }
  const worstSymbols: SymbolRow[] = [...perSymbol]
    .map(([symbol, ts]) => ({ symbol, ...summary(ts) }))
    .filter((r) => r.net_pnl < 0)
    .sort((a, b) => a.net_pnl - b.net_pnl)
    .slice(0, 3);
  const worstHours: HourRow[] = [...perHour]
    .filter(([, ts]) => ts.length >= MIN_SAMPLE)
    .map(([hour_utc, ts]) => ({ hour_utc, ...summary(ts) }))
    .filter((r) => r.net_pnl < 0)
    .sort((a, b) => a.net_pnl - b.net_pnl)
    .slice(0, 3);

  // 4. The single worst trades.
  const biggest: BigLoss[] = [...trips]
    .sort((a, b) => a.netPnl.cmp(b.netPnl))
    .slice(0, 3)
    .filter((t) => t.netPnl.lt(0))
    .map((t) => ({
      symbol: t.symbol,
      direction: t.direction,
      entry_time: pyIso(t.entryMs),
      net_pnl: f(t.netPnl),
      notional: f(t.notional),
      hold_seconds: t.holdSeconds,
    }));

  let fees = new D(0);
  for (const t of trips) fees = fees.plus(t.fees);

  return {
    ...summary(trips),
    fees: f(fees),
    median_notional: medianNotional,
    after_losing_streak: streak,
    holding: hold,
    worst_symbols: worstSymbols,
    worst_entry_hours_utc: worstHours,
    biggest_losses: biggest,
  };
}
