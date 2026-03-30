# Portfolio & Case Studies Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a two-layer portfolio system (/portfolio hub + /portfolio/[slug] detail pages) that converts $5K-$50K prospects using challenge-outcome storytelling.

**Architecture:** Static content in `portfolio-data.ts` (i18n key references), reusable components in `src/components/portfolio/`, Next.js dynamic routes with per-page SEO metadata. No CMS, no database.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, existing Mnemox design system (ScrollReveal, NumberTicker, BrowserFrame)

**Spec:** `docs/superpowers/specs/2026-03-30-portfolio-case-studies-design.md`

---

### Task 1: Data Layer + Config

**Files:**
- Create: `src/lib/portfolio-data.ts`
- Modify: `src/lib/config.ts`

- [ ] **Step 1: Create portfolio data model and content**

Create `src/lib/portfolio-data.ts` with the `CaseStudy` interface and all 3 featured + 3 secondary project entries. Each translatable field stores an i18n key string (not raw text). Use `TranslationKey` type from existing i18n system.

```typescript
// src/lib/portfolio-data.ts
import type { TranslationKey } from '@/lib/translations/en';

export interface CaseStudyMetric {
  valueKey: TranslationKey;
  labelKey: TranslationKey;
}

export interface SolutionComponent {
  titleKey: TranslationKey;
  descKey: TranslationKey;
}

export interface CaseStudy {
  slug: string;
  nameKey: TranslationKey;
  taglineKey: TranslationKey;
  accentColor: string;
  tags: { labelKey: TranslationKey; color: string }[];
  // Hub
  challengeKey: TranslationKey;
  challengeDescKey: TranslationKey;
  hubMetrics: CaseStudyMetric[];
  hubScreenshot: string;
  // Detail
  overviewKey: TranslationKey;
  impactNumbers: CaseStudyMetric[];
  problemHeadlineKey: TranslationKey;
  problemDescKey: TranslationKey;
  solutionHeadlineKey: TranslationKey;
  solutionComponents: SolutionComponent[];
  screenshots: string[];
  results: (CaseStudyMetric & { contextKey?: TranslationKey })[];
  techStack: string[];
  githubUrl?: string;
  // SEO (raw strings, not i18n — metadata is language-specific at build time)
  metaTitle: string;
  metaDescription: string;
}

export interface SecondaryProject {
  name: string;
  descKey: TranslationKey;
  statKey: TranslationKey;
  statLabelKey: TranslationKey;
  href: string;
}

export const FEATURED_CASES: CaseStudy[] = [
  {
    slug: 'tradememory',
    nameKey: 'p_tm_name',
    taglineKey: 'p_tm_tagline',
    accentColor: '#00e5ff',
    tags: [
      { labelKey: 'p_tag_mcp', color: '#00e5ff' },
      { labelKey: 'p_tag_audit', color: '#00ff88' },
      { labelKey: 'p_tag_opensource', color: '#ffaa00' },
    ],
    challengeKey: 'p_tm_challenge',
    challengeDescKey: 'p_tm_challenge_desc',
    hubMetrics: [
      { valueKey: 'p_tm_m1_val', labelKey: 'p_tm_m1_lbl' },
      { valueKey: 'p_tm_m2_val', labelKey: 'p_tm_m2_lbl' },
      { valueKey: 'p_tm_m3_val', labelKey: 'p_tm_m3_lbl' },
    ],
    hubScreenshot: '/portfolio/tradememory-hub.webp',
    overviewKey: 'p_tm_overview',
    impactNumbers: [
      { valueKey: 'p_tm_i1_val', labelKey: 'p_tm_i1_lbl' },
      { valueKey: 'p_tm_i2_val', labelKey: 'p_tm_i2_lbl' },
      { valueKey: 'p_tm_i3_val', labelKey: 'p_tm_i3_lbl' },
      { valueKey: 'p_tm_i4_val', labelKey: 'p_tm_i4_lbl' },
    ],
    problemHeadlineKey: 'p_tm_problem_h',
    problemDescKey: 'p_tm_problem_desc',
    solutionHeadlineKey: 'p_tm_solution_h',
    solutionComponents: [
      { titleKey: 'p_tm_s1_title', descKey: 'p_tm_s1_desc' },
      { titleKey: 'p_tm_s2_title', descKey: 'p_tm_s2_desc' },
      { titleKey: 'p_tm_s3_title', descKey: 'p_tm_s3_desc' },
      { titleKey: 'p_tm_s4_title', descKey: 'p_tm_s4_desc' },
    ],
    screenshots: ['/portfolio/tradememory-detail-1.webp'],
    results: [
      { valueKey: 'p_tm_r1_val', labelKey: 'p_tm_r1_lbl' },
      { valueKey: 'p_tm_r2_val', labelKey: 'p_tm_r2_lbl' },
      { valueKey: 'p_tm_r3_val', labelKey: 'p_tm_r3_lbl' },
    ],
    techStack: ['Python', 'FastAPI', 'MCP Protocol', 'SQLite', 'Claude API', 'SHA-256'],
    githubUrl: 'https://github.com/mnemox-ai/tradememory-protocol',
    metaTitle: 'TradeMemory Protocol — Case Study | Mnemox AI',
    metaDescription: 'How we built the first persistent memory layer for AI trading agents. 1,233 tests, 17 MCP tools, SHA-256 audit trail.',
  },
  {
    slug: 'nexusos',
    nameKey: 'p_nx_name',
    taglineKey: 'p_nx_tagline',
    accentColor: '#00ff88',
    tags: [
      { labelKey: 'p_tag_dashboard', color: '#00ff88' },
      { labelKey: 'p_tag_agentsdk', color: '#00e5ff' },
      { labelKey: 'p_tag_realtime', color: '#ffaa00' },
    ],
    challengeKey: 'p_nx_challenge',
    challengeDescKey: 'p_nx_challenge_desc',
    hubMetrics: [
      { valueKey: 'p_nx_m1_val', labelKey: 'p_nx_m1_lbl' },
      { valueKey: 'p_nx_m2_val', labelKey: 'p_nx_m2_lbl' },
    ],
    hubScreenshot: '/portfolio/nexusos-hub.webp',
    overviewKey: 'p_nx_overview',
    impactNumbers: [
      { valueKey: 'p_nx_i1_val', labelKey: 'p_nx_i1_lbl' },
      { valueKey: 'p_nx_i2_val', labelKey: 'p_nx_i2_lbl' },
      { valueKey: 'p_nx_i3_val', labelKey: 'p_nx_i3_lbl' },
      { valueKey: 'p_nx_i4_val', labelKey: 'p_nx_i4_lbl' },
    ],
    problemHeadlineKey: 'p_nx_problem_h',
    problemDescKey: 'p_nx_problem_desc',
    solutionHeadlineKey: 'p_nx_solution_h',
    solutionComponents: [
      { titleKey: 'p_nx_s1_title', descKey: 'p_nx_s1_desc' },
      { titleKey: 'p_nx_s2_title', descKey: 'p_nx_s2_desc' },
      { titleKey: 'p_nx_s3_title', descKey: 'p_nx_s3_desc' },
      { titleKey: 'p_nx_s4_title', descKey: 'p_nx_s4_desc' },
    ],
    screenshots: ['/portfolio/nexusos-detail-1.webp'],
    results: [
      { valueKey: 'p_nx_r1_val', labelKey: 'p_nx_r1_lbl' },
      { valueKey: 'p_nx_r2_val', labelKey: 'p_nx_r2_lbl' },
      { valueKey: 'p_nx_r3_val', labelKey: 'p_nx_r3_lbl' },
    ],
    techStack: ['Next.js', 'Claude Agent SDK', 'Supabase', 'WebSocket', 'TypeScript', 'Tailwind'],
    // No githubUrl — private repo
    metaTitle: 'NexusOS AI War Room — Case Study | Mnemox AI',
    metaDescription: 'Command center for AI agent fleets. Real-time WebSocket streaming, decision queue, multi-project orchestration.',
  },
  {
    slug: 'ng-gold',
    nameKey: 'p_ng_name',
    taglineKey: 'p_ng_tagline',
    accentColor: '#ffaa00',
    tags: [
      { labelKey: 'p_tag_mt5', color: '#ffaa00' },
      { labelKey: 'p_tag_risk', color: '#ff3366' },
      { labelKey: 'p_tag_xauusd', color: '#00e5ff' },
    ],
    challengeKey: 'p_ng_challenge',
    challengeDescKey: 'p_ng_challenge_desc',
    hubMetrics: [
      { valueKey: 'p_ng_m1_val', labelKey: 'p_ng_m1_lbl' },
      { valueKey: 'p_ng_m2_val', labelKey: 'p_ng_m2_lbl' },
    ],
    hubScreenshot: '/portfolio/ng-gold-hub.webp',
    overviewKey: 'p_ng_overview',
    impactNumbers: [
      { valueKey: 'p_ng_i1_val', labelKey: 'p_ng_i1_lbl' },
      { valueKey: 'p_ng_i2_val', labelKey: 'p_ng_i2_lbl' },
      { valueKey: 'p_ng_i3_val', labelKey: 'p_ng_i3_lbl' },
      { valueKey: 'p_ng_i4_val', labelKey: 'p_ng_i4_lbl' },
    ],
    problemHeadlineKey: 'p_ng_problem_h',
    problemDescKey: 'p_ng_problem_desc',
    solutionHeadlineKey: 'p_ng_solution_h',
    solutionComponents: [
      { titleKey: 'p_ng_s1_title', descKey: 'p_ng_s1_desc' },
      { titleKey: 'p_ng_s2_title', descKey: 'p_ng_s2_desc' },
      { titleKey: 'p_ng_s3_title', descKey: 'p_ng_s3_desc' },
      { titleKey: 'p_ng_s4_title', descKey: 'p_ng_s4_desc' },
    ],
    screenshots: ['/portfolio/ng-gold-detail-1.webp'],
    results: [
      { valueKey: 'p_ng_r1_val', labelKey: 'p_ng_r1_lbl' },
      { valueKey: 'p_ng_r2_val', labelKey: 'p_ng_r2_lbl' },
      { valueKey: 'p_ng_r3_val', labelKey: 'p_ng_r3_lbl' },
    ],
    techStack: ['MQL5', 'MetaTrader 5', 'Python', 'Textual TUI', 'PostgreSQL', 'WebSocket'],
    // No githubUrl — private repo
    metaTitle: 'NG_Gold Trading System — Case Study | Mnemox AI',
    metaDescription: 'Multi-strategy XAUUSD EA with 9-layer risk control, circuit breakers, and Bloomberg-style monitoring.',
  },
];

export const SECONDARY_PROJECTS: SecondaryProject[] = [
  { name: 'Idea Reality', descKey: 'p_sec_ir_desc', statKey: 'p_sec_ir_stat', statLabelKey: 'p_sec_ir_stat_lbl', href: 'https://github.com/mnemox-ai/idea-reality-mcp' },
  { name: 'deflated-sharpe', descKey: 'p_sec_ds_desc', statKey: 'p_sec_ds_stat', statLabelKey: 'p_sec_ds_stat_lbl', href: 'https://github.com/mnemox-ai/deflated-sharpe' },
  { name: 'anti-resonance', descKey: 'p_sec_ar_desc', statKey: 'p_sec_ar_stat', statLabelKey: 'p_sec_ar_stat_lbl', href: 'https://github.com/mnemox-ai/anti-resonance' },
];
```

