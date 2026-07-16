import { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageOptimized } from '@/components/shared/image-optimized';

export type LightboxImage = {
  id: string;
  url: string;
  alt?: string;
  artistName?: string;
  categoryName?: string;
  format?: string;
};

type GalleryLightboxProps = {
  images: LightboxImage[];
  initialIndex: number;
  onClose: () => void;
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export function GalleryLightbox({ images, initialIndex, onClose }: GalleryLightboxProps) {
  const [[page, direction], setPage] = useState([initialIndex, 0]);

  // We only have 1 active image, wrap the index
  const imageIndex = ((page % images.length) + images.length) % images.length;
  const currentImage = images[imageIndex];

  const paginate = useCallback(
    (newDirection: number) => {
      setPage([page + newDirection, newDirection]);
    },
    [page]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        paginate(1);
      } else if (e.key === 'ArrowLeft') {
        paginate(-1);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [paginate, onClose]);

  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
      };
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-12 overflow-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-background/98 backdrop-blur-xl cursor-pointer"
        onClick={onClose}
      />
      
      {/* Top Bar Controls */}
      <div className="absolute top-0 inset-x-0 z-[110] flex justify-between items-center p-4 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
        <div className="text-white/80 text-sm font-medium tracking-widest pointer-events-auto">
          {imageIndex + 1} / {images.length}
        </div>
        <button
          onClick={onClose}
          className="rounded-full bg-black/20 p-2 md:p-3 text-white hover:bg-black/40 hover:scale-110 transition-all backdrop-blur-sm pointer-events-auto"
        >
          <X className="h-5 w-5 md:h-6 md:w-6" />
        </button>
      </div>

      {/* Navigation Arrows (Desktop) */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); paginate(-1); }}
            className="absolute left-2 md:left-8 z-[110] rounded-full bg-black/20 p-2 md:p-4 text-white hover:bg-black/40 hover:scale-110 transition-all backdrop-blur-sm hidden sm:block"
          >
            <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); paginate(1); }}
            className="absolute right-2 md:right-8 z-[110] rounded-full bg-black/20 p-2 md:p-4 text-white hover:bg-black/40 hover:scale-110 transition-all backdrop-blur-sm hidden sm:block"
          >
            <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
          </button>
        </>
      )}
      
      {/* Expanded Image Carousel */}
      <div 
        className="relative z-[105] w-full h-full max-w-7xl flex flex-col items-center justify-center overflow-hidden cursor-pointer"
        onClick={onClose}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag={images.length > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute inset-0 w-full h-full flex flex-col items-center justify-center"
          >
            <div className="relative w-full h-full p-2 md:p-0 flex flex-col items-center justify-center">
              <div 
                className="relative cursor-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {currentImage.url.match(/\.(mp4|webm|mov)$/i) || (currentImage.format && ['mp4', 'webm', 'mov'].includes(currentImage.format)) ? (
                  <video
                    src={currentImage.url}
                    controls
                    autoPlay
                    className="max-h-[85vh] max-w-full object-contain select-none rounded-lg"
                  />
                ) : (
                  <ImageOptimized
                    src={currentImage.url}
                    alt={currentImage.alt || 'Gallery image'}
                    width={1200}
                    height={1200}
                    className="max-h-[85vh] max-w-full object-contain select-none"
                    priority
                  />
                )}
                {currentImage.artistName && (
                  <div className="absolute bottom-6 left-0 right-0 text-center z-50">
                    <span className="bg-black/70 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs tracking-widest uppercase shadow-lg border border-white/10">
                      Artist: {currentImage.artistName}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
