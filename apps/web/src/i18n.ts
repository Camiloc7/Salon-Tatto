import { getRequestConfig } from 'next-intl/server';
export const locales = ['en', 'es'] as const;
export const defaultLocale = 'en' as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = (requested && locales.includes(requested as any)) ? requested : defaultLocale;

  return {
    locale,
    messages: {
      ...(await import(`../public/locales/${locale}/common.json`)).default,
      ...(await import(`../public/locales/${locale}/home.json`)).default,
      ...(await import(`../public/locales/${locale}/artists.json`)).default,
      ...(await import(`../public/locales/${locale}/blog.json`)).default,
      ...(await import(`../public/locales/${locale}/gallery.json`)).default,
      ...(await import(`../public/locales/${locale}/contact.json`)).default,
      ...(await import(`../public/locales/${locale}/admin.json`)).default,
    },
    timeZone: 'UTC',
  };
});
