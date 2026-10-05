/**
 * Display formatting for the address page. Every number is rounded the way
 * the Python report rounds it (half-even on the exact value, `pyfmt.ts`), so
 * the page, the rule sentence and `tradememory sync` print the same figures:
 * -1234.5 is -$1,234 everywhere, 150 s is 2 minutes everywhere.
 */
import { pyFixed, pyFixedGrouped, pyPercent0 } from '@/lib/tradememory/pyfmt';

export type Lang = 'en' | 'zh';

const MINUS = '−';
const DASH = '–';

export function fmtInt(n: number): string {
  return pyFixedGrouped(n, 0);
}

/** Whole USDC with a true minus sign: −$97,790. Same rounding as the report's `_money`. */
export function fmtMoney(x: number): string {
  return `${x < 0 ? MINUS : ''}$${pyFixedGrouped(Math.abs(x), 0)}`;
}

/** The report's `:.0%` rounding, so the page and the CLI agree on "46%". */
export function fmtPct(x: number | null): string {
  return x === null ? DASH : pyPercent0(x);
}

export interface DurationUnits {
  d: string;
  h: string;
  m: string;
}

/** The report's `_dur` thresholds and rounding, with the page's unit labels. */
export function fmtDuration(seconds: number | null, units: DurationUnits): string {
  if (seconds === null) return DASH;
  if (seconds >= 86400) return `${pyFixed(seconds / 86400, 1)} ${units.d}`;
  if (seconds >= 3600) return `${pyFixed(seconds / 3600, 1)} ${units.h}`;
  return `${pyFixed(seconds / 60, 0)} ${units.m}`;
}

export function fmtDate(ms: number, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === 'zh' ? 'zh-TW' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(ms));
}

/** 2025-10-10 15:49 (UTC); the column header carries the zone. */
export function fmtDateTimeUtc(ms: number): string {
  const d = new Date(ms);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}`;
}

export function fmtHour(h: number): string {
  return `${String(h).padStart(2, '0')}:00`;
}
