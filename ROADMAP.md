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
- [ ] Clipboard .catch() missing → add error handling
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

## Phase 5: Deployment
- [ ] Vercel project setup
- [ ] mnemox.ai DNS migration
- [ ] Environment variables (PayPal, Clerk, Supabase, GA)
- [ ] Smoke test all pages + PayPal sandbox
- [ ] Go live: DNS cutover
