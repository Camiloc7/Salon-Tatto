import { getTranslations } from 'next-intl/server';
import { api } from '@/lib/api-client';
import { LocationMap } from '@/components/contact/location-map';
import { MapPin, Phone, Mail, Instagram, Facebook, Clock, Navigation } from 'lucide-react';
import type { StudioSettings, SeoPage } from '@salon-tatto/shared';
import { getOptimizedImageUrl } from '@/lib/utils';
import { locales } from '@/i18n';

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'site' });
  let seo: SeoPage | null = null;
  try {
    seo = await api.get<SeoPage>('/seo/contacto', {
      params: { locale },
      next: { revalidate: 300 },
    });
  } catch {}

  return {
    title: seo?.title || `Contact | ${t('name')}`,
    description: seo?.description || `Get in touch with ${t('name')}`,
    openGraph: {
      title: seo?.ogTitle || seo?.title || `Contact | ${t('name')}`,
      description: seo?.ogDescription || seo?.description || `Get in touch with ${t('name')}`,
      images: seo?.ogImage ? [{ url: getOptimizedImageUrl(seo.ogImage) }] : [],
    },
    alternates: {
      languages: {
        en: '/en/contacto',
        es: '/es/contacto',
      },
    },
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  
  let settings: StudioSettings | null = null;
  try {
    settings = await api.get<StudioSettings>('/settings', {
      next: { revalidate: 300 },
    });
  } catch {}

  const hasCoordinates = settings?.googleMapsLat && settings?.googleMapsLng;
  const lat = hasCoordinates && settings ? parseFloat(settings.googleMapsLat as string) : 40.7128;
  const lng = hasCoordinates && settings ? parseFloat(settings.googleMapsLng as string) : -74.0060;

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight uppercase">
            {t('title') || 'Contáctanos'}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('subtitle') || 'Visita nuestro estudio de lujo para tu próximo tatuaje. Agenda una cita o pásate a saludarnos.'}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Contact Information */}
          <div className="space-y-12">
            {/* Address */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <MapPin className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">{t('visitUs') || 'Visítanos'}</h2>
              </div>
              <p className="text-lg text-muted-foreground ml-9">
                {settings?.address || '123 Tattoo Street, New York, NY 10001'}
              </p>
              <div className="ml-9 pt-2">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-6"
                >
                  <Navigation className="mr-2 h-4 w-4" />
                  {t('getDirections') || 'Cómo llegar'}
                </a>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <Phone className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">{t('getInTouch') || 'Comunícate'}</h2>
              </div>
              <div className="ml-9 space-y-3 text-muted-foreground text-lg">
                {settings?.phone && (
                  <p className="hover:text-foreground transition-colors">
                    <a href={`tel:${settings.phone}`}>{settings.phone}</a>
                  </p>
                )}
                {settings?.whatsapp && (
                  <p className="hover:text-foreground transition-colors">
                    <a href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
                      WhatsApp: {settings.whatsapp}
                    </a>
                  </p>
                )}
                {settings?.email && (
                  <p className="hover:text-foreground transition-colors">
                    <a href={`mailto:${settings.email}`}>{settings.email}</a>
                  </p>
                )}
              </div>
            </div>

            {/* Social Media */}
            {(settings?.instagram || settings?.facebook || settings?.tiktok) && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-primary">
                  <Instagram className="h-6 w-6" />
                  <h2 className="text-2xl font-semibold">{t('socialMedia') || 'Redes Sociales'}</h2>
                </div>
                <div className="ml-9 flex gap-4">
                  {settings.instagram && (
                    <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="p-3 bg-accent rounded-full hover:bg-primary hover:text-primary-foreground transition-all">
                      <Instagram className="h-5 w-5" />
                      <span className="sr-only">Instagram</span>
                    </a>
                  )}
                  {settings.facebook && (
                    <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="p-3 bg-accent rounded-full hover:bg-primary hover:text-primary-foreground transition-all">
                      <Facebook className="h-5 w-5" />
                      <span className="sr-only">Facebook</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Business Hours */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <Clock className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">{t('hours') || 'Horarios'}</h2>
              </div>
              {settings?.sameDayReservation === 'true' ? (
                <div className="ml-9 text-muted-foreground text-lg">
                  <p>{t('sameDayReservationText')}</p>
                </div>
              ) : (
                <div className="ml-9 grid grid-cols-2 gap-y-2 max-w-xs text-muted-foreground">
                  <span>{t('days.monday') || 'Lunes'}</span>
                  <span className="text-right">{settings?.mondayHours || 'Cerrado'}</span>
                  
                  <span>{t('days.tuesday') || 'Martes'}</span>
                  <span className="text-right">{settings?.tuesdayHours || '10:00 - 19:00'}</span>
                  
                  <span>{t('days.wednesday') || 'Miércoles'}</span>
                  <span className="text-right">{settings?.wednesdayHours || '10:00 - 19:00'}</span>
                  
                  <span>{t('days.thursday') || 'Jueves'}</span>
                  <span className="text-right">{settings?.thursdayHours || '10:00 - 19:00'}</span>
                  
                  <span>{t('days.friday') || 'Viernes'}</span>
                  <span className="text-right">{settings?.fridayHours || '10:00 - 20:00'}</span>
                  
                  <span>{t('days.saturday') || 'Sábado'}</span>
                  <span className="text-right">{settings?.saturdayHours || '10:00 - 20:00'}</span>
                  
                  <span>{t('days.sunday') || 'Domingo'}</span>
                  <span className="text-right">{settings?.sundayHours || 'Cerrado'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Map */}
          <div className="h-[500px] lg:h-[700px] w-full relative">
            <div className="absolute inset-0 bg-accent/20 rounded-2xl -m-4 md:-m-6 blur-2xl -z-10" />
            <LocationMap lat={lat} lng={lng} />
          </div>
        </div>
      </div>
    </div>
  );
}
