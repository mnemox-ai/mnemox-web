import type { Metadata } from 'next';
import { PortfolioHub } from '@/components/portfolio/PortfolioHub';

export const metadata: Metadata = {
  title: 'Portfolio — AI Trading Systems Built on Real Capital | Mnemox AI',
  description:
    'Explore Mnemox AI shipped systems: TradeMemory Protocol (1,233 tests), NexusOS AI War Room, and NG_Gold multi-strategy EA. Open source tools built by a founder who trades real capital.',
  openGraph: {
    title: 'Portfolio — Mnemox AI',
    description:
      '4 shipped AI trading systems. 1,510+ tests. Built on real capital, not slide decks.',
    url: 'https://www.mnemox.ai/portfolio',
    images: [{ url: '/assets/og-home.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio — Mnemox AI',
    description:
      '4 shipped AI trading systems. 1,510+ tests. Built on real capital, not slide decks.',
    images: ['/assets/og-home.png'],
  },
  alternates: { canonical: 'https://www.mnemox.ai/portfolio' },
  other: {
    'application-ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Mnemox AI Portfolio',
      description:
        'AI trading systems built by Mnemox AI: TradeMemory Protocol, NexusOS, and NG_Gold.',
      url: 'https://www.mnemox.ai/portfolio',
      author: {
        '@type': 'Organization',
        name: 'Mnemox AI',
        url: 'https://www.mnemox.ai',
      },
    }),
  },
};

export default function PortfolioPage() {
  return <PortfolioHub />;
}
