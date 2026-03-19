'use client';

import { useParams } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import Link from 'next/link';

export default function BadgePage() {
  const { hash } = useParams<{ hash: string }>();
  const { t } = useI18n();

  const badgeImgUrl = `/api/badge/${hash}`;

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4 py-16">
      {/* Badge image */}
      <div className="w-full max-w-2xl rounded-xl border border-border overflow-hidden shadow-2xl">
        <img src={badgeImgUrl} alt="Mnemox Reality Check Badge" className="w-full" />
      </div>

      {/* CTA */}
      <div className="mt-8 text-center">
        <h1 className="text-2xl font-display text-white mb-2">
          {t('badge_cta_title')}
        </h1>
        <p className="text-txt-dim mb-6">
          {t('badge_cta_desc')}
        </p>
        <Link
          href="/check"
          className="inline-block px-8 py-3 rounded-lg bg-cyan text-bg font-semibold hover:opacity-90 transition"
        >
          {t('badge_cta_button')}
        </Link>
      </div>

      {/* Footer */}
      <p className="mt-12 text-xs text-txt-dim">
        Powered by <span className="text-white">Mnemox AI</span> &middot; mnemox.ai/check
      </p>
    </div>
  );
}
