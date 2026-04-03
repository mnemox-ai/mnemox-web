import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Idea Reality Check — Validate Your Idea Against 5 Databases | Mnemox',
  description:
    'Pre-build validation for developers and AI agents. Scans GitHub, Hacker News, npm, PyPI, and Product Hunt simultaneously. Get a 0-100 reality signal in 15 seconds.',
  openGraph: {
    title: 'Idea Reality Check — Validate Your Idea Against 5 Databases',
    description:
      'Scans 5 live sources, scores your idea 0-100, and tells you whether the market is accelerating, stable, or declining — in 15 seconds.',
    url: 'https://www.mnemox.ai/check',
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
    canonical: 'https://www.mnemox.ai/check',
  },
  other: {
    'application-ld+json': JSON.stringify([
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        softwareVersion: '0.5.0',
        name: 'Idea Reality Check',
        url: 'https://www.mnemox.ai/check',
        downloadUrl: 'https://pypi.org/project/idea-reality-mcp/',
        screenshot: 'https://www.mnemox.ai/assets/og-check.png',
        description:
          'Pre-build validation tool. Scans GitHub, Hacker News, npm, PyPI, and Product Hunt to score your software idea 0-100.',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any',
        offers: [
          { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free — scans GitHub, HN, npm, PyPI, Product Hunt, and Stack Overflow' },
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
            name: 'Is Idea Reality Check free?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, basic scans are completely free with no signup required. Advanced features may require a subscription.',
            },
          },
          {
            '@type': 'Question',
            name: 'What databases does Idea Reality Check scan?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Idea Reality Check scans GitHub repositories, Hacker News discussions, npm packages, PyPI packages, and Product Hunt launches simultaneously.',
            },
          },
          {
            '@type': 'Question',
            name: 'How accurate is the competitor detection?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The system uses AI to identify semantic similarities across multiple databases. Accuracy depends on how well-documented competitors are online, but it catches most established projects.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I use Idea Reality Check in my CI/CD pipeline?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, you can use the idea-check-action GitHub Action or the idea-reality-mcp Python package to integrate idea validation into your development workflow.',
            },
          },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: 'How to Validate Your Startup Idea',
        description: 'Use Idea Reality Check to scan the market before you build.',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Describe your idea',
            text: 'Enter a brief description of your product or startup idea in the text box.',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Run the scan',
            text: 'Click "Check Reality" to scan 5 databases simultaneously for existing competitors.',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Review results',
            text: 'Get a 0-100 reality score, list of competitors, and gap analysis showing underserved opportunities.',
          },
        ],
        totalTime: 'PT15S',
      },
    ]),
  },
};

export default function CheckLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
