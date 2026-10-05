/**
 * Turn a venue's fill history into finished trades.
 *
 * Port of tradememory-protocol `src/tradememory/sync/fills.py`, operation
 * for operation. A round trip starts when a symbol's position leaves zero
 * and ends when it returns to zero. Adds and partial exits inside it belong
 * to the same trip; a fill that crosses zero closes one trip and opens the
 * next. P&L is matched first-in, first-out.
 *
 * When a venue reports the position before each fill (Hyperliquid's
 * `startPosition`) and it disagrees with the position the fills so far add
 * up to, the history has a hole (it started mid-position, or fills are
 * missing). The trip in progress is dropped rather than stored with an entry
 * price nobody knows, and tracking resumes once the position is flat again.
 */
import type { Dec } from './decimal';
import { D, ZERO, key, sign } from './decimal';
import { sha256Hex } from './sha256';

export type Side = 'buy' | 'sell';
export type Direction = 'long' | 'short';

export interface Fill {
  source: string;
  account: string;
  symbol: string;
  side: Side;
  qty: Dec; // > 0
  price: Dec; // >= 0: an expiring contract settles at zero
  fee: Dec; // quote currency; a rebate is negative
  timeMs: number; // UTC, milliseconds
  fillId: string;
  orderId: string | null;
  startPosition: Dec | null; // signed position before this fill, when the venue reports it
  feeKnown: boolean; // false: charged in another token, so `fee` is 0 and not netted
}

export function makeFill(f: Fill): Fill {
  if (f.side !== 'buy' && f.side !== 'sell') throw new Error(`side must be 'buy' or 'sell', got ${f.side}`);
  if (f.qty.lte(0)) throw new Error(`fill ${f.fillId}: qty must be positive`);
  if (f.price.lt(0)) throw new Error(`fill ${f.fillId}: price must not be negative`);
  if (!Number.isFinite(f.timeMs)) throw new Error(`fill ${f.fillId}: time must be a number`);
  return f;
}

export function signedQty(f: Fill): Dec {
  return f.side === 'buy' ? f.qty : f.qty.neg();
}

export interface RoundTrip {
  source: string;
  account: string;
  symbol: string;
  direction: Direction;
  entryMs: number;
  exitMs: number;
  openedQty: Dec; // everything added while the position was open
  maxPosition: Dec; // largest absolute size reached
  avgEntry: Dec;
  avgExit: Dec;
  grossPnl: Dec;
  fees: Dec;
  adds: number; // orders that increased the position after the opening order
  fillIds: string[];
  orderIds: string[];
  feesComplete: boolean; // false when a fill's fee was paid in another token
  // Derived, fixed at construction (Python computes them as properties).
  netPnl: Dec;
  notional: Dec; // size at its largest, valued at the average entry price
  holdSeconds: number;
  tripId: string;
}

export interface BuildResult {
  trips: RoundTrip[]; // closed, ordered by exit time
  openPositions: Map<string, Dec>; // symbol -> signed size still open at the end
  dropped: number; // trips discarded because the history had a hole
}

interface Open {
  direction: Direction;
  entryMs: number;
  lots: [Dec, Dec][]; // FIFO [remaining qty, price]
  openedQty: Dec;
  entryCost: Dec;
  exitQty: Dec;
  exitValue: Dec;
  gross: Dec;
  fees: Dec;
  adds: number;
  maxPosition: Dec;
  fillIds: string[];
  orderIds: string[];
  feesComplete: boolean;
}

function touch(trip: Open, fill: Fill): void {
  if (!trip.fillIds.includes(fill.fillId)) trip.fillIds.push(fill.fillId);
  if (fill.orderId && !trip.orderIds.includes(fill.orderId)) trip.orderIds.push(fill.orderId);
  if (!fill.feeKnown) trip.feesComplete = false;
}

/** Python `_id_order`: (time, len(fill_id), fill_id). Numeric ids must not sort as text. */
function idOrder(a: Fill, b: Fill): number {
  if (a.timeMs !== b.timeMs) return a.timeMs - b.timeMs;
  if (a.fillId.length !== b.fillId.length) return a.fillId.length - b.fillId.length;
  return a.fillId < b.fillId ? -1 : a.fillId > b.fillId ? 1 : 0;
}

function start(f: Fill): Dec {
  if (f.startPosition === null) throw new Error('start_position required');
  return f.startPosition;
}

