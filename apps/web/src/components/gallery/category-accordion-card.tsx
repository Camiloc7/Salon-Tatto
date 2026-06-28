'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { getOptimizedImageUrl } from '@/lib/utils';
import { ImageOptimized } from '@/components/shared/image-optimized';

interface CategoryAccordionCardProps {
  categoryName: string;
  images: { id: string; url: string }[];
  children: React.ReactNode;
}

export function CategoryAccordionCard({
  categoryName,
  images,
  children,
}: CategoryAccordionCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Background carousel logic
  useEffect(() => {
    if (images.length <= 1 || isOpen) return; // Stop carousel if open or only 1 image

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 4000); // 4 seconds crossfade

    return () => clearInterval(interval);
  }, [images.length, isOpen]);

  const currentImageUrl = images[currentImageIndex]?.url;

  return (
    <div className="mb-8 border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950">
      {/* Header / Banner */}
      <div
        className="relative h-[250px] sm:h-[300px] w-full cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Background Image Carousel */}
        <AnimatePresence mode="popLayout">
          {!isOpen && currentImageUrl ? (
            <motion.div
              key={currentImageUrl}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="absolute inset-0 z-0"
            >
              <ImageOptimized
                src={currentImageUrl}
                alt={categoryName}
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </motion.div>
          ) : (
            // Static background when open, or if no images
            <motion.div
              key="static-bg"
              className="absolute inset-0 z-0"
            >
              {images[0] && (
                <ImageOptimized
                  src={images[0].url}
                  alt={categoryName}
                  fill
                  className="object-cover opacity-50"
                  sizes="(max-width: 1200px) 100vw, 1200px"
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overlay */}
        <div 
          className={`absolute inset-0 z-10 transition-colors duration-500 ${
            isOpen ? 'bg-black/80' : 'bg-black/60 group-hover:bg-black/50'
          }`} 
        />

        {/* Content */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-3xl sm:text-5xl font-serif tracking-widest text-white uppercase drop-shadow-md">
            {categoryName}
          </h2>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 text-zinc-300"
          >
            <ChevronDown className="w-8 h-8 opacity-70 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        </div>
      </div>

      {/* Expandable Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="p-4 sm:p-8 border-t border-zinc-800">
              {children}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
