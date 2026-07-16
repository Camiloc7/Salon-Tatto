'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageOptimized } from '@/components/shared/image-optimized';
import { GalleryLightbox, LightboxImage } from '@/components/shared/gallery-lightbox';
import { CategoryAccordionCard } from '@/components/gallery/category-accordion-card';
import { cn } from '@/lib/utils';
import type { ArtistImage } from '@salon-tatto/shared';

type ArtistGalleryProps = {
  images: ArtistImage[];
};

export function ArtistGallery({ images }: ArtistGalleryProps) {
  const [lightboxData, setLightboxData] = useState<{ images: LightboxImage[], index: number } | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (!images?.length) return null;

  // Group images by category
  const groupedImages = images.reduce((acc, img) => {
    const category = (img as any).category?.name || 'Otros';
    if (!acc[category]) acc[category] = [];
    acc[category].push(img);
    return acc;
  }, {} as Record<string, ArtistImage[]>);

  const sortedCategories = Object.keys(groupedImages).sort((a, b) => a.localeCompare(b));



  return (
    <div className="relative w-full pb-20">
      <div className="max-w-7xl mx-auto">
        {sortedCategories.map((category) => {
          const categoryImages = groupedImages[category];
          
          const categoryLightboxImages: LightboxImage[] = categoryImages.map(img => ({
            id: img.id,
            url: img.url || img.cloudinaryId,
            alt: img.alt || '',
            format: img.format,
          }));

          return (
            <CategoryAccordionCard
              key={category}
              categoryName={category}
              images={categoryImages.map(img => ({ id: img.id, url: img.url || img.cloudinaryId }))}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] md:auto-rows-[300px] gap-2 md:gap-6">
                {categoryImages.map((image, index) => {
                  const isLarge = index % 5 === 0;
                  const isLandscape = index % 5 === 2;
                  
                  const isVideo = image.format === 'mp4' || image.format === 'webm' || image.format === 'mov' || (image.url || image.cloudinaryId).match(/\.(mp4|webm|mov)$/i);
                  const isHoveredLocal = hoveredId === image.id;

                  return (
                    <motion.div
                      key={image.id}
                      className={cn(
                        'relative overflow-hidden cursor-pointer group rounded-sm bg-neutral-950',
                        isLarge ? 'col-span-2 row-span-2' : isLandscape ? 'col-span-2 row-span-1' : 'col-span-1 row-span-1',
                        hoveredId && !isHoveredLocal ? 'opacity-30 grayscale' : 'opacity-100 grayscale-0',
                        'transition-all duration-700 ease-out'
                      )}
                      onMouseEnter={() => setHoveredId(image.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => setLightboxData({ images: categoryLightboxImages, index })}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.8, delay: (index % 5) * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {isVideo ? (
                        <video
                          src={image.url || image.cloudinaryId}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-2000 ease-out group-hover:scale-[1.03]"
                          muted
                          loop
                          playsInline
                          ref={(el) => {
                            if (el) {
                              if (isHoveredLocal) el.play().catch(() => {});
                              else el.pause();
                            }
                          }}
                        />
                      ) : (
                        <ImageOptimized
                          src={image.url || image.cloudinaryId}
                          alt={image.alt || ''}
                          fill
                          className="object-cover transition-transform duration-2000 ease-out group-hover:scale-[1.03]"
                          sizes={isLarge ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
                        />
                      )}
                      
                      <div className="absolute inset-0 bg-black/0 transition-colors duration-700 group-hover:bg-black/40 flex items-center justify-center pointer-events-none">
                        <div className="flex flex-col items-center translate-y-4 opacity-0 transition-all duration-700 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                          {(image as any).category?.name && (
                            <span className="text-white/90 font-mono text-[10px] sm:text-xs uppercase tracking-widest mb-2 border border-white/30 px-3 py-1 rounded-full backdrop-blur-sm">
                              {(image as any).category.name}
                            </span>
                          )}
                          <span className="text-white font-serif uppercase tracking-[0.3em] text-xs md:text-sm">
                            Ver detalle
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CategoryAccordionCard>
          );
        })}
      </div>

      <AnimatePresence>
        {lightboxData !== null && (
          <GalleryLightbox
            images={lightboxData.images}
            initialIndex={lightboxData.index}
            onClose={() => setLightboxData(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
