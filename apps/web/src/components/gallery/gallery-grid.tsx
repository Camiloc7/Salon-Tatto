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
              onClick={() => setSelectedIndex(index)}
            />
            {image.artistName && (
              <p className="mt-1 text-xs text-muted-foreground text-center">
                {t('byArtist')} {image.artistName}
              </p>
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
