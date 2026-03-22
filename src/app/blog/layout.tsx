import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Mnemox Blog',
    default: 'Blog | Mnemox',
  },
  description: 'Technical articles about MCP servers, AI trading, and developer tools.',
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 text-txt">
      {children}
    </article>
  );
}