/**
 * `group` ordered so each fill starts where the previous one ended, from `from`.
 *
 * Each fill is a step from its starting position to the position after it,
 * so an order that uses every fill is an Euler trail (Hierholzer). A greedy
 * walk is not enough: when the position comes back to the same size inside
 * one millisecond, the first matching fill can be the wrong branch. Ties go
 * to the lower id. null when no such order exists.
 */
function chain(group: Fill[], from: Dec): Fill[] | null {
  const steps = new Map<string, Fill[]>();
  const desc = [...group].sort((a, b) => idOrder(b, a)); // pop() takes the lowest id
  for (const f of desc) {
    const k = key(start(f));
    const list = steps.get(k);
    if (list) list.push(f);
    else steps.set(k, [f]);
  }
  const stack: [Dec, Fill | null][] = [[from, null]];
  const trail: Fill[] = [];
  while (stack.length) {
    const [node, via] = stack[stack.length - 1];
    const out = steps.get(key(node));
    if (out && out.length) {
      const f = out.pop() as Fill;
      stack.push([start(f).plus(signedQty(f)), f]);
    } else {
      stack.pop();
      if (via !== null) trail.push(via);
    }
  }
  trail.reverse();
  let position = from;
  for (const f of trail) {
    if (!start(f).eq(position)) return null;
    position = position.plus(signedQty(f));
  }
  return trail.length === group.length ? trail : null;
}

/** Where a group's fills start by their own account: one more step out than in. */
function trailStart(group: Fill[]): Dec {
  const balance = new Map<string, { node: Dec; b: number }>();
  const bump = (node: Dec, by: number) => {
    const k = key(node);
    const cur = balance.get(k);
    if (cur) cur.b += by;
    else balance.set(k, { node, b: by });
  };
  for (const f of group) {
    bump(start(f), 1);
    bump(start(f).plus(signedQty(f)), -1);
  }
  for (const { node, b } of balance.values()) if (b === 1) return node;
  return start(group[0]);
}

/** Chain as far as the starting positions allow, then id order. */
function greedy(group: Fill[], from: Dec): Fill[] {
  const remaining = [...group];
  const out: Fill[] = [];
  let current = from;
  while (remaining.length) {
    const idx = remaining.findIndex((f) => start(f).eq(current));
    if (idx === -1) return out.concat(remaining);
    const nxt = remaining[idx];
    remaining.splice(idx, 1);
    out.push(nxt);
    current = start(nxt).plus(signedQty(nxt));
  }
  return out;
}

/**
 * Yield fills in the order they executed.
 *
 * Fills sharing a timestamp (one order sweeping several resting orders) are
 * not numbered in execution order on every venue: Hyperliquid's trade ids
 * inside one millisecond are not sequential. When the venue reports the
 * position before each fill, chain them so each starts where the previous
 * one left off. If the position before the millisecond is not where they
 * start (a hole), chain from where they say they start, so the hole shows
 * up once, at the first fill. Without that report, fall back to id order.
 */
function* executionOrder(series: Fill[], positionNow: () => Dec): Generator<Fill> {
  let i = 0;
  while (i < series.length) {
    let j = i;
    while (j < series.length && series[j].timeMs === series[i].timeMs) j++;
    const group = series.slice(i, j);
    if (group.length > 1 && group.every((f) => f.startPosition !== null)) {
      const now = positionNow();
      yield* chain(group, now) || chain(group, trailStart(group)) || greedy(group, now);
    } else {
      yield* group;
    }
    i = j;
  }
}

function openTrip(f: Fill, qty: Dec, fee: Dec): Open {
  const trip: Open = {
    direction: f.side === 'buy' ? 'long' : 'short',
    entryMs: f.timeMs,
    lots: [[qty, f.price]],
    openedQty: qty,
    entryCost: qty.times(f.price),
    exitQty: ZERO,
    exitValue: ZERO,
    gross: ZERO,
    fees: fee,
    adds: 0,
    maxPosition: qty,
    fillIds: [],
    orderIds: [],
    feesComplete: true,
  };
  touch(trip, f);
  return trip;
}

