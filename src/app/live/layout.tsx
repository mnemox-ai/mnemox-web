import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live Dashboard - Strategy E | Mnemox',
  description: 'Watch Strategy E (BTCUSDT) trade live with AI-powered memory. P100% vs 1000 random strategies.',
  openGraph: {
    title: 'Live Dashboard - Strategy E | Mnemox',
    description: 'Watch Strategy E (BTCUSDT) trade live with AI-powered memory. P100% vs 1000 random strategies.',
    url: 'https://www.mnemox.ai/live',
    siteName: 'Mnemox AI',
    images: ['/og-home.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Live Dashboard - Strategy E | Mnemox',
    description: 'Watch Strategy E trade live.',
  },
};

export default function LiveLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
