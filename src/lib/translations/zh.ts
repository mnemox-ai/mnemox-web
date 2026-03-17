import type { TranslationKey } from './en';

export const zh: Record<TranslationKey, string> = {
  lang_toggle: 'EN',
  nav_products: '產品',
  nav_pricing: '定價',
  hero_title: '為建造者與交易員打造的 AI 工具',
  hero_subtitle: '開源智能與記憶工具，為 AI 代理而生。台北打造。',
  card_ir_name: 'Idea Reality',
  card_ir_desc: 'AI 代理的建構前市場現實檢查。同時掃描 5 個平台，在你建構之前。',
  card_ir_cta: '免費試用 →',
  card_tm_name: 'TradeMemory',
  card_tm_desc: 'AI 交易代理的持久記憶。從虧損學習、發現模式、自動調整倉位。',
  card_tm_cta: '開始使用 →',
  footer_text: '© 2026 Mnemox · 台北打造 · AI 工具',
  footer_pricing: '定價',
  social_stars: '{count} ★ 合計',
  social_tests: '{count} 測試通過',
  social_license: 'MIT 授權',
  nav_github: 'GitHub',
  footer_blog: '部落格',

  // TradeMemory page — Hero
  tm_hero_tag: '開源 MCP 伺服器',
  tm_hero_title1: 'AI 交易記憶',
  tm_hero_title2: '你的代理永不遺忘',
  tm_hero_desc: '你的 AI 代理每次對話結束就忘記所有交易。TradeMemory 賦予它持久記憶 — 儲存決策、發現模式、透過 MCP 自動演化策略。',
  tm_hero_cta1: '開始使用',
  tm_hero_cta2: '在 GitHub 查看',

  // TradeMemory page — Stats
  tm_stat_tests: '測試通過',
  tm_stat_memory: '記憶類型',
  tm_stat_tools: 'MCP 工具',
  tm_stat_license: '授權',

  // TradeMemory page — Features
  tm_features_title: '交易代理需要的一切',
  tm_features_subtitle: '從交易儲存到策略演化 — 為 AI 交易代理打造的完整記憶架構。',
  tm_feat_owm_title: '結果加權記憶',
  tm_feat_owm_desc: '5 種認知記憶類型：情節、語意、程序、情感、前瞻。每筆交易依結果品質、上下文相似度、時近性和信心度評分。',
  tm_feat_reflection_title: '反思引擎',
  tm_feat_reflection_desc: '規則式分析發現交易歷史中的模式 — 按交易時段、策略、信心度統計勝率。可選 LLM 層提供更深入洞察。',
  tm_feat_pattern_title: '自動模式挖掘',
  tm_feat_pattern_desc: 'L2 發現哪些策略、時段和條件產出贏家。L3 生成可執行調整：停用虧損策略、加碼贏家策略。',
  tm_feat_daily_title: '每日自動覆盤',
  tm_feat_daily_desc: '排程 daily_reflection.py 在收盤時執行。自動彙整損益、標記異常、更新記憶層。',
  tm_feat_bias_title: '偏差偵測',
  tm_feat_bias_desc: '程序記憶追蹤交易行為。從交易歷史中偵測過度交易、報復性交易和特定時段偏差。',
  tm_feat_kelly_title: 'Kelly 記憶公式',
  tm_feat_kelly_desc: '使用回憶的勝率和報酬比，進行上下文加權 Kelly 準則計算。預設四分之一 Kelly，可調風險偏好。',
  tm_feat_evolution_title: '策略演化',
  tm_feat_evolution_desc: '從原始價格數據發現交易策略。LLM 驅動的假設生成 + 向量化回測 + 達爾文式篩選。找到真正的 alpha — 經統計驗證。',

  // TradeMemory page — Architecture (Part 2)
  tm_arch_title: '三層架構',
  tm_arch_subtitle: '原始交易 → 模式發現 → 策略調整。每層餵給下一層。',
  tm_arch_l1_title: 'L1 — 交易儲存',
  tm_arch_l1_desc: '完整上下文的原始交易記錄：入場、出場、損益、策略、推理、市場條件。',
  tm_arch_l2_title: 'L2 — 模式發現',
  tm_arch_l2_desc: '反思引擎分析 L1 數據。按時段、策略和信心度統計勝率。發現什麼有效。',
  tm_arch_l3_title: 'L3 — 策略調整',
  tm_arch_l3_desc: '可執行輸出：停用虧損策略、調整倉位大小、標記市場狀態變化。',
  tm_arch_owm_title: '結果加權記憶 (OWM)',
  tm_arch_owm_desc: '基於認知科學的回憶系統。5 種記憶類型依結果品質、相似度、時近性、信心度和情感評分。Score = Q × Sim × Rec × Conf × Aff。',

  // TradeMemory page — Install (Part 2)
  tm_install_title: '30 秒安裝',
  tm_install_subtitle: '支援任何 MCP 相容客戶端。',
  tm_install_claude_desktop: 'Claude Desktop',
  tm_install_claude_code: 'Claude Code',
  tm_install_pip: 'pip / uv',
  tm_install_copy: '複製',

  // TradeMemory page — MCP Tools (Part 2)
  tm_tools_title: '15 個 MCP 工具',
  tm_tools_subtitle: '透過 Model Context Protocol 的完整交易記憶介面。',

  // TradeMemory page — Pricing (Part 2)
  tm_pricing_title: '定價',
  tm_pricing_subtitle: '自架版永久免費。託管方案給不想維運的團隊。',
  tm_pricing_free: '免費',
  tm_pricing_pro: '專業版',
  tm_pricing_team: '團隊版',

  // TradeMemory page — CTA (Part 2)
  tm_cta_title: '開始建構交易記憶',
  tm_cta_desc: '給你的 AI 代理應有的記憶。',
};
