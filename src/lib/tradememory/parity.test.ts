/**
 * Parity with the Python reference (tradememory-protocol).
 *
 * Fixtures: `__fixtures__/hlfix/<address>.json` holds raw `userFillsByTime`
 * output as `{address, complete, fills}`; `__fixtures__/hlexpected/<address>.json`
 * is what the Python code computes from it (`scratchpad/expected.py`:
 * summary, loss_patterns, suggest_size_rule, the first 25 round trips).
 * The committed ones are trimmed copies so the repo stays small. Point
 * `TM_FIXTURE_DIR` at a folder with full `hlfix/` and `hlexpected/`
 * subfolders to run the whole sample:
 *
 *   TM_FIXTURE_DIR=path/to/scratchpad npx vitest run
 *
 * Comparison rules: integers, booleans and strings exactly; floats within
 * 1e-9 relative; Decimal strings (`trips_head`, `open_positions`) by value,
 * because Python's `str(Decimal)` keeps trailing zeros that decimal.js
 * normalises away ("-28.6552580" vs "-28.655258"); the suggestion object
 * exactly, including null.
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { analyzeFills } from './analyze';
import { D } from './decimal';
import { pyIso } from './pyfmt';
import { describeEvidence, describeRule, money, suggestSizeRule, type SuggestedRule } from './suggest';
import type { Patterns } from './report';
import { isPerp, perpFills, toFill, type RawFill } from './hyperliquid';

interface RawFixture {
  address: string;
  complete: boolean;
  fills: RawFill[];
}

interface ExpectedTrip {
  symbol: string;
  direction: string;
  entry_time: string;
  exit_time: string;
  net_pnl: string;
  notional: string;
  fees: string;
  max_position: string;
  avg_entry: string;
  avg_exit: string;
  adds: number;
  fees_complete: boolean;
}

interface Expected {
  address: string;
  summary: {
    fills_fetched: number;
    spot_fills_skipped: number;
    closed_trades: number;
    open_positions: Record<string, string>;
    trades_dropped_for_missing_history: number;
    fills_with_fee_in_another_token_not_netted: number;
  };
  patterns: Patterns;
  suggested_rule: SuggestedRule | null;
  trips_head: ExpectedTrip[];
}

const REL_TOL = 1e-9;

function fixtureDirs(): { hlfix: string; hlexpected: string; label: string }[] {
  const dirs = [
    {
      hlfix: path.join(__dirname, '__fixtures__', 'hlfix'),
      hlexpected: path.join(__dirname, '__fixtures__', 'hlexpected'),
      label: 'committed',
    },
  ];
  const full = process.env.TM_FIXTURE_DIR;
  if (full) {
    dirs.push({ hlfix: path.join(full, 'hlfix'), hlexpected: path.join(full, 'hlexpected'), label: 'TM_FIXTURE_DIR' });
  }
  return dirs.filter((d) => existsSync(d.hlfix) && existsSync(d.hlexpected));
}

function cases(): { label: string; address: string; raw: string; expected: string }[] {
  const out: { label: string; address: string; raw: string; expected: string }[] = [];
  for (const d of fixtureDirs()) {
    for (const file of readdirSync(d.hlfix).filter((f) => f.endsWith('.json')).sort()) {
      const expected = path.join(d.hlexpected, file);
      if (!existsSync(expected)) throw new Error(`no expected output for ${file}`);
      out.push({ label: d.label, address: file.replace(/\.json$/, ''), raw: path.join(d.hlfix, file), expected });
    }
  }
  return out;
}

/** Deep compare with the rules above; `where` names the path for the failure message. */
function expectParity(actual: unknown, expected: unknown, where: string): void {
  if (expected === null || typeof expected !== 'object') {
    if (typeof expected === 'number' && typeof actual === 'number') {
      if (Number.isInteger(expected)) {
        expect(actual, where).toBe(expected);
      } else {
        const tol = REL_TOL * Math.max(Math.abs(expected), Math.abs(actual));
        expect(Math.abs(actual - expected) <= tol, `${where}: ${actual} vs ${expected}`).toBe(true);
      }
      return;
    }
    expect(actual, where).toBe(expected);
    return;
  }
  if (Array.isArray(expected)) {
    expect(Array.isArray(actual), where).toBe(true);
    const a = actual as unknown[];
    expect(a.length, `${where}.length`).toBe(expected.length);
    expected.forEach((e, i) => expectParity(a[i], e, `${where}[${i}]`));
    return;
  }
  expect(actual !== null && typeof actual === 'object', where).toBe(true);
  const a = actual as Record<string, unknown>;
  const e = expected as Record<string, unknown>;
  expect(Object.keys(a).sort(), `${where} keys`).toEqual(Object.keys(e).sort());
  for (const k of Object.keys(e)) expectParity(a[k], e[k], `${where}.${k}`);
}

