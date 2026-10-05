import type { Metadata } from 'next';
import { Mona_Sans } from 'next/font/google';

// TradeMemory's own face (see tradememory-protocol/assets and the promo
// video): Mona Sans, normal width for text and 125% wide for emphasis.
const mona = Mona_Sans({
  subsets: ['latin'],
  weight: 'variable',
  axes: ['wdth'],
  variable: '--font-mona',
  display: 'swap',
});

const TITLE = 'TradeMemory remembers what it cost';
const DESCRIPTION =
  'Paste a Hyperliquid address. Your browser rebuilds its closed trades, shows where the account loses money, and writes the rule TradeMemory would propose. Nothing is stored or sent to us.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://www.mnemox.ai/tradememory',
    siteName: 'Mnemox AI',
    images: [
      {
        url: '/assets/og-home.png',
        width: 1200,
        height: 630,
        alt: 'TradeMemory',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/assets/og-home.png'],
  },
  alternates: {
    canonical: 'https://www.mnemox.ai/tradememory',
  },
  other: {
    'application-ld+json': JSON.stringify([
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'TradeMemory',
        url: 'https://www.mnemox.ai/tradememory',
        downloadUrl: 'https://pypi.org/project/tradememory-protocol/',
        installUrl: 'https://github.com/mnemox-ai/tradememory-protocol',
        description:
          'Memory and a brake for AI trading agents. Syncs fill history from Hyperliquid and Alpaca into local memory, reports where the history loses money, proposes rules the owner approves, and holds orders that break them before they reach the broker.',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Windows, macOS, Linux',
        license: 'https://opensource.org/license/mit',
        offers: [
          {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            description: 'Open source, self-hosted, MIT licensed. No paid tier.',
          },
        ],
        creator: {
          '@type': 'Organization',
          name: 'Mnemox AI',
          url: 'https://www.mnemox.ai',
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What does the address page do with my address?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'It sends the address to Hyperliquid\'s public info API from your browser, rebuilds the closed trades locally, and shows descriptive statistics of that history. Nothing is stored or sent to Mnemox; the address is not put in the URL or in analytics.',
            },
          },
          {
            '@type': 'Question',
            name: 'Does TradeMemory execute trades?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. TradeMemory syncs history into memory and, with the optional brake in front of a broker MCP server, holds or refuses orders that break a rule the owner approved. It never places orders itself.',
            },
          },
          {
            '@type': 'Question',
            name: 'Which venues are supported?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'History sync from Hyperliquid (public API, no key) and Alpaca (read-only key). The brake currently fronts Alpaca\'s official MCP server, in preview.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is TradeMemory free?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. TradeMemory is open source under the MIT license and runs on your own machine. The brake\'s policy engine, Mnemox Control, is AGPL-3.0.',
            },
          },
          {
            '@type': 'Question',
            name: 'How do I install TradeMemory?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'pip install tradememory-protocol, then tradememory sync hyperliquid --address 0x... to sync a history. The brake needs pip install "tradememory-protocol[proxy]" on Python 3.12 or newer.',
            },
          },
        ],
      },
    ]),
  },
};

export default function TradeMemoryLayout({ children }: { children: React.ReactNode }) {
  return <div className={mona.variable}>{children}</div>;
}
