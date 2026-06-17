'use client';

import { ImageCard } from '@/components/shared/image-card';
import type { ArtistImage } from '@salon-tatto/shared';

type ArtistGalleryProps = {
  images: ArtistImage[];
};

export function ArtistGallery({ images }: ArtistGalleryProps) {
  if (!images?.length) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {images.map((image) => (
        <ImageCard
          key={image.id}
          src={image.url || image.cloudinaryId}
          alt={image.alt || ''}
          className="aspect-square"
        />
      ))}
    </div>
  );
}
