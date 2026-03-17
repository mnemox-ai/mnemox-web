import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Idea Reality Check — Validate Your Idea Against 5 Databases | Mnemox',
  description:
    'Pre-build validation for developers and AI agents. Scans GitHub, Hacker News, npm, PyPI, and Product Hunt simultaneously. Get a 0-100 reality signal in 15 seconds.',
  openGraph: {
    title: 'Idea Reality Check — Validate Your Idea Against 5 Databases',
    description:
      'Scans 5 live sources, scores your idea 0-100, and tells you whether the market is accelerating, stable, or declining — in 15 seconds.',
    url: 'https://mnemox.ai/check',
    siteName: 'Mnemox',
    images: [{ url: '/assets/og-check.png', width: 1200, height: 630, alt: 'Idea Reality Check' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Idea Reality Check — Validate Your Idea Against 5 Databases',
    description: 'Scans 5 live sources in parallel. Get a 0-100 reality signal in 15 seconds.',
    images: ['/assets/og-check.png'],
  },
  alternates: {
    canonical: 'https://mnemox.ai/check',
  },
  other: {
    'application-ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Idea Reality Check',
      url: 'https://mnemox.ai/check',
      description:
        'Pre-build validation tool. Scans GitHub, Hacker News, npm, PyPI, and Product Hunt to score your software idea 0-100.',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any',
      offers: [
        { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Quick scan (GitHub + HN)' },
        { '@type': 'Offer', price: '9.99', priceCurrency: 'USD', description: 'Deep scan (5 sources + AI analysis)' },
      ],
      creator: {
        '@type': 'Organization',
        name: 'Mnemox AI',
        url: 'https://mnemox.ai',
      },
    }),
  },
};

export default function CheckLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
