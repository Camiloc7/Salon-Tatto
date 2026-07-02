import { getTranslations } from 'next-intl/server';
import { locales } from '@/i18n';
import { api } from '@/lib/api-client';
import { getOptimizedImageUrl } from '@/lib/utils';
import type { SeoPage } from '@salon-tatto/shared';

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
    seo = await api.get<SeoPage>('/seo/studio', {
      params: { locale },
      next: { revalidate: 300 },
    });
  } catch {}

  return {
    title: seo?.title || t('studio.title'),
    description: seo?.description || t('studio.description'),
    openGraph: {
      title: seo?.ogTitle || seo?.title || t('studio.title'),
      description: seo?.ogDescription || seo?.description || t('studio.description'),
      images: seo?.ogImage ? [{ url: getOptimizedImageUrl(seo.ogImage) }] : [],
    },
    alternates: {
      languages: {
        en: '/en/studio',
        es: '/es/studio',
      },
    },
  };
}

export default async function StudioPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <div className="container py-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight">{t('studio.title')}</h1>
        <div className="mt-8 space-y-6 text-lg text-muted-foreground leading-relaxed">
          <p>{t('studio.description')}</p>
          <p>{t('studio.p1')}</p>
          <p>{t('studio.p2')}</p>
          <p>{t('studio.p3')}</p>
        </div>
      </div>
    </div>
  );
}
