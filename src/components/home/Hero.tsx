'use client';

import Image from 'next/image';
import { useI18n } from '@/lib/i18n';

export function Hero() {
  const { t } = useI18n();

  return (
    <section className="relative flex flex-col items-center px-6 pb-16 pt-20 text-center md:pt-28">
      {/* Mascot with floating animation */}
      <div className="animate-float mb-8">
        <Image
          src="/mne-cat.png"
          alt="Mnemox AI mascot"
          width={160}
          height={160}
          priority
          className="drop-shadow-[0_0_40px_rgba(0,229,255,0.25)]"
        />
      </div>

      {/* Title */}
      <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight text-txt md:text-6xl">
        {t('hero_title')}
      </h1>

      {/* Subtitle */}
      <p className="mt-5 max-w-xl text-base leading-relaxed text-txt-dim md:text-lg">
        {t('hero_subtitle')}
      </p>
    </section>
  );
}
