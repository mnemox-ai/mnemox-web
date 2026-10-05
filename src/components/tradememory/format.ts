/** Display formatting for the address page. Parity-sensitive strings live in `@/lib/tradememory/pyfmt`. */
import { pyPercent0 } from '@/lib/tradememory/pyfmt';

export type Lang = 'en' | 'zh';

const MINUS = '−';
const DASH = '–';

export function fmtInt(n: number): string {
  return n.toLocaleString('en-US');
}

/** Whole USDC with a true minus sign: −$97,790. */
export function fmtMoney(x: number): string {
  const abs = Math.abs(x).toLocaleString('en-US', { maximumFractionDigits: 0 });
  return `${x < 0 ? MINUS : ''}$${abs}`;
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

export function fmtDuration(seconds: number | null, units: DurationUnits): string {
  if (seconds === null) return DASH;
  if (seconds >= 86400) return `${(seconds / 86400).toFixed(1)} ${units.d}`;
  if (seconds >= 3600) return `${(seconds / 3600).toFixed(1)} ${units.h}`;
  return `${Math.round(seconds / 60)} ${units.m}`;
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