- [ ] **Step 2: Update config.ts with portfolio stats**

Add portfolio-specific constants to `src/lib/config.ts`:

Update existing constants and add portfolio-specific ones. Note: `COMBINED_STARS_APPROX` is stale ('680+') — update to match current reality.

```typescript
// Update existing
export const COMBINED_STARS_APPROX = '780+';  // was '680+', updated 2026-03-31

// Add after existing COMBINED_TESTS
export const PORTFOLIO_STATS = {
  totalTests: COMBINED_TESTS,   // derived, not duplicated
  shippedSystems: 4,
  countriesReached: 35,
  githubStars: 780,             // update when stars change
} as const;
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/portfolio-data.ts src/lib/config.ts
git commit -m "feat(portfolio): data layer + config constants"
```

---

### Task 2: i18n Keys (English + Chinese)

**Files:**
- Modify: `src/lib/translations/en.ts`
- Modify: `src/lib/translations/zh.ts`

- [ ] **Step 1: Add all p_* keys to en.ts**

**i18n key prefix: `p_`** (matches existing codebase convention: `svc_`, `tm_`, `live_`).

Add at the end of the `en` object. Full key list with content:

```typescript
// Navigation
nav_portfolio: 'Portfolio',

// Hub — Hero
p_hero_eyebrow: 'OUR WORK',
p_hero_title1: 'AI trading systems',
p_hero_title2: 'built on real capital, not slide decks.',
p_hero_desc: 'Every system here solves a problem we hit ourselves — then hardened to production grade. We ship infrastructure that trades, remembers, and protects.',
p_hero_founder: 'Sean Peng',
p_hero_founder_role: 'CEO, Mnemox AI · Taipei',

// Hub — Metrics labels
p_metrics_tests: 'Tests Passing',
p_metrics_systems: 'Shipped Systems',
p_metrics_countries: 'Countries Reached',
p_metrics_stars: 'GitHub Stars',

// Hub — Section labels
p_label_problem: 'THE PROBLEM',
p_label_challenge: 'THE CHALLENGE',
p_label_solution: 'THE SOLUTION',
p_label_action: 'IN ACTION',
p_label_results: 'RESULTS',
p_label_oss: 'OPEN SOURCE & TOOLS',

// Tags (shared)
p_tag_mcp: 'MCP',
p_tag_audit: 'AUDIT',
p_tag_opensource: 'OPEN SOURCE',
p_tag_dashboard: 'DASHBOARD',
p_tag_agentsdk: 'AGENT SDK',
p_tag_realtime: 'REAL-TIME',
p_tag_mt5: 'MT5',
p_tag_risk: 'RISK ENGINE',
p_tag_xauusd: 'XAUUSD',

// TradeMemory — Hub
p_tm_name: 'TradeMemory Protocol',
p_tm_tagline: 'Persistent memory + audit trail for AI trading agents',
p_tm_challenge: 'AI trading agents forget everything between sessions',
p_tm_challenge_desc: 'Every MCP tool teaches AI how to execute trades. None teach AI how to remember why. Prop firms spend $100K+/year on compliance tools that weren\'t built for AI agents.',
p_tm_m1_val: '1,233', p_tm_m1_lbl: 'Tests',
p_tm_m2_val: '17', p_tm_m2_lbl: 'MCP Tools',
p_tm_m3_val: 'SHA-256', p_tm_m3_lbl: 'Audit Trail',

// TradeMemory — Detail
p_tm_overview: 'The industry\'s first MCP-native memory layer for AI trading agents. 5 memory types (episodic, semantic, procedural, affective, prospective), outcome-weighted recall, and SHA-256 tamper-proof decision records. Open source, MIT licensed, 1,233 tests.',
p_tm_i1_val: '1,233', p_tm_i1_lbl: 'Tests Passing',
p_tm_i2_val: '17', p_tm_i2_lbl: 'MCP Tools',
p_tm_i3_val: '35+', p_tm_i3_lbl: 'REST Endpoints',
p_tm_i4_val: 'SHA-256', p_tm_i4_lbl: 'Tamper Detection',
p_tm_problem_h: 'AI trading agents start every session from zero',
p_tm_problem_desc: 'No memory of past trades. No context for decisions. No audit trail for compliance. Every session is a blank slate, repeating the same mistakes. Prop firms need compliance-grade logging, but existing tools cost $100K+/year and were never designed for AI agents.',
p_tm_solution_h: '5-layer outcome-weighted memory architecture',
p_tm_s1_title: 'Episodic Memory', p_tm_s1_desc: 'Every trade stored with full decision context and power-law decay',
p_tm_s2_title: 'Semantic Memory', p_tm_s2_desc: 'Bayesian strategy beliefs auto-updated from trade outcomes',
p_tm_s3_title: 'Affective State', p_tm_s3_desc: 'EWMA confidence tracking + drawdown-linked risk appetite',
p_tm_s4_title: 'Audit Trail', p_tm_s4_desc: 'SHA-256 tamper-proof decision records aligned with MiFID II',
p_tm_r1_val: '6 months', p_tm_r1_lbl: 'Dev time saved vs in-house build',
p_tm_r2_val: '100%', p_tm_r2_lbl: 'Decision audit coverage',
p_tm_r3_val: '0', p_tm_r3_lbl: 'Compliance gaps',

// NexusOS — Hub
p_nx_name: 'NexusOS',
p_nx_tagline: 'AI War Room — command center for autonomous agents',
p_nx_challenge: 'No single screen to command an AI agent fleet',
p_nx_challenge_desc: 'Managing multiple AI agents across trading, research, and ops meant tab-hopping between terminals. No visibility into what agents decided or why.',
p_nx_m1_val: '5', p_nx_m1_lbl: 'Agent Types',
p_nx_m2_val: 'Real-time', p_nx_m2_lbl: 'WSS Streaming',

// NexusOS — Detail
p_nx_overview: 'Enterprise command center for managing AI agent fleets. Real-time WebSocket streaming, stateful Claude SDK sessions, decision queue, memory pipeline visualization, and multi-project orchestration — all in one dashboard.',
p_nx_i1_val: '5', p_nx_i1_lbl: 'Agent Types',
p_nx_i2_val: 'WSS', p_nx_i2_lbl: 'Real-time Streaming',
p_nx_i3_val: '76', p_nx_i3_lbl: 'Tests',
p_nx_i4_val: 'SSE', p_nx_i4_lbl: 'Chat Streaming',
p_nx_problem_h: 'AI agents run blind — no visibility, no control',
p_nx_problem_desc: 'When you run 5 AI agents across trading, code review, and research, there\'s no way to see what they\'re doing, what they decided, or why. Terminal logs scroll by. Context is lost. Errors go unnoticed until damage is done.',
p_nx_solution_h: 'One screen to monitor, command, and audit every agent',
p_nx_s1_title: 'Agent Dashboard', p_nx_s1_desc: 'Real-time status, memory pipeline, activity feed per project',
p_nx_s2_title: 'Chat Interface', p_nx_s2_desc: 'Stateful Claude SDK sessions with SSE streaming and tool call display',
p_nx_s3_title: 'Decision Queue', p_nx_s3_desc: 'Pending decisions surface for human review before execution',
p_nx_s4_title: 'Event System', p_nx_s4_desc: '6 event namespaces — project, agent, trade, bridge, decision, evolution',
p_nx_r1_val: '1 screen', p_nx_r1_lbl: 'Replaces 5+ terminal tabs',
p_nx_r2_val: 'Real-time', p_nx_r2_lbl: 'Agent monitoring',
p_nx_r3_val: 'Full', p_nx_r3_lbl: 'Decision audit trail',

// NG_Gold — Hub
p_ng_name: 'NG_Gold',
p_ng_tagline: 'Multi-strategy XAUUSD trading system with real-time risk control',
p_ng_challenge: '4 gold strategies, 1 account — without blowing up',
p_ng_challenge_desc: 'Running multiple strategies simultaneously on XAUUSD requires portfolio-level risk control that most MT5 EAs don\'t have. One bad strategy can wipe the others\' gains.',
p_ng_m1_val: '9 layers', p_ng_m1_lbl: 'Risk Control',
p_ng_m2_val: '-3%/day', p_ng_m2_lbl: 'Max Drawdown Cap',

// NG_Gold — Detail
p_ng_overview: 'Production XAUUSD Expert Advisor running 4 independent strategies on a shared risk engine. Per-strategy drawdown caps, portfolio correlation limits, circuit breakers, and Bloomberg-style real-time monitoring. Battle-tested on real capital.',
p_ng_i1_val: '4', p_ng_i1_lbl: 'Strategies',
p_ng_i2_val: '9', p_ng_i2_lbl: 'Risk Layers',
p_ng_i3_val: '108', p_ng_i3_lbl: 'Tests',
p_ng_i4_val: '-50%', p_ng_i4_lbl: 'Kill Switch Trigger',
p_ng_problem_h: 'Multi-strategy gold trading without portfolio-level risk',
p_ng_problem_desc: 'Most MT5 EAs are single-strategy. Running 4 strategies on the same account means correlated drawdowns can compound. Without cross-strategy risk limits, daily caps, and circuit breakers, one bad day can erase weeks of gains.',
p_ng_solution_h: '9-layer risk architecture with automatic circuit breakers',
p_ng_s1_title: 'Per-Strategy Limits', p_ng_s1_desc: 'Daily -3%, weekly -5%, monthly -10% drawdown caps per strategy',
p_ng_s2_title: 'Portfolio Guard', p_ng_s2_desc: 'Max 3 total positions, max 2 same-direction, correlation checks',
p_ng_s3_title: 'Circuit Breakers', p_ng_s3_desc: '-30% drawdown halts trading, -50% kills the EA entirely',
p_ng_s4_title: 'Bloomberg Dashboard', p_ng_s4_desc: 'Real-time TUI with P&L, risk metrics, activity feed, regime detection',
p_ng_r1_val: '4 strategies', p_ng_r1_lbl: 'Running simultaneously',
p_ng_r2_val: '< 3%', p_ng_r2_lbl: 'Max daily drawdown',
p_ng_r3_val: '24/7', p_ng_r3_lbl: 'Automated risk monitoring',

// Secondary projects
p_sec_ir_desc: 'Pre-build reality check for AI agents. Scans 5 platforms in parallel.',
p_sec_ir_stat: '457 ★', p_sec_ir_stat_lbl: 'GitHub Stars · 35+ Countries',
p_sec_ds_desc: 'Overfitting detection for trading strategies. Published on PyPI.',
p_sec_ds_stat: 'PyPI', p_sec_ds_stat_lbl: 'Open Source Package',
p_sec_ar_desc: 'Prevents LLM echo chambers in RAG pipelines. Forces negative case exposure.',
p_sec_ar_stat: 'MIT', p_sec_ar_stat_lbl: 'Licensed · Research-backed',

// Hub — CTA
p_cta_title: 'Have a trading system that needs building?',
p_cta_desc: 'We scope, build, and ship — from audit trails to full AI war rooms.',
p_cta_scarcity: '▸ Founder-led builds — limited availability',
p_cta_primary: 'Describe Your Project',
p_cta_secondary: 'View Services & Pricing →',
p_sticky_text: '4 shipped systems · 1,510+ tests',
p_sticky_scarcity: 'Founder-led — limited availability',
p_sticky_btn: 'Book a Call',

// Detail — CTA
p_detail_cta_title: 'Want something like this for your trading operation?',
p_detail_cta_primary: 'Book a Discovery Call',
p_detail_cta_github: 'View on GitHub →',
p_detail_back: '← Back to Portfolio',
```

