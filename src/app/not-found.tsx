import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-6">
        <span className="font-mono text-8xl font-bold text-cyan">404</span>
      </div>

      <h1 className="mb-2 text-2xl font-bold text-txt">Page Not Found</h1>
      <p className="mb-8 max-w-md text-txt-dim">
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </p>

      <div className="flex gap-4">
        <Link
          href="/"
          className="rounded-lg bg-cyan px-6 py-2.5 font-display text-sm font-semibold text-black transition-colors hover:bg-white"
        >
          Go Home
        </Link>
        <Link
          href="/check"
          className="rounded-lg border border-border px-6 py-2.5 font-display text-sm text-txt-dim transition-colors hover:border-cyan hover:text-cyan"
        >
          Try Idea Check
        </Link>
      </div>

      <div className="mt-12 font-mono text-xs text-txt-muted">
        <p>Lost? Here are some helpful links:</p>
        <div className="mt-3 flex flex-wrap justify-center gap-4">
          <Link href="/services" className="text-cyan hover:underline">Services</Link>
          <Link href="/portfolio" className="text-cyan hover:underline">Portfolio</Link>
          <Link href="/blog" className="text-cyan hover:underline">Blog</Link>
          <a 
            href="https://github.com/mnemox-ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-cyan hover:underline"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
