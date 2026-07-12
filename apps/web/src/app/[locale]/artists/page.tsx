import { getTranslations } from 'next-intl/server';
import { locales } from '@/i18n';
import { api } from '@/lib/api-client';
import { ArtistCard } from '@/components/artists/artist-card';
import { StructuredData } from '@/components/shared/structured-data';
import { getOptimizedImageUrl, stripHtml } from '@/lib/utils';
import type { Artist, SeoPage } from '@salon-tatto/shared';
import Link from 'next/link';
import { InkBackground } from '@/components/artists/ink-background';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ specialty?: string }>;
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
  } catch { }

  return {
    title: seo?.title || t('title'),
    description: seo?.description || t('description'),
    openGraph: {
      title: seo?.ogTitle || seo?.title || t('title'),
      description: seo?.ogDescription || seo?.description || t('description'),
      images: seo?.ogImage ? [{ url: getOptimizedImageUrl(seo.ogImage) }] : [],
    },
    alternates: {
      canonical: `/${locale}/artists`,
      languages: {
        en: '/en/artists',
        es: '/es/artists',
      },
    },
  };
}

export default async function ArtistsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const sParams = await searchParams;
  const currentSpecialty = sParams?.specialty || null;
  const t = await getTranslations({ locale, namespace: 'artists' });

  let artists: Artist[] = [];
  try {
    const res = await api.get<{ data: Artist[] }>('/artists', {
      params: { locale, isActive: true, limit: 50 },
      next: { revalidate: 3600, tags: ['artists'] },
    });
    artists = res.data;
  } catch (error) {
    console.error("Failed to fetch artists:", error);
  }

  const specialties = Array.from(new Set(artists.map((a) => a.specialty).filter(Boolean))) as string[];

  const filteredArtists = currentSpecialty
    ? artists.filter((a) => a.specialty === currentSpecialty)
    : artists;

  return (
    <div className="relative min-h-screen py-20 overflow-hidden">
      <InkBackground />
      <div className="container relative z-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">{t('title')}</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('description')}
          </p>
        </div>

        {specialties.length > 0 && (
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <Link
              href={`/${locale}/artists`}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${!currentSpecialty
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                }`}
            >
              {t('all')}
            </Link>
            {specialties.map((spec) => (
              <Link
                key={spec}
                href={`/${locale}/artists?specialty=${encodeURIComponent(spec)}`}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${currentSpecialty === spec
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                  }`}
              >
                {spec}
              </Link>
            ))}
          </div>
        )}

        {filteredArtists.length === 0 ? (
          <div className="mt-12 text-center text-muted-foreground">
            {t('noArtists')}
          </div>
        ) : (
          <div className={
            filteredArtists.length <= 2
              ? 'mt-16 flex flex-wrap justify-center gap-8 md:gap-12'
              : 'mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          }>
            {filteredArtists.map((artist, index) => (
              <div key={artist.id} className={filteredArtists.length <= 2 ? 'w-full max-w-[350px]' : 'w-full'}>
                <ArtistCard artist={artist} locale={locale} isPriority={index < 3} />
              </div>
            ))}
          </div>
        )}

        {artists.map((artist) => (
          <StructuredData
            key={artist.id}
            type="Person"
            data={{
              name: artist.name,
              description: stripHtml(artist.biography),
              image: artist.avatar,
              knowsAbout: artist.specialty,
            }}
          />
        ))}
      </div>
    </div>
  );
}