- [ ] **Step 2: Add matching keys to zh.ts**

Translate all `p_*` keys to Traditional Chinese. Technical terms (MCP, SHA-256, WebSocket) keep English. Sean Peng's name stays English.

- [ ] **Step 3: Verify TypeScript compiles**

Run: `cd C:/Users/johns/projects/mnemox-web && npx tsc --noEmit`
Expected: no type errors (all new keys are valid `TranslationKey`)

- [ ] **Step 4: Commit**

```bash
git add src/lib/translations/en.ts src/lib/translations/zh.ts
git commit -m "feat(portfolio): i18n keys — english + chinese"
```

---

### Task 3: Hub Page Components

**Files:**
- Create: `src/components/portfolio/MetricsBar.tsx`
- Create: `src/components/portfolio/CaseStudyCard.tsx`
- Create: `src/components/portfolio/SecondaryCard.tsx`
- Create: `src/components/portfolio/StickyCtaBar.tsx`
- Create: `src/components/portfolio/PortfolioHub.tsx`

- [ ] **Step 1: MetricsBar component**

Create `src/components/portfolio/MetricsBar.tsx`:
- Accepts `items: { value: number; label: string }[]`
- 4-column flex on desktop → 2×2 grid on mobile (`max-md:grid-cols-2`)
- Uses `NumberTicker` from `@/components/magicui/number-ticker`
- Styled with `border-t border-b border-border` + mono font for values
- Values use cyan color, labels use txt-dim

