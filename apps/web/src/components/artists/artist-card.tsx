import Link from 'next/link';
import { getImageUrl } from '@/lib/utils';
import type { Artist } from '@salon-tatto/shared';
import * as motion from 'framer-motion/client';
import { Instagram, Twitter, Youtube } from 'lucide-react';

type ArtistCardProps = {
  artist: Artist;
  locale: string;
  isPriority?: boolean;
};

export function ArtistCard({ artist, locale, isPriority = false }: ArtistCardProps) {
  const coverUrl = getImageUrl(artist.avatar);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <div
        className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-muted-foreground/20 bg-card p-4 sm:p-6 text-card-foreground shadow-[10px_10px_30px_rgba(0,0,0,0.15)] transition-all hover:shadow-[10px_10px_30px_rgba(0,0,0,0.25)]"
      >
        <Link href={`/${locale}/artistas/${artist.slug}`} className="absolute inset-0 z-10" aria-label={`Ver portafolio de ${artist.name}`} />

        {/* Subtle noise/texture overlay effect */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

        {/* Inner Border / Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-muted">
          <img
            src={coverUrl}
            alt={artist.name || 'Artist'}
            crossOrigin="anonymous"
            fetchPriority={isPriority ? "high" : "auto"}
            className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>
        
        <div className="mt-6 flex flex-1 flex-col items-center text-center">
          <h3 className="text-2xl font-serif tracking-wide text-foreground">
            {artist.name?.toUpperCase()}
          </h3>
          <p className="mt-2 text-xs font-semibold text-primary uppercase tracking-[0.2em]">
            {artist.specialty}
          </p>
          
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground line-clamp-3 md:line-clamp-4 px-2">
            {artist.biography || "Conoce más sobre el increíble trabajo y estilo de este artista en su portafolio detallado. Especialista en diseños únicos y personalizados."}
          </p>
        </div>
        
        <div className="mt-8 flex items-center justify-between border-t border-border pt-4">
          <span
            className="inline-flex items-center justify-center rounded-sm border border-foreground/30 bg-transparent px-4 py-1.5 text-xs font-medium text-foreground transition-colors group-hover:bg-foreground group-hover:text-background"
          >
            VER PORTAFOLIO
          </span>
          
          <div className="flex gap-3 text-muted-foreground relative z-20">
            {artist.instagramUrl ? (
              <a href={artist.instagramUrl} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
            ) : (
              <Instagram className="h-4 w-4 opacity-50" />
            )}
            {/* <Twitter className="h-4 w-4 opacity-50" /> */}
            {/* <Youtube className="h-4 w-4 opacity-50" /> */}
          </div>
        </div>
      </div>
    </motion.div>
  );
}



