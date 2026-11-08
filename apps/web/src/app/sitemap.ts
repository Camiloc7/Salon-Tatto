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
    // La API limita `limit` a 50, así que recorremos las páginas para no dejar
    // posts publicados fuera del sitemap. Usamos defaultLocale como base para
    // construir los alternates del sitemap.
    const blogPosts: BlogPost[] = [];
    let page = 1;
    let totalPages = 1;

    do {
      const response = await api.get<{
        data: BlogPost[];
        meta?: { totalPages?: number };
      }>('/blog', {
        params: { locale: defaultLocale, status: 'published', limit: 50, page },
        next: { revalidate: 3600 },
      });

      blogPosts.push(...(response?.data ?? []));
      totalPages = response?.meta?.totalPages ?? 1;
      page += 1;
      // Límite de seguridad para evitar un bucle infinito si la API responde mal.
    } while (page <= totalPages && page <= 100);

    for (const post of blogPosts) {
      const urlPath = `/blog/${post.slug}`;
      const alternates: Record<string, string> = {};

      for (const locale of locales) {
        const localizedPath = `/${locale}${urlPath}`;
        alternates[locale] = `${BASE_URL}${localizedPath}`;
      }

      alternates['x-default'] = `${BASE_URL}/en${urlPath}`;

      entries.push({
        url: `${BASE_URL}/en${urlPath}`,
        lastModified: post.updatedAt
          ? new Date(post.updatedAt)
          : new Date(post.publishedAt || new Date()),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: { languages: alternates },
      });
    }
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  return entries;
}
