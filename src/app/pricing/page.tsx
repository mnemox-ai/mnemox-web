import type { Metadata } from 'next';
import { PricingTable } from '@/components/pricing/PricingTable';
import { ComparisonSection } from '@/components/pricing/ComparisonSection';
import { BillingTable } from '@/components/pricing/BillingTable';
import { FAQ } from '@/components/pricing/FAQ';

export const metadata: Metadata = {
  title: 'Pricing — TradeMemory Protocol | Mnemox',
  description:
    'Simple, transparent pricing for TradeMemory Protocol. Free forever for self-hosting, or use our hosted API with guaranteed uptime and zero infrastructure.',
  keywords:
    'pricing, AI trading, MCP, memory, MT5, forex, XAUUSD, trading bot, algorithmic trading',
  openGraph: {
    title: 'Pricing — TradeMemory Protocol',
    description:
      'Simple, transparent pricing. Free forever for self-hosting, or use our hosted API.',
    url: 'https://mnemox.ai/pricing',
    type: 'website',
    siteName: 'Mnemox AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing — TradeMemory Protocol',
    description:
      'Simple, transparent pricing. Free forever for self-hosting.',
  },
  alternates: {
    canonical: 'https://mnemox.ai/pricing',
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
