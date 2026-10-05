/**
 * Hyperliquid fill history from the public info API. No key, no signature.
 *
 * Port of tradememory-protocol `src/tradememory/sync/hyperliquid.py`.
 *
 * The API returns at most 2,000 fills per call and serves only an address's
 * recent fills (its docs say the 10,000 most recent; an active address
 * returned 18,432 on 2026-10-02), so older history cannot be recovered.
 *
 * Only perpetual fills are turned into trades. Spot fills move balances that
 * deposits and transfers also move, and those are not in the fill feed, so a
 * spot "position" cannot be rebuilt from fills alone.
 *
 * The API answers browsers with `access-control-allow-origin: *`, so this
 * runs entirely client-side: the address is sent to Hyperliquid and nowhere
 * else.
 */
import { D } from './decimal';
import { makeFill, type Fill } from './fills';

export const API_URL = 'https://api.hyperliquid.xyz/info';
export const PAGE_SIZE = 2000;
export const MAX_PAGES = 50; // 100,000 fills; more than any address returned when this was written
export const ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/;

/** One record of the `userFillsByTime` response; only the fields the port reads are typed. */
export interface RawFill {
  coin: string;
  px: string | number;
  sz: string | number;
  side: 'B' | 'A' | string;
  time: number | string;
  startPosition?: string | number | null;
  dir?: string;
  fee: string | number;
  feeToken?: string;
  tid: number | string;
  oid?: number | string | null;
  hash?: string;
  [extra: string]: unknown;
}

export type Post = (body: Record<string, unknown>) => Promise<unknown>;

export interface FetchProgress {
  page: number; // pages received so far
  fills: number; // distinct fills so far
}

export interface RetryNotice {
  attempt: number; // 0-based
  waitMs: number;
  /** HTTP status that caused the retry (429, 500, 502, 503), or null for a network failure / timeout. */
  status: number | null;
}

export const REQUEST_TIMEOUT_MS = 30_000; // the reference's urlopen timeout
const HTTP_RETRIES = 6; // 1+2+4+8+16+30 s: about a minute, the span of the per-minute weight limit
const NETWORK_RETRIES = 4; // 1+2+4+8 s. A 429 served without CORS headers reaches a browser as a
// network failure rather than a status, so this path backs off too instead of giving up at once.

export interface FetchOptions {
  post?: Post;
  startMs?: number;
  onProgress?: (p: FetchProgress) => void;
  onRetry?: (r: RetryNotice) => void;
  signal?: AbortSignal;
}

export class HyperliquidHttpError extends Error {
  readonly status: number;
  constructor(status: number) {
    super(`Hyperliquid answered ${status}`);
    this.name = 'HyperliquidHttpError';
    this.status = status;
  }
}

export class NetworkError extends Error {
  constructor(cause?: unknown) {
    super('could not reach Hyperliquid');
    this.name = 'NetworkError';
    this.cause = cause;
  }
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(signal.reason ?? new DOMException('aborted', 'AbortError'));
    const t = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    function onAbort() {
      clearTimeout(t);
      reject(signal?.reason ?? new DOMException('aborted', 'AbortError'));
    }
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

/** The caller's abort signal joined with a per-request timeout. */
function requestSignal(userSignal: AbortSignal | undefined, timeoutMs: number): { signal: AbortSignal; clear: () => void } {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new DOMException('request timed out', 'TimeoutError')), timeoutMs);
  const forward = () => controller.abort(userSignal?.reason);
  if (userSignal?.aborted) forward();
  else userSignal?.addEventListener('abort', forward, { once: true });
  return {
    signal: controller.signal,
    clear: () => {
      clearTimeout(timer);
      userSignal?.removeEventListener('abort', forward);
    },
  };
}

/**
 * POST with the reference's backoff: 429 (the per-IP weight limit, counted
 * per minute) and 5xx back off for up to about a minute in total before
 * giving up. Each request times out after 30 s like the reference's
 * urlopen; a timeout or any other network failure backs off on its own,
 * shorter, schedule and then surfaces as `NetworkError`. Only the caller's
 * own abort stops the retries.
 */
export function makeBrowserPost(opts: { onRetry?: (r: RetryNotice) => void; signal?: AbortSignal } = {}): Post {
  return async (body) => {
    let httpAttempt = 0;
    let networkAttempt = 0;
    for (;;) {
      if (opts.signal?.aborted) throw opts.signal.reason ?? new DOMException('aborted', 'AbortError');
      const { signal, clear } = requestSignal(opts.signal, REQUEST_TIMEOUT_MS);
      let response: Response;
      try {
        response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal,
          credentials: 'omit',
          referrerPolicy: 'no-referrer',
          cache: 'no-store',
        });
      } catch (err) {
        clear();
        if (opts.signal?.aborted) throw err; // the person cancelled
        if (networkAttempt >= NETWORK_RETRIES) throw new NetworkError(err);
        const waitMs = Math.min(2 ** networkAttempt, 30) * 1000;
        opts.onRetry?.({ attempt: networkAttempt, waitMs, status: null });
        networkAttempt += 1;
        await sleep(waitMs, opts.signal);
        continue;
      }
      clear();
      if (response.ok) return response.json();
      const status = response.status;
      if (![429, 500, 502, 503].includes(status) || httpAttempt >= HTTP_RETRIES) {
        throw new HyperliquidHttpError(status);
      }
      const waitMs = Math.min(2 ** httpAttempt, 30) * 1000;
      opts.onRetry?.({ attempt: httpAttempt, waitMs, status });
      httpAttempt += 1;
      await sleep(waitMs, opts.signal);
    }
  };
}

