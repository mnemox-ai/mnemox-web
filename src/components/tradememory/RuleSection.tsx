'use client';

import { useI18n } from '@/lib/i18n';
import { describeEvidence, describeRule, money, pyFixedGrouped, pyPercent0, whyNoRule, type Analysis } from '@/lib/tradememory';
import type { TranslationKey } from '@/lib/translations/en';

const WHY: Record<string, TranslationKey> = {
  not_enough_after_streak: 'tm_rule_why_not_enough',
  too_few_sized_up: 'tm_rule_why_too_few',
  not_more_often_than_usual: 'tm_rule_why_not_more',
  sized_up_did_not_lose: 'tm_rule_why_no_loss',
};

export function RuleSection({ analysis }: { analysis: Analysis }) {
  const { t, lang } = useI18n();
  const rule = analysis.suggested_rule;

  let sentence = '';
  let evidence = '';
  if (rule) {
    if (lang === 'zh') {
      const e = rule.evidence;
      sentence = t('tm_rule_sentence', { streak: rule.streak, amount: money(rule.max_notional).slice(1) });
      evidence = t('tm_rule_evidence', {
        trades: e.history_trades,
        source: rule.source,
        sized: e.sized_up,
        after: e.trades_after_streak,
        streak: rule.streak,
        share: pyPercent0(e.sized_up_share),
        usual: pyPercent0(e.usual_sized_up_share),
        pnl: `${e.sized_up_net_pnl < 0 ? '-' : ''}$${pyFixedGrouped(Math.abs(e.sized_up_net_pnl), 0)}`,
      });
    } else {
      // The exact sentences `tradememory rules list` prints.
      sentence = describeRule(rule);
      evidence = describeEvidence(rule);
    }
  }
  const why = rule ? null : whyNoRule(analysis.patterns);

  return (
    <section className="tm-wrap tm-hair border-t py-14">
      <h2 className="tm-h2">{t('tm_sec_rule')}</h2>
      {rule ? (
        <>
          <p className="mt-5 max-w-[44rem] text-2xl font-semibold leading-snug sm:text-[1.75rem]">{sentence}</p>
          <p className="mt-4 max-w-[44rem] break-words leading-relaxed text-[var(--tm-dim)]">{evidence}</p>
          <p className="mt-3 max-w-[44rem] text-sm leading-relaxed text-[var(--tm-muted)]">{t('tm_rule_position_note')}</p>
          <div className="mt-8 max-w-[44rem] border-l-2 border-[var(--tm-accent)] pl-5">
            <p className="tm-label text-[var(--tm-accent)]">{t('tm_rule_status')}</p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--tm-dim)]">
              {t('tm_rule_howto_a')}{' '}
              <code className="rounded bg-[#10151b] px-1.5 py-0.5 font-mono text-[13px] text-[var(--tm-fg)]">tradememory rules approve &lt;id&gt;</code>
              {lang === 'zh' ? '' : '.'} {t('tm_rule_howto_b')}
            </p>
          </div>
        </>
      ) : (
        <>
          <p className="mt-5 max-w-[44rem] text-2xl font-semibold leading-snug">{t('tm_rule_none')}</p>
          {why && WHY[why] && <p className="mt-3 max-w-[44rem] leading-relaxed text-[var(--tm-dim)]">{t(WHY[why])}</p>}
        </>
      )}
    </section>
  );
}
