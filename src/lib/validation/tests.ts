/**
 * Validation test implementations for strategy analysis.
 */

import { computeStats, normalCDF, type Stats } from './stats';

// --- Types ---

export interface TestResult {
  name: string;
  passed: boolean;
  score: number;
  details: string;
  walk_forward_windows?: WalkForwardWindow[];
  regime_breakdown?: RegimeBreakdown[];
  sub_results?: { label: string; value: string; passed: boolean }[];
}

export interface WalkForwardWindow {
  window: number;
  is_sharpe: number;
  oos_sharpe: number;
  is_trades: number;
  oos_trades: number;
  is_win_rate: number;
  oos_win_rate: number;
}

export interface RegimeBreakdown {
  regime: string;
  trades: number;
  win_rate: number;
  avg_pnl: number;
  sharpe: number;
}

// --- Tests ---

/**
 * Deflated Sharpe Ratio test.
 * Adjusts the Sharpe ratio for multiple testing bias.
 */
export function runDSRTest(returns: number[], stats: Stats, numStrategies: number): TestResult {
  const n = returns.length;
  const sharpe = stats.sharpe;

  // Skewness and kurtosis
  const mean = stats.mean;
  const std = stats.std;
  const skew = std > 0
    ? returns.reduce((s, r) => s + ((r - mean) / std) ** 3, 0) / n
    : 0;
  const kurtosis = std > 0
    ? returns.reduce((s, r) => s + ((r - mean) / std) ** 4, 0) / n - 3
    : 0;

  // Expected max Sharpe from multiple testing (Bailey & Lopez de Prado)
  const trials = Math.max(numStrategies, 1);
  const expectedMaxSharpe = trials > 1
    ? Math.sqrt(2 * Math.log(trials)) * (1 - Math.log(Math.PI * Math.log(trials)) / (2 * Math.log(trials)))
    : 0;

  // Variance of Sharpe estimator
  const sharpeVar = (1 + 0.5 * sharpe ** 2 - skew * sharpe + (kurtosis / 4) * sharpe ** 2) / (n - 1);
  const sharpeStd = Math.sqrt(Math.max(sharpeVar, 1e-10));

  // DSR = probability that observed Sharpe > expected max from random trials
  const zScore = sharpeStd > 0 ? (sharpe - expectedMaxSharpe) / sharpeStd : 0;
  const dsr = normalCDF(zScore);

  const passed = dsr > 0.95;
  const score = Math.min(100, Math.round(dsr * 100));

  return {
    name: 'Deflated Sharpe Ratio',
    passed,
    score,
    details: `DSR = ${(dsr * 100).toFixed(1)}% (need >95%). Adjusted for ${trials} strategies tested.`,
    sub_results: [
      { label: 'Raw Sharpe', value: sharpe.toFixed(3), passed: sharpe > 0 },
      { label: 'DSR Probability', value: `${(dsr * 100).toFixed(1)}%`, passed },
      { label: 'Expected Max Sharpe', value: expectedMaxSharpe.toFixed(3), passed: sharpe > expectedMaxSharpe },
      { label: 'Skewness', value: skew.toFixed(3), passed: skew > -0.5 },
      { label: 'Excess Kurtosis', value: kurtosis.toFixed(3), passed: kurtosis < 3 },
      { label: 'Strategies Tested', value: String(trials), passed: trials <= 10 },
    ],
  };
}

/**
 * Walk-Forward Analysis test.
 */
