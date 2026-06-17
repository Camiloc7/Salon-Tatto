import { getTranslations } from 'next-intl/server';
import { locales } from '@/i18n';
import { api } from '@/lib/api-client';
import { ImageCard } from '@/components/shared/image-card';
import { getOptimizedImageUrl } from '@/lib/utils';
import type { Artist, SeoPage } from '@salon-tatto/shared';

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'gallery' });
  let seo: SeoPage | null = null;
  try {
    seo = await api.get<SeoPage>('/seo/gallery', {
      params: { locale },
      next: { revalidate: 300 },
    });
  } catch {}

  return {
    title: seo?.title || t('title'),
    description: seo?.description || t('description'),
    openGraph: {
      title: seo?.ogTitle || seo?.title || t('title'),
      description: seo?.ogDescription || seo?.description || t('description'),
      images: seo?.ogImage ? [{ url: getOptimizedImageUrl(seo.ogImage) }] : [],
    },
    alternates: {
      languages: {
        en: '/en/galeria',
        es: '/es/galeria',
      },
    },
  };
}

type ImageEntry = {
  id: string;
  url: string;
  alt: string;
  artistName?: string;
  artistSlug?: string;
};

export default async function GalleryPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'gallery' });

  let images: ImageEntry[] = [];
  try {
    const artists = await api.get<Artist[]>('/artists', {
      params: { locale, isActive: true, limit: 50 },
      next: { revalidate: 60 },
    });

    artists.forEach((artist) => {
      if (artist.images) {
        artist.images.forEach((img) => {
          images.push({
            id: img.id,
            url: img.url || img.cloudinaryId,
            alt: img.alt || artist.name || '',
            artistName: artist.name,
            artistSlug: artist.slug,
          });
        });
      }
    });
  } catch {}

  if (images.length === 0) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-4xl font-bold">{t('gallery.title')}</h1>
        <p className="mt-4 text-muted-foreground">{t('noImages')}</p>
      </div>
    );
  }

  return (
    <div className="container py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">{t('title')}</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {t('description')}
        </p>
      </div>

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
        {images.map((image) => (
          <div key={image.id} className="mb-4 break-inside-avoid">
            <ImageCard
              src={image.url}
              alt={image.alt}
              className="w-full"
            />
            {image.artistName && (
              <p className="mt-1 text-xs text-muted-foreground text-center">
                {t('byArtist')} {image.artistName}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
