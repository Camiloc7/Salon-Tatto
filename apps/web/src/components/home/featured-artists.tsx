'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import type { Artist } from '@salon-tatto/shared';
import { getImageUrl } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

export function FeaturedArtists() {
  const t = useTranslations('home');
  const tCommon = useTranslations();
  const locale = useLocale();

  const { data: artists, isLoading } = useQuery({
    queryKey: queryKeys.artists.list({ locale, limit: 6 }),
    queryFn: async () => {
      const res = await api.get<{ data: Artist[] }>('/artists', {
        params: { locale, limit: 6, isActive: true },
      });
      return res.data;
    },
  });

  return (
    <section className="py-24 bg-black border-t border-zinc-900">
      <div className="container max-w-7xl px-6 mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-serif font-light tracking-wide text-white uppercase mb-4">
              {t('featuredArtists.title')}
            </h2>
            <div className="w-12 h-[1px] bg-amber-500/50 mb-6" />
            <p className="text-zinc-400 font-light leading-relaxed tracking-wide">
              {t('featuredArtists.description')}
            </p>
          </div>
          <Link href={`/${locale}/artists`} className="hidden md:block">
            <Button variant="ghost" className="text-zinc-400 hover:text-white uppercase tracking-widest text-xs font-semibold rounded-none group">
              {tCommon('actions.viewAll')} <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Minimal Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-[400px] animate-pulse bg-zinc-900/50 border border-zinc-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 group/grid">
            {artists?.map((artist, index) => {
              const displayImage = artist.avatar 
                ? getImageUrl(artist.avatar) 
                : (artist.images && artist.images.length > 0 ? getImageUrl(artist.images[0].url) : null);
              
              return (
                <motion.div
                  key={artist.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.7, ease: 'easeOut' }}
                  className="group relative"
                >
                  <Link href={`/${locale}/artists/${artist.slug}`} className="block">
                    <div className="relative h-[450px] overflow-hidden bg-zinc-900">
                      {displayImage ? (
                        <img 
                          src={displayImage} 
                          alt={`${artist.name} profile`} 
                          crossOrigin="anonymous"
                          className="absolute inset-0 w-full h-full object-cover object-top transition-all duration-700 group-hover/grid:grayscale group-hover/grid:opacity-60 group-hover:!grayscale-0 group-hover:!opacity-100 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-zinc-800" />
                      )}
                      
                      {/* Gradient overlay for text */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="absolute bottom-0 left-0 p-8 w-full">
                        <h3 className="text-2xl font-serif text-white uppercase tracking-widest mb-1">
                          {artist.name}
                        </h3>
                        <p className="text-xs text-amber-500/80 font-medium tracking-[0.2em] uppercase">
                          {artist.specialty}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="mt-12 text-center md:hidden">
          <Link href={`/${locale}/artists`}>
            <Button variant="outline" className="w-full text-zinc-300 border-zinc-800 hover:bg-zinc-900 hover:text-white uppercase tracking-widest text-xs py-6 rounded-none">
              {tCommon('actions.viewAll')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
