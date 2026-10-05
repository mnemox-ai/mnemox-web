/**
 * Decimal arithmetic matching Python's default `decimal` context, which the
 * reference implementation (tradememory-protocol, `sync/fills.py`) relies on:
 * 28 significant digits, ROUND_HALF_EVEN. Position-chain equality and P&L
 * sums must come out identical to the Python values, so every arithmetic
 * step in this folder goes through `D`, never through floats.
 */
import Decimal from 'decimal.js';

export const D = Decimal.clone({
  precision: 28,
  rounding: Decimal.ROUND_HALF_EVEN,
  // Plain notation always: `toString()` doubles as a value key.
  toExpNeg: -9e15,
  toExpPos: 9e15,
});

export type Dec = Decimal;

export const ZERO = new D(0);

/** A value-based key (Python's Decimal hashes by value: Decimal('1.0') == Decimal('1')). */
export function key(d: Decimal): string {
  return d.isZero() ? '0' : d.toString();
}

/** Python `(x > 0) - (x < 0)`. */
export function sign(d: Decimal): -1 | 0 | 1 {
  if (d.gt(0)) return 1;
  if (d.lt(0)) return -1;
  return 0;
}
