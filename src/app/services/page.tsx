import type { Metadata } from 'next';
import { ServicesContent } from '@/components/services/ServicesContent';

export const metadata: Metadata = {
  title: 'AI Trading Services — Custom Systems, Audit Trails & War Rooms',
  description:
    'Expert AI trading infrastructure: decision audit trails, real-time dashboards, multi-strategy EAs, and AI war rooms. Built by the creator of TradeMemory Protocol.',
  openGraph: {
    title: 'AI Trading Services — Mnemox AI',
    description:
      'Custom AI trading systems with compliance-grade audit trails. From $5,000.',
    url: 'https://www.mnemox.ai/services',
    images: [{ url: '/assets/og-home.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Trading Services — Mnemox AI',
    description:
      'Custom AI trading systems with compliance-grade audit trails.',
    images: ['/assets/og-home.png'],
  },
  alternates: { canonical: 'https://www.mnemox.ai/services' },
  other: {
    'application-ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Mnemox AI Trading Services',
      provider: {
        '@type': 'Organization',
        name: 'Mnemox AI',
        url: 'https://www.mnemox.ai',
      },
      description:
        'Custom AI trading infrastructure: audit trails, dashboards, multi-strategy EAs, and AI war rooms.',
      url: 'https://www.mnemox.ai/services',
    }),
  },
};

export default function ServicesPage() {
  return <ServicesContent />;
}
