import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n';
import { api } from '@/lib/api-client';
import { ImageOptimized } from '@/components/shared/image-optimized';
import { ArtistGallery } from '@/components/artists/artist-gallery';
import { WhatsAppButton } from '@/components/shared/whatsapp-button';
import { StructuredData } from '@/components/shared/structured-data';
import { getImageUrl, getOptimizedImageUrl } from '@/lib/utils';
import { Instagram } from 'lucide-react';
import Link from 'next/link';
import type { Artist, SeoPage, StudioSettings } from '@salon-tatto/shared';

import { ArtistHero } from '@/components/artists/artist-hero';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    try {
      const res = await api.get<{ data: Artist[] }>('/artists', {
        params: { locale, isActive: true, limit: 100 },
        next: { revalidate: 60 },
      });
      res.data.forEach((artist) => {
        params.push({ locale, slug: artist.slug });
      });
    } catch {}
  }
  return params;
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
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
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'artists' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  let artist: Artist | null = null;
  try {
    artist = await api.get<Artist>(`/artists/${slug}`, {
      params: { locale },
      next: { revalidate: 60 },
    });
  } catch {}

  if (!artist) notFound();

  let settings: StudioSettings | null = null;
  try {
    settings = await api.get<StudioSettings>('/settings', {
      next: { revalidate: 300 },
    });
  } catch {}

  const whatsappPhone = settings?.whatsapp ? settings.whatsapp.replace(/[^0-9]/g, '') : '';

  return (
    <div className="container py-20">
      <div className="mx-auto max-w-6xl">
        <ArtistHero 
          artist={artist} 
          tInstagram={t('instagram')} 
          tContact={t('contactViaWhatsapp')} 
          whatsappNumber={whatsappPhone} 
        />

        {artist.images && artist.images.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">{tNav('gallery')}</h2>
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
