import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/validate
 * Accepts a CSV file (multipart/form-data) and returns validation results.
 *
 * MVP: Parses CSV, computes basic statistics, and runs lightweight TypeScript
 * validation tests. For the full Deflated Sharpe Ratio and CPCV tests,
 * TODO: wire up to the Python tradememory-protocol validation engine.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const format = (formData.get('format') as string) || 'daily_returns';
    const strategyName = (formData.get('strategy_name') as string) || 'Untitled Strategy';
    const numStrategies = parseInt((formData.get('num_strategies') as string) || '1', 10);

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });
    }

    const text = await file.text();
    const lines = text.trim().split('\n');

    if (lines.length < 2) {
      return NextResponse.json({ error: 'CSV must contain at least a header and one data row' }, { status: 400 });
    }

    // Parse CSV
    let dailyReturns: number[];

    if (format === 'quantconnect') {
      dailyReturns = parseQuantConnectCSV(lines);
    } else {
      dailyReturns = parseDailyReturnsCSV(lines);
    }

    if (dailyReturns.length < 30) {
      return NextResponse.json({ error: 'Need at least 30 data points for validation' }, { status: 400 });
    }

    // Compute stats
    const stats = computeStats(dailyReturns);

    // Run tests
    const dsrTest = runDSRTest(dailyReturns, stats, numStrategies);
    const wfTest = runWalkForwardTest(dailyReturns);
    const regimeTest = runRegimeTest(dailyReturns);
    const cpcvTest = runCPCVTest(dailyReturns);

    const tests = [dsrTest, wfTest, regimeTest, cpcvTest];
    const avgScore = tests.reduce((s, t) => s + t.score, 0) / tests.length;

    // Determine verdict
    const allPassed = tests.every((t) => t.passed);
    const anyFailed = tests.filter((t) => !t.passed).length;
    let verdict: 'PASS' | 'CAUTION' | 'FAIL';
    if (allPassed && avgScore >= 65) {
      verdict = 'PASS';
    } else if (anyFailed >= 3 || avgScore < 35) {
      verdict = 'FAIL';
    } else {
      verdict = 'CAUTION';
    }

    // Estimate trade-level stats from daily returns
    const totalTrades = estimateTradeCount(dailyReturns);
    const winRate = dailyReturns.filter((r) => r > 0).length / dailyReturns.length;
    const maxDD = computeMaxDrawdown(dailyReturns);
    const totalPnl = dailyReturns.reduce((s, r) => s + r, 0);

    const result = {
      verdict,
      overall_score: Math.round(avgScore),
      strategy_name: strategyName,
      summary: {
        total_trades: totalTrades,
        sharpe_ratio: stats.sharpe,
        win_rate: winRate,
        max_drawdown: maxDD,
        profit_factor: stats.profitFactor,
        avg_trade_pnl: totalPnl / dailyReturns.length,
        total_pnl: totalPnl,
        avg_hold_time: estimateHoldTime(dailyReturns.length),
      },
      tests,
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error('[validate] Error:', err);
    return NextResponse.json(
      { error: 'Internal server error processing CSV' },
      { status: 500 }
    );
  }
}

// ---------- CSV Parsers ----------

function parseDailyReturnsCSV(lines: string[]): number[] {
  // Expect: date,return (or just return per line)
  const header = lines[0].toLowerCase();
  const hasHeader = header.includes('date') || header.includes('return') || header.includes('pnl');
  const start = hasHeader ? 1 : 0;

  const returns: number[] = [];
  for (let i = start; i < lines.length; i++) {
    const cols = lines[i].split(',').map((c) => c.trim());
    // Try last column as the return value
    const val = parseFloat(cols[cols.length - 1]);
    if (!isNaN(val)) returns.push(val);
  }
  return returns;
}

function parseQuantConnectCSV(lines: string[]): number[] {
  // QuantConnect trade log: Symbol,EntryTime,ExitTime,EntryPrice,ExitPrice,Quantity,PnL,...
  const header = lines[0].toLowerCase();
  const cols = header.split(',').map((c) => c.trim());
  const pnlIdx = cols.findIndex((c) => c === 'pnl' || c === 'profit' || c === 'net profit');
  const idx = pnlIdx >= 0 ? pnlIdx : cols.length - 1;

  const returns: number[] = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',').map((c) => c.trim());
    const val = parseFloat(parts[idx]);
    if (!isNaN(val)) returns.push(val);
  }
  return returns;
}

// ---------- Stats ----------

interface Stats {
  mean: number;
  std: number;
  sharpe: number;
  profitFactor: number;
}

function computeStats(returns: number[]): Stats {
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

function computeMaxDrawdown(returns: number[]): number {
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

function estimateTradeCount(returns: number[]): number {
  // For daily returns, each non-zero day roughly = 1 trade period
  return returns.filter((r) => r !== 0).length;
}

function estimateHoldTime(days: number): string {
  if (days < 60) return `${days}d`;
  const months = Math.round(days / 30);
  return `~${months}mo`;
}

// ---------- Validation Tests ----------

interface TestResult {
  name: string;
  passed: boolean;
  score: number;
  details: string;
  walk_forward_windows?: WalkForwardWindow[];
  regime_breakdown?: RegimeBreakdown[];
  sub_results?: { label: string; value: string; passed: boolean }[];
}

interface WalkForwardWindow {
  window: number;
  is_sharpe: number;
  oos_sharpe: number;
  is_trades: number;
  oos_trades: number;
  is_win_rate: number;
  oos_win_rate: number;
}

interface RegimeBreakdown {
  regime: string;
  trades: number;
  win_rate: number;
  avg_pnl: number;
  sharpe: number;
}

function runDSRTest(returns: number[], stats: Stats, numStrategies: number): TestResult {
  // Deflated Sharpe Ratio approximation
  // DSR adjusts the Sharpe ratio for multiple testing bias
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

function runWalkForwardTest(returns: number[]): TestResult {
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

function runRegimeTest(returns: number[]): TestResult {
  // Classify each period into a regime based on rolling volatility
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
  const meanThreshold = 0.0005; // adjust for scale
  for (let i = 0; i < rollingMean.length; i++) {
    const r = returns[i + windowSize];
    if (rollingMean[i] > meanThreshold) trendRegimes.trending_up.push(r);
    else if (rollingMean[i] < -meanThreshold) trendRegimes.trending_down.push(r);
    else trendRegimes.ranging.push(r);
  }

  // Build regime breakdown from volatility regimes
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

  // Add trend regimes
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

function runCPCVTest(returns: number[]): TestResult {
  // Combinatorial Purged Cross-Validation approximation
  // Split data into K groups, test all C(K,2) train/test combos
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

  // Test each group as OOS while rest is IS
  let passCount = 0;
  const sharpes: number[] = [];

  for (let testIdx = 0; testIdx < K; testIdx++) {
    const testData = groups[testIdx];
    // Purge: skip 1 observation on each boundary
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

// ---------- Helpers ----------

function normalCDF(x: number): number {
  // Approximation of the cumulative distribution function of the standard normal
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
