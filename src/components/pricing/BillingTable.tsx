'use client';

import { useI18n } from '@/lib/i18n';

const ROWS = [
  { api: 'store_trade()', descKey: 'pricing_api_store_desc' as const, cost: '1 credit', costColor: 'text-amber' },
  { api: 'recall_trades()', descKey: 'pricing_api_recall_desc' as const, costKey: 'pricing_api_free' as const, costColor: 'text-neon-green' },
  { api: 'get_performance()', descKey: 'pricing_api_perf_desc' as const, costKey: 'pricing_api_free' as const, costColor: 'text-neon-green' },
  { api: 'run_reflection()', descKey: 'pricing_api_reflect_desc' as const, cost: '5 credits', costColor: 'text-amber' },
] as const;

export function BillingTable() {
  const { t } = useI18n();

  return (
    <section className="mx-auto max-w-4xl px-5 py-16 sm:px-10">
      <div className="border border-border bg-bg-card p-8 sm:p-12">
        <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
          {t('pricing_billing_title')}
        </h2>
        <p className="mt-3 text-base text-txt-dim">
          {t('pricing_billing_intro')}
        </p>

        {/* Table */}
        <div className="mt-8 overflow-x-auto">
          <table className="w-full font-mono text-sm">
            <thead>
              <tr className="border-b border-border-bright">
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-cyan">
                  {t('pricing_tbl_api')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-cyan">
                  {t('pricing_tbl_action')}
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-widest text-cyan">
                  {t('pricing_tbl_cost')}
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.api} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-cyan">{row.api}</td>
                  <td className="px-4 py-3 text-txt-dim">{t(row.descKey)}</td>
                  <td className={`px-4 py-3 text-center font-bold ${row.costColor}`}>
                    {'costKey' in row ? t(row.costKey) : row.cost}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Notes */}
        <ul className="mt-8 flex flex-col gap-3">
          {(['pricing_billing_3', 'pricing_billing_4', 'pricing_billing_5'] as const).map((key) => (
            <li key={key} className="relative pl-6 text-[15px] leading-relaxed text-txt">
              <span className="absolute left-0 font-bold text-cyan">&rarr;</span>
              {t(key)}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