function expectDecimalEqual(actual: string, expected: string, where: string): void {
  expect(new D(actual).eq(new D(expected)), `${where}: ${actual} vs ${expected}`).toBe(true);
}

const all = cases();

describe('Hyperliquid address analysis matches the Python reference', () => {
  it('has fixtures to run', () => {
    expect(all.length).toBeGreaterThan(0);
  });

  for (const c of all) {
    it(`${c.label}: ${c.address}`, () => {
      const raw = JSON.parse(readFileSync(c.raw, 'utf8')) as RawFixture;
      const expected = JSON.parse(readFileSync(c.expected, 'utf8')) as Expected;
      const result = analyzeFills(raw.fills, raw.address);

      // Summary: integers exactly, open positions by Decimal value.
      const { open_positions: expOpen, ...expSummary } = expected.summary;
      const { open_positions: actOpen, ...actSummary } = result.summary;
      expect(actSummary).toEqual(expSummary);
      expect(Object.keys(actOpen).sort()).toEqual(Object.keys(expOpen).sort());
      for (const k of Object.keys(expOpen)) expectDecimalEqual(actOpen[k], expOpen[k], `open_positions.${k}`);

      // loss_patterns output, floats within tolerance.
      expectParity(result.patterns, expected.patterns, 'patterns');

      // The suggestion, exactly (null when null).
      expect(result.suggested_rule).toEqual(expected.suggested_rule);

      // First 25 round trips.
      const head = result.trips.slice(0, 25);
      expect(head.length).toBe(expected.trips_head.length);
      head.forEach((t, i) => {
        const e = expected.trips_head[i];
        const w = `trips_head[${i}]`;
        expect(t.symbol, w).toBe(e.symbol);
        expect(t.direction, w).toBe(e.direction);
        expect(pyIso(t.entryMs), w).toBe(e.entry_time);
        expect(pyIso(t.exitMs), w).toBe(e.exit_time);
        expectDecimalEqual(t.netPnl.toString(), e.net_pnl, `${w}.net_pnl`);
        expectDecimalEqual(t.notional.toString(), e.notional, `${w}.notional`);
        expectDecimalEqual(t.fees.toString(), e.fees, `${w}.fees`);
        expectDecimalEqual(t.maxPosition.toString(), e.max_position, `${w}.max_position`);
        expectDecimalEqual(t.avgEntry.toString(), e.avg_entry, `${w}.avg_entry`);
        expectDecimalEqual(t.avgExit.toString(), e.avg_exit, `${w}.avg_exit`);
        expect(t.adds, w).toBe(e.adds);
        expect(t.feesComplete, w).toBe(e.fees_complete);
      });
    });
  }
});

/**
 * `suggest-cases.json`: loss_patterns output from real addresses plus what
 * Python's suggest_size_rule / describe_rule / describe_evidence return for
 * it. Covers the suggestion path and both "no rule" branches, and pins the
 * Python-style rounding and percent formatting.
 */
