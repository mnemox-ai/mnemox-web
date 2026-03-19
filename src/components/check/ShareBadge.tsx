'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';

interface ShareBadgeProps {
  ideaHash: string;
  score: number;
}

export function ShareBadge({ ideaHash, score }: ShareBadgeProps) {
  const { t } = useI18n();
  const [loaded, setLoaded] = useState(false);
  const [copyText, setCopyText] = useState<string | null>(null);

  const badgeUrl = `/api/badge/${ideaHash}`;
  const publicUrl = `https://www.mnemox.ai/api/badge/${ideaHash}`;

  const handleDownload = async () => {
    try {
      const res = await fetch(badgeUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mnemox-badge.png';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      /* download failed silently */
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopyText(t('check_copied'));
      setTimeout(() => setCopyText(null), 2000);
    } catch {
      /* clipboard not available */
    }
  };

  const handleShareX = () => {
    const text = encodeURIComponent(`My idea scored ${score}/100 on Mnemox Reality Check`);
    const url = encodeURIComponent(publicUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const btnClass =
    'px-4 py-2 rounded-lg border border-border bg-bg-card hover:bg-bg-card-hover text-txt-dim hover:text-txt transition text-sm';

  return (
    <div className="mt-8">
      <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[2px] text-cyan">
        {t('check_share_title')}
      </h3>

      {/* Badge preview */}
      <div className="rounded-xl border border-border overflow-hidden">
        {!loaded && (
          <div className="bg-bg-card animate-pulse h-[315px] rounded-xl" />
        )}
        <img
          src={badgeUrl}
          alt="Mnemox Badge"
          onLoad={() => setLoaded(true)}
          className={loaded ? '' : 'hidden'}
        />
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mt-4">
        <button onClick={handleDownload} className={btnClass}>
          {t('check_download')}
        </button>
        <button onClick={handleCopyLink} className={btnClass}>
          {copyText ?? t('check_copy_link')}
        </button>
        <button onClick={handleShareX} className={btnClass}>
          {t('check_share_x')}
        </button>
      </div>
    </div>
  );
}
