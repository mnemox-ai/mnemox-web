# Mnemox Verified Track Record — Product Spec v0.1

**Status**: Path A.3 stake from `otso-deal-prep/09-strategic-direction-2026-05-15.md`. Stand-alone product if NG_Gold's alpha thesis fails. Complementary cash line if it survives.

**Owner**: Sean Peng (Mnemox AI)
**Authored**: 2026-05-15 overnight session, alongside Path 1 (NG_Gold P0 fixes).

---

## One-sentence pitch

> **Cryptographic forward-anchoring + best-effort backward reconstruction of trading track records, sold to emerging managers, signal sellers, and prop firm graduates who have alpha but can't prove it.**

## Why this exists

Sean's authentic origin story: 7 years of XAUUSD live trading, broker data lost, can't prove the track record. Sean is the **first-paying customer of his own product** — NG_Gold's forward-only verified track (starting 2026-05-15) is the product demo.

The market for "I had alpha but I can't prove it" is genuinely huge:
- Every CTA who switched brokers and lost server-side history
- Every signal seller booted from MyFXBook
- Every emerging manager raising their first $1-25M fund
- Every prop firm graduate who can't take the firm's data with them
- Every funded trader who wants portable track for the next firm

No incumbent serves them. Bloomberg / Eurekahedge / HedgeFundIntelligence index large funds. MyFXBook is broken (terminal hijack vulnerabilities + no cryptographic anchoring). validityBase is narrow (manager-side only). There's a 6-figure-customer-count niche with no real product.

## The customer

Three tiers:

### Tier 1: Emerging hedge fund manager (premium)
- $500-200M AUM, raising first or second fund
- Spinning out of a Tier-1 fund, has 1-3 years live but can't take it
- Needs allocator-credible track record for due diligence
- **ACV: $5-15k/year per manager**
- Volume target: 30-50 managers in year 1

### Tier 2: Signal seller / CTA (volume)
- $5-200M AUM total following them, sells signals on MyFXBook / Darwinex / TradingView / Discord
- Constant fraud accusation pressure — needs cryptographic verification
- **ACV: $500-2,000/year per signal seller**
- Volume target: 300-500 sellers in year 1

### Tier 3: Funded trader / prop firm graduate (entry)
- Just passed FTMO / FundingPips / etc, wants portable track
- **ACV: $99-299/year per trader**
- Volume target: 1,000-3,000 traders in year 1

**Blended ARR ceiling year 1**: $300k-$800k. Conservative target Q4 2026: **$150k ARR**.

## The product (3 surfaces)

### Surface 1: Forward-anchored ledger (the core)

Every trade the customer makes is:
1. Logged by an MQL5 / cTrader / FIX adapter
2. Hashed (SHA-256 content hash) at decision time — includes reasoning, market context, position size
3. Linked into a chained SHA-256 audit ledger (`chained_hash = SHA256(prev_hash || content_hash)`)
4. Daily Merkle root computed over all of customer's hashes for the day
5. Daily root submitted to RFC 3161 TSA (freetsa.org for free tier; eIDAS-qualified TSA for premium tier) — get a notary-grade timestamp
6. Optional: anchor the Merkle root in an OpenTimestamps / Bitcoin transaction for public verifiability

Every customer gets a public verification URL: `mnemox.ai/verify/<customer-id>/<date>` that lets allocators / followers / regulators independently re-derive the daily root from the published trade list.

**This is exactly what TradeMemory Protocol already does** — but repackaged for retail / emerging manager audience, not for AI agent builders.

### Surface 2: Best-effort backward reconstruction (the differentiator)

Most competitors only offer forward-from-now. Sean offers backward-reconstruction:

