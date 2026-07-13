import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { WhatsAppButton } from '@/components/shared/whatsapp-button';
import { HideOnAdmin } from '@/components/layout/public-layout-wrapper';
import { locales } from '@/i18n';
import { QueryProvider } from '@/providers/query-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { Toaster } from 'sonner';
import { GoogleAnalytics } from '@next/third-parties/google';
import { api } from '@/lib/api-client';
import type { StudioSettings } from '@salon-tatto/shared';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'site' });
  
  const baseUrl = process.env.WEB_URL || 'https://larolatattoonyc.com';

  return {
    metadataBase: new URL(baseUrl),
    title: t('name'),
    description: t('description'),
    openGraph: {
      title: t('name'),
      description: t('description'),
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      alternateLocale: locale === 'es' ? ['en_US'] : ['es_ES'],
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  let settings: StudioSettings | null = null;
  try {
    settings = await api.get<StudioSettings>('/settings', {
      next: { revalidate: 300 },
    });
  } catch (err) {
    console.error('Failed to fetch settings in layout', err);
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <QueryProvider>
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <HideOnAdmin>
              <Header logoUrl={settings?.logoUrl} />
            </HideOnAdmin>
            
            <main className="flex-1">{children}</main>
            
            <HideOnAdmin>
              <Footer />
              <WhatsAppButton />
            </HideOnAdmin>
          </div>
          <Toaster position="top-right" richColors />
          <GoogleAnalytics gaId="G-10BGG11343" />
        </AuthProvider>
      </QueryProvider>
    </NextIntlClientProvider>
  );
}
