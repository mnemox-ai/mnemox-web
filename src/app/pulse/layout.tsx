import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Idea Pulse | Mnemox AI',
  description:
    'Real-time startup idea trends. See what founders are building, where the gaps are, and which ideas are trending — powered by 2,600+ reality checks.',
  openGraph: {
    title: 'Idea Pulse | Mnemox AI',
    description: 'Real-time startup idea trends from 35+ countries',
    url: 'https://www.mnemox.ai/pulse',
    siteName: 'Mnemox AI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Idea Pulse | Mnemox AI',
    description: 'What are founders building right now? See real-time trends.',
  },
};

export default function PulseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
