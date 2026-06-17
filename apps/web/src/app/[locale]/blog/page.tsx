import { getTranslations } from 'next-intl/server';
import { locales } from '@/i18n';
import { api } from '@/lib/api-client';
import { BlogCard } from '@/components/blog/blog-card';
import { getOptimizedImageUrl } from '@/lib/utils';
import type { BlogPost, SeoPage, PaginatedResponse } from '@salon-tatto/shared';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ page?: string; category?: string; tag?: string; search?: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  let seo: SeoPage | null = null;
  try {
    seo = await api.get<SeoPage>('/seo/blog', {
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
        en: '/en/blog',
        es: '/es/blog',
      },
    },
  };
}

export default async function BlogPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations({ locale, namespace: 'blog' });

  const page = Number(resolvedSearchParams?.page) || 1;
  const categorySlug = resolvedSearchParams?.category || '';
  const tagSlug = resolvedSearchParams?.tag || '';
  const search = resolvedSearchParams?.search || '';

  let posts: BlogPost[] = [];
  let totalPages = 1;
  try {
    const result = await api.get<PaginatedResponse<BlogPost>>('/blog', {
      params: {
        locale,
        status: 'published',
        page,
        limit: 9,
        ...(categorySlug && { categorySlug }),
        ...(tagSlug && { tagSlug }),
        ...(search && { search }),
      },
      next: { revalidate: 60 },
    });
    posts = result.data;
    totalPages = result.meta.totalPages;
  } catch {}

  return (
    <div className="container py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">{t('blog.title')}</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {t('blog.description')}
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center text-muted-foreground">
          {t('blog.noPosts')}
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} locale={locale} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/${locale}/blog?page=${p}${categorySlug ? `&category=${categorySlug}` : ''}${tagSlug ? `&tag=${tagSlug}` : ''}${search ? `&search=${search}` : ''}`}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-md border text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                p === page ? 'bg-primary text-primary-foreground border-primary' : ''
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
