import { getRequestConfig } from 'next-intl/server';
export const locales = ['en', 'es'] as const;
export const defaultLocale = (process.env.NEXT_PUBLIC_DEFAULT_LOCALE as any) || 'en';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = (requested && locales.includes(requested as any)) ? requested : defaultLocale;

  return {
    locale,
    messages: {
      ...(await import(`../public/locales/${locale}/common.json`)).default,
      home: (await import(`../public/locales/${locale}/home.json`)).default,
      artists: (await import(`../public/locales/${locale}/artists.json`)).default,
      blog: (await import(`../public/locales/${locale}/blog.json`)).default,
      gallery: (await import(`../public/locales/${locale}/gallery.json`)).default,
      contact: (await import(`../public/locales/${locale}/contact.json`)).default,
      admin: (await import(`../public/locales/${locale}/admin.json`)).default,
    },
    timeZone: 'UTC',
  };
});
