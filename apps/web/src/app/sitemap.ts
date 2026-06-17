import { MetadataRoute } from 'next';
import { locales, defaultLocale } from '../i18n';

const BASE_URL = process.env.WEB_URL || 'http://localhost:3000';

type SitemapEntry = {
  url: string;
  lastModified?: Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  alternates?: { languages: Record<string, string> };
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ['', '/estudio', '/artistas', '/galeria', '/blog', '/contacto'];

  const entries: SitemapEntry[] = [];

  for (const route of staticRoutes) {
    const urlPath = route;
    const alternates: Record<string, string> = {};

    for (const locale of locales) {
      const localizedPath = `/${locale}${urlPath}`;
      alternates[locale] = `${BASE_URL}${localizedPath}`;
    }

    alternates['x-default'] = `${BASE_URL}/en${urlPath}`;

    entries.push({
      url: `${BASE_URL}/en${urlPath}`,
      lastModified: new Date(),
      changeFrequency: route === '' ? 'daily' : 'weekly',
      priority: route === '' ? 1.0 : 0.8,
      alternates: { languages: alternates },
    });
  }

  return entries;
}