- [ ] **Step 2: CaseStudyCard component**

Create `src/components/portfolio/CaseStudyCard.tsx`:
- Props: `case: CaseStudy`, `reversed: boolean` (for alternating layout)
- Desktop: 2-column grid, `reversed` flips column order via `md:order-` classes
- Mobile: always text-first, visual-second (single column)
- Left/text side: "THE PROBLEM" label (text-danger, mono, uppercase, tracking-widest) → headline (text-xl font-semibold) → desc (text-sm text-txt-dim) → metrics row (flex gap-5, big mono numbers in accent color) → "Read full case study →" link (text-cyan)
- Right/visual side: `<Image>` wrapped in the existing `BrowserFrame` component (import from `@/components/services/demo/BrowserFrame`). Add accent glow via `style={{ boxShadow: '0 0 40px ${accentColor}13' }}`
- Aspect ratio 16:10 on visual container
- Whole card wrapped in `<Link href={/portfolio/${slug}}>` for click-through

- [ ] **Step 3: SecondaryCard component**

Create `src/components/portfolio/SecondaryCard.tsx`:
- Props: `project: SecondaryProject`
- Simple card: border border-border rounded-lg p-5, hover → border-cyan/30 bg-cyan/2
- Name (font-semibold text-[15px]) → desc (text-xs text-txt-dim) → stat (text-lg mono cyan) + stat label (text-[9px] uppercase txt-dim)
- Wraps in `<a href={project.href} target="_blank">`

