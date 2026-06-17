'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';

export function Hero() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80 z-10" />

      <div className="container relative z-20 mx-auto px-4 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          {t('hero.title')}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 sm:text-xl">
          {t('hero.subtitle')}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href={`/${locale}/artistas`}>
            <Button size="lg" className="min-w-[200px]">
              {t('hero.cta')}
            </Button>
          </Link>
          <Link href={`/${locale}/galeria`}>
            <Button variant="outline" size="lg" className="min-w-[200px] text-white border-white hover:bg-white/10">
              {t('hero.secondaryCta')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
