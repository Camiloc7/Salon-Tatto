import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { locales } from '@/i18n';
import { api } from '@/lib/api-client';
import { ImageOptimized } from '@/components/shared/image-optimized';
import { ArtistGallery } from '@/components/artists/artist-gallery';
import { WhatsAppButton } from '@/components/shared/whatsapp-button';
import { StructuredData } from '@/components/shared/structured-data';
import { getImageUrl, getOptimizedImageUrl } from '@/lib/utils';
import { Instagram } from 'lucide-react';
import Link from 'next/link';
import type { Artist, SeoPage } from '@salon-tatto/shared';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    try {
      const artists = await api.get<Artist[]>('/artists', {
        params: { locale, isActive: true, limit: 100 },
        next: { revalidate: 60 },
      });
      artists.forEach((artist) => {
        params.push({ locale, slug: artist.slug });
      });
    } catch {}
  }
  return params;
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  let artist: Artist | null = null;
  try {
    artist = await api.get<Artist>(`/artists/${slug}`, {
      params: { locale },
      next: { revalidate: 60 },
    });
  } catch {}

  if (!artist) {
    return { title: 'Not Found' };
  }

  return {
    title: artist.seoTitle || artist.name,
    description: artist.seoDescription || artist.biography,
    openGraph: {
      title: artist.seoTitle || artist.name,
      description: artist.seoDescription || artist.biography,
      images: artist.avatar ? [{ url: getOptimizedImageUrl(artist.avatar) }] : [],
    },
    alternates: {
      languages: {
        en: `/en/artistas/${slug}`,
        es: `/es/artistas/${slug}`,
      },
    },
  };
}

export default async function ArtistProfilePage({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'artists' });

  let artist: Artist | null = null;
  try {
    artist = await api.get<Artist>(`/artists/${slug}`, {
      params: { locale },
      next: { revalidate: 60 },
    });
  } catch {}

  if (!artist) notFound();

  return (
    <div className="container py-20">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left gap-8">
          <div className="h-48 w-48 shrink-0 overflow-hidden rounded-full">
            <ImageOptimized
              src={getImageUrl(artist.avatar)}
              alt={artist.name || ''}
              width={200}
              height={200}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">{artist.name}</h1>
            <p className="text-lg text-muted-foreground">{artist.specialty}</p>
            {artist.biography && (
              <p className="text-muted-foreground leading-relaxed">
                {artist.biography}
              </p>
            )}
            <div className="flex items-center gap-4">
              {artist.instagramUrl && (
                <Link
                  href={artist.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                  {t('instagram')}
                </Link>
              )}
              <Link
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-primary hover:underline"
              >
                {t('contactViaWhatsapp')}
              </Link>
            </div>
          </div>
        </div>

        {artist.images && artist.images.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">{t('gallery')}</h2>
            <ArtistGallery images={artist.images} />
          </div>
        )}
      </div>

      <StructuredData
        type="Person"
        data={{
          name: artist.name,
          description: artist.biography,
          image: artist.avatar,
          knowsAbout: artist.specialty,
          url: artist.instagramUrl,
        }}
      />

      <WhatsAppButton />
    </div>
  );
}