- [ ] **Step 4: StickyCtaBar component**

Create `src/components/portfolio/StickyCtaBar.tsx`:
- Uses IntersectionObserver to show/hide (observe a sentinel element passed as `triggerRef`)
- Fixed bottom, bg-bg/95 backdrop-blur border-t border-cyan/20
- Desktop: flex between text ("4 shipped systems · 1,510+ tests · Founder-led — limited availability") and cyan "Book a Call" button
- Mobile: button only, text hidden (`max-md:hidden` on text span)
- Button links to `/services#booking`

- [ ] **Step 5: PortfolioHub — assemble all sections**

Create `src/components/portfolio/PortfolioHub.tsx` ('use client'):
- Imports: `useI18n`, `ScrollReveal`, `MetricsBar`, `CaseStudyCard`, `SecondaryCard`, `StickyCtaBar`, `FEATURED_CASES`, `SECONDARY_PROJECTS`, `PORTFOLIO_STATS`
- Section 1: Hero (eyebrow + h1 + sub + founder line with gradient avatar)
- Section 2: `<MetricsBar>` with `PORTFOLIO_STATS`
- Section 3: `FEATURED_CASES.map((c, i) => <CaseStudyCard case={c} reversed={i % 2 === 1} />)` — add a `ref` sentinel after first card for sticky bar trigger
- Section 4: secondary section title + 3-col grid (`max-md:grid-cols-1`) of `<SecondaryCard>`
- Section 5: bottom CTA box (gradient bg, headline, scarcity line, two buttons)
- Section 6: `<StickyCtaBar triggerRef={sentinelRef} />`
- Each section wrapped in `<ScrollReveal>`