/**
 * Every retrievable fill for `address` oldest first, deduplicated by trade id,
 * plus whether all came back.
 *
 * `complete` is false when the fetch had to stop early: a full page inside
 * one millisecond (skipped past, its other fills lost) or MAX_PAGES still
 * full. Trades rebuilt from such a history may be missing.
 */
export async function fetchFills(
  address: string,
  options: FetchOptions = {},
): Promise<{ fills: RawFill[]; complete: boolean }> {
  if (!ADDRESS_RE.test(address)) throw new Error(`not a Hyperliquid address: ${address}`);
  const post = options.post ?? makeBrowserPost({ onRetry: options.onRetry, signal: options.signal });
  const seen = new Set<string>();
  const out: RawFill[] = [];
  let cursor = options.startMs ?? 0;
  let complete = true;
  let pages = 0;
  for (; pages < MAX_PAGES; pages++) {
    const page = await post({ type: 'userFillsByTime', user: address, startTime: cursor, aggregateByTime: false });
    if (!Array.isArray(page)) throw new Error(`unexpected response from Hyperliquid: ${JSON.stringify(page).slice(0, 200)}`);
    const rows = page as RawFill[];
    const fresh = rows.filter((f) => !seen.has(`${f.tid}|${f.hash}`));
    for (const f of fresh) seen.add(`${f.tid}|${f.hash}`);
    out.push(...fresh);
    options.onProgress?.({ page: pages + 1, fills: out.length });
    if (rows.length < PAGE_SIZE) break;
    // The next page starts at the last timestamp returned; fills sharing
    // that millisecond come back again and are dropped as duplicates.
    let newest = Math.max(...rows.map((f) => Number(f.time)));
    if (newest <= cursor) {
      // The whole page is one millisecond: asking from the same time
      // would return it again. Move past it.
      complete = false;
      newest = cursor + 1;
    }
    cursor = newest;
  }
  if (pages === MAX_PAGES) complete = false;
  out.sort((a, b) => {
    const ta = Number(a.time);
    const tb = Number(b.time);
    if (ta !== tb) return ta - tb;
    const ia = String(a.tid);
    const ib = String(b.tid);
    return ia < ib ? -1 : ia > ib ? 1 : 0;
  });
  return { fills: out, complete };
}

export function isPerp(raw: RawFill): boolean {
  const coin = String(raw.coin ?? '');
  return !coin.startsWith('@') && !coin.includes('/') && raw.dir !== 'Buy' && raw.dir !== 'Sell';
}

/** One perpetual fill as a Fill. Throws on a malformed record. */
export function toFill(raw: RawFill, address: string): Fill {
  const side = raw.side === 'B' ? 'buy' : raw.side === 'A' ? 'sell' : null;
  if (side === null) throw new Error(`malformed Hyperliquid fill: side ${String(raw.side)}`);
  for (const field of ['coin', 'tid', 'sz', 'px', 'fee', 'time'] as const) {
    if (raw[field] === undefined || raw[field] === null) throw new Error(`malformed Hyperliquid fill: missing ${field}`);
  }
  // Python's Decimal(str(x)) raises on anything that is not a number; decimal.js
  // would accept "NaN" and "Infinity", so reject those here.
  const num = (field: 'sz' | 'px' | 'fee' | 'startPosition') => {
    const d = new D(String(raw[field]));
    if (!d.isFinite()) throw new Error(`malformed Hyperliquid fill: ${field} is ${String(raw[field])}`);
    return d;
  };
  const timeMs = Number(raw.time);
  if (!Number.isFinite(timeMs)) throw new Error(`malformed Hyperliquid fill: time is ${String(raw.time)}`);
  try {
    const fee = num('fee');
    // A fee paid in another token is not comparable to USDC P&L: leave it
    // out and say so, rather than net it at a guessed price. Python's
    // raw.get("feeToken", "USDC") only defaults when the key is absent, so
    // an explicit null counts as "another token".
    const feeKnown = (raw.feeToken === undefined ? 'USDC' : raw.feeToken) === 'USDC';
    return makeFill({
      source: 'hyperliquid',
      account: address.toLowerCase(),
      symbol: String(raw.coin).toUpperCase(),
      side,
      qty: num('sz'),
      price: num('px'),
      fee: feeKnown ? fee : new D(0),
      timeMs,
      fillId: `${raw.tid}`,
      orderId: raw.oid !== undefined && raw.oid !== null ? String(raw.oid) : null,
      startPosition: raw.startPosition !== undefined && raw.startPosition !== null ? num('startPosition') : null,
      feeKnown,
    });
  } catch (err) {
    throw new Error(`malformed Hyperliquid fill: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/** Perpetual fills as Fill, plus the count of spot fills skipped. */
export function perpFills(rawFills: RawFill[], address: string): { fills: Fill[]; spot: number } {
  const fills: Fill[] = [];
  let spot = 0;
  for (const raw of rawFills) {
    if (!isPerp(raw)) {
      spot += 1;
      continue;
    }
    fills.push(toFill(raw, address));
  }
  return { fills, spot };
}