interface SuggestCase {
  address: string;
  patterns: Patterns;
  suggested_rule: SuggestedRule | null;
  describe_rule: string | null;
  describe_evidence: string | null;
}

describe('to_fill rejects what Python rejects', () => {
  const good: RawFill = {
    coin: 'BTC', px: '100.5', sz: '0.2', side: 'B', time: 1780407315815, startPosition: '0.0',
    dir: 'Open Long', fee: '0.01', feeToken: 'USDC', tid: 191945580377504, oid: 453175175243, hash: '0xabc',
  };

  it('accepts a well-formed perp fill', () => {
    const f = toFill(good, '0xABC');
    expect(f.account).toBe('0xabc');
    expect(f.feeKnown).toBe(true);
    expect(f.fee.toString()).toBe('0.01');
  });

  it.each([
    ['missing coin', { ...good, coin: undefined }],
    ['missing tid', { ...good, tid: undefined }],
    ['missing px', { ...good, px: undefined }],
    ['missing sz', { ...good, sz: undefined }],
    ['missing fee', { ...good, fee: undefined }],
    ['missing time', { ...good, time: undefined }],
    ['bad side', { ...good, side: 'X' }],
    ['NaN size', { ...good, sz: 'NaN' }],
    ['Infinity price', { ...good, px: 'Infinity' }],
    ['NaN fee', { ...good, fee: 'nan' }],
    ['non-numeric size', { ...good, sz: 'abc' }],
    ['zero size', { ...good, sz: '0' }],
    ['negative price', { ...good, px: '-1' }],
    ['NaN startPosition', { ...good, startPosition: 'NaN' }],
    ['non-numeric time', { ...good, time: 'yesterday' }],
  ])('rejects %s', (_label, raw) => {
    expect(() => toFill(raw as unknown as RawFill, '0xabc')).toThrow();
  });

  it('treats a null feeToken as a fee in another token, like raw.get("feeToken", "USDC")', () => {
    const f = toFill({ ...good, feeToken: null as unknown as string }, '0xabc');
    expect(f.feeKnown).toBe(false);
    expect(f.fee.isZero()).toBe(true);
  });

  it('keeps a Settlement fill at price 0 and skips spot and Buy/Sell rows', () => {
    const settle = toFill({ ...good, px: '0', dir: 'Settlement' }, '0xabc');
    expect(settle.price.isZero()).toBe(true);
    expect(isPerp({ ...good, coin: '@166', dir: 'Buy' })).toBe(false);
    expect(isPerp({ ...good, coin: 'PURR/USDC' })).toBe(false);
    expect(isPerp({ ...good, dir: 'Sell' })).toBe(false);
    const { fills, spot } = perpFills([good, { ...good, coin: '@1', dir: 'Buy' }], '0xabc');
    expect(fills.length).toBe(1);
    expect(spot).toBe(1);
  });
});

describe('money() formats a limit exactly, like the Python helper', () => {
  it.each([
    ['1500', '$1,500'],
    ['94264', '$94,264'],
    ['1', '$1'],
    ['1500.25', '$1,500.25'],
    ['1234567.5', '$1,234,567.5'],
  ])('%s -> %s', (input, out) => {
    expect(money(input)).toBe(out);
  });
});

describe('suggest_size_rule and its sentences match Python', () => {
  const file = path.join(__dirname, '__fixtures__', 'suggest-cases.json');
  const suggestCases = JSON.parse(readFileSync(file, 'utf8')) as SuggestCase[];

  for (const c of suggestCases) {
    it(c.address, () => {
      const rule = suggestSizeRule(c.patterns, `Hyperliquid ${c.address}`);
      expect(rule).toEqual(c.suggested_rule);
      if (rule) {
        expect(describeRule(rule)).toBe(c.describe_rule);
        expect(describeEvidence(rule)).toBe(c.describe_evidence);
      }
    });
  }
});
