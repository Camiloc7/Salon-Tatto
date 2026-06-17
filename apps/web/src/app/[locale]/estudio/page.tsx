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
        en: '/en/estudio',
        es: '/es/estudio',
      },
    },
  };
}

export default async function StudioPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return (
    <div className="container py-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight">{t('studio.title')}</h1>
        <div className="mt-8 space-y-6 text-lg text-muted-foreground leading-relaxed">
          <p>{t('studio.description')}</p>
          <p>
            Founded with a passion for art and self-expression, our studio has been
            providing high-quality tattoo services for over a decade. We pride
            ourselves on maintaining the highest standards of hygiene, creativity,
            and customer satisfaction.
          </p>
          <p>
            Our team of experienced artists specializes in a wide range of styles
            including traditional, realism, geometric, watercolor, blackwork, and
            custom designs. Every tattoo is a unique piece of art, created in
            collaboration with our clients.
          </p>
          <p>
            We believe that getting a tattoo is not just about the final result,
            but about the entire experience. From the moment you walk through our
            doors, we ensure you feel comfortable, informed, and excited about
            your new art.
          </p>
        </div>
      </div>
    </div>
  );
}
