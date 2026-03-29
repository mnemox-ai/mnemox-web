'use client';

import type { ReactNode } from 'react';

interface BrowserFrameProps {
  title: string;
  children: ReactNode;
}

export function BrowserFrame({ title, children }: BrowserFrameProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-bg-card shadow-2xl shadow-cyan/5">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-border bg-bg px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500/80" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <div className="h-3 w-3 rounded-full bg-green-500/80" />
        </div>
        <div className="mx-auto font-mono text-xs text-txt-dim">{title}</div>
        <div className="w-[52px]" /> {/* Spacer to center title */}
      </div>
      {/* Content */}
      <div className="p-4 md:p-6">{children}</div>
    </div>
  );
}
