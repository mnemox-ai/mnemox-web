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
    'application-ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'TradeMemory Protocol',
      url: 'https://www.mnemox.ai/tradememory',
      description:
        'Three-layer memory architecture for algorithmic trading. MCP server with 17 tools for MT5/forex.',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Any',
      softwareVersion: '0.5.0',
      featureList:
        '17 MCP tools, 5 cognitive memory types (Episodic, Semantic, Procedural, Affective, Prospective), Evolution Engine, Outcome-Weighted Memory, Decision Audit Trail with SHA-256 tamper detection',
      keywords:
        'MCP server, trading memory, AI agent, algorithmic trading, MT5, forex, decision intelligence',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        description: 'Open source — self-hosted free forever',
      },
      creator: {
        '@type': 'Organization',
        name: 'Mnemox AI',
        url: 'https://www.mnemox.ai',
      },
    }),
  },
};

export default function TradeMemoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
