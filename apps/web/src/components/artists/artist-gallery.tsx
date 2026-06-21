'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ImageOptimized } from '@/components/shared/image-optimized';
import { cn } from '@/lib/utils';
import type { ArtistImage } from '@salon-tatto/shared';

type ArtistGalleryProps = {
  images: ArtistImage[];
};

export function ArtistGallery({ images }: ArtistGalleryProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Stop body scroll when modal is open
  useEffect(() => {
    if (selectedId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedId]);

  if (!images?.length) return null;

  const selectedImage = images.find((img) => img.id === selectedId);

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
              layoutId={`gallery-image-${image.id}`}
              className={cn(
                'relative overflow-hidden cursor-pointer group rounded-sm bg-neutral-950',
                isLarge ? 'col-span-2 row-span-2' : isLandscape ? 'col-span-2 row-span-1' : 'col-span-1 row-span-1',
                // Dimming effect if another item is hovered
                hoveredId && hoveredId !== image.id ? 'opacity-30 grayscale' : 'opacity-100 grayscale-0',
                'transition-all duration-700 ease-out'
              )}
              onMouseEnter={() => setHoveredId(image.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setSelectedId(image.id)}
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
        {selectedId && selectedImage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="absolute inset-0 bg-background/95 backdrop-blur-md cursor-pointer"
              onClick={() => setSelectedId(null)}
            />
            
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              onClick={() => setSelectedId(null)}
              className="absolute top-6 right-6 md:top-10 md:right-10 z-[110] rounded-full bg-foreground/5 p-3 text-foreground hover:bg-foreground/10 hover:scale-110 transition-all backdrop-blur-sm"
            >
              <X className="h-6 w-6" />
            </motion.button>
            
            {/* Expanded Image */}
            <motion.div
              layoutId={`gallery-image-${selectedId}`}
              className="relative z-[105] w-full h-full max-w-7xl flex flex-col items-center justify-center overflow-hidden rounded-sm"
            >
              <div className="relative w-full h-full">
                <ImageOptimized
                  src={selectedImage.url || selectedImage.cloudinaryId}
                  alt={selectedImage.alt || ''}
                  fill
                  className="object-contain"
                  priority
                  sizes="100vw"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
