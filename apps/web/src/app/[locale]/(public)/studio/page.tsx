import { getTranslations } from 'next-intl/server';
import { locales } from '@/i18n';
import { api } from '@/lib/api-client';
import { getOptimizedImageUrl } from '@/lib/utils';
import type { SeoPage, StudioSettings } from '@salon-tatto/shared';

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

/** Mapea el layout elegido en el admin al ancho máximo del contenedor */
function getLayoutClass(layout?: string): string {
  switch (layout) {
    case 'fullwidth':
      return 'w-full max-w-none px-4 sm:px-8';
    case 'centered':
      return 'mx-auto max-w-2xl px-4';
    default:
      return 'mx-auto max-w-4xl px-4';
  }
}

export default async function StudioPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });

  let settings: StudioSettings | null = null;
  try {
    settings = await api.get<StudioSettings>('/settings', {
      next: { revalidate: 60, tags: ['settings'] },
    });
  } catch (error) {
    console.error('Failed to fetch settings for studio page', error);
  }

  const dynamicContent =
    locale === 'en' ? settings?.studioPageContent_en : settings?.studioPageContent_es;
  const hasDynamicContent =
    dynamicContent && dynamicContent.trim() !== '' && dynamicContent.trim() !== '<p></p>';

  // Apariencia configurada desde el admin
  const bgImageUrl = settings?.studioBgImageUrl;
  const bgColor = settings?.studioBgColor || '#0f0f0f';
  const overlayOpacity = parseFloat(settings?.studioOverlayOpacity ?? '0');
  const layout = settings?.studioLayout || 'default';

  const hasBgImage = bgImageUrl && bgImageUrl.trim() !== '';

  /**
   * Construimos los estilos inline para la sección de fondo.
   * Si hay imagen: la usamos como background-image con un overlay de color encima.
   * Si no hay imagen: solo el color de fondo.
   */
  const sectionStyle: React.CSSProperties = hasBgImage
    ? {
        backgroundImage: `url(${bgImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundColor: bgColor,
      }
    : { backgroundColor: bgColor };

  const overlayStyle: React.CSSProperties = {
    backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
  };

  const layoutClass = getLayoutClass(layout);

  // ¿Tiene fondo personalizado (imagen o color no blanco/negro por defecto)?
  const hasCustomBackground = hasBgImage || (settings?.studioBgColor && settings.studioBgColor !== '#0f0f0f');

  return (
    <div
      className="relative min-h-screen"
      style={sectionStyle}
    >
      {/* Overlay oscuro sobre la imagen (solo si hay imagen) */}
      {hasBgImage && overlayOpacity > 0 && (
        <div className="absolute inset-0 pointer-events-none" style={overlayStyle} />
      )}

      {/* Contenido principal */}
      <div className={`relative z-10 py-20 ${hasCustomBackground ? 'text-white' : ''}`}>
        <div className={layoutClass}>
          {!hasDynamicContent && (
            <h1 className="text-4xl font-bold tracking-tight mb-8">{t('studio.title')}</h1>
          )}

          {hasDynamicContent ? (
            /**
             * El contenido viene del editor Tiptap (HTML con estilos inline de color,
             * fuente, alineación, etc.). Usamos prose para la tipografía base pero
             * permitimos que los estilos inline del editor prevalezcan.
             */
            <div
              className="rich-content"
              style={hasCustomBackground ? { color: 'inherit' } : undefined}
              dangerouslySetInnerHTML={{ __html: dynamicContent }}
            />
          ) : (
            <div className="mt-8 space-y-6 text-lg leading-relaxed opacity-80">
              <p>{t('studio.description')}</p>
              <p>{t('studio.p1')}</p>
              <p>{t('studio.p2')}</p>
              <p>{t('studio.p3')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
