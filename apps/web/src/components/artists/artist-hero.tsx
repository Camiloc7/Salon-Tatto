'use client';

import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import Link from 'next/link';
import { ImageOptimized } from '@/components/shared/image-optimized';
import { getImageUrl } from '@/lib/utils';
import type { Artist } from '@salon-tatto/shared';

type ArtistHeroProps = {
  artist: Artist;
  tInstagram: string;
  tContact: string;
  whatsappNumber: string;
};

export function ArtistHero({ artist, tInstagram, tContact, whatsappNumber }: ArtistHeroProps) {
  return (
    <div className="relative flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start gap-8 md:gap-16 pt-10 pb-20">
      
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full md:w-5/12 aspect-[3/4] relative z-10 overflow-hidden rounded-sm"
      >
        <ImageOptimized
          src={getImageUrl(artist.avatar)}
          alt={artist.name || ''}
          fill
          className="object-cover transition-transform duration-1000 hover:scale-105"
          priority
        />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full md:w-7/12 flex flex-col justify-center relative z-20 md:-ml-24 md:mt-24 glass-card p-8 md:p-12"
      >
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary mb-4 leading-none tracking-tight">
          {artist.name}
        </h1>
        <p className="text-xl md:text-2xl text-foreground/80 mb-6 font-light uppercase tracking-widest">
          {artist.specialty}
        </p>
        
        {artist.biography && (
          <p className="text-muted-foreground leading-relaxed text-lg mb-8 max-w-xl whitespace-pre-wrap">
            {artist.biography}
          </p>
        )}
        
        <div className="flex flex-wrap items-center gap-6 mt-auto">
          {artist.instagramUrl && (
            <Link
              href={artist.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors uppercase tracking-wider text-sm font-medium"
            >
              <Instagram className="h-4 w-4" />
              {tInstagram}
            </Link>
          )}
          <Link
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-background bg-primary px-6 py-3 rounded-none hover:bg-primary/90 transition-colors uppercase tracking-wider"
          >
            {tContact}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
