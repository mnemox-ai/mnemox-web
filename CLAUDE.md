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
- [2026-03-18] Phase 3: Clerk auth + Supabase + Dashboard + Webhooks + i18n

## Current Status
- Phase 3 完成：Clerk auth, Supabase (users/api_keys/subscriptions), Dashboard, PayPal webhooks
- i18n: en + zh, 含 dashboard 和 nav auth keys
- Vercel 部署中
