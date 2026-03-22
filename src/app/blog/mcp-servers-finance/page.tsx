import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'MCP Servers for Finance and Trading: A Complete List (2026)',
  description:
    'Every MCP server for trading, market data, portfolio management, and DeFi — compared by features, language, and use case. Updated March 2026.',
  openGraph: {
    title: 'MCP Servers for Finance and Trading: A Complete List (2026)',
    description:
      'Every MCP server for trading, market data, and DeFi — compared by features, language, and use case.',
    url: 'https://www.mnemox.ai/blog/mcp-servers-finance',
    type: 'article',
    publishedTime: '2026-03-22T00:00:00Z',
  },
  alternates: {
    canonical: 'https://www.mnemox.ai/blog/mcp-servers-finance',
  },
  other: {
    'application-ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'MCP Servers for Finance and Trading: A Complete List (2026)',
      datePublished: '2026-03-22',
      author: { '@type': 'Organization', name: 'Mnemox AI', url: 'https://mnemox.ai' },
      publisher: { '@type': 'Organization', name: 'Mnemox AI', url: 'https://mnemox.ai' },
    }),
  },
};

const servers = [
  {
    name: 'TradeMemory Protocol',
    repo: 'mnemox-ai/tradememory-protocol',
    url: 'https://github.com/mnemox-ai/tradememory-protocol',
    lang: 'Python',
    category: 'Trading Memory',
    description:
      'Persistent memory layer for AI trading agents. Three-layer architecture (raw trades → pattern discovery → strategy adjustment) with 15 MCP tools, Outcome-Weighted Memory, and an Evolution Engine that discovers strategies from raw price data.',
    platforms: 'MT5, Binance, Alpaca, any platform',
    tools: 15,
    highlight: true,
  },
  {
    name: 'CCXT MCP Server',
    repo: 'doggybee/mcp-server-ccxt',
    url: 'https://github.com/doggybee/mcp-server-ccxt',
    lang: 'TypeScript',
    category: 'Exchange Data',
    description:
      'Real-time crypto market data and trading via 20+ exchanges using the CCXT library. Supports spot, futures, OHLCV, balances, and order management.',
    platforms: 'Binance, Coinbase, Kraken, 20+ exchanges',
    tools: null,
    highlight: false,
  },
  {
    name: 'Investor Agent (Yahoo Finance)',
    repo: 'ferdousbhai/investor-agent',
    url: 'https://github.com/ferdousbhai/investor-agent',
    lang: 'Python',
    category: 'Market Data',
    description:
      'Yahoo Finance integration for stock market data including options recommendations.',
    platforms: 'US stocks',
    tools: null,
    highlight: false,
  },
  {
    name: 'VibeTrader MCP',
    repo: 'etbars/vibetrader-mcp',
    url: 'https://github.com/etbars/vibetrader-mcp',
    lang: 'Python',
    category: 'Trading Bot',
    description:
      'AI-powered trading bot platform. Create automated trading strategies with natural language via Alpaca brokerage.',
    platforms: 'Alpaca',
    tools: null,
    highlight: false,
  },
  {
    name: 'Tasty Agent',
    repo: 'ferdousbhai/tasty-agent',
    url: 'https://github.com/ferdousbhai/tasty-agent',
    lang: 'Python',
    category: 'Brokerage',
    description:
      'Tastyworks API integration to handle trading activities on Tastytrade.',
    platforms: 'Tastytrade',
    tools: null,
    highlight: false,
  },
  {
    name: 'FinancialData.Net MCP',
    repo: 'financialdatanet/mcp-server',
    url: 'https://github.com/financialdatanet/mcp-server',
    lang: 'Python',
    category: 'Market Data',
    description:
      'End-of-day and intraday stock market data, financial statements, insider trading data, sustainability data, and earnings releases.',
    platforms: 'US, global equities',
    tools: null,
    highlight: false,
  },
  {
    name: 'Stooq MCP',
    repo: 'hoqqun/stooq-mcp',
    url: 'https://github.com/hoqqun/stooq-mcp',
    lang: 'Rust',
    category: 'Market Data',
    description:
      'Fetch real-time stock prices from Stooq without API keys. Supports US, Japan, UK, and Germany markets.',
    platforms: 'US, JP, UK, DE equities',
    tools: null,
    highlight: false,
  },
  {
    name: 'Perp CLI',
    repo: 'hypurrquant/perp-cli',
    url: 'https://github.com/hypurrquant/perp-cli',
    lang: 'TypeScript',
    category: 'DeFi Trading',
    description:
      'Multi-DEX perpetual futures trading. 18 tools for market data, trade execution with dry-run safety, funding rate arbitrage scanning, and portfolio analytics.',
    platforms: 'Pacifica (Solana), Hyperliquid, Lighter (ETH)',
    tools: 18,
    highlight: false,
  },
  {
    name: 'CryptoGuard Client',
    repo: 'gpartin/CryptoGuardClient',
    url: 'https://github.com/gpartin/CryptoGuardClient',
    lang: 'Python',
    category: 'Risk Management',
    description:
      'Per-transaction deterministic crypto validator. Validate trades (PROCEED/CAUTION/BLOCK), scan tokens, detect rug pulls.',
    platforms: 'Crypto',
    tools: null,
    highlight: false,
  },
  {
    name: 'BaoStock MCP',
    repo: 'HuggingAGI/mcp-baostock-server',
    url: 'https://github.com/HuggingAGI/mcp-baostock-server',
    lang: 'Python',
    category: 'Market Data',
    description:
      'Access and analysis capabilities for Chinese stock market data via baostock.',
    platforms: 'China A-shares',
    tools: null,
    highlight: false,
  },
  {
    name: 'Finmap MCP',
    repo: 'finmap-org/mcp-server',
    url: 'https://github.com/finmap-org/mcp-server',
    lang: 'Python',
    category: 'Market Data',
    description:
      'Historical data from US, UK, Russian and Turkish stock exchanges. Sectors, tickers, company profiles, market cap, volume, treemap and histogram visualizations.',
    platforms: 'US, UK, RU, TR equities',
    tools: null,
    highlight: false,
  },
];

