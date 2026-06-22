'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageOptimized } from '@/components/shared/image-optimized';
import { GalleryLightbox, LightboxImage } from '@/components/shared/gallery-lightbox';
import { cn } from '@/lib/utils';
import type { ArtistImage } from '@salon-tatto/shared';

type ArtistGalleryProps = {
  images: ArtistImage[];
};

export function ArtistGallery({ images }: ArtistGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (!images?.length) return null;

  const lightboxImages: LightboxImage[] = images.map(img => ({
    id: img.id,
    url: img.url || img.cloudinaryId,
    alt: img.alt || '',
  }));

  return (
    <div className="relative w-full pb-20">
      <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] md:auto-rows-[300px] gap-2 md:gap-6">
        {images.map((image, index) => {
          // Asymmetrical Bento Grid logic: 
          // 0th image: 2x2 large block
          // 2nd image: 2x1 wide panoramic
          // Others: 1x1 standard blocks
          const isLarge = index % 5 === 0;
          const isLandscape = index % 5 === 2;
          
          return (
            <motion.div
              key={image.id}
              className={cn(
                'relative overflow-hidden cursor-pointer group rounded-sm bg-neutral-950',
                isLarge ? 'col-span-2 row-span-2' : isLandscape ? 'col-span-2 row-span-1' : 'col-span-1 row-span-1',
                // Dimming effect if another item is hovered
                hoveredId && hoveredId !== image.id ? 'opacity-30 grayscale' : 'opacity-100 grayscale-0',
                'transition-all duration-700 ease-out'
              )}
              onMouseEnter={() => setHoveredId(image.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setSelectedIndex(index)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: (index % 5) * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <ImageOptimized
                src={image.url || image.cloudinaryId}
                alt={image.alt || ''}
                fill
                className="object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-[1.03]"
                sizes={isLarge ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
              />
              
              <div className="absolute inset-0 bg-black/0 transition-colors duration-700 group-hover:bg-black/30 flex items-center justify-center pointer-events-none">
                <span className="translate-y-4 opacity-0 transition-all duration-700 ease-out group-hover:translate-y-0 group-hover:opacity-100 text-white font-serif uppercase tracking-[0.3em] text-xs md:text-sm">
                  Ver detalle
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedIndex !== null && (
          <GalleryLightbox
            images={lightboxImages}
            initialIndex={selectedIndex}
            onClose={() => setSelectedIndex(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
