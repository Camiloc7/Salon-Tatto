'use client';

import { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import { ImageOptimized } from '@/components/shared/image-optimized';
import { cn } from '@/lib/utils';

type ImageCardProps = {
  src: string;
  alt: string;
  className?: string;
};

export function ImageCard({ src, alt, className }: ImageCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn('group relative overflow-hidden rounded-lg', className)}
      >
        <ImageOptimized
          src={src}
          alt={alt}
          width={400}
          height={400}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/40">
          <ZoomIn className="h-8 w-8 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpen(false)}
        >
          <button
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
          >
            <X className="h-6 w-6" />
          </button>
          <ImageOptimized
            src={src}
            alt={alt}
            width={1200}
            height={900}
            className="max-h-[85vh] max-w-full rounded-lg object-contain"
            priority
          />
        </div>
      )}
    </>
  );
}