export default function MCPServersFinance() {
  return (
    <div className="prose-invert max-w-none">
      <time className="text-xs text-txt-dim">2026-03-22</time>
      <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">
        MCP Servers for Finance and Trading: A Complete List (2026)
      </h1>

      <p className="mt-6 text-txt-dim leading-relaxed">
        The Model Context Protocol (MCP) lets AI agents call external tools through a standardized interface.
        For traders and fintech developers, this means your Claude, Cursor, or custom agent can fetch market
        data, execute trades, and manage risk — without writing custom API wrappers for every broker.
      </p>
      <p className="mt-4 text-txt-dim leading-relaxed">
        This list covers every MCP server built for finance, trading, and DeFi as of March 2026.
        We categorize them by use case so you can find the right one for your stack.
      </p>

      <h2 className="mt-12 mb-6 font-display text-2xl font-semibold">What is an MCP server for trading?</h2>
      <p className="text-txt-dim leading-relaxed">
        An MCP server exposes tools that an AI agent can call. For trading, these tools typically
        fall into four categories: <strong>market data</strong> (prices, OHLCV, fundamentals),{' '}
        <strong>trade execution</strong> (place/cancel orders),{' '}
        <strong>memory and analytics</strong> (store trades, discover patterns), and{' '}
        <strong>risk management</strong> (position sizing, circuit breakers).
      </p>
      <p className="mt-4 text-txt-dim leading-relaxed">
        You install them via <code className="rounded bg-bg-card px-1.5 py-0.5 text-cyan">pip install</code> or{' '}
        <code className="rounded bg-bg-card px-1.5 py-0.5 text-cyan">npx</code>, add them to your MCP client
        config, and your agent gains access to the tools.
      </p>

      <h2 className="mt-12 mb-6 font-display text-2xl font-semibold">Complete list</h2>

      <div className="space-y-4">
        {servers.map((s) => (
          <div
            key={s.repo}
            className={`rounded-xl border p-5 ${
              s.highlight ? 'border-cyan bg-cyan/5' : 'border-border bg-bg-card'
            }`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm font-semibold text-cyan hover:underline"
              >
                {s.name}
              </a>
              <span className="rounded-full bg-bg px-2 py-0.5 text-[10px] text-txt-dim">{s.lang}</span>
              <span className="rounded-full bg-bg px-2 py-0.5 text-[10px] text-txt-dim">{s.category}</span>
              {s.tools && (
                <span className="rounded-full bg-cyan/10 px-2 py-0.5 text-[10px] text-cyan">
                  {s.tools} tools
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-txt-dim leading-relaxed">{s.description}</p>
            <p className="mt-1 text-xs text-txt-dim">
              Platforms: {s.platforms} ·{' '}
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-cyan hover:underline">
                GitHub
              </a>
            </p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 mb-6 font-display text-2xl font-semibold">How to choose</h2>

      <ul className="space-y-3 text-txt-dim leading-relaxed">
        <li>
          <strong>Need market data only?</strong> Use CCXT (crypto), FinancialData.Net (equities), or Stooq (global, no API key).
        </li>
        <li>
          <strong>Need to execute trades?</strong> VibeTrader (Alpaca), Tasty Agent (Tastytrade), or Perp CLI (DeFi perps).
        </li>
        <li>
          <strong>Need your agent to remember and learn from trades?</strong>{' '}
          <Link href="/tradememory" className="text-cyan hover:underline">
            TradeMemory Protocol
          </Link>{' '}
          — the only MCP server with persistent trade memory, pattern discovery, and strategy evolution.
        </li>
        <li>
          <strong>Need risk checks before execution?</strong> CryptoGuard for crypto token validation.
        </li>
      </ul>

      <h2 className="mt-12 mb-6 font-display text-2xl font-semibold">Missing from this list?</h2>
      <p className="text-txt-dim leading-relaxed">
        New MCP servers ship every week. If you know one we missed,{' '}
        <a
          href="https://github.com/mnemox-ai/mnemox-web/issues/new"
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan hover:underline"
        >
          open an issue
        </a>{' '}
        and we will add it.
      </p>

      <hr className="my-12 border-border" />

      <p className="text-sm text-txt-dim">
        Built by{' '}
        <Link href="/" className="text-cyan hover:underline">
          Mnemox AI
        </Link>
        . We build open-source MCP servers for trading memory and idea validation.
      </p>
    </div>
  );
}