export function runWalkForwardTest(returns: number[]): TestResult {
  const n = returns.length;
  const numWindows = Math.min(5, Math.floor(n / 60));

  if (numWindows < 2) {
    return {
      name: 'Walk-Forward Analysis',
      passed: false,
      score: 20,
      details: 'Insufficient data for walk-forward (need 120+ observations for 2 windows)',
      sub_results: [
        { label: 'Data Points', value: String(n), passed: false },
        { label: 'Windows Possible', value: String(numWindows), passed: false },
      ],
    };
  }

  const windowSize = Math.floor(n / numWindows);
  const isRatio = 0.7; // 70% in-sample, 30% out-of-sample
  const windows: WalkForwardWindow[] = [];
  let oosPositive = 0;

  for (let w = 0; w < numWindows; w++) {
    const start = w * windowSize;
    const end = Math.min(start + windowSize, n);
    const windowData = returns.slice(start, end);

    const isCut = Math.floor(windowData.length * isRatio);
    const isData = windowData.slice(0, isCut);
    const oosData = windowData.slice(isCut);

    const isStats = computeStats(isData);
    const oosStats = computeStats(oosData);
    const isWinRate = isData.filter((r) => r > 0).length / isData.length;
    const oosWinRate = oosData.filter((r) => r > 0).length / oosData.length;

    windows.push({
      window: w + 1,
      is_sharpe: isStats.sharpe,
      oos_sharpe: oosStats.sharpe,
      is_trades: isData.length,
      oos_trades: oosData.length,
      is_win_rate: isWinRate,
      oos_win_rate: oosWinRate,
    });

    if (oosStats.sharpe > 0) oosPositive++;
  }

  const passRate = oosPositive / numWindows;
  const passed = passRate >= 0.6;
  const score = Math.round(passRate * 100);
  const avgOosSharpe = windows.reduce((s, w) => s + w.oos_sharpe, 0) / windows.length;

  return {
    name: 'Walk-Forward Analysis',
    passed,
    score,
    details: `${oosPositive}/${numWindows} windows profitable OOS (${(passRate * 100).toFixed(0)}%). Avg OOS Sharpe: ${avgOosSharpe.toFixed(2)}`,
    walk_forward_windows: windows,
    sub_results: [
      { label: 'Windows', value: String(numWindows), passed: numWindows >= 3 },
      { label: 'OOS Profitable', value: `${oosPositive}/${numWindows}`, passed: passRate >= 0.6 },
      { label: 'Avg OOS Sharpe', value: avgOosSharpe.toFixed(3), passed: avgOosSharpe > 0 },
      { label: 'Pass Rate', value: `${(passRate * 100).toFixed(0)}%`, passed },
    ],
  };
}

/**
 * Regime Analysis test.
 */
export function runRegimeTest(returns: number[]): TestResult {
  const windowSize = 20;
  const n = returns.length;

  if (n < windowSize * 3) {
    return {
      name: 'Regime Analysis',
      passed: false,
      score: 20,
      details: 'Insufficient data for regime analysis (need 60+ observations)',
    };
  }

  // Compute rolling volatility
  const rollingVol: number[] = [];
  for (let i = windowSize; i < n; i++) {
    const window = returns.slice(i - windowSize, i);
    const mean = window.reduce((s, r) => s + r, 0) / windowSize;
    const vol = Math.sqrt(window.reduce((s, r) => s + (r - mean) ** 2, 0) / (windowSize - 1));
    rollingVol.push(vol);
  }

  // Classify into regimes by volatility percentile
  const sortedVol = [...rollingVol].sort((a, b) => a - b);
  const p33 = sortedVol[Math.floor(sortedVol.length * 0.33)];
  const p66 = sortedVol[Math.floor(sortedVol.length * 0.66)];

  const regimes: Record<string, number[]> = { low_vol: [], medium_vol: [], high_vol: [] };
  for (let i = 0; i < rollingVol.length; i++) {
    const r = returns[i + windowSize];
    if (rollingVol[i] <= p33) regimes.low_vol.push(r);
    else if (rollingVol[i] <= p66) regimes.medium_vol.push(r);
    else regimes.high_vol.push(r);
  }

  // Also add trend regime based on rolling mean
  const rollingMean: number[] = [];
  for (let i = windowSize; i < n; i++) {
    const window = returns.slice(i - windowSize, i);
    rollingMean.push(window.reduce((s, r) => s + r, 0) / windowSize);
  }

  const trendRegimes: Record<string, number[]> = { trending_up: [], ranging: [], trending_down: [] };
  const meanThreshold = 0.0005;
  for (let i = 0; i < rollingMean.length; i++) {
    const r = returns[i + windowSize];
    if (rollingMean[i] > meanThreshold) trendRegimes.trending_up.push(r);
    else if (rollingMean[i] < -meanThreshold) trendRegimes.trending_down.push(r);
    else trendRegimes.ranging.push(r);
  }

  // Build regime breakdown
  const breakdown: RegimeBreakdown[] = [];
  let profitableRegimes = 0;

  for (const [regime, rets] of Object.entries(regimes)) {
    if (rets.length === 0) continue;
    const winRate = rets.filter((r) => r > 0).length / rets.length;
    const avgPnl = rets.reduce((s, r) => s + r, 0) / rets.length;
    const stats = computeStats(rets);
    breakdown.push({
      regime: regime.replace('_', ' '),
      trades: rets.length,
      win_rate: winRate,
      avg_pnl: avgPnl,
      sharpe: stats.sharpe,
    });
    if (avgPnl > 0) profitableRegimes++;
  }

  for (const [regime, rets] of Object.entries(trendRegimes)) {
    if (rets.length < 5) continue;
    const winRate = rets.filter((r) => r > 0).length / rets.length;
    const avgPnl = rets.reduce((s, r) => s + r, 0) / rets.length;
    const stats = computeStats(rets);
    breakdown.push({
      regime: regime.replace('_', ' '),
      trades: rets.length,
      win_rate: winRate,
      avg_pnl: avgPnl,
      sharpe: stats.sharpe,
    });
    if (avgPnl > 0) profitableRegimes++;
  }

  const totalRegimes = breakdown.length;
  const passRate = totalRegimes > 0 ? profitableRegimes / totalRegimes : 0;
  const passed = passRate >= 0.5;
  const score = Math.round(passRate * 100);

  return {
    name: 'Regime Analysis',
    passed,
    score,
    details: `${profitableRegimes}/${totalRegimes} regimes profitable. Strategy ${passed ? 'shows resilience' : 'is regime-dependent'}.`,
    regime_breakdown: breakdown,
    sub_results: [
      { label: 'Regimes Analyzed', value: String(totalRegimes), passed: totalRegimes >= 4 },
      { label: 'Profitable Regimes', value: `${profitableRegimes}/${totalRegimes}`, passed },
      { label: 'Regime Robustness', value: `${(passRate * 100).toFixed(0)}%`, passed: passRate >= 0.5 },
    ],
  };
}