- [ ] **Step 6: Verify components render**

Run: `cd C:/Users/johns/projects/mnemox-web && npm run dev`
Navigate to http://localhost:3000/portfolio (will 404 until Task 4, but components should compile)

Run: `npx tsc --noEmit`
Expected: no type errors

- [ ] **Step 7: Commit**

```bash
git add src/components/portfolio/
git commit -m "feat(portfolio): hub page components — metrics, cards, sticky CTA"
```

---

### Task 4: Hub Page Route + SEO

**Files:**
- Create: `src/app/portfolio/page.tsx`

- [ ] **Step 1: Create portfolio hub page**

```typescript
// src/app/portfolio/page.tsx
import type { Metadata } from 'next';
import { PortfolioHub } from '@/components/portfolio/PortfolioHub';

export const metadata: Metadata = {
  title: 'Portfolio — AI Trading Systems Shipped to Production | Mnemox AI',
  description: 'Case studies: TradeMemory Protocol, NexusOS War Room, NG_Gold multi-strategy EA. 1,510+ tests, 4 shipped systems, 35+ countries.',
  openGraph: {
    title: 'Portfolio — Mnemox AI',
    description: 'AI trading systems built on real capital, not slide decks.',
    url: 'https://www.mnemox.ai/portfolio',
    images: [{ url: '/assets/og-home.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio — Mnemox AI',
    description: 'AI trading systems built on real capital, not slide decks.',
    images: ['/assets/og-home.png'],
  },
  alternates: { canonical: 'https://www.mnemox.ai/portfolio' },
};

export default function PortfolioPage() {
  return <PortfolioHub />;
}
```

