import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live Dashboard - Strategy E | Mnemox',
  description: 'Watch Strategy E (BTCUSDT) trade live with AI-powered memory. P100% vs 1000 random strategies.',
  openGraph: {
    title: 'Live Dashboard - Strategy E | Mnemox',
    description: 'Watch Strategy E (BTCUSDT) trade live with AI-powered memory. P100% vs 1000 random strategies.',
    images: ['/og-home.png'],
  },
};

export default function LiveLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