1. Customer imports any combination of: broker-side server export (CSV / Excel / PDF), email confirmations, bank deposit/withdrawal history, MyFXBook archive, tax filings
2. Mnemox normalises into TDR (Trading Decision Record) format
3. Apply cryptographic chain backwards from the most recent reconstructable date
4. **Mark each reconstructed record with a confidence level**: "broker server export = HIGH", "email-only = MEDIUM", "self-reported = LOW"
5. Publish reconstructed + forward record in a single ledger, labelled honestly

Allocators get: "verified continuous track from <date>; high-confidence reconstruction from <date>; partial reconstruction before that".

**Honest reconstruction beats no record**. validityBase doesn't do this.

### Surface 3: Allocator-facing report (the upsell)

For Tier 1 customers, generate a monthly PDF NAV letter:
- Cryptographically-signed equity curve
- Daily Sharpe, Calmar, max DD
- Cohen's d vs SP500 / XAUUSD benchmark
- Walk-Forward Validation report
- Deflated Sharpe Ratio with multiple-testing correction
- Open positions snapshot (signed timestamp = no cherry-picking)

This is the artefact emerging managers can send to family offices / FoFs / seeders.

## Pricing (initial guesses, revisit after 30 customer signups)

| Tier | Plan | $/yr | What's included |
|---|---|---|---|
| 1 | Manager | $5,000 | Full surface 1+2+3, qualified TSA, monthly NAV PDF, allocator-facing report, white-glove onboarding |
| 1 | Manager Pro | $15,000 | + custom benchmark + co-branded report + 1 hour quarterly allocator-prep call |
| 2 | Signal Seller | $500 | Surface 1 only, freetsa-tier TSA, JSON ledger export, public verify URL |
| 2 | Signal Seller Pro | $2,000 | + Surface 2 (backward reconstruction), public verify URL with branding |
| 3 | Funded Trader | $99 | Surface 1 only, 100 trades / month, freetsa, public verify URL |
| 3 | Funded Trader Pro | $299 | Surface 1 + 1k trades / month, custom verify URL |

Plus a **free tier**: 50 trades / month, basic verify URL, Mnemox-branded — this is the lighthouse for inbound signups + the buyer's data is the next layer of training corpus.

## Tech stack (reuse existing Mnemox assets — minimal new build)

| Layer | Existing | New build needed |
|---|---|---|
| Trade ingestion | TradeMemory MQL5 / Python adapters | cTrader + FIX gateway (3-5 days) |
| Audit chain | `tradememory-protocol/src/tradememory/audit/` | nothing — already shipped |
| TSA | `tradememory-protocol/src/tradememory/audit/tsa.py` (freetsa) | qualified TSA wrapper for Tier 1 (1 day) |
| Backward reconstruction | nothing | new module (1 week) — parse CSV / PDF / email exports |
| DSR / Walk-Forward / CPCV | `tradememory-protocol/src/tradememory/strategy_validator.py` | nothing — already shipped, just needs API endpoint |
| Public verify URL | nothing | Vercel/Cloudflare worker reading from Mnemox API (2 days) |
| Allocator PDF report | nothing | reuse the OTSO proposal PDF builder pattern (`otso-deal-prep/build_arxiv_pdf.py`-style) (3 days) |
| Auth / billing | nothing | Stripe + Clerk (3 days) |
| Customer onboarding | nothing | landing page + email automation (5 days) |

**Total new build: ~3 weeks of focused work** if Sean dedicates one person to it. Stack is mostly existing infrastructure.

## Go-to-market

Three channels matched to three tiers:

### Channel A — Reddit / forum content + product-led growth (Tier 3)
- Write 5-10 posts on r/algotrading, r/forex, r/quantfinance: "How I lost 7 years of track record and what I built to make sure no one else does"
- Free tier on landing page; viral hook = "verified by Mnemox" badge on signal seller profiles
- Cost: $0, time: 2 weeks of consistent posting

### Channel B — Cold outreach to signal sellers (Tier 2)
- Scrape top 200 sellers on MyFXBook, Darwinex, eToro
- Personalised email with their current track record + "here's what an allocator-grade version looks like" (sample PDF)
- Cost: $0-500 for email tools, time: 1 week of writing + send

