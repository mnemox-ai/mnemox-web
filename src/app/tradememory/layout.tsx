import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TradeMemory — The Memory Layer for AI Trading Agents',
  description:
    'Your trading AI has amnesia. TradeMemory gives it persistent memory — record decisions, recall by outcome, audit every choice. 20 MCP tools, SHA-256 tamper detection, works with any market.',
  openGraph: {
    title: 'TradeMemory — The Memory Layer for AI Trading Agents',
    description:
      'Your trading AI has amnesia. TradeMemory gives it persistent memory — 20 MCP tools, SHA-256 tamper detection, works with any market.',
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
    title: 'TradeMemory — The Memory Layer for AI Trading Agents',
    description:
      'Your trading AI has amnesia. TradeMemory gives it persistent memory — 20 MCP tools, SHA-256 tamper detection.',
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
        name: 'TradeMemory',
        url: 'https://www.mnemox.ai/tradememory',
        downloadUrl: 'https://pypi.org/project/tradememory-protocol/',
        installUrl: 'https://github.com/mnemox-ai/tradememory-protocol',
        screenshot: 'https://www.mnemox.ai/assets/og-home.png',
        description:
          'The memory layer for AI trading agents. 20 MCP tools, SHA-256 tamper-evident audit trail, works with any market.',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Windows, macOS, Linux',
        softwareVersion: '0.5.5',
        featureList:
          '20 MCP tools, 5 cognitive memory types (Episodic, Semantic, Procedural, Affective, Prospective), Outcome-Weighted Memory (OWM), SHA-256 tamper-evident audit trail, MiFID II compliance support',
        keywords:
          'MCP server, trading memory, AI agent, algorithmic trading, MT5, forex, MiFID II, compliance, decision audit',
        offers: [
          {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            description: 'Open source, self-hosted, MIT licensed. No paid tier.',
          },
        ],
        creator: {
          '@type': 'Organization',
          name: 'Mnemox AI',
          url: 'https://www.mnemox.ai',
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Is TradeMemory free?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, TradeMemory is fully open source under the MIT license. It is free for personal and commercial use.',
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
              text: 'No, TradeMemory is a memory layer only. It stores and recalls trade information but does not execute orders. You need a separate execution layer such as MT5 or the Binance API.',
            },
          },
          {
            '@type': 'Question',
            name: 'What trading platforms are supported?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'TradeMemory ships adapters for MetaTrader 5 and Binance. The memory layer itself is platform-agnostic, so other venues can be added, but only those two are built today.',
            },
          },
          {
            '@type': 'Question',
            name: 'How do I install TradeMemory?',
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
        name: 'How to Install TradeMemory',
        description: 'Step-by-step guide to install and configure TradeMemory for AI trading agents.',
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
            text: 'Use the 20 MCP tools like remember_trade, recall_memories, and get_agent_state in your AI conversations.',
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