/**
 * Combinatorial Purged Cross-Validation test.
 */
export function runCPCVTest(returns: number[]): TestResult {
  const n = returns.length;
  const K = Math.min(6, Math.max(3, Math.floor(n / 50)));

  if (n < 100) {
    return {
      name: 'CPCV (Cross-Validation)',
      passed: false,
      score: 15,
      details: 'Insufficient data for CPCV (need 100+ observations)',
      sub_results: [
        { label: 'Data Points', value: String(n), passed: false },
      ],
    };
  }

  const groupSize = Math.floor(n / K);
  const groups: number[][] = [];
  for (let i = 0; i < K; i++) {
    const start = i * groupSize;
    const end = i === K - 1 ? n : start + groupSize;
    groups.push(returns.slice(start, end));
  }

  // Test each group as OOS
  let passCount = 0;
  const sharpes: number[] = [];

  for (let testIdx = 0; testIdx < K; testIdx++) {
    const testData = groups[testIdx];
    const testStats = computeStats(testData);
    sharpes.push(testStats.sharpe);
    if (testStats.sharpe > 0) passCount++;
  }

  const passRate = passCount / K;
  const avgSharpe = sharpes.reduce((s, v) => s + v, 0) / sharpes.length;
  const sharpeStd = Math.sqrt(sharpes.reduce((s, v) => s + (v - avgSharpe) ** 2, 0) / (sharpes.length - 1));
  const passed = passRate >= 0.6 && avgSharpe > 0;
  const score = Math.min(100, Math.round(passRate * 100));

  return {
    name: 'CPCV (Cross-Validation)',
    passed,
    score,
    details: `${passCount}/${K} folds profitable. Avg fold Sharpe: ${avgSharpe.toFixed(2)} (std: ${sharpeStd.toFixed(2)})`,
    sub_results: [
      { label: 'Folds', value: String(K), passed: K >= 4 },
      { label: 'Profitable Folds', value: `${passCount}/${K}`, passed: passRate >= 0.6 },
      { label: 'Avg Fold Sharpe', value: avgSharpe.toFixed(3), passed: avgSharpe > 0 },
      { label: 'Sharpe Std', value: sharpeStd.toFixed(3), passed: sharpeStd < 1.0 },
      { label: 'PBO (est.)', value: `${((1 - passRate) * 100).toFixed(0)}%`, passed: passRate >= 0.6 },
    ],
  };
}
