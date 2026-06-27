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
  return {
    title: t('name'),
    description: t('description'),
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <QueryProvider>
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <HideOnAdmin>
              <Header />
            </HideOnAdmin>
            
            <main className="flex-1">{children}</main>
            
            <HideOnAdmin>
              <Footer />
              <WhatsAppButton />
            </HideOnAdmin>
          </div>
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </QueryProvider>
    </NextIntlClientProvider>
  );
}
