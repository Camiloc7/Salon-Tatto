import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, locale: string = 'en'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function getOptimizedImageUrl(cloudinaryId: string, options?: {
  width?: number;
  height?: number;
  fit?: 'fill' | 'limit' | 'crop';
}): string {
  if (!cloudinaryId) return '';
  if (cloudinaryId.startsWith('http')) return cloudinaryId;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dlimmlxeh';

  const transformations = [
    options?.width && `w_${options.width}`,
    options?.height && `h_${options.height}`,
    options?.fit && `c_${options.fit}`,
    'f_auto',
    'q_auto',
  ].filter(Boolean).join(',');

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${cloudinaryId}`;
}

export function getImageUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dlimmlxeh';
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${url}`;
}
