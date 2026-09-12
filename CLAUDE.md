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
- [2026-09-12] **/pricing 停止描述從未上線的 hosted TradeMemory**（`b4bc99c`）——`/pricing` 賣的是 Strategy Validator，但它的 FAQ（**有渲染、線上看得到**）還在回答 hosted API 的問題：「開始用 hosted API 後是獨立的 cloud database」「Hosted API 資料存在 Render 美國機房，每日自動備份、保留 30 天」「透過我們的 REST API 或 MCP tools」。**那個服務從沒上線**（產品 repo 的 `hosted-api-spec.md` 八月起就掛「never launched」banner，`mcp.mnemox.ai/dashboard` 404）。等於一頁描述兩個產品、其中一個不存在，同時對另一個收錢。四題 FAQ 改成回答頁面上真正在賣的東西，並明說 TradeMemory 是獨立的 MIT 自架專案、無付費層。⚠️ **刻意沒有編造 Validate 的儲存位置與保留期**：舊答案的細節是在講不存在的服務，我不拿猜測去替換，這題要 Sean 自己確認。另刪兩個死元件＋19 個孤兒 key：`BillingTable.tsx`（對 `store_trade()`／`recall_trades()`／`get_performance()`／`run_reflection()` 標「1 credit／5 credits」，這四個 tool 都不存在，且無人 import）、`ComparisonSection.tsx`（「Trade memory stored in the cloud at mcp.mnemox.ai」，同樣無人 import）。兩者都是三月那次 pricing 清理的殘留。🟢 **`/pricing` 的 $29 沒動**：那是 Strategy Validator，有真的 Stripe checkout，是真的。🔴 **未處理**：`src/app/terms/page.tsx:36` 仍定義「Hosted API — Cloud-hosted TradeMemory endpoints (when available)」，那是法律文件，留給 Sean 決定。
- [2026-09-12] **/tradememory 對外口徑修真**（`afd6f5a`）——兩項不是「過期」是**造假／賣不存在的東西**：①JSON-LD 的 `aggregateRating` 寫 `ratingValue 5 / ratingCount 1324`，**根本沒人評過**，那個 1324 看起來是 GitHub star 數被挪用成評價數。機器可讀、會被搜尋與 AI 爬蟲索引、違反 Google 結構化資料政策 → **直接移除**（沒有真實評價可以替換）②JSON-LD 另外宣告 `Offer price 29`（Pro：hosted API／web dashboard／優先支援），那層**從來不存在**，README 八月就把 $29 表格拿掉了 → 移除，只留 free/self-hosted 那筆。可見的 Pricing 三層表（$29/月「即將推出」）是 **4/05 商業重寫時加回來的**，而 3/30 才剛把同樣的 vaporware 從 `/pricing` 拔掉（**同一個坑踩兩次，下次改這頁先查 harvest 判決**）→ 換成誠實的 status 區塊（MIT／自架／維護模式／無付費層 ＋ dashboard 預覽連結 ＋ 付費單次交易紀錄分析另述）。對照 source 修正的過期數字：**19→20 tools**、**0.5.1→0.5.5**、**1,233→1,514 tests**、全站 **tamper-proof→tamper-evident**（SHA-256 鏈讓竄改「可被偵測」不是「不可能」）。另外 `MCPTools` 列的 17 個 tool 裡**有 9 個名字不存在**（store_trade／recall_trades／get_performance／run_reflection／evolve_strategies／discover_signals／generate_hypothesis／run_backtest／select_survivors），JSON-LD 的 how-to 還叫人用 `store_trade`、`recall_similar`（真名是 `remember_trade`、`recall_memories`）→ 換成真的 20 個、分四組、描述取自 docstring。驗證：`tsc --noEmit` 乾淨、`next build` 過。⚠️ 本機 build 需要 `TURSO_DATABASE_URL`／`TURSO_AUTH_TOKEN`／`IP_HASH_SALT`，沒有的話會在 `/api/pulse` 收集頁面資料時爆（Vercel 上有設，非程式問題）。
- [2026-04-11] **Validate SaaS 金流**：Stripe checkout + webhook（checkout.session.completed / subscription.updated / deleted）+ subscription gating（Free 3/月, Pro unlimited $29/月）+ usage logging + pricing page 3 tiers + validate hero copy。Build pass, commit 75214f8 pushed。需手動：Stripe Dashboard 建 product + Supabase ALTER TABLE + env vars。
- [2026-04-05] **/tradememory 商業重寫**：7 段落新版 landing page（Hero amnesia hook → Problem 3欄 → How It Works 3步 → Use Cases 3卡 → Stats Bar → Pricing 3層表格 → CTA footer）。AAPL Terminal demo、layout metadata 更新（19 tools, pricing offers in JSON-LD）、en.ts + zh.ts 全 tm_* key 替換為商業版文案。Build pass，commit e11f170 pushed。
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
- **2026-04-05 /tradememory 商業重寫完成**：新版 7 段落 landing page，商業定位（amnesia hook + 3層 pricing）。Vercel 自動部署中。
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
