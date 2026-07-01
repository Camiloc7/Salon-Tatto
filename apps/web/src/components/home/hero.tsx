'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, Star, Users, MapPin } from 'lucide-react';
import type { StudioSettings } from '@salon-tatto/shared';

export function Hero({ settings }: { settings: StudioSettings | null }) {
  const t = useTranslations('home');
  const tCommon = useTranslations();
  const locale = useLocale();

  const title = settings?.studioName || t('hero.title');
  const phoneDigits = settings?.phone ? settings.phone.replace(/\D/g, '') : '1234567890';
  const waMessage = encodeURIComponent("Hi! I'd like to book an appointment. Here's my tattoo idea and reference photo. Could you recommend the best artist for my project?");
  const whatsappLink = `https://wa.me/${phoneDigits}?text=${waMessage}`;

  const isVideo = settings?.heroMediaUrl?.match(/\.(mp4|webm|mov)$/i);
  const currentSubtitle = locale === 'es' ? settings?.heroSubtitle_es : settings?.heroSubtitle_en;

  return (
    <section className="relative min-h-[100dvh] w-full bg-black overflow-hidden flex flex-col items-center justify-center">
      {/* Preload critical assets for LCP */}
      <link rel="preload" href="/logo.svg" as="image" type="image/svg+xml" crossOrigin="anonymous" fetchPriority="high" />
      {!settings?.heroMediaUrl && (
        <link rel="preload" href="/stardust.png" as="image" fetchPriority="high" />
      )}

      {settings?.heroMediaUrl ? (
        <>
          {isVideo ? (
            <video
              src={settings.heroMediaUrl}
              className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 mix-blend-screen"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <img
              src={settings.heroMediaUrl}
              alt="Hero Background"
              className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 mix-blend-screen"
              fetchPriority="high"
            />
          )}
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/50 via-black to-black z-0" />
          <div className="absolute inset-0 bg-[url('/stardust.png')] opacity-20 mix-blend-overlay z-0" />
        </>
      )}

      {/* Main Content Container */}
      <motion.div
        className="relative z-10 w-full max-w-5xl px-6 flex flex-col items-center text-center mt-20"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        {/*
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif tracking-widest text-white/90 drop-shadow-sm pb-4 uppercase leading-tight font-light">
          {title}
        </h1>
        */}

        {/* LOGO NUEVO (Imagen WebP) */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-[400px] md:h-[400px] mx-auto mb-6">
          <Image src="/LR.webp" alt="Studio Logo" fill className="object-contain" priority />
        </div>

        {/* LOGO ANTERIOR (Máscara SVG Dorado) - Descomentar para restaurar */}
        {/*
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-[400px] md:h-[400px] mx-auto mb-6 rounded-2xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-primary" />
          <div className="absolute inset-0 bg-black/95 backdrop-blur-sm [mask-image:url(/logo.svg)] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]" />
        </div>
        */}

        <div className="w-24 h-[1px] bg-primary/50 my-6 mx-auto" />

        <p className="text-lg md:text-xl text-zinc-400 font-light max-w-2xl tracking-wide leading-relaxed whitespace-pre-line">
          {currentSubtitle || t('hero.subtitle')}
        </p>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <Link href={whatsappLink} target="_blank">
            <Button size="lg" className="h-14 px-10 text-sm tracking-widest uppercase font-semibold rounded-none bg-white text-black hover:bg-zinc-200 transition-colors border border-transparent">
              {tCommon('actions.bookNow')}
            </Button>
          </Link>
        </motion.div>

        {/* Minimalist Navigation Icons */}
        <motion.div
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 w-full max-w-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          <NavIcon href={`/${locale}/galeria`} icon={<ImageIcon size={20} strokeWidth={1} />} label={tCommon('nav.gallery')} />
          <NavIcon href={`/${locale}/artistas`} icon={<Users size={20} strokeWidth={1} />} label={tCommon('nav.artists')} />
          <NavIcon href={`/${locale}/blog`} icon={<Star size={20} strokeWidth={1} />} label={tCommon('nav.blog')} />
          <NavIcon href={`/${locale}/contacto`} icon={<MapPin size={20} strokeWidth={1} />} label={tCommon('nav.contact')} />
        </motion.div>
      </motion.div>
    </section>
  );
}

function NavIcon({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex flex-col items-center gap-4 group">
      <div className="w-14 h-14 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 transition-all duration-500 group-hover:border-zinc-500 group-hover:text-white bg-black/50 backdrop-blur-sm">
        {icon}
      </div>
      <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-zinc-500 group-hover:text-white transition-colors">
        {label}
      </span>
    </Link>
  );
}
