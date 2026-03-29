import type { Metadata } from 'next';
import { PricingTable } from '@/components/pricing/PricingTable';
import { FAQ } from '@/components/pricing/FAQ';

export const metadata: Metadata = {
  title: 'Pricing — Mnemox AI',
  description:
    'TradeMemory Protocol is free and open source. For custom AI trading systems, contact us for a quote.',
  openGraph: {
    title: 'Pricing — Mnemox AI',
    description:
      'Free open-source tools. Custom AI trading infrastructure from $5K.',
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
    title: 'Pricing — Mnemox AI',
    description:
      'Free open-source tools. Custom trading systems from $5K.',
    images: ['/assets/og-home.png'],
  },
  alternates: {
    canonical: 'https://www.mnemox.ai/pricing',
  },
};

export default function PricingPage() {
  return (
    <>
      <PricingTable />
      <FAQ />
    </>
  );
}
