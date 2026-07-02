import { getTranslations } from 'next-intl/server';
import { locales } from '@/i18n';
import { api } from '@/lib/api-client';
import { GalleryGrid } from '@/components/gallery/gallery-grid';
import { CategoryAccordionCard } from '@/components/gallery/category-accordion-card';
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
      languages: {
        en: '/en/gallery',
        es: '/es/gallery',
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
  categoryName?: string;
};

export default async function GalleryPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'gallery' });

  let images: ImageEntry[] = [];
  try {
    const res = await api.get<{ data: Artist[] }>('/artists', {
      params: { locale, isActive: true, limit: 50 },
      next: { revalidate: 60 },
    });
    const artists = res.data;

    artists.forEach((artist) => {
      if (artist.images) {
        artist.images.forEach((img) => {
          images.push({
            id: img.id,
            url: img.url || img.cloudinaryId,
            alt: img.alt || artist.name || '',
            artistName: artist.name,
            artistSlug: artist.slug,
            categoryName: (img as any).category?.name,
          });
        });
      }
    });
  } catch { }

  if (images.length === 0) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-4xl font-bold">{t('title')}</h1>
        <p className="mt-4 text-muted-foreground">{t('noImages')}</p>
      </div>
    );
  }

  const groupedImages = images.reduce((acc, img) => {
    const category = img.categoryName || t('other', { fallback: 'Otros' });
    if (!acc[category]) acc[category] = [];
    acc[category].push(img);
    return acc;
  }, {} as Record<string, ImageEntry[]>);

  const sortedCategories = Object.keys(groupedImages).sort((a, b) => a.localeCompare(b));

  return (
    <div className="container py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight">{t('title')}</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {t('description')}
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        {sortedCategories.map((category) => (
          <CategoryAccordionCard
            key={category}
            categoryName={category}
            images={groupedImages[category].map(img => ({ id: img.id, url: img.url }))}
          >
            <GalleryGrid images={groupedImages[category]} />
          </CategoryAccordionCard>
        ))}
      </div>
    </div>
  );
}
