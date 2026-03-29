'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n';

export function Hero() {
  const { t } = useI18n();

  return (
    <section className="relative flex flex-col items-center px-6 pb-16 pt-20 text-center md:pt-28">
      {/* Mascot with floating animation — mask fades edges into bg */}
      <div className="animate-float mb-8">
        <Image
          src="/mne-cat.png"
          alt="Mnemox AI mascot"
          width={180}
          height={180}
          priority
          className="drop-shadow-[0_0_50px_rgba(0,229,255,0.3)]"
          style={{
            maskImage: 'radial-gradient(ellipse 70% 70% at 50% 45%, black 40%, transparent 72%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 45%, black 40%, transparent 72%)',
          }}
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

      {/* Services CTA */}
      <Link
        href="/services"
        className="mt-8 inline-block rounded-lg bg-cyan px-8 py-3 font-semibold text-bg transition-colors hover:bg-cyan/90 no-underline hover:no-underline"
      >
        {t('hero_services_cta')}
      </Link>
    </section>
  );
}
