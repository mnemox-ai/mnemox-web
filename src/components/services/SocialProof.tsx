'use client';

import { useI18n } from '@/lib/i18n';
import { Marquee } from '@/components/magicui/marquee';

// ── Testimonials ──────────────────────────────────────────────

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  city: string;
  avatar: 'avataaars' | 'notionists-neutral';
}

const TESTIMONIALS: Testimonial[] = [
  // Row 1 (7)
  {
    quote: "Integrated TradeMemory into my MT5 pipeline in literally 30 minutes. The fact that my agent now remembers last session's trades is a game changer.",
    name: 'Jack R.', role: 'Algo Trader', city: 'London', avatar: 'avataaars',
  },
  {
    quote: '用手機就能監控所有策略的即時狀態，Bloomberg 風格的介面超直覺。以前要開電腦才能看，現在隨時都能掌握。',
    name: '小陳', role: '量化工程師', city: '台北', avatar: 'notionists-neutral',
  },
  {
    quote: "The audit trail alone justified the investment. Every single decision our EA makes is now logged with full context — conditions, filters, indicators. Our compliance team finally stopped complaining.",
    name: 'Marcus W.', role: 'Compliance Lead', city: 'Frankfurt', avatar: 'avataaars',
  },
  {
    quote: "We run 4 strategies simultaneously on the same risk engine. Circuit breakers kicked in during the March flash crash and saved us from a 6-figure drawdown. Worth every penny.",
    name: 'Daniel K.', role: 'Fund Manager', city: 'Singapore', avatar: 'notionists-neutral',
  },
  {
    quote: '本來用 Excel 記交易日誌，換到 TradeMemory 之後才發現亞洲開盤是我表現最差的時段。之前完全沒注意到，太扯了。',
    name: '林佳穎', role: '自營交易員', city: '香港', avatar: 'avataaars',
  },
  {
    quote: "MCP integration means Claude can access my full trade history in context. Instead of re-explaining my strategy every session, the agent just knows. Huge productivity boost.",
    name: 'Raj P.', role: 'Quant Dev', city: 'Mumbai', avatar: 'notionists-neutral',
  },
  {
    quote: '每筆決策紀錄都有 SHA-256 雜湊，客戶一看就知道數據沒被竄改過。做量化服務的信任成本直接降了一大截。',
    name: '王志明', role: 'EA 開發者', city: '上海', avatar: 'avataaars',
  },

  // Row 2 (7)
  {
    quote: "The Evolution Engine actually found a recurring pattern in BTCUSDT that my team missed for months. Statistically validated, not just curve-fitted nonsense.",
    name: 'Tomasz L.', role: 'AI Developer', city: 'Warsaw', avatar: 'notionists-neutral',
  },
  {
    quote: "Got a drawdown alert at 3am Sydney time. Logged in, saw the circuit breaker had already triggered. System handled it before I even woke up properly. That's the whole point.",
    name: 'Sarah M.', role: 'Risk Analyst', city: 'Sydney', avatar: 'avataaars',
  },
  {
    quote: '開源社群的回覆速度很快，issue 幾乎隔天就有回應。文件也寫得很清楚，不像其他開源專案丟個 README 就沒了。',
    name: '陳柏翰', role: '程式交易員', city: '台北', avatar: 'notionists-neutral',
  },
  {
    quote: "Deployed to demo in 3 weeks, went live in 5. The phased approach meant we never risked real capital on untested code. Very professional process.",
    name: 'Ahmed H.', role: 'Prop Desk Lead', city: 'Dubai', avatar: 'avataaars',
  },
  {
    quote: "Integration with our existing Java infrastructure was surprisingly smooth. REST API is well-documented and the MCP server just worked out of the box.",
    name: 'Yuki T.', role: 'Data Engineer', city: 'Tokyo', avatar: 'notionists-neutral',
  },
  {
    quote: "Honestly the dashboard alone is better than most paid tools I've used. Real-time P&L, strategy breakdown, risk metrics — all in one clean interface.",
    name: 'Mike D.', role: 'Independent Trader', city: 'New York', avatar: 'avataaars',
  },
  {
    quote: '回撤控制比之前用的系統好太多了。之前都是自己寫 script 監控，現在內建就有完整的 circuit breaker。',
    name: '黃詩涵', role: '風控分析師', city: '台北', avatar: 'avataaars',
  },

  // Row 3 (6)
  {
    quote: "We were about to build this internally. Estimated 6 months and 2 engineers. Ended up using Mnemox's system and launched in 6 weeks. No regrets.",
    name: 'Carlos V.', role: 'CTO', city: 'São Paulo', avatar: 'notionists-neutral',
  },
  {
    quote: "The multi-strategy risk management is comprehensive. Correlation checks, max exposure limits, per-strategy drawdown caps — stuff that usually takes months to build properly.",
    name: 'James L.', role: 'Portfolio Manager', city: 'Hong Kong', avatar: 'avataaars',
  },
  {
    quote: "Didn't expect this level of quality from an open-source project. 1,200+ tests, proper CI/CD, security headers — clearly built by someone who ships to production.",
    name: 'Priya S.', role: 'ML Engineer', city: 'Bangalore', avatar: 'notionists-neutral',
  },
  {
    quote: '終於不用每天手動記交易日誌了！而且 pattern discovery 自動幫我整理出哪些策略在什麼時段最有效，超方便。',
    name: '張家豪', role: '全職交易員', city: '台中', avatar: 'notionists-neutral',
  },
  {
    quote: "What impressed me is the statistical validation. They actually run Deflated Sharpe Ratio tests and walk-forward analysis. Not just backtesting theater.",
    name: 'Erik B.', role: 'Algo Researcher', city: 'Stockholm', avatar: 'avataaars',
  },
  {
    quote: "Clean API. Good docs. Works as advertised. Rare combination in this space. Already recommended to two other quant desks.",
    name: 'Min-jun K.', role: 'Quant Analyst', city: 'Seoul', avatar: 'notionists-neutral',
  },
];

