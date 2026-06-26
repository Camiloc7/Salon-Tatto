'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ImageCard } from '@/components/shared/image-card';
import { GalleryLightbox, LightboxImage } from '@/components/shared/gallery-lightbox';
import { useTranslations } from 'next-intl';

type GalleryGridProps = {
  images: LightboxImage[];
};

export function GalleryGrid({ images }: GalleryGridProps) {
  const t = useTranslations('gallery');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!images?.length) return null;

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
        {images.map((image, index) => (
          <div key={image.id} className="mb-4 break-inside-avoid">
            <ImageCard
              src={image.url}
              alt={image.alt || ''}
              className="w-full"
              disableInternalModal
              format={image.format}
              onClick={() => setSelectedIndex(index)}
            />
            {image.artistName && (
              <div className="mt-2 flex flex-col items-center">
                {image.categoryName && (
                  <span className="text-[10px] uppercase tracking-widest text-primary/80 font-mono mb-1">
                    {image.categoryName}
                  </span>
                )}
                <p className="text-xs text-muted-foreground text-center">
                  {t('byArtist')} {image.artistName}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedIndex !== null && (
          <GalleryLightbox
            images={images}
            initialIndex={selectedIndex}
            onClose={() => setSelectedIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
