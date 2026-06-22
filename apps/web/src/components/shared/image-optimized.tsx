import Image from 'next/image';
import { getOptimizedImageUrl } from '@/lib/utils';

type ImageOptimizedProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
};

export function ImageOptimized({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
  sizes,
}: ImageOptimizedProps) {
  const isCloudinary =
    src.includes('cloudinary') || !src.startsWith('http');

  if (isCloudinary) {
    const cloudinaryId = src.includes('cloudinary')
      ? src.split('/upload/')[1]?.split('/').slice(1).join('/') || src
      : src;

    const optimizedSrc = getOptimizedImageUrl(cloudinaryId, {
      width,
      height,
      fit: 'fill',
    });

    return (
      <Image
        src={optimizedSrc}
        alt={alt}
        {...(fill ? { fill: true, sizes } : { width: width || 800, height: height || 600 })}
        className={className}
        priority={priority}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      {...(fill ? { fill: true, sizes } : { width: width || 800, height: height || 600 })}
      className={className}
      priority={priority}
    />
  );
}
