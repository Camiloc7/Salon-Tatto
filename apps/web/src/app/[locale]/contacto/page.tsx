import { getTranslations } from 'next-intl/server';
import { locales } from '@/i18n';
import { api } from '@/lib/api-client';
import { ContactForm } from '@/components/forms/contact-form';
import { WhatsAppButton } from '@/components/shared/whatsapp-button';
import { getOptimizedImageUrl } from '@/lib/utils';
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import type { StudioSettings, SeoPage } from '@salon-tatto/shared';

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  let seo: SeoPage | null = null;
  try {
    seo = await api.get<SeoPage>('/seo/contact', {
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
        en: '/en/contacto',
        es: '/es/contacto',
      },
    },
  };
}

async function getSettings(): Promise<StudioSettings | null> {
  try {
    return await api.get<StudioSettings>('/settings/studio', {
      next: { revalidate: 300 },
    });
  } catch {
    return null;
  }
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const settings = await getSettings();

  return (
    <div className="container py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight">{t('contact.title')}</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {t('contact.description')}
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2">
        <div className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">{t('contact.schedule')}</h2>
            <dl className="space-y-3 text-muted-foreground">
              {[
                { key: 'Monday', value: settings?.mondayHours },
                { key: 'Tuesday', value: settings?.tuesdayHours },
                { key: 'Wednesday', value: settings?.wednesdayHours },
                { key: 'Thursday', value: settings?.thursdayHours },
                { key: 'Friday', value: settings?.fridayHours },
                { key: 'Saturday', value: settings?.saturdayHours },
                { key: 'Sunday', value: settings?.sundayHours },
              ].map(({ key, value }) => (
                <div key={key} className="flex justify-between">
                  <dt className="font-medium">{key}</dt>
                  <dd>{value || 'Closed'}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="space-y-4">
            {settings?.address && (
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <span className="text-muted-foreground">{settings.address}</span>
              </div>
            )}
            {settings?.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-primary" />
                <a
                  href={`tel:${settings.phone}`}
                  className="text-muted-foreground hover:text-primary"
                >
                  {settings.phone}
                </a>
              </div>
            )}
            {settings?.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-primary" />
                <a
                  href={`mailto:${settings.email}`}
                  className="text-muted-foreground hover:text-primary"
                >
                  {settings.email}
                </a>
              </div>
            )}
            {settings?.whatsapp && (
              <div className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 shrink-0 text-primary" />
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                >
                  {t('contact.whatsapp')}
                </a>
              </div>
            )}
          </div>

          {settings?.googleMapsLat && settings?.googleMapsLng && (
            <div className="aspect-video overflow-hidden rounded-lg border">
              <iframe
                title="Studio Location"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                src={`https://www.google.com/maps?q=${settings.googleMapsLat},${settings.googleMapsLng}&z=15&output=embed`}
              />
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6">{t('contact.form.title')}</h2>
          <ContactForm />
        </div>
      </div>

      <WhatsAppButton />
    </div>
  );
}
