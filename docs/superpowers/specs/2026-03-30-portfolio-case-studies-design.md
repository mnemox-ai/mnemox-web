# Portfolio & Case Studies — Design Spec

## Overview

A two-layer portfolio system for mnemox.ai: a hub page (`/portfolio`) listing all projects as challenge-outcome stories, and individual case study detail pages (`/portfolio/[slug]`). Target audience: prop firm CTOs ($20K-$50K) and solo algo traders ($5K-$20K) evaluating Mnemox AI as a vendor.

Design references: thoughtbot.com/work (challenge-outcome storytelling for small agency), Linear (tiered hierarchy), AE Studio (impact metrics without Fortune 500 logos).

## Design Decisions

### Audience Strategy: Dual-Read Content
- Enterprise reads: "Professional operation, compliance-ready, proven architecture"
- Solo trader reads: "This person actually trades, he built real systems, he gets it"
- Same content serves both. Hero speaks professional, founder line creates relatability.

### What We Amplify
- 1,510+ combined tests (massive for open source)
- 17 MCP tools, 35+ REST endpoints
- SHA-256 audit trail (zero competition in MCP ecosystem)
- 35+ countries reached, 780+ GitHub stars
- "Built on real capital" — founder eats his own cooking

### What We Hide
- 0 paying customers → use "countries reached" and "GitHub stars" instead
- Evolution Engine 0/150 graduation → only mention "5 memory types"
- OWM permutation test inconclusive → only say "outcome-weighted recall"
- Procedural memory half-built → not mentioned
- No client testimonials → no testimonial section on portfolio (keep it on /services)

---

## Hub Page: `/portfolio`

### Section 1: Hero
- Eyebrow: "OUR WORK" (mono, cyan, uppercase)
- Headline: "AI trading systems **built on real capital,** not slide decks."
- Subtext: "Every system here solves a problem we hit ourselves — then hardened to production grade. We ship infrastructure that trades, remembers, and protects."
- Founder line: Avatar + "**Sean Peng** · CEO, Mnemox AI · Taipei"
- No CTA in hero — let the work speak first.

### Section 2: Aggregate Metrics Bar
Horizontal row, border-top and border-bottom, 4 items:
- **1,510+** Tests Passing (cyan)
- **4** Shipped Systems
- **35+** Countries Reached
- **780+** GitHub Stars

Use `NumberTicker` component (import from `src/components/magicui/number-ticker.tsx`) for scroll-in animation. Values from `config.ts` constants (`PORTFOLIO_STATS`). Update `COMBINED_TESTS` and add `COMBINED_STARS` at implementation time.

### Section 3: Featured Case Studies (×3)
Alternating layout: odd rows = text-left/visual-right, even rows = visual-left/text-right.

Each case study block:
- **"THE PROBLEM"** label (red, mono, uppercase)
- **Challenge headline** (20-22px, bold) — frames the pain
- **1-2 sentence description** — expands the problem, hints at market gap
- **Result metrics** (2-3 items) — big number + label, project accent color
- **"Read full case study →"** link (cyan)
- **Visual** — real screenshot in browser frame mockup (16:10 aspect ratio)