- [ ] **Step 2: Test in browser**

Run: `npm run dev`
Navigate to http://localhost:3000/portfolio
Expected: full hub page renders with all sections. Screenshots will show placeholder/broken images (expected — we haven't captured them yet).

- [ ] **Step 3: Commit**

```bash
git add src/app/portfolio/page.tsx
git commit -m "feat(portfolio): hub page route + SEO metadata"
```

---

### Task 5: Detail Page Components

**Files:**
- Create: `src/components/portfolio/ImpactNumbers.tsx`
- Create: `src/components/portfolio/SolutionGrid.tsx`
- Create: `src/components/portfolio/TechStackPills.tsx`
- Create: `src/components/portfolio/CaseStudyDetail.tsx`

- [ ] **Step 1: ImpactNumbers component**

4-column grid (`max-md:grid-cols-2`). Each cell: value (text-[28px] mono font-bold) + label (text-[11px] txt-dim). Separator lines between cells using gap-[1px] + bg-border trick (like the mockup).

- [ ] **Step 2: SolutionGrid component**

2×2 grid (`max-md:grid-cols-1`). Each card: border border-border rounded-lg p-4. Title (font-semibold accent color) + desc (text-xs txt-dim).

- [ ] **Step 3: TechStackPills component**

Horizontal flex-wrap. Each pill: `px-3 py-1 border border-border rounded-full text-[11px] mono text-txt-dim`.

- [ ] **Step 4: CaseStudyDetail — full detail page template**

Create `src/components/portfolio/CaseStudyDetail.tsx` ('use client'):
- Props: `caseStudy: CaseStudy`
- Section 1: Header — tags row + name (text-[32px]) + tagline (accent color) + overview
- Section 2: `<ImpactNumbers>`
- Section 3: THE CHALLENGE — label (text-danger) + headline + desc
- Section 4: THE SOLUTION — label (text-cyan) + headline + `<SolutionGrid>`
- Section 5: IN ACTION — label (txt-dim) + screenshot(s) in `<BrowserFrame>`
- Section 6: RESULTS — label (text-neon-green) + 3-col metrics
- Section 7: `<TechStackPills>`
- Section 8: CTA — headline + scarcity + buttons (Book a Discovery Call + View on GitHub)
- Each section wrapped in `<ScrollReveal>`, separated by `border-b border-border` with `py-8`
- Back link at top: "← Back to Portfolio" → `/portfolio`

- [ ] **Step 5: Commit**

```bash
git add src/components/portfolio/
git commit -m "feat(portfolio): detail page components — impact, solution, tech, full template"
```

---

### Task 6: Detail Page Route (Dynamic)

**Files:**
- Create: `src/app/portfolio/[slug]/page.tsx`

- [ ] **Step 1: Create dynamic route with generateStaticParams**

```typescript
// src/app/portfolio/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CaseStudyDetail } from '@/components/portfolio/CaseStudyDetail';
import { FEATURED_CASES } from '@/lib/portfolio-data';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return FEATURED_CASES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cs = FEATURED_CASES.find((c) => c.slug === slug);
  if (!cs) return {};
  return {
    title: cs.metaTitle,
    description: cs.metaDescription,
    openGraph: {
      title: cs.metaTitle,
      description: cs.metaDescription,
      url: `https://www.mnemox.ai/portfolio/${slug}`,
      images: [{ url: `/portfolio/${slug}-og.webp`, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title: cs.metaTitle, images: [`/portfolio/${slug}-og.webp`] },
    alternates: { canonical: `https://www.mnemox.ai/portfolio/${slug}` },
    other: {
      'application-ld+json': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: slug,
        description: cs.metaDescription,
        author: { '@type': 'Organization', name: 'Mnemox AI', url: 'https://www.mnemox.ai' },
        url: `https://www.mnemox.ai/portfolio/${slug}`,
        image: `/portfolio/${slug}-og.webp`,
      }),
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const cs = FEATURED_CASES.find((c) => c.slug === slug);
  if (!cs) notFound();
  return <CaseStudyDetail caseStudy={cs} />;
}
```

- [ ] **Step 2: Test all 3 slugs**

Run: `npm run dev`
Navigate to:
- http://localhost:3000/portfolio/tradememory
- http://localhost:3000/portfolio/nexusos
- http://localhost:3000/portfolio/ng-gold
Expected: each renders the detail page template with correct content.

Navigate to http://localhost:3000/portfolio/nonexistent
Expected: 404 page.

- [ ] **Step 3: Commit**

```bash
git add src/app/portfolio/
git commit -m "feat(portfolio): detail page dynamic route + SEO + JSON-LD"
```

---

### Task 7: Navigation + Footer + Sitemap

**Files:**
- Modify: `src/components/layout/Nav.tsx`
- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Add Portfolio to Nav**

In `Nav.tsx`, add a top-level "Portfolio" link next to "Services" (before the Technology dropdown). Use same styling as the Services link but with `text-txt-dim` instead of `text-cyan` (Services is the primary CTA):

```tsx
<Link
  href="/portfolio"
  className="font-mono text-xs tracking-[1.5px] uppercase text-txt-dim no-underline transition-colors hover:text-cyan hover:no-underline"