### Channel C — Allocator-network warm intros (Tier 1)
- Sean's SEA network (Taiwan / HK / SG family offices) — ask for intros to emerging managers they've passed on for lack of track record
- Co-host one webinar with a Tier-1 quant lawyer or fund-admin firm: "Cryptographic track record verification for emerging managers"
- Cost: $1-2k for webinar production, time: 1 month lead time

## 12-month milestones

| Month | Free tier | Tier 3 paid | Tier 2 paid | Tier 1 paid | MRR |
|---|---|---|---|---|---|
| 1 | 0 | 0 | 0 | 0 | $0 (build) |
| 2 | 0 | 0 | 0 | 0 | $0 (build) |
| 3 | 50 | 5 | 0 | 0 | $50 |
| 4 | 150 | 15 | 3 | 0 | $300 |
| 5 | 350 | 30 | 8 | 1 | $1,000 |
| 6 | 700 | 60 | 15 | 2 | $2,800 |
| 7 | 1,200 | 100 | 25 | 4 | $5,000 |
| 8 | 1,800 | 150 | 35 | 6 | $8,000 |
| 9 | 2,500 | 200 | 50 | 10 | $13,000 |
| 10 | 3,200 | 250 | 65 | 14 | $18,000 |
| 11 | 4,000 | 300 | 80 | 18 | $24,000 |
| 12 | 5,000 | 400 | 100 | 25 | $34,000 |
| **ARR end Q4** | **5,000** | **400** | **100** | **25** | **$408k** |

Conservative; assumes Sean spends ~20% of his time on this while the other 80% on NG_Gold + OTSO.

## Honest risk

1. **Sean's own NG_Gold doesn't show alpha** — then the lighthouse customer is broken. Mitigation: pivot the messaging to "honesty as a feature" — Mnemox publishes the negative result on its own ledger, customers see that this is a system where negative results are also surfaced.
2. **Allocators don't care about cryptographic verification** — possible. Mitigation: emphasise the backward reconstruction (Surface 2), which solves a more universal pain.
3. **Regulatory drift** — EU AI Act Article 12 was delayed (per codex finding 2026-05-15). The forcing function is softer than initially modelled. Mitigation: target jurisdictions where regulatory force matters (UK FCA, MAS) or operator markets where reputation + fraud detection are the real drivers (prop firms, signal sellers).
4. **Mem0 / Cognee pivot to finance** — same competitive risk noted in the strategic direction doc. Mitigation: vertical depth (finance-specific normalisation + allocator UX) is where they're slow.

## Next actions (this week, after Sean reads)

1. Buy domain `mnemoxverified.com` (or similar) — $12 one-time
2. Draft landing page (Sean's hand, 2-3 hours)
3. Decide free-tier limit (50 trades/mo? 100?)
4. Cold-email 5 signal sellers on MyFXBook to ask: "If you could prove your track record was untampered from day 1, would you pay $500/year for that?"

If 3 of 5 say yes → green-light the 3-week build.
If <3 of 5 say yes → reframe (different audience or different price).

This is Sean's call. Path 2 only justifies its 3 weeks of build if customer-pull is real.

---

## Related artefacts

- Source thesis: `C:/Users/johns/projects/otso-deal-prep/09-strategic-direction-2026-05-15.md` Section "Path 2"
- Reusable tech: `C:/Users/johns/projects/tradememory-protocol/src/tradememory/audit/` (chain, merkle, tsa)
- Reusable validation: `C:/Users/johns/projects/tradememory-protocol/src/tradememory/strategy_validator.py`
- Lighthouse customer: NG_Gold live track starting 2026-05-15 (post P0 fixes from `NG_Gold/validation/2026-05-15-pre-live/`)

This spec is a stake, not a commitment. It documents the option so Sean can pick it up or drop it deliberately, not by drift.
