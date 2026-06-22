import { getTranslations } from 'next-intl/server';
import { locales } from '@/i18n';
import { api } from '@/lib/api-client';
import { Hero } from '@/components/home/hero';
import { FeaturedArtists } from '@/components/home/featured-artists';
import { Testimonials } from '@/components/home/testimonials';
import { FAQ } from '@/components/home/faq';
import { StructuredData } from '@/components/shared/structured-data';
import type { StudioSettings, SeoPage } from '@salon-tatto/shared';
import { getOptimizedImageUrl } from '@/lib/utils';
import { getGooglePlaceReviews } from '@/lib/google-places';

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  let seo: SeoPage | null = null;
  try {
    seo = await api.get<SeoPage>('/seo/home', {
      params: { locale },
      next: { revalidate: 300 },
    });
  } catch {}

  return {
    title: seo?.title || t('hero.title'),
    description: seo?.description || t('hero.subtitle'),
    openGraph: {
      title: seo?.ogTitle || seo?.title || t('hero.title'),
      description: seo?.ogDescription || seo?.description || t('hero.subtitle'),
      images: seo?.ogImage ? [{ url: getOptimizedImageUrl(seo.ogImage) }] : [],
    },
    alternates: {
      languages: {
        en: '/en',
        es: '/es',
      },
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  let settings: StudioSettings | null = null;
  try {
    settings = await api.get<StudioSettings>('/settings/studio', {
      next: { revalidate: 300 },
    });
  } catch {}

  const placeDetails = await getGooglePlaceReviews();

  return (
    <>
      <StructuredData
        type="LocalBusiness"
        data={{
          name: t('site.name'),
          description: t('site.description'),
          ...(settings?.address && { address: { '@type': 'PostalAddress', streetAddress: settings.address } }),
          ...(settings?.phone && { telephone: settings.phone }),
          ...(settings?.email && { email: settings.email }),
        }}
      />
      <Hero settings={settings} />
      <FeaturedArtists />
      <Testimonials initialReviews={placeDetails?.reviews || []} />
      <FAQ />
    </>
  );
}
