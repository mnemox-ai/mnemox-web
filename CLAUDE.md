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
- Pages: `src/app/` (homepage, check, pricing, tradememory, dashboard)
- Auth: `src/middleware.ts`, `src/app/sign-in/`, `src/app/sign-up/`
- Supabase: `src/lib/supabase/server.ts`
- Webhooks: `src/app/api/webhooks/clerk/`, `paypal/`
- Config: `src/lib/config.ts`

## Recent Changes
- [2026-03-18] Clerk 切 production：pk_live + sk_live keys，Google OAuth custom credentials，5 DNS CNAME records
- [2026-03-18] Phase 4 OG + Schema.org：root layout OG/Twitter/Organization schema，tradememory layout 新建，pricing 加 OG image + Product schema，check URL 統一 www.mnemox.ai
- [2026-03-18] Vercel redeploy with production Clerk keys
- [2026-03-18] fix: ensureUser upsert 解決 FK violation，API key 產生/撤銷正常
- [2026-03-18] Supabase project 建立 + schema.sql 跑完 + Vercel env vars 設定完成
- [2026-03-18] Phase 3: Clerk auth + Supabase + Dashboard + Webhooks + CTA auth gate

## Current Status
- Phase 3 完成 + Supabase live（4 tables, RLS enabled, Tokyo region）
- **Clerk production mode**，Email + Google OAuth（custom credentials）
- Phase 4 OG + Schema.org 完成（4/5 pages 有完整 OG + schema）
- Dashboard 正常：訂閱方案 / 使用量 / API 金鑰產生
- Vercel auto-deploy 正常，7 env vars 已設
- DNS：clerk/accounts/clkmail/clk._domainkey/clk2._domainkey CNAME 已加，等驗證
- 待辦：Turso → Supabase 遷移（省 $6/月）、GitHub OAuth（optional）
