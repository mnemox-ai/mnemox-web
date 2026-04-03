import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog — AI Trading & Developer Tools Articles',
  description: 'Technical articles about MCP servers, AI trading, and developer tools by Mnemox AI. Guides for algorithmic traders and startup founders.',
  alternates: {
    canonical: 'https://www.mnemox.ai/blog',
  },
  openGraph: {
    title: 'Mnemox AI Blog — Technical Articles',
    description: 'Technical articles about MCP servers, AI trading, and developer tools.',
    url: 'https://www.mnemox.ai/blog',
    type: 'website',
  },
  other: {
    'application-ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Mnemox AI Blog',
      description: 'Technical articles about MCP servers, AI trading, and developer tools.',
      url: 'https://www.mnemox.ai/blog',
      publisher: {
        '@type': 'Organization',
        name: 'Mnemox AI',
        url: 'https://www.mnemox.ai',
      },
      blogPost: [
        {
          '@type': 'BlogPosting',
          headline: 'MCP Servers for Finance and Trading: A Complete List (2026)',
          url: 'https://www.mnemox.ai/blog/mcp-servers-finance',
          datePublished: '2026-03-22',
          author: { '@type': 'Organization', name: 'Mnemox AI' },
        },
        {
          '@type': 'BlogPosting',
          headline: 'How to Check If Your Startup Idea Already Exists (Before You Build)',
          url: 'https://www.mnemox.ai/blog/check-startup-idea',
          datePublished: '2026-03-22',
          author: { '@type': 'Organization', name: 'Mnemox AI' },
        },
      ],
    }),
  },
};

const posts = [
  {
    slug: 'mcp-servers-finance',
    title: 'MCP Servers for Finance and Trading: A Complete List (2026)',
    description: 'Every MCP server for trading, market data, and DeFi — compared by features, language, and use case.',
    date: '2026-03-22',
  },
  {
    slug: 'check-startup-idea',
    title: 'How to Check If Your Startup Idea Already Exists (Before You Build)',
    description: 'Manual methods vs automated scanning. Stop reinventing the wheel.',
    date: '2026-03-22',
  },
];

export default function BlogIndex() {
  return (
    <div>
      <h1 className="mb-2 font-display text-4xl font-bold">Blog</h1>
      <p className="mb-12 text-txt-dim">Technical articles by Mnemox AI.</p>

      <div className="space-y-8">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block rounded-xl border border-border bg-bg-card p-6 transition-colors hover:border-cyan"
          >
            <time className="text-xs text-txt-dim">{post.date}</time>
            <h2 className="mt-1 font-display text-xl font-semibold">{post.title}</h2>
            <p className="mt-2 text-sm text-txt-dim">{post.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
