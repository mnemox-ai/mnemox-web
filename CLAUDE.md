# Mnemox Web — Claude Code 指令

## 專案概述

Mnemox AI 官方網站。Next.js 14 + Tailwind + Magic UI + Clerk + Supabase。

- GitHub: mnemox-ai/mnemox-web
- 部署: Vercel (www.mnemox.ai)
- Default branch: `main`

## 技術棧

- Next.js 14, React 18, TypeScript
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
- **Live Dashboard Step 2 完成**：多策略支持（Strategy E + C），Dashboard 總覽 UI，337 筆 Strategy C backtest seeded
- Phase 3 完成 + Supabase live（4+2 tables: users/api_keys/subscriptions/usage_logs + live_trades/live_positions）
- **Clerk production mode**，Email + Google OAuth（custom credentials）
- Phase 4 OG + Schema.org 完成（6/6 pages 有完整 OG + schema，含 /live twitter card）
- Dashboard 正常：訂閱方案 / 使用量 / API 金鑰產生
- Vercel auto-deploy 正常
- GH Actions executor 已正常運行（每小時 :05），paper trades 會自動出現在 /live
- /live 已加入 sitemap（hourly changeFrequency）
- Dynamic OG image 上線：`src/app/live/opengraph-image.tsx`，即時數據 + 深色漸層 + glow 效果
- **Live Dashboard Step 2 完成**，下一步：Step 3（推廣 + 更多策略）
