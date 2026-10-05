/**
 * Turn a history's loss patterns into a rule the owner can approve.
 *
 * Port of tradememory-protocol `src/tradememory/rules/suggest.py`. Only one
 * kind exists so far: size after a losing streak. It is suggested when the
 * history shows the trader sizing up right after losses in a row more often
 * than they size up in general (the report's `more_often_than_usual`: a
 * one-sided binomial test against their own rate, p <= 0.10, and at least
 * 5 points above it), and those sized-up trades losing money in total.
 */
import { D } from './decimal';
import { pyFixedGrouped, pyPercent0, pyRound } from './pyfmt';
import { SIZE_UP, STREAK, type Patterns, hasTrades } from './report';

export const SIZE_AFTER_LOSING_STREAK = 'size_after_losing_streak';
export const MIN_SIZED_UP = 2; // one sized-up loser is an anecdote, not a habit

export interface RuleEvidence {
  history_trades: number;
  median_notional: number;
  trades_after_streak: number;
  sized_up: number;
  sized_up_share: number;
  usual_sized_up_share: number;
  p_value: number;
  sized_up_win_rate: number | null;
  sized_up_net_pnl: number;
}

export interface SuggestedRule {
  kind: typeof SIZE_AFTER_LOSING_STREAK;
  streak: number;
  max_notional: string; // whole dollars, rounded down
  action: 'escalate' | 'deny';
  source: string;
  evidence: RuleEvidence;
}

/** A proposed rule from `lossPatterns` output, or null when the history does not call for one. */
export function suggestSizeRule(stats: Patterns, source: string): SuggestedRule | null {
  if (!hasTrades(stats)) return null;
  const streak = stats.after_losing_streak;
  const medianNotional = stats.median_notional;
  if (!streak || !streak.enough_data || !medianNotional) return null;
  if (streak.sized_up < MIN_SIZED_UP) return null;
  if (!streak.more_often_than_usual) return null;
  const pValue = streak.sized_up_p_value as number;
  const sizedUp = streak.sized_up_result;
  if (sizedUp.net_pnl >= 0) return null;
  // Whole dollars, rounded down: an order at the reported "sized up" size is held.
  const maxNotional = Math.max(1, Math.floor(SIZE_UP * medianNotional));
  return {
    kind: SIZE_AFTER_LOSING_STREAK,
    streak: STREAK,
    max_notional: String(maxNotional),
    action: 'escalate',
    source,
    evidence: {
      history_trades: stats.trades,
      median_notional: pyRound(medianNotional, 2),
      trades_after_streak: streak.trades_after_streak,
      sized_up: streak.sized_up,
      sized_up_share: pyRound(streak.sized_up_share as number, 4),
      usual_sized_up_share: pyRound(streak.baseline_sized_up_share, 4),
      p_value: pyRound(pValue, 4),
      sized_up_win_rate: sizedUp.win_rate,
      sized_up_net_pnl: pyRound(sizedUp.net_pnl, 2),
    },
  };
}

/** Why `suggestSizeRule` returned null, in the order the reference checks. */
export type NoRuleReason =
  | 'no_trades'
  | 'not_enough_after_streak'
  | 'too_few_sized_up'
  | 'not_more_often_than_usual'
  | 'sized_up_did_not_lose';

export function whyNoRule(stats: Patterns): NoRuleReason | null {
  if (!hasTrades(stats)) return 'no_trades';
  const streak = stats.after_losing_streak;
  if (!streak || !streak.enough_data || !stats.median_notional) return 'not_enough_after_streak';
  if (streak.sized_up < MIN_SIZED_UP) return 'too_few_sized_up';
  if (!streak.more_often_than_usual) return 'not_more_often_than_usual';
  if (streak.sized_up_result.net_pnl >= 0) return 'sized_up_did_not_lose';
  return null;
}

/** A whole-dollar limit for people: "$1,500". Exact for any stored limit, never through float. */
export function money(value: string | number): string {
  const d = new D(String(value));
  const text = d.isInteger() ? d.toFixed(0) : d.toString();
  const neg = text.startsWith('-');
  const [int, frac] = (neg ? text.slice(1) : text).split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `$${neg ? '-' : ''}${grouped}${frac !== undefined ? `.${frac}` : ''}`;
}

/** One line a person can approve or turn down. */
export function describeRule(rule: SuggestedRule): string {
  const held = (rule.action ?? 'escalate') === 'escalate' ? 'held for your approval' : 'refused';
  return `After ${rule.streak} losses in a row, orders that take a position to ${money(rule.max_notional)} or more are ${held}.`;
}

export function describeEvidence(rule: SuggestedRule): string {
  const e = rule.evidence;
  return (
    `In ${e.history_trades} closed trades (${rule.source}), ${e.sized_up} of the ` +
    `${e.trades_after_streak} trades after ${rule.streak} losses in a row were ` +
    `${SIZE_UP}x the usual size or more (${pyPercent0(e.sized_up_share)}, against ` +
    `${pyPercent0(e.usual_sized_up_share)} of all trades); together they made ` +
    `${e.sized_up_net_pnl < 0 ? '-' : ''}$${pyFixedGrouped(Math.abs(e.sized_up_net_pnl), 0)}.`
  );
}