>
  {t('nav_portfolio')}
</Link>
```

Add `nav_portfolio: 'Portfolio'` to en.ts and `nav_portfolio: '作品集'` to zh.ts (if not already in Task 2).

- [ ] **Step 2: Add Portfolio to Footer**

In `Footer.tsx`, add a Portfolio link in the links row (between Blog and Services):

```tsx
<Link
  href="/portfolio"
  className="font-mono text-xs text-txt-dim no-underline transition-colors hover:text-cyan hover:no-underline"
>
  {t('nav_portfolio')}
</Link>
```

- [ ] **Step 3: Add to sitemap**

Add `/portfolio` and `/portfolio/tradememory`, `/portfolio/nexusos`, `/portfolio/ng-gold` entries. Follow existing sitemap pattern.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Nav.tsx src/components/layout/Footer.tsx src/app/sitemap.ts
git commit -m "feat(portfolio): add to nav, footer, sitemap"
```

---

### Task 8: Screenshot Capture + Placeholder Images

**Files:**
- Create: `public/portfolio/` directory
- Create placeholder images (or capture real screenshots)

- [ ] **Step 1: Create portfolio image directory**

```bash
mkdir -p public/portfolio
```

- [ ] **Step 2: Create placeholder WebP images**

For initial deployment, create colored placeholder images (960×600px) matching each project's accent color. These will be replaced with real screenshots later.

Use a simple script or manually create:
- `public/portfolio/tradememory-hub.webp` — cyan-tinted dark placeholder
- `public/portfolio/nexusos-hub.webp` — green-tinted dark placeholder
- `public/portfolio/ng-gold-hub.webp` — amber-tinted dark placeholder
- `public/portfolio/tradememory-detail-1.webp` — same as hub for now
- `public/portfolio/nexusos-detail-1.webp`
- `public/portfolio/ng-gold-detail-1.webp`

Alternative: use Playwright to capture real screenshots from running apps if they're available locally. The spec lists exact capture targets in "Screenshot Strategy" section.

- [ ] **Step 3: Commit**

```bash
git add public/portfolio/
git commit -m "feat(portfolio): placeholder screenshots"
```

---

### Task 9: Build Verification + Responsive Check

**Files:** None (verification only)

- [ ] **Step 1: Full build**

```bash
cd C:/Users/johns/projects/mnemox-web && npx next build
```
Expected: build succeeds with no errors. All portfolio routes statically generated.

- [ ] **Step 2: Check hub page in browser**

Run `npm run dev`, verify at http://localhost:3000/portfolio:
- Hero renders with "Sean Peng" founder line
- MetricsBar shows animated numbers
- 3 case study cards with alternating layout
- Secondary grid with 3 cards
- Bottom CTA with scarcity line
- Sticky bar appears after scrolling past first case study

- [ ] **Step 3: Check detail page**

Navigate to http://localhost:3000/portfolio/tradememory:
- Back link works
- All 8 sections render
- CTA buttons link correctly

- [ ] **Step 4: Check mobile responsive**

Use browser DevTools → toggle device toolbar → iPhone 14 Pro (390px):
- Metrics bar: 2×2 grid
- Case studies: single column, text above visual
- Secondary: single column
- Sticky bar: button only

- [ ] **Step 5: Check i18n**

Toggle language to 中文 → all portfolio text switches to Chinese.

- [ ] **Step 6: Commit any fixes**

```bash
git add -A && git commit -m "fix(portfolio): build verification + responsive fixes"
```

---

### Task 10: Final Polish + Push

**Files:** Various minor tweaks

- [ ] **Step 1: Run lint**

```bash
cd C:/Users/johns/projects/mnemox-web && npx next lint
```
Fix any lint errors.

- [ ] **Step 2: Verify OG image path**

Check that `/assets/og-home.png` exists and is used as fallback OG image for /portfolio. Per-project OG images (`/portfolio/tradememory-og.webp`) can be created later — fallback is fine for launch.

- [ ] **Step 3: Push to main**

```bash
git push origin main
```
Vercel auto-deploys.

- [ ] **Step 4: Verify on production**

After Vercel deploy completes (~2 min), check:
- https://www.mnemox.ai/portfolio
- https://www.mnemox.ai/portfolio/tradememory
- https://www.mnemox.ai/portfolio/nexusos
- https://www.mnemox.ai/portfolio/ng-gold

- [ ] **Step 5: Update mnemox-web CLAUDE.md**

Add to Recent Changes:
```
- [2026-03-31] feat: Portfolio hub + 3 case study detail pages + nav/footer/sitemap integration
```

Update Current Status with portfolio info.
