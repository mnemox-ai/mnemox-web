# Mnemox Web — Claude Code 指令

## 專案概述

Mnemox AI 官方網站。Next.js 14 + Tailwind + Magic UI + Clerk + Supabase。

- GitHub: mnemox-ai/mnemox-web
- 部署: Vercel (www.mnemox.ai)
- Default branch: `main`

## 技術棧

- Next.js 16, React 19, TypeScript
- Tailwind CSS + Magic UI components
- Clerk (auth), Supabase (DB), PayPal (payments)
- i18n: custom system (en.ts / zh.ts)

## 開發規範

- `npm run dev` — local dev
- `npx next build` — build check
- Commit message: `type: description`

## 重要檔案

- Layout: `src/components/layout/Nav.tsx`, `Footer.tsx`
- i18n: `src/lib/translations/en.ts`, `zh.ts`
- Pages: `src/app/` (homepage, check, pricing, tradememory, dashboard, live)
- Live: `src/components/live/`, `src/lib/live-data.ts`, `src/app/api/live-status/`
- Auth: `src/middleware.ts`, `src/app/sign-in/`, `src/app/sign-up/`
- Supabase: `src/lib/supabase/server.ts`
- Webhooks: `src/app/api/webhooks/clerk/`, `paypal/`
- Config: `src/lib/config.ts`

## Recent Changes
- [2026-04-03] **Strategy Validator 產品**：/validate 頁面（CSV upload + 4-test validation + Bloomberg-style results + HTML report download）+ /api/validate route（TypeScript DSR/WF/Regime/CPCV 引擎）+ Portfolio case study #4（/portfolio/strategy-validator）。i18n EN+ZH，build pass。
- [2026-03-31] **Portfolio Case Studies**：/portfolio hub page（challenge-outcome storytelling × 3 featured + 3 secondary）+ /portfolio/[slug] detail pages（TradeMemory, NexusOS, NG_Gold）。MetricsBar + CaseStudyCard + StickyCtaBar + ImpactNumbers + SolutionGrid。Nav/Footer/Sitemap 更新。i18n EN+ZH 完整。Placeholder SVGs（待替換真實截圖）。
- [2026-03-30] **Content Audit Round 2**：MCPTools 補齊 2 audit tools（15→17）、版本 0.5.0→0.5.1、/pricing 簡化為 Free+Enterprise（移除 $29/$79 vaporware）、social proof 數字更新（1510+ tests, 780+ stars）、TradeMemory CTA 區分（開始使用→#install）、清理 8 個空翻譯 key。
- [2026-03-30] **Site Audit 修復**：P0（NumberTicker SSR 0→actual, MCP tools 15→17, pricing CTA #waitlist→mailto）、P1（移除 requireAuth gate, Blog i18n, 刪 PayPal webhook）、P2（Footer 重建加 Privacy/Terms/Pricing 連結, blog 改指 /blog）、新增 /privacy + /terms 頁面、sitemap 更新。
- [2026-03-22] **GEO Sprint 完成**：robots.ts 加 AI crawler（GPTBot/ClaudeBot/PerplexityBot）、check/tradememory JSON-LD 修正（SoftwareApplication + $9.99 移除 + featureList/keywords）、llms.txt 加 install 指令 + when-to-use、hero text 改問答式、/blog 基礎建設（layout + index + Nav link + sitemap）、2 篇 GEO 文章（mcp-servers-finance + check-startup-idea）
- [2026-03-22] fix: branch 統一為 `main`（GitHub default + Vercel production branch），刪除 remote `master`
- [2026-03-19] fix: 掃描動畫 HN 不亮 — setInterval+mutable idx closure race condition，改用 setTimeout map
- [2026-03-19] **Idea Reality v2 大改版**：移除 PayPal paywall、Validation Badge（Satori OG + verdict labels）、ShareBadge UI、GapRadar 群眾智慧、/pulse 趨勢頁、/badge/[hash] 落地頁、國家名稱映射、掃描動畫修復、Supabase service client 修正、中文 pivot hints 前端 lang 傳遞
- [2026-03-19] feat: /pulse 頁面（Recharts LineChart + BarChart + country pills + trending cards + NumberTicker + i18n + sitemap + Nav link）
- [2026-03-19] Vercel Analytics 上線（@vercel/analytics + GA4 雙追蹤）
- [2026-03-19] **Live Dashboard Step 2: Multi-Strategy**：2 策略卡片（E + C）、點擊切換、/api/live-summaries + /api/live-status?strategy= 、StrategySummaryCard、LiveBanner 聚合、i18n 中英、OG image 多策略、Strategy C 337 筆 backtest seeded
- [2026-03-19] Dynamic OG image for /live：Satori ImageResponse 即時生成 1200×630 PNG，顯示 win rate / trades / paper / position 狀態，5 min ISR cache
- [2026-03-19] Session 2.5: Nav top-level LIVE link + LiveBanner on /tradememory + 60s auto-refresh + sitemap /live + OG twitter card + code health (i18n keys 補全, TradeTable 修正) + security review PASS
- [2026-03-18] fix: direction 欄位名對齊 Supabase（was side），Dir 欄位 LONG badge 正常顯示
- [2026-03-18] /live 頁面上線：equity chart (lightweight-charts) + StatusCard + StatsCard + TradeTable + i18n 中英切換 + Nav dropdown 加 Live Dashboard
- [2026-03-18] Clerk 切 production：pk_live + sk_live keys，Google OAuth custom credentials，5 DNS CNAME records
- [2026-03-18] Phase 4 OG + Schema.org：root layout OG/Twitter/Organization schema，tradememory layout 新建，pricing 加 OG image + Product schema，check URL 統一 www.mnemox.ai
- [2026-03-18] Vercel redeploy with production Clerk keys
- [2026-03-18] fix: ensureUser upsert 解決 FK violation，API key 產生/撤銷正常
- [2026-03-18] Supabase project 建立 + schema.sql 跑完 + Vercel env vars 設定完成
- [2026-03-18] Phase 3: Clerk auth + Supabase + Dashboard + Webhooks + CTA auth gate

## Current Status
- **2026-04-03 Strategy Validator 上線**：/validate 頁面 + /api/validate + portfolio #4。Ray Chou 客戶產品三層完成（MCP + Skill + Web UI）。
- **2026-03-31 Portfolio 上線**：/portfolio hub + 4 case study detail pages。待替換 placeholder 截圖為真實截圖。
- **2026-03-30 全站審計 3 輪完成**：P0/P1/P2 bug fixes + Privacy/Terms + MCPTools 17 tools + pricing 簡化 Free+Enterprise + terminal demo 重寫 + LiveBanner 移除。3 commits pushed, Vercel deployed。
- **Default branch: `main`**
- /blog: 2 篇文章，Nav 用 i18n（不再硬編碼 "BLOG"）
- **Idea Reality v2 完成**：Badge + GapRadar + Pulse + PayPal 移除 + verdict labels
- **8 個 production users**，2,691 筆掃描，35 國（Clerk production）
- /check: 全免費、ShareBadge（download/copy/share X）、GapRadar（智慧 fallback）、中文 pivot hints
- /pulse: Recharts 圖表、國家映射（中英文 + flag）、trending ideas
- /badge/[hash]: 落地頁 + OG 預覽（分享引流）
- /api/badge/[hash]: Satori OG image（verdict labels: Ghost Town → Shark Tank）
- Dashboard: API key 正常（Supabase service role + debug log）
- Vercel auto-deploy + GITHUB_TOKEN 設定完成（stars 正常顯示）
- Render pipeline minutes 70% used（注意 500 分鐘上限）
