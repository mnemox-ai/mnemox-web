import { NextRequest, NextResponse } from 'next/server';
import { rateLimitRequest } from '@/lib/rate-limit';
import {
  computeStats,
  computeMaxDrawdown,
  estimateTradeCount,
  estimateHoldTime,
  parseDailyReturnsCSV,
  parseQuantConnectCSV,
  runDSRTest,
  runWalkForwardTest,
  runRegimeTest,
  runCPCVTest,
} from '@/lib/validation';

// Validation constants
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const MIN_DATA_POINTS = 30;
const RATE_LIMIT_MAX_REQUESTS = 20; // 20 requests per minute per IP
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

/**
 * POST /api/validate
 * Accepts a CSV file (multipart/form-data) and returns validation results.
 *
 * MVP: Parses CSV, computes basic statistics, and runs lightweight TypeScript
 * validation tests. Future: wire up to the Python tradememory-protocol validation engine.
 */
export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const { limited, resetIn } = rateLimitRequest(
      req,
      RATE_LIMIT_MAX_REQUESTS,
      RATE_LIMIT_WINDOW_MS
    );

    if (limited) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil(resetIn / 1000)),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const format = (formData.get('format') as string) || 'daily_returns';
    const strategyName = (formData.get('strategy_name') as string) || 'Untitled Strategy';
    const numStrategies = parseInt((formData.get('num_strategies') as string) || '1', 10);

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });
    }

    const text = await file.text();
    const lines = text.trim().split('\n');

    if (lines.length < 2) {
      return NextResponse.json({ error: 'CSV must contain at least a header and one data row' }, { status: 400 });
    }

    // Parse CSV
    const dailyReturns = format === 'quantconnect'
      ? parseQuantConnectCSV(lines)
      : parseDailyReturnsCSV(lines);

    if (dailyReturns.length < MIN_DATA_POINTS) {
      return NextResponse.json({ error: `Need at least ${MIN_DATA_POINTS} data points for validation` }, { status: 400 });
    }

    // Compute stats
    const stats = computeStats(dailyReturns);

    // Run tests
    const tests = [
      runDSRTest(dailyReturns, stats, numStrategies),
      runWalkForwardTest(dailyReturns),
      runRegimeTest(dailyReturns),
      runCPCVTest(dailyReturns),
    ];
    const avgScore = tests.reduce((s, t) => s + t.score, 0) / tests.length;

    // Determine verdict
    const allPassed = tests.every((t) => t.passed);
    const failedCount = tests.filter((t) => !t.passed).length;
    let verdict: 'PASS' | 'CAUTION' | 'FAIL';
    if (allPassed && avgScore >= 65) {
      verdict = 'PASS';
    } else if (failedCount >= 3 || avgScore < 35) {
      verdict = 'FAIL';
    } else {
      verdict = 'CAUTION';
    }

    // Estimate trade-level stats
    const totalPnl = dailyReturns.reduce((s, r) => s + r, 0);

    const result = {
      verdict,
      overall_score: Math.round(avgScore),
      strategy_name: strategyName,
      summary: {
        total_trades: estimateTradeCount(dailyReturns),
        sharpe_ratio: stats.sharpe,
        win_rate: dailyReturns.filter((r) => r > 0).length / dailyReturns.length,
        max_drawdown: computeMaxDrawdown(dailyReturns),
        profit_factor: stats.profitFactor,
        avg_trade_pnl: totalPnl / dailyReturns.length,
        total_pnl: totalPnl,
        avg_hold_time: estimateHoldTime(dailyReturns.length),
      },
      tests,
    };

    return NextResponse.json(result);
  } catch (err) {
    // Log errors only in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[validate] Error:', err);
    }
    return NextResponse.json(
      { error: 'Internal server error processing CSV' },
      { status: 500 }
    );
  }
}
