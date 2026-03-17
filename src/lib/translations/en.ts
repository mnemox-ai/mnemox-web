export const en = {
  lang_toggle: '中文',
  nav_products: 'Products',
  nav_pricing: 'Pricing',
  hero_title: 'AI Tools for Builders & Traders.',
  hero_subtitle: 'Open-source intelligence and memory tools for AI agents. Built in Taipei.',
  card_ir_name: 'Idea Reality',
  card_ir_desc: 'Pre-build market reality check for AI agents. Scans 5 platforms simultaneously before you build.',
  card_ir_cta: 'Try Free →',
  card_tm_name: 'TradeMemory',
  card_tm_desc: 'Persistent memory for AI trading agents. Learns from losses, spots patterns, auto-adjusts sizing.',
  card_tm_cta: 'Get Started →',
  footer_text: '© 2026 Mnemox · Built in Taipei · Tools for AI',
  footer_pricing: 'Pricing',
  social_stars: '{count} ★ combined',
  social_tests: '{count} tests passing',
  social_license: 'MIT licensed',
  nav_github: 'GitHub',
  footer_blog: 'Blog',

  // TradeMemory page — Hero
  tm_hero_tag: 'Open Source MCP Server',
  tm_hero_title1: 'AI Trading Memory',
  tm_hero_title2: 'Your Agent Never Forgets',
  tm_hero_desc: 'Your AI agent forgets every trade after each session. TradeMemory gives it persistent memory — store decisions, discover patterns, evolve strategy automatically via MCP.',
  tm_hero_cta1: 'Get Started',
  tm_hero_cta2: 'View on GitHub',

  // TradeMemory page — Stats
  tm_stat_tests: 'Tests Passing',
  tm_stat_memory: 'Memory Types',
  tm_stat_tools: 'MCP Tools',
  tm_stat_license: 'Licensed',

  // TradeMemory page — Features
  tm_features_title: 'Everything Your Trading Agent Needs',
  tm_features_subtitle: 'From trade storage to strategy evolution — a complete memory architecture for AI trading agents.',
  tm_feat_owm_title: 'Outcome-Weighted Memory',
  tm_feat_owm_desc: '5 cognitive memory types: Episodic, Semantic, Procedural, Affective, Prospective. Each trade scored by outcome quality, context similarity, recency, and confidence.',
  tm_feat_reflection_title: 'Reflection Engine',
  tm_feat_reflection_desc: 'Rule-based analysis finds patterns in your trade history — win rates by session, strategy, confidence level. Optional LLM layer for deeper insights.',
  tm_feat_pattern_title: 'Automatic Pattern Mining',
  tm_feat_pattern_desc: 'L2 discovers which strategies, sessions, and conditions produce winners. L3 generates actionable adjustments: disable losers, size up winners.',
  tm_feat_daily_title: 'Automated Daily Reflection',
  tm_feat_daily_desc: 'Schedule daily_reflection.py to run at market close. Summarizes P&L, flags anomalies, and updates memory layers automatically.',
  tm_feat_bias_title: 'Bias Detection',
  tm_feat_bias_desc: 'Procedural memory tracks trading behaviors. Detects overtrading, revenge trading, and session-specific biases from your trade history.',
  tm_feat_kelly_title: 'Kelly-from-Memory',
  tm_feat_kelly_desc: 'Context-weighted Kelly Criterion using recalled win rates and payoff ratios. Quarter-Kelly default with risk appetite adjustment.',
  tm_feat_evolution_title: 'Strategy Evolution',
  tm_feat_evolution_desc: 'Discover trading strategies from raw price data. LLM-powered hypothesis generation + vectorized backtesting + Darwinian selection. Finds real alpha — statistically validated.',

  // TradeMemory page — Architecture (Part 2)
  tm_arch_title: 'Three-Layer Architecture',
  tm_arch_subtitle: 'Raw trades → pattern discovery → strategy adjustments. Each layer feeds the next.',
  tm_arch_l1_title: 'L1 — Trade Storage',
  tm_arch_l1_desc: 'Raw trade records with full context: entry, exit, P&L, strategy, reasoning, market conditions.',
  tm_arch_l2_title: 'L2 — Pattern Discovery',
  tm_arch_l2_desc: 'Reflection engine analyzes L1 data. Finds win rates by session, strategy, and confidence. Discovers what works.',
  tm_arch_l3_title: 'L3 — Strategy Adjustment',
  tm_arch_l3_desc: 'Actionable outputs: disable losing strategies, adjust position sizes, flag regime changes.',
  tm_arch_owm_title: 'Outcome-Weighted Memory (OWM)',
  tm_arch_owm_desc: 'Cognitive science-based recall. 5 memory types scored by outcome quality, similarity, recency, confidence, and affect. Score = Q × Sim × Rec × Conf × Aff.',

  // TradeMemory page — Install (Part 2)
  tm_install_title: 'Install in 30 Seconds',
  tm_install_subtitle: 'Works with any MCP-compatible client.',
  tm_install_claude_desktop: 'Claude Desktop',
  tm_install_claude_code: 'Claude Code',
  tm_install_pip: 'pip / uv',
  tm_install_copy: 'Copy',

  // TradeMemory page — MCP Tools (Part 2)
  tm_tools_title: '15 MCP Tools',
  tm_tools_subtitle: 'Complete trading memory interface via Model Context Protocol.',

  // TradeMemory page — Pricing (Part 2)
  tm_pricing_title: 'Pricing',
  tm_pricing_subtitle: 'Self-hosted is free forever. Hosted plans for teams who want zero ops.',
  tm_pricing_free: 'Free',
  tm_pricing_pro: 'Pro',
  tm_pricing_team: 'Team',

  // TradeMemory page — CTA (Part 2)
  tm_cta_title: 'Start Building Trading Memory',
  tm_cta_desc: 'Give your AI agent the memory it deserves.',
} as const;

export type TranslationKey = keyof typeof en;
