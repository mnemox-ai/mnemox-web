import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TradeMemory Protocol — AI Trading Memory Layer',
  description:
    'Three-layer memory architecture for algorithmic trading. L1 raw trades → L2 pattern discovery → L3 strategy adjustment. MCP server for MT5/forex.',
  openGraph: {
    title: 'TradeMemory Protocol — AI Trading Memory Layer',
    description:
      'Three-layer memory for algorithmic trading. L1 trades → L2 patterns → L3 strategy. MCP server for MT5/forex.',
    url: 'https://www.mnemox.ai/tradememory',
    siteName: 'Mnemox AI',
    images: [
      {
        url: '/assets/og-home.png',
        width: 1200,
        height: 630,
        alt: 'TradeMemory Protocol',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TradeMemory Protocol — AI Trading Memory Layer',
    description:
      'Three-layer memory for algorithmic trading. MCP server for MT5/forex.',
    images: ['/assets/og-home.png'],
  },
  alternates: {
    canonical: 'https://www.mnemox.ai/tradememory',
  },
  other: {
    'application-ld+json': JSON.stringify([
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'TradeMemory Protocol',
        url: 'https://www.mnemox.ai/tradememory',
        downloadUrl: 'https://pypi.org/project/tradememory-protocol/',
        installUrl: 'https://github.com/mnemox-ai/tradememory-protocol',
        screenshot: 'https://www.mnemox.ai/assets/og-home.png',
        description:
          'Persistent memory layer for AI trading agents. 5-layer cognitive architecture with Outcome-Weighted Memory, pattern discovery, and strategy evolution.',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Windows, macOS, Linux',
        softwareVersion: '0.5.1',
        featureList:
          '17 MCP tools, 5 cognitive memory types, Evolution Engine, Outcome-Weighted Memory, Decision Audit Trail with SHA-256 tamper detection, Kelly Criterion position sizing',
        keywords:
          'MCP server, trading memory, AI agent, algorithmic trading, MT5, forex, Claude Desktop, Cursor',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          description: 'Open source under MIT license — free forever',
        },
        creator: {
          '@type': 'Organization',
          name: 'Mnemox AI',
          url: 'https://www.mnemox.ai',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '5',
          ratingCount: '1233',
          bestRating: '5',
          worstRating: '1',
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Is TradeMemory Protocol free?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, TradeMemory Protocol is fully open source under the MIT license. It is free for personal and commercial use.',
            },
          },
          {
            '@type': 'Question',
            name: 'Which AI assistants work with TradeMemory?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'TradeMemory works with any MCP-compatible client including Claude Desktop, Cursor, Windsurf, and custom agents built with the MCP SDK.',
            },
          },
          {
            '@type': 'Question',
            name: 'Does TradeMemory execute trades?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No, TradeMemory is a memory layer only. It stores and recalls trade information but does not execute orders. You need a separate execution layer like MT5, Binance API, or Alpaca.',
            },
          },
          {
            '@type': 'Question',
            name: 'What trading platforms are supported?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'TradeMemory supports MetaTrader 5 (MT5), Binance, Alpaca, and any platform with API access. The memory layer is platform-agnostic.',
            },
          },
          {
            '@type': 'Question',
            name: 'How do I install TradeMemory Protocol?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Install via pip: pip install tradememory-protocol. Then add it to your MCP client configuration (Claude Desktop, Cursor, etc.).',
            },
          },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: 'How to Install TradeMemory Protocol',
        description: 'Step-by-step guide to install and configure TradeMemory Protocol for AI trading agents.',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Install the package',
            text: 'Run pip install tradememory-protocol in your terminal.',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Configure your MCP client',
            text: 'Add TradeMemory to your Claude Desktop or Cursor MCP configuration file.',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Start using memory tools',
            text: 'Use the 17 MCP tools like store_trade, recall_similar, and get_bias_report in your AI conversations.',
          },
        ],
        totalTime: 'PT5M',
      },
    ]),
  },
};

export default function TradeMemoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
