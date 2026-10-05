/**
 * Everything the address page computes from one address's raw fills, in the
 * shape the Python reference emits (`scratchpad/expected.py` in the
 * tradememory-protocol work tree), so the parity test can compare them.
 */
import type { Dec } from './decimal';
import { buildRoundTrips, type RoundTrip } from './fills';
import { perpFills, type RawFill } from './hyperliquid';
import { lossPatterns, type Patterns } from './report';
import { suggestSizeRule, type SuggestedRule } from './suggest';

export interface AnalysisSummary {
  fills_fetched: number;
  spot_fills_skipped: number;
  closed_trades: number;
  open_positions: Record<string, string>;
  trades_dropped_for_missing_history: number;
  fills_with_fee_in_another_token_not_netted: number;
}

export interface Analysis {
  address: string;
  summary: AnalysisSummary;
  patterns: Patterns;
  suggested_rule: SuggestedRule | null;
  trips: RoundTrip[];
  openPositions: Map<string, Dec>;
  /** Earliest and latest perp fill, ms; null when there are none. */
  perpRange: { fromMs: number; toMs: number } | null;
}

export function analyzeFills(rawFills: RawFill[], address: string): Analysis {
  const { fills, spot } = perpFills(rawFills, address);
  const built = buildRoundTrips(fills);
  const patterns = lossPatterns(built.trips);
  const openPositions: Record<string, string> = {};
  for (const [symbol, size] of built.openPositions) openPositions[symbol] = size.toString();
  let perpRange: Analysis['perpRange'] = null;
  for (const f of fills) {
    if (!perpRange) perpRange = { fromMs: f.timeMs, toMs: f.timeMs };
    else {
      if (f.timeMs < perpRange.fromMs) perpRange.fromMs = f.timeMs;
      if (f.timeMs > perpRange.toMs) perpRange.toMs = f.timeMs;
    }
  }
  return {
    address,
    summary: {
      fills_fetched: rawFills.length,
      spot_fills_skipped: spot,
      closed_trades: built.trips.length,
      open_positions: openPositions,
      trades_dropped_for_missing_history: built.dropped,
      fills_with_fee_in_another_token_not_netted: fills.filter((f) => !f.feeKnown).length,
    },
    patterns,
    suggested_rule: suggestSizeRule(patterns, `Hyperliquid ${address}`),
    trips: built.trips,
    openPositions: built.openPositions,
    perpRange,
  };
}
