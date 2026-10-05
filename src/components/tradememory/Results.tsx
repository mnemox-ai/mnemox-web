'use client';

import type { RefObject } from 'react';
import { useI18n } from '@/lib/i18n';
import { hasTrades, type Analysis } from '@/lib/tradememory';
import { fmtDate, fmtDateTimeUtc, fmtDuration, fmtHour, fmtInt, fmtMoney, fmtPct } from './format';

function pnlClass(x: number): string {
  if (x < 0) return 'text-[var(--tm-loss)]';
  if (x > 0) return 'text-[var(--tm-gain)]';
  return '';
}

export function Results({
  analysis,
  complete,
  headingRef,
}: {
  analysis: Analysis;
  complete: boolean;
  headingRef: RefObject<HTMLHeadingElement | null>;
}) {
  const { t, lang } = useI18n();
  const p = analysis.patterns;
  if (!hasTrades(p) || !analysis.perpRange) return null;
  const s = analysis.summary;
  const streak = p.after_losing_streak;
  const hold = p.holding;
  const units = { d: t('tm_unit_d'), h: t('tm_unit_h'), m: t('tm_unit_m') };
  const from = fmtDate(analysis.perpRange.fromMs, lang);
  const to = fmtDate(analysis.perpRange.toMs, lang);
  const dropped = s.trades_dropped_for_missing_history;
  const feeOther = s.fills_with_fee_in_another_token_not_netted;
  const showCut = s.fills_fetched >= 10_000 || dropped > 0 || !complete;
  const openList = Object.entries(s.open_positions)
    .map(([symbol, size]) => `${symbol} ${size}`)
    .join(', ');
  const holdMax = Math.max(hold.median_hold_winners_s ?? 0, hold.median_hold_losers_s ?? 0, 1);
  const symbolMax = Math.max(...p.worst_symbols.map((r) => Math.abs(r.net_pnl)), 1);
  const hourMax = Math.max(...p.worst_entry_hours_utc.map((r) => Math.abs(r.net_pnl)), 1);

  return (
    <div>
      {/* This account */}
      <h2 id="tm-results" ref={headingRef} tabIndex={-1} className="tm-h2 scroll-mt-24 focus:outline-none">
        {t('tm_sec_history')}
      </h2>
      <p className="mt-4 break-all font-mono text-sm text-[var(--tm-fg)]">{analysis.address}</p>
      <p className="mt-1 text-sm text-[var(--tm-dim)]">{t('tm_history_window', { from, to, fills: fmtInt(s.fills_fetched) })}</p>
      {(showCut || feeOther > 0 || openList) && (
        <ul className="mt-3 max-w-[44rem] space-y-1 text-sm text-[var(--tm-dim)]">
          {showCut && <li>{t('tm_history_cut', { from })}</li>}
          {dropped > 0 && <li>{dropped === 1 ? t('tm_history_dropped_one') : t('tm_history_dropped', { n: fmtInt(dropped) })}</li>}
          {!complete && <li>{t('tm_history_incomplete')}</li>}
          {feeOther > 0 && <li>{feeOther === 1 ? t('tm_fee_other_token_one') : t('tm_fee_other_token', { n: fmtInt(feeOther) })}</li>}
          {openList && <li className="break-words">{t('tm_open_positions', { positions: openList })}</li>}
        </ul>
      )}

      <dl className="tm-hair mt-10 grid grid-cols-2 gap-x-6 gap-y-8 border-t pt-6 lg:grid-cols-4">
        <Stat label={t('tm_stat_closed')} value={fmtInt(p.trades)} unit={t('tm_stat_closed_unit')} />
        <Stat label={t('tm_stat_winrate')} value={fmtPct(p.win_rate)} unit={t('tm_stat_winrate_unit')} />
        <Stat label={t('tm_stat_net')} value={fmtMoney(p.net_pnl)} unit={t('tm_stat_net_unit')} className={pnlClass(p.net_pnl)} />
        <Stat label={t('tm_stat_fees')} value={fmtMoney(p.fees)} unit={t('tm_stat_fees_unit')} />
      </dl>

      {/* After two losses in a row */}
      <section className="mt-16">
        <h2 className="tm-h2">{t('tm_sec_streak')}</h2>
        {streak.enough_data ? (
          <>
            <p className="tm-lede mt-5">
              {t('tm_streak_lead', { n: fmtInt(streak.trades_after_streak) })}
              {lang === 'zh' ? '' : ' '}
              {t('tm_streak_sized', {
                sized: fmtInt(streak.sized_up),
                share: fmtPct(streak.sized_up_share),
                baseline: fmtPct(streak.baseline_sized_up_share),
              })}
            </p>
            <p className="tm-verdict mt-6">
              <span className="tm-verdict-dot" aria-hidden />
              <span>{streak.more_often_than_usual ? t('tm_streak_more') : t('tm_streak_nosign')}</span>
            </p>
            <dl className="mt-8 grid max-w-[40rem] gap-6 sm:grid-cols-2">
              <div>
                <dt className="tm-label">{t('tm_streak_all', { n: fmtInt(streak.trades_after_streak) })}</dt>
                <dd className="mt-2 text-lg tabular-nums">
                  {t('tm_won', { rate: fmtPct(streak.after_streak_result.win_rate) })}
                  <span className="text-[var(--tm-muted)]"> · </span>
                  <span className={pnlClass(streak.after_streak_result.net_pnl)}>
                    {t('tm_made', { pnl: fmtMoney(streak.after_streak_result.net_pnl) })}
                  </span>
                </dd>
              </div>
              {streak.sized_up > 0 && (
                <div>
                  <dt className="tm-label">{t('tm_streak_sizedup', { n: fmtInt(streak.sized_up) })}</dt>
                  <dd className="mt-2 text-lg tabular-nums">
                    {t('tm_won', { rate: fmtPct(streak.sized_up_result.win_rate) })}
                    <span className="text-[var(--tm-muted)]"> · </span>
                    <span className={pnlClass(streak.sized_up_result.net_pnl)}>
                      {t('tm_made', { pnl: fmtMoney(streak.sized_up_result.net_pnl) })}
                    </span>
                  </dd>
                </div>
              )}
            </dl>
            <p className="mt-5 text-sm text-[var(--tm-muted)]">{t('tm_usual_size', { amount: fmtInt(p.median_notional) })}</p>
          </>
        ) : (
          <p className="tm-lede mt-5">{t('tm_streak_not_enough', { n: fmtInt(streak.trades_after_streak) })}</p>
        )}
      </section>

      {/* How long it holds */}
      <section className="mt-16">
        <h2 className="tm-h2">{t('tm_sec_hold')}</h2>
        {hold.enough_data ? (
          <div className="mt-6 max-w-[40rem]">
            <HoldBar
              label={t('tm_hold_winners')}
              text={fmtDuration(hold.median_hold_winners_s, units)}
              pct={((hold.median_hold_winners_s ?? 0) / holdMax) * 100}
              tone="gain"
            />
            <HoldBar
              label={t('tm_hold_losers')}
              text={fmtDuration(hold.median_hold_losers_s, units)}
              pct={((hold.median_hold_losers_s ?? 0) / holdMax) * 100}
              tone="loss"
            />
            <p className="tm-label mt-4">{t('tm_hold_median')}</p>
          </div>
        ) : (
          <p className="mt-5 text-[var(--tm-dim)]">{t('tm_hold_not_enough')}</p>
        )}
      </section>

      {/* Where it loses */}
      <section className="mt-16">
        <h2 className="tm-h2">{t('tm_sec_where')}</h2>
        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <h3 className="tm-h3 mb-3">{t('tm_worst_symbols')}</h3>
            {p.worst_symbols.length ? (
              <table className="tm-table">
                <thead>
                  <tr>
                    <th scope="col">{t('tm_col_symbol')}</th>
                    <th scope="col" className="tm-num">{t('tm_col_trades')}</th>
                    <th scope="col" className="tm-num">{t('tm_col_won')}</th>
                    <th scope="col" className="tm-num">{t('tm_col_net')}</th>
                  </tr>
                </thead>
                <tbody>
                  {p.worst_symbols.map((r) => (
                    <tr key={r.symbol}>
                      <td className="font-semibold">{r.symbol}</td>
                      <td className="tm-num">{fmtInt(r.trades)}</td>
                      <td className="tm-num">{fmtPct(r.win_rate)}</td>
                      <td className="tm-num">
                        <span className={pnlClass(r.net_pnl)}>{fmtMoney(r.net_pnl)}</span>
                        <span className="tm-lossbar" style={{ width: `${(Math.abs(r.net_pnl) / symbolMax) * 100}%` }} aria-hidden />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-[var(--tm-dim)]">{t('tm_none_symbols')}</p>
            )}
          </div>
          <div>
            <h3 className="tm-h3 mb-3">{t('tm_worst_hours')}</h3>
            {p.worst_entry_hours_utc.length ? (
              <table className="tm-table">
                <thead>
                  <tr>
                    <th scope="col">{t('tm_col_hour')}</th>
                    <th scope="col" className="tm-num">{t('tm_col_trades')}</th>
                    <th scope="col" className="tm-num">{t('tm_col_won')}</th>
                    <th scope="col" className="tm-num">{t('tm_col_net')}</th>
                  </tr>
                </thead>
                <tbody>
                  {p.worst_entry_hours_utc.map((r) => (
                    <tr key={r.hour_utc}>
                      <td className="font-semibold tabular-nums">{fmtHour(r.hour_utc)}</td>
                      <td className="tm-num">{fmtInt(r.trades)}</td>
                      <td className="tm-num">{fmtPct(r.win_rate)}</td>
                      <td className="tm-num">
                        <span className={pnlClass(r.net_pnl)}>{fmtMoney(r.net_pnl)}</span>
                        <span className="tm-lossbar" style={{ width: `${(Math.abs(r.net_pnl) / hourMax) * 100}%` }} aria-hidden />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-[var(--tm-dim)]">{t('tm_none_hours')}</p>
            )}
          </div>
        </div>

        <div className="mt-12">
          <h3 className="tm-h3 mb-3">{t('tm_biggest')}</h3>
          {p.biggest_losses.length ? (
            <table className="tm-table">
              <thead>
                <tr>
                  <th scope="col">{t('tm_col_entry')}</th>
                  <th scope="col">{t('tm_col_trade')}</th>
                  <th scope="col" className="tm-num">{t('tm_col_net')}</th>
                  <th scope="col" className="tm-num">{t('tm_col_held')}</th>
                </tr>
              </thead>
              <tbody>
                {p.biggest_losses.map((r, i) => (
                  <tr key={i}>
                    <td className="font-mono text-sm">{fmtDateTimeUtc(Date.parse(r.entry_time))}</td>
                    <td>
                      <span className="text-[var(--tm-dim)]">{r.direction === 'long' ? t('tm_dir_long') : t('tm_dir_short')}</span>{' '}
                      <span className="font-semibold">{r.symbol}</span>
                    </td>
                    <td className={`tm-num ${pnlClass(r.net_pnl)}`}>{fmtMoney(r.net_pnl)}</td>
                    <td className="tm-num">{fmtDuration(r.hold_seconds, units)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-[var(--tm-dim)]">{t('tm_none_losses')}</p>
          )}
        </div>

        <p className="tm-hair mt-12 border-t pt-4 text-sm text-[var(--tm-dim)]">{t('tm_descriptive')}</p>
      </section>
    </div>
  );
}

function Stat({ label, value, unit, className = '' }: { label: string; value: string; unit: string; className?: string }) {
  return (
    <div>
      <dt className="tm-label">{label}</dt>
      <dd className={`mt-3 whitespace-nowrap text-[clamp(1.25rem,6.4vw,2.75rem)] font-bold leading-none tracking-tight tabular-nums ${className}`}>{value}</dd>
      <dd className="mt-2 text-xs text-[var(--tm-muted)]">{unit}</dd>
    </div>
  );
}

function HoldBar({ label, text, pct, tone }: { label: string; text: string; pct: number; tone: 'gain' | 'loss' }) {
  return (
    <div className="grid grid-cols-[5.5rem_1fr_auto] items-center gap-3 py-2 sm:grid-cols-[7rem_1fr_auto]">
      <span className="text-sm text-[var(--tm-dim)]">{label}</span>
      <span className="h-2 overflow-hidden rounded-full bg-[var(--tm-line)]" aria-hidden>
        <span
          className="block h-full rounded-full"
          style={{ width: `${Math.max(2, Math.min(100, pct))}%`, background: tone === 'gain' ? 'var(--tm-gain)' : 'var(--tm-loss)' }}
        />
      </span>
      <span className="text-base tabular-nums">{text}</span>
    </div>
  );
}
