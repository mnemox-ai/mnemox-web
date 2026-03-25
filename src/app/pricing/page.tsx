import type { Metadata } from 'next';
import { PricingTable } from '@/components/pricing/PricingTable';
import { ComparisonSection } from '@/components/pricing/ComparisonSection';
import { BillingTable } from '@/components/pricing/BillingTable';
import { FAQ } from '@/components/pricing/FAQ';

export const metadata: Metadata = {
  title: 'Pricing — TradeMemory Protocol',
  description:
    'Simple, transparent pricing for TradeMemory Protocol. Free forever for self-hosting, or use our hosted API with guaranteed uptime and zero infrastructure.',
  keywords:
    'pricing, AI trading, MCP, memory, MT5, forex, XAUUSD, trading bot, algorithmic trading',
  openGraph: {
    title: 'Pricing — TradeMemory Protocol',
    description:
      'Simple, transparent pricing. Free forever for self-hosting, or use our hosted API.',
    url: 'https://www.mnemox.ai/pricing',
    type: 'website',
    siteName: 'Mnemox AI',
    images: [
      {
        url: '/assets/og-home.png',
        width: 1200,
        height: 630,
        alt: 'Mnemox AI Pricing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing — TradeMemory Protocol',
    description:
      'Simple, transparent pricing. Free forever for self-hosting.',
    images: ['/assets/og-home.png'],
  },
  alternates: {
    canonical: 'https://www.mnemox.ai/pricing',
  },
  other: {
    'application-ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'TradeMemory Protocol Pricing',
      url: 'https://www.mnemox.ai/pricing',
      description:
        'Pricing for TradeMemory Protocol. Free self-hosted, or hosted API plans.',
      mainEntity: {
        '@type': 'Product',
        name: 'TradeMemory Protocol',
        offers: [
          {
            '@type': 'Offer',
            name: 'Free',
            price: '0',
            priceCurrency: 'USD',
            description: 'Free forever — self-host or use the hosted API',
          },
        ],
      },
    }),
  },
};

export default function PricingPage() {
  return (
    <>
      <PricingTable />
      <ComparisonSection />
      <BillingTable />
      <FAQ />
    </>
  );
}
