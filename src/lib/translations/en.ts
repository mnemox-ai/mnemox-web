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
} as const;

export type TranslationKey = keyof typeof en;
