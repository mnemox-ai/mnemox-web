/** Centralised configuration constants. */

export const API_BASE = 'https://idea-reality-mcp.onrender.com';

export const GA_ID = 'G-3VD4L98FJP';

export const GITHUB_ORG = 'mnemox-ai';

export const PRODUCT_STATS = {
  ideaReality: { tests: 277, repo: 'idea-reality-mcp' },
  tradeMemory: { tests: 1233, repo: 'tradememory-protocol' },
} as const;

export const COMBINED_TESTS = PRODUCT_STATS.ideaReality.tests + PRODUCT_STATS.tradeMemory.tests;
