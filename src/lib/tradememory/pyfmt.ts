/**
 * Formatting that reproduces what Python prints, so sentences built here
 * (`describe_rule`, `describe_evidence`) and the rounded numbers inside a
 * suggested rule match the reference byte for byte.
 */
import Decimal from 'decimal.js';
import { D } from './decimal';

/**
 * Python `round(x, n)` for floats: round-half-even on the exact binary value
 * (CPython formats with dtoa mode 3, then reads the string back).
 * `toFixed(100)` gives the exact decimal expansion for every double in the
 * ranges this page handles, which is what the tie test has to see:
 * `round(1/32, 4)` is 0.0312 in Python, not the 0.0313 that
 * `Math.round` or `toFixed(4)` would give.
 */
export function pyRound(x: number, n: number): number {
  if (!Number.isFinite(x)) return x;
  const exact = new D(x.toFixed(100));
  return exact.toDecimalPlaces(n, Decimal.ROUND_HALF_EVEN).toNumber();
}

/** Python `f"{x:.{n}f}"` without separators. */
export function pyFixed(x: number, n: number): string {
  if (!Number.isFinite(x)) return String(x);
  const exact = new D(x.toFixed(100));
  return exact.toDecimalPlaces(n, Decimal.ROUND_HALF_EVEN).toFixed(n);
}

/** Python `f"{x:,.{n}f}"`: thousands separators in the integer part. */
export function pyFixedGrouped(x: number, n: number): string {
  const s = pyFixed(x, n);
  const neg = s.startsWith('-');
  const body = neg ? s.slice(1) : s;
  const [int, frac] = body.split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${neg ? '-' : ''}${grouped}${frac !== undefined ? `.${frac}` : ''}`;
}

/** Python `f"{x:.0%}"`: the value times 100 (a float multiply), then `.0f`, then `%`. */
export function pyPercent0(x: number): string {
  return `${pyFixed(x * 100, 0)}%`;
}

/** Python `f"{n:,}"` for an integer. */
export function pyIntGrouped(n: number): string {
  return pyFixedGrouped(n, 0);
}

/** `report._money`: `-$1,234` / `$1,234`, whole units. */
export function money(x: number): string {
  return `${x < 0 ? '-' : ''}$${pyFixedGrouped(Math.abs(x), 0)}`;
}

/** `report._dur`: `1.2d`, `3.5h`, `45m`, or `n/a`. */
export function dur(seconds: number | null): string {
  if (seconds === null) return 'n/a';
  if (seconds >= 86400) return `${pyFixed(seconds / 86400, 1)}d`;
  if (seconds >= 3600) return `${pyFixed(seconds / 3600, 1)}h`;
  return `${pyFixed(seconds / 60, 0)}m`;
}

/**
 * Python `datetime.isoformat()` for a UTC datetime built from epoch
 * milliseconds: `2025-10-10T15:49:47.773000+00:00`, and no fraction at all
 * when the microseconds are zero.
 */
export function pyIso(ms: number): string {
  const d = new Date(ms);
  const p = (n: number, w = 2) => String(n).padStart(w, '0');
  const base = `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())}T${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}`;
  const micro = (ms % 1000) * 1000;
  return `${base}${micro ? `.${p(micro, 6)}` : ''}+00:00`;
}
