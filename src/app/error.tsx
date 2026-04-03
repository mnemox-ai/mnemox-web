'use client';

import { useEffect } from 'react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      console.error('Page error:', error);
    }
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-danger-dim bg-danger/10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-danger"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      <h1 className="mb-2 text-2xl font-bold text-txt">Something went wrong</h1>
      <p className="mb-6 max-w-md text-txt-dim">
        An unexpected error occurred. Please try again or contact support if the problem persists.
      </p>

      {error.digest && (
        <p className="mb-6 font-mono text-xs text-txt-muted">
          Error ID: {error.digest}
        </p>
      )}

      <div className="flex gap-4">
        <button
          onClick={reset}
          className="rounded-lg bg-cyan px-6 py-2.5 font-display text-sm font-semibold text-black transition-colors hover:bg-white"
        >
          Try Again
        </button>
        <a
          href="/"
          className="rounded-lg border border-border px-6 py-2.5 font-display text-sm text-txt-dim transition-colors hover:border-cyan hover:text-cyan"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
