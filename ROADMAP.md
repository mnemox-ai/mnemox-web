# Mnemox Web Rebuild — ROADMAP

> Next.js 14 + Magic UI + Clerk + Supabase + PayPal
> Created: 2026-03-18

## Phase 1: Foundation ✅
- [x] Next.js 14 scaffold + Tailwind + Magic UI
- [x] i18n system (en/zh, unified)
- [x] Shared layout: Nav, Footer, BackgroundEffects, ScrollReveal
- [x] Shared components: Terminal, PricingCard, FeatureCard, StatsBar

## Phase 2: Pages ✅
- [x] Homepage (hero, product cards, social proof)
- [x] TradeMemory (hero, terminal, features, architecture, install, tools)
- [x] Pricing (4 tiers, billing, FAQ)
- [x] Check (input, gauge, results, PayPal, paid report, SEO)

## Phase 2.5: Code Review Fixes ✅
- [x] Centralize API_BASE + GA_ID to config.ts
- [x] Fix `<Script>` inside `<head>`
- [x] Remove dead onReportReady prop
- [x] Gauge setState no-op guard
- [x] Placeholder timer phase-aware
- [x] Analytics interval cleanup
- [x] Mascot image edge blending

## Phase 2.5b: Deferred Code Quality (TODO)
- [ ] Duplicate GitHub stars fetch (Nav + Home) → use SWR or shared context
- [ ] Inline lang ternary bypassing i18n in PayPalFlow + PaidReport → use t() keys
- [ ] Duplicate card accent stripe → extract AccentCard component
- [x] Clipboard .catch() missing → add error handling
- [ ] Duplicate copy-to-AI logic → extract CopyToAIButton component

## Phase 3: Auth + User System (NEXT)
- [ ] Clerk setup (sign-in, sign-up, user button, middleware)
- [ ] Supabase setup (users, api_keys, subscriptions tables)
- [ ] Dashboard page (`/dashboard`) — API key management, usage stats
- [ ] Subscription flow — PayPal → Supabase record → API key

## Phase 4: Dynamic Data + SEO
- [x] GitHub stars API route (cached 1hr)
- [x] Sitemap generation
- [x] GA integration
- [ ] OG images per page (i18n-aware)
- [ ] Structured data (schema.org) per page

## Phase 2.6: API Response Alignment ✅
- [x] Fix crash: evidence is array of objects, not strings (React can't render objects as children)
- [x] Map API fields: top_similars, duplicate_likelihood, trend, total_ideas_scanned
- [x] Verify Vercel deploy (auto-deploy not working, manual `npx vercel --prod` needed)

## Phase 5: Deployment ✅
- [x] Vercel project setup
- [x] mnemox.ai DNS migration (Namecheap: A record + www CNAME → Vercel)
- [ ] Environment variables (PayPal, Clerk, Supabase, GA)
- [ ] Smoke test all pages + PayPal sandbox
- [x] Go live: DNS cutover
- [ ] Fix Vercel Git integration (auto-deploy on push not triggering)