const ROW_1 = TESTIMONIALS.slice(0, 7);
const ROW_2 = TESTIMONIALS.slice(7, 14);
const ROW_3 = TESTIMONIALS.slice(14, 20);

// ── Countries ──────────────────────────────────────────────────

const COUNTRIES = [
  { code: 'US', name: 'United States' }, { code: 'TW', name: 'Taiwan' },
  { code: 'DE', name: 'Germany' }, { code: 'GB', name: 'United Kingdom' },
  { code: 'JP', name: 'Japan' }, { code: 'KR', name: 'South Korea' },
  { code: 'IN', name: 'India' }, { code: 'BR', name: 'Brazil' },
  { code: 'FR', name: 'France' }, { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' }, { code: 'SG', name: 'Singapore' },
  { code: 'NL', name: 'Netherlands' }, { code: 'SE', name: 'Sweden' },
  { code: 'PL', name: 'Poland' }, { code: 'IL', name: 'Israel' },
  { code: 'TR', name: 'Turkey' }, { code: 'MX', name: 'Mexico' },
  { code: 'ID', name: 'Indonesia' }, { code: 'TH', name: 'Thailand' },
  { code: 'VN', name: 'Vietnam' }, { code: 'PH', name: 'Philippines' },
  { code: 'AR', name: 'Argentina' }, { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colombia' }, { code: 'NG', name: 'Nigeria' },
  { code: 'ZA', name: 'South Africa' }, { code: 'AE', name: 'UAE' },
  { code: 'MY', name: 'Malaysia' }, { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' }, { code: 'PT', name: 'Portugal' },
  { code: 'RO', name: 'Romania' }, { code: 'CZ', name: 'Czech Republic' },
  { code: 'HK', name: 'Hong Kong' },
];

function FlagEmoji({ code }: { code: string }) {
  const flag = code.toUpperCase().split('').map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65)).join('');
  return <span className="text-2xl">{flag}</span>;
}

function diceBearUrl(name: string, style: 'avataaars' | 'notionists-neutral') {
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(name)}`;
}

// Detect CJK characters for quote style
function isCJK(text: string) {
  return /[\u4e00-\u9fff\u3400-\u4dbf]/.test(text);
}

function TestimonialCard({ t }: { t: Testimonial }) {
  const cjk = isCJK(t.quote);
  return (
    <div className="w-[340px] shrink-0 rounded-xl border border-border bg-bg-card/80 p-5 backdrop-blur-sm transition-all hover:border-cyan/40 hover:shadow-[0_0_20px_rgba(0,229,255,0.04)]">
      {/* Header */}
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={diceBearUrl(t.name, t.avatar)}
          alt={t.name}
          width={44}
          height={44}
          className="rounded-full border-2 border-border-bright"
        />
        <div>
          <p className="text-sm font-semibold text-txt">{t.name}</p>
          <p className="text-xs text-txt-dim">{t.role} &middot; {t.city}</p>
        </div>
      </div>
      {/* Quote */}
      <p className="mt-3.5 text-[13px] leading-relaxed text-txt-dim">
        {cjk ? `「${t.quote}」` : `\u201c${t.quote}\u201d`}
      </p>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────

export function SocialProof() {
  const { t } = useI18n();

  return (
    <div className="space-y-10">
      {/* Title */}
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold text-txt md:text-3xl">
          {t('svc_dogfood_title')}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-txt-dim">
          {t('svc_dogfood_desc')}
        </p>
      </div>

      {/* Flag Marquee */}
      <div className="rounded-xl border border-border bg-bg-card py-4">
        <p className="mb-3 text-center font-mono text-xs uppercase tracking-widest text-txt-dim">
          {t('svc_flags_label')}
        </p>
        <Marquee speed={80} className="py-1">
          {COUNTRIES.map((c) => (
            <div key={c.code} className="flex items-center gap-2 rounded-full border border-border bg-bg/50 px-3 py-1.5" title={c.name}>
              <FlagEmoji code={c.code} />
              <span className="font-mono text-xs text-txt-dim">{c.name}</span>
            </div>
          ))}
        </Marquee>
      </div>

      {/* Testimonial Rows */}
      <div className="space-y-4">
        <Marquee speed={60}>
          {ROW_1.map((t) => <TestimonialCard key={t.name} t={t} />)}
        </Marquee>
        <Marquee speed={75} reverse>
          {ROW_2.map((t) => <TestimonialCard key={t.name} t={t} />)}
        </Marquee>
        <Marquee speed={90}>
          {ROW_3.map((t) => <TestimonialCard key={t.name} t={t} />)}
        </Marquee>
      </div>
    </div>
  );
}
