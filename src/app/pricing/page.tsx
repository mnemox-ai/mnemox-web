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
            name: 'Self-Hosted',
            price: '0',
            priceCurrency: 'USD',
            description: 'Free forever — run your own instance',
          },
          {
            '@type': 'Offer',
            name: 'Starter',
            price: '9',
            priceCurrency: 'USD',
            billingIncrement: 'P1M',
            description: '1,000 API calls/month',
          },
          {
            '@type': 'Offer',
            name: 'Pro',
            price: '29',
            priceCurrency: 'USD',
            billingIncrement: 'P1M',
            description: '10,000 API calls/month + priority support',
          },
          {
            '@type': 'Offer',
            name: 'Enterprise',
            description: 'Custom pricing — contact us',
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
