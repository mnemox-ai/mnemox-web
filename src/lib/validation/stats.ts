/**
 * Statistical computation utilities for strategy validation.
 */

export interface Stats {
  mean: number;
  std: number;
  sharpe: number;
  profitFactor: number;
}

/**
 * Compute basic statistics from a returns array.
 */
export function computeStats(returns: number[]): Stats {
  const n = returns.length;
  const mean = returns.reduce((s, r) => s + r, 0) / n;
  const variance = returns.reduce((s, r) => s + (r - mean) ** 2, 0) / (n - 1);
  const std = Math.sqrt(variance);
  const sharpe = std > 0 ? (mean / std) * Math.sqrt(252) : 0;

  const gains = returns.filter((r) => r > 0).reduce((s, r) => s + r, 0);
  const losses = Math.abs(returns.filter((r) => r < 0).reduce((s, r) => s + r, 0));
  const profitFactor = losses > 0 ? gains / losses : gains > 0 ? 99.9 : 0;

  return { mean, std, sharpe, profitFactor };
}

/**
 * Compute maximum drawdown from returns.
 */
export function computeMaxDrawdown(returns: number[]): number {
  let peak = 0;
  let cumulative = 0;
  let maxDD = 0;
  for (const r of returns) {
    cumulative += r;
    if (cumulative > peak) peak = cumulative;
    const dd = peak > 0 ? (peak - cumulative) / peak : 0;
    if (dd > maxDD) maxDD = dd;
  }
  // If returns are fractional (like daily pct), convert
  return Math.min(maxDD, 1);
}

/**
 * Estimate trade count from daily returns.
 */
export function estimateTradeCount(returns: number[]): number {
  // For daily returns, each non-zero day roughly = 1 trade period
  return returns.filter((r) => r !== 0).length;
}

/**
 * Estimate hold time from number of days.
 */
export function estimateHoldTime(days: number): string {
  if (days < 60) return `${days}d`;
  const months = Math.round(days / 30);
  return `~${months}mo`;
}

/**
 * Approximation of the cumulative distribution function of the standard normal.
 */
export function normalCDF(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return 0.5 * (1.0 + sign * y);
}
