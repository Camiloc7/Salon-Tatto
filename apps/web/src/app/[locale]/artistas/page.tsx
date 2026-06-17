import { getTranslations } from 'next-intl/server';
import { locales } from '@/i18n';
import { api } from '@/lib/api-client';
import { ArtistCard } from '@/components/artists/artist-card';
import { StructuredData } from '@/components/shared/structured-data';
import { getOptimizedImageUrl } from '@/lib/utils';
import type { Artist, SeoPage } from '@salon-tatto/shared';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ page?: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'artists' });
  let seo: SeoPage | null = null;
  try {
    seo = await api.get<SeoPage>('/seo/artists', {
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
        en: '/en/artistas',
        es: '/es/artistas',
      },
    },
  };
}

export default async function ArtistsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'artists' });

  let artists: Artist[] = [];
  try {
    artists = await api.get<Artist[]>('/artists', {
      params: { locale, isActive: true, limit: 50 },
      next: { revalidate: 60 },
    });
  } catch {}

  return (
    <div className="container py-20">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">{t('title')}</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {t('description')}
        </p>
      </div>

      {artists.length === 0 ? (
        <div className="mt-12 text-center text-muted-foreground">
          {t('noArtists')}
        </div>
      ) : (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} locale={locale} />
          ))}
        </div>
      )}

      {artists.map((artist) => (
        <StructuredData
          key={artist.id}
          type="Person"
          data={{
            name: artist.name,
            description: artist.biography,
            image: artist.avatar,
            knowsAbout: artist.specialty,
          }}
        />
      ))}
    </div>
  );
}
