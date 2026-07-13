import { MetadataRoute } from 'next';
import { locales, defaultLocale } from '../i18n';
import { api } from '@/lib/api-client';
import type { BlogPost } from '@salon-tatto/shared';

const BASE_URL = process.env.WEB_URL || 'https://larolatattoonyc.com';

type SitemapEntry = {
  url: string;
  lastModified?: Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  alternates?: { languages: Record<string, string> };
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ['', '/studio', '/artists', '/gallery', '/blog', '/contact'];

  const entries: SitemapEntry[] = [];

  // 1. Static Routes
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

  // 2. Dynamic Blog Routes
  try {
    // Solo obtenemos los posts publicados para cada locale y extraemos slugs.
    // Usamos en/defaultLocale como base para construir los alternates del sitemap.
    const blogPosts = await api.get<{ data: BlogPost[] }>('/blog', {
      params: { locale: defaultLocale, status: 'published', limit: 500 },
      next: { revalidate: 3600 },
    });

    if (blogPosts?.data) {
      for (const post of blogPosts.data) {
        const urlPath = `/blog/${post.slug}`;
        const alternates: Record<string, string> = {};

        for (const locale of locales) {
          const localizedPath = `/${locale}${urlPath}`;
          alternates[locale] = `${BASE_URL}${localizedPath}`;
        }

        alternates['x-default'] = `${BASE_URL}/en${urlPath}`;

        entries.push({
          url: `${BASE_URL}/en${urlPath}`,
          lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.publishedAt || new Date()),
          changeFrequency: 'monthly',
          priority: 0.7,
          alternates: { languages: alternates },
        });
      }
    }
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  return entries;
}