function finish(trip: Open, last: Fill, symbol: string): RoundTrip {
  const grossPnl = trip.gross;
  const fees = trip.fees;
  const avgEntry = trip.entryCost.div(trip.openedQty);
  const hold = last.timeMs - trip.entryMs;
  const keyText = `${last.account}|${symbol}|${trip.direction}|${trip.fillIds[0]}`;
  return {
    source: last.source,
    account: last.account,
    symbol,
    direction: trip.direction,
    entryMs: trip.entryMs,
    exitMs: last.timeMs,
    openedQty: trip.openedQty,
    maxPosition: trip.maxPosition,
    avgEntry,
    avgExit: trip.exitValue.div(trip.exitQty),
    grossPnl,
    fees,
    adds: trip.adds,
    fillIds: [...trip.fillIds],
    orderIds: [...trip.orderIds],
    feesComplete: trip.feesComplete,
    netPnl: grossPnl.minus(fees),
    notional: trip.maxPosition.times(avgEntry),
    holdSeconds: hold > 0 ? (hold - (hold % 1000)) / 1000 : 0,
    tripId: `${last.source}-${sha256Hex(keyText).slice(0, 16)}`,
  };
}

export function buildRoundTrips(fills: Iterable<Fill>): BuildResult {
  const bySymbol = new Map<string, Fill[]>();
  for (const f of fills) {
    const list = bySymbol.get(f.symbol);
    if (list) list.push(f);
    else bySymbol.set(f.symbol, [f]);
  }

  const trips: RoundTrip[] = [];
  const openPositions = new Map<string, Dec>();
  let dropped = 0;

  for (const [symbol, series] of bySymbol) {
    series.sort(idOrder);
    let position: Dec = ZERO;
    let trip: Open | null = null;
    let blind = false; // inside a position whose entry we never saw
    let counted = false; // the blind stretch's trade was already counted as dropped

    for (const f of executionOrder(series, () => position)) {
      if (f.startPosition !== null && !f.startPosition.eq(position)) {
        // A hole. A trade dropped here, or a blind stretch, counts once
        // however many holes it spans.
        if (trip !== null) {
          dropped += 1;
          trip = null;
          counted = true;
        } else if (!blind) {
          counted = false;
        }
        position = f.startPosition;
        if (blind && position.isZero() && !counted) {
          dropped += 1; // the blind stretch ended inside the hole
        }
        blind = !position.isZero();
      }

      const s = signedQty(f);
      if (blind) {
        const before = position;
        position = position.plus(s);
        if (position.isZero() || sign(position) !== sign(before)) {
          // Flat again, or flipped through zero: the hole is behind us.
          blind = false;
          if (!counted) dropped += 1;
          if (!position.isZero()) {
            trip = openTrip(f, position.abs(), f.fee.times(position.abs()).div(f.qty));
          }
        }
        continue;
      }

      if (position.isZero()) {
        trip = openTrip(f, f.qty, f.fee);
        position = s;
        continue;
      }

      if (trip === null) throw new Error('open position without a trip');
      if (sign(s) === sign(position)) {
        trip.lots.push([f.qty, f.price]);
        trip.openedQty = trip.openedQty.plus(f.qty);
        trip.entryCost = trip.entryCost.plus(f.qty.times(f.price));
        trip.fees = trip.fees.plus(f.fee);
        if (f.orderId === null || !trip.orderIds.includes(f.orderId)) {
          trip.adds += 1; // one order filled in pieces is one add
        }
        touch(trip, f);
        position = position.plus(s);
        trip.maxPosition = D.max(trip.maxPosition, position.abs());
        continue;
      }

      const closing = D.min(f.qty, position.abs());
      const directionSign = trip.direction === 'long' ? 1 : -1;
      let remaining = closing;
      while (remaining.gt(0)) {
        const lot = trip.lots[0];
        const take = D.min(lot[0], remaining);
        trip.gross = trip.gross.plus(f.price.minus(lot[1]).times(take).times(directionSign));
        lot[0] = lot[0].minus(take);
        remaining = remaining.minus(take);
        if (lot[0].isZero()) trip.lots.shift();
      }
      trip.exitQty = trip.exitQty.plus(closing);
      trip.exitValue = trip.exitValue.plus(closing.times(f.price));
      trip.fees = trip.fees.plus(f.fee.times(closing).div(f.qty));
      touch(trip, f);
      position = position.plus(closing.times(sign(s)));

      if (position.isZero()) {
        trips.push(finish(trip, f, symbol));
        trip = null;
        const leftover = f.qty.minus(closing);
        if (leftover.gt(0)) {
          trip = openTrip(f, leftover, f.fee.times(leftover).div(f.qty));
          position = leftover.times(sign(s));
        }
      }
    }

    if (!position.isZero()) openPositions.set(symbol, position);
  }

  trips.sort((a, b) => {
    if (a.exitMs !== b.exitMs) return a.exitMs - b.exitMs;
    return a.tripId < b.tripId ? -1 : a.tripId > b.tripId ? 1 : 0;
  });
  return { trips, openPositions, dropped };
}