#### Case Study 1: TradeMemory Protocol
- Challenge: "AI trading agents forget everything between sessions"
- Description: "Every MCP tool teaches AI how to execute trades. None teach AI how to remember why. Prop firms spend $100K+/year on compliance tools that weren't built for AI agents."
- Metrics: **1,233** Tests | **17** MCP Tools | **SHA-256** Audit Trail
- Visual: Terminal demo / audit trail JSON screenshot
- Accent: cyan (#00e5ff)

#### Case Study 2: NexusOS
- Challenge: "No single screen to command an AI agent fleet"
- Description: "Managing multiple AI agents across trading, research, and ops meant tab-hopping between terminals. No visibility into what agents decided or why."
- Metrics: **5** Agent Types | **Real-time** WSS Streaming
- Visual: NexusOS dashboard screenshot
- Accent: green (#00ff88)

#### Case Study 3: NG_Gold
- Challenge: "4 gold strategies, 1 account — without blowing up"
- Description: "Running multiple strategies simultaneously on XAUUSD requires portfolio-level risk control that most MT5 EAs don't have. One bad strategy can wipe the others' gains."
- Metrics: **9 layers** Risk Control | **-3%/day** Max Drawdown Cap
- Visual: Bloomberg-style ng-gold-dashboard screenshot
- Accent: amber (#ffaa00)

### Section 4: Secondary Grid — "Open Source & Tools"
Section title: "OPEN SOURCE & TOOLS" (mono, dim, uppercase)
3-column grid of smaller cards:

1. **Idea Reality** — "Pre-build reality check for AI agents" — 457 ★ · 35+ Countries
2. **deflated-sharpe** — "Overfitting detection for trading strategies" — PyPI
3. **anti-resonance** — "Prevents LLM echo chambers in RAG pipelines" — MIT Licensed

Each card: name, 1-line desc, key stat. Hover → cyan border. Click → GitHub repo.

### Section 5: Bottom CTA
- Headline: "Have a trading system that needs building?"
- Subtext: "We scope, build, and ship — from audit trails to full AI war rooms."
- Scarcity: "▸ Founder-led builds — limited availability" (amber, mono)
- Primary CTA: "Describe Your Project" → scrolls to /services#booking
- Secondary CTA: "View Services & Pricing →" → /services

### Section 6: Sticky Bottom Bar
Appears after scrolling past first case study (IntersectionObserver trigger).
- Left: "4 shipped systems · 1,510+ tests · **Founder-led — limited availability**"
- Right: "Book a Call" button (cyan)
- Blur backdrop, subtle top border.

---

## Detail Page: `/portfolio/[slug]`

Dynamic route with content driven by a data file (not CMS). Each case study follows the same template:

### Section 1: Header
- Tag badges (e.g., MCP / AUDIT / OPEN SOURCE) — colored pills
- Project name (32px, bold)
- One-liner tagline (cyan, 16px)
- 2-3 sentence overview paragraph

### Section 2: Impact Numbers
4-column grid, full-width:
- Each cell: big number (28px, mono, cyan) + label below
- Example for TradeMemory: 1,233 Tests | 17 MCP Tools | 35+ Endpoints | SHA-256 Audit

### Section 3: The Challenge
- Label: "THE CHALLENGE" (red, mono)
- Headline summarizing the pain point
- 2-3 sentences expanding the problem with market context

### Section 4: The Solution
- Label: "THE SOLUTION" (cyan, mono)
- Headline summarizing the approach
- 2×2 grid of solution components (icon-free: just title + 1-line desc in bordered cards)

### Section 5: In Action
- Label: "IN ACTION" (dim, mono)
- Full-width screenshot(s) in browser frame mockup
- Optional: 2 screenshots side-by-side for before/after or different views

### Section 6: Results
- Label: "RESULTS" (green, mono)
- 3-column metric cards with large numbers + context text
- Metrics framed as business outcomes, not technical stats

### Section 7: Tech Stack
- Horizontal flex of pill badges showing technologies used
- Monospace, muted color, subtle borders

### Section 8: CTA
- "Want something like this for your trading operation?"
- Scarcity line
- Primary: "Book a Discovery Call"
- Secondary: "View on GitHub →" (for open source projects)

---

## Screenshot Strategy

### Approach: Real Screenshots + Design Packaging
No AI-generated images. All screenshots are real product captures.

### Source Material
| Project | What to Capture | How |
|---------|----------------|-----|
| TradeMemory | `tradememory demo --fast` terminal output | Terminal screenshot, crop to key output |
| TradeMemory | Audit trail JSON (TDR record) | Format JSON, highlight SHA-256 hash |
| NexusOS | Dashboard UI (projects, agents, chat) | Playwright screenshot of running app |
| NG_Gold | ng-gold-dashboard Bloomberg TUI | Terminal screenshot of live dashboard |
| NG_Gold | Decision Logger JSONL output | Terminal screenshot, highlight key fields |

### Packaging
1. **Browser frame mockup** — dark chrome border (rounded corners, 3 dots), matches site dark theme
2. **Consistent aspect ratio** — all 16:10, max-width 960px on detail pages
3. **Subtle glow** — `box-shadow: 0 0 40px rgba(accent, 0.08)` matching project accent color
4. **No annotations on hub page** — clean screenshots. Annotations only on detail pages if needed.

### Implementation
- Capture with Playwright (`page.screenshot()`) or manual terminal capture
- Package with a reusable `<ScreenshotFrame>` component (CSS-only browser chrome)
- Store in `/public/portfolio/` as optimized WebP (Next.js Image component for lazy loading)

---

## Technical Architecture

### File Structure
```
src/app/portfolio/
  page.tsx                    — Hub page (metadata + PortfolioHub component)
  [slug]/page.tsx             — Detail page (dynamic route, metadata per project)

src/components/portfolio/
  PortfolioHub.tsx            — Hub page content
  CaseStudyCard.tsx           — Featured case study block (challenge-outcome layout)
  SecondaryCard.tsx            — Small card for open source tools
  MetricsBar.tsx              — Aggregate stats row with NumberTicker
  StickyCtaBar.tsx            — Floating bottom CTA bar
  CaseStudyDetail.tsx         — Detail page template
  ImpactNumbers.tsx           — 4-column metrics grid
  SolutionGrid.tsx            — 2×2 solution components
  ScreenshotFrame.tsx         — Reuse/extend existing BrowserFrame from src/components/services/demo/BrowserFrame.tsx
  TechStackPills.tsx          — Horizontal tech stack badges

src/lib/portfolio-data.ts     — All case study content (no CMS)
```

### Data Model
```typescript
interface CaseStudy {
  slug: string;
  name: string;
  tagline: string;
  accentColor: string;
  tags: string[];
  // Hub page
  challenge: string;          // headline
  challengeDesc: string;      // 1-2 sentences
  hubMetrics: { value: string; label: string }[];
  hubScreenshot: string;      // path to image
  // Detail page
  overview: string;
  impactNumbers: { value: string; label: string }[];
  problemHeadline: string;
  problemDesc: string;
  solutionHeadline: string;
  solutionComponents: { title: string; desc: string }[];
  screenshots: string[];
  results: { value: string; label: string; context?: string }[];
  techStack: string[];
  githubUrl?: string;
  // SEO
  metaTitle: string;
  metaDescription: string;
}
```

Content lives in `portfolio-data.ts` as a typed array. No database, no CMS. Easy to update.

### i18n
- Add `portfolio_*` keys to `en.ts` and `zh.ts` for ALL translatable strings
- Hub page static text (hero, section titles, CTA) uses `t('portfolio_hero_title')` etc.
- Case study content also uses flat keys: `t('portfolio_tm_challenge')`, `t('portfolio_tm_desc')` etc.
- Follow existing pattern (same as `svc_tier1_name`, `svc_tier1_desc`) — no inline en/zh objects
- `portfolio-data.ts` stores i18n KEY references, not raw strings

### Navigation
- Add "Portfolio" as top-level Nav item next to "Services" (conversion page, not a product)
- Add to Footer links
- Add to sitemap.xml

### SEO
- Each detail page gets unique `<Metadata>` with title, description, OG image
- OG images: use screenshot as base, overlay project name + Mnemox logo (Satori)
- Add JSON-LD `CreativeWork` schema per case study
- Canonical URLs: `https://www.mnemox.ai/portfolio/[slug]`

### Performance
- Screenshots as WebP via Next.js `<Image>` (lazy loading, responsive sizes)
- `ScrollReveal` on each section (existing component)
- `NumberTicker` on metrics (existing component)
- Sticky bar uses IntersectionObserver (same pattern as existing site)

---

## Conversion Elements

| Element | Location | Purpose |
|---------|----------|---------|
| Founder line | Hub hero | Trust — "I trade with what I build" |
| Aggregate metrics | Hub, below hero | Social proof without client logos |
| "SHA-256 Audit" | TradeMemory metrics | Unique differentiator |
| Scarcity signal | Bottom CTA + sticky bar | Urgency — founder-led = limited bandwidth |
| "Describe Your Project" | CTA button text | Lower friction than "Contact Us" |
| Challenge-outcome format | Each case study | Client sees their problem, then your solution |
| Real screenshots | Visual column | Trust — real systems, not mockups |
| GitHub links | Secondary grid + detail pages | Open source = transparency signal |
| Services link | Secondary CTA | Natural flow: portfolio → services → booking |

---

## Responsive Behavior

| Section | Desktop | Mobile (< 768px) |
|---------|---------|-------------------|
| Metrics bar | 4-column flex | 2×2 grid |
| Featured case studies | 2-column (text + visual) | Single column, visual stacks below text |
| Alternating layout | Text-left/visual-right alternates | Always text-first, visual-second |
| Secondary grid | 3-column | Single column |
| Impact numbers (detail) | 4-column | 2×2 grid |
| Solution grid (detail) | 2×2 | Single column |
| Sticky bar | Full width with text + button | Button only, no text |

Follow existing breakpoints: `max-md:` (< 768px) and `max-sm:` (< 640px).

## Loading States
- Screenshots: use Next.js `<Image>` with `placeholder="blur"` and a matching accent-colored blur data URL
- NumberTicker: renders final number immediately on SSR, animates on client hydration
- No skeleton needed — all content is static (from `portfolio-data.ts`)

## Color Notes
- "THE PROBLEM" / "THE CHALLENGE" labels use `#ff3366` (existing `--color-danger` in CSS variables)
- "THE SOLUTION" labels use `#00e5ff` (existing `--color-cyan`)
- "RESULTS" labels use `#00ff88` (existing `--color-neon-green`)
- No new colors introduced

## JSON-LD Schema (Detail Pages)
```json
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "TradeMemory Protocol",
  "description": "...",
  "author": { "@type": "Organization", "name": "Mnemox AI", "url": "https://www.mnemox.ai" },
  "dateCreated": "2026-03-16",
  "url": "https://www.mnemox.ai/portfolio/tradememory",
  "image": "/portfolio/tradememory-og.png",
  "keywords": ["MCP", "trading", "audit", "memory"]
}
```

---

## Out of Scope
- Client testimonials on portfolio page (keep on /services only)
- Video demos (future enhancement)
- Filtering by industry/tech (not enough projects yet)
- CMS integration (content in code is fine for 4 projects)
- AI-generated images
