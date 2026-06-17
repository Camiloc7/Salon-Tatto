import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { locales } from '@/i18n';
import { api } from '@/lib/api-client';
import { ImageOptimized } from '@/components/shared/image-optimized';
import { BlogCard } from '@/components/blog/blog-card';
import { StructuredData } from '@/components/shared/structured-data';
import { formatDate, getImageUrl, getOptimizedImageUrl } from '@/lib/utils';
import type { BlogPost, SeoPage } from '@salon-tatto/shared';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    try {
      const posts = await api.get<{ data: BlogPost[]; meta: { totalPages: number } }>('/blog', {
        params: { locale, status: 'published', limit: 100 },
        next: { revalidate: 60 },
      });
      posts.data.forEach((post) => {
        params.push({ locale, slug: post.slug });
      });
    } catch {}
  }
  return params;
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  let post: BlogPost | null = null;
  try {
    post = await api.get<BlogPost>(`/blog/${slug}`, {
      params: { locale },
      next: { revalidate: 60 },
    });
  } catch {}

  if (!post) return { title: 'Not Found' };

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: post.featuredImage
        ? [{ url: getOptimizedImageUrl(post.featuredImage) }]
        : [],
      type: 'article',
      publishedTime: post.publishedAt || undefined,
    },
    alternates: {
      languages: {
        en: `/en/blog/${slug}`,
        es: `/es/blog/${slug}`,
      },
    },
  };
}

function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '');
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale });

  let post: BlogPost | null = null;
  try {
    post = await api.get<BlogPost>(`/blog/${slug}`, {
      params: { locale },
      next: { revalidate: 60 },
    });
  } catch {}

  if (!post) notFound();

  let relatedPosts: BlogPost[] = [];
  if (post.categories && post.categories.length > 0) {
    try {
      const related = await api.get<{ data: BlogPost[] }>('/blog', {
        params: {
          locale,
          status: 'published',
          categorySlug: post.categories[0].slug,
          limit: 3,
        },
        next: { revalidate: 60 },
      });
      relatedPosts = related.data.filter((p) => p.id !== post.id).slice(0, 3);
    } catch {}
  }

  return (
    <article className="container py-20">
      <div className="mx-auto max-w-3xl">
        {post.featuredImage && (
          <div className="aspect-video overflow-hidden rounded-lg mb-8">
            <ImageOptimized
              src={getImageUrl(post.featuredImage)}
              alt={post.title || ''}
              width={1200}
              height={675}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {post.publishedAt && (
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt, locale)}
            </time>
          )}
          {post.author && (
            <>
              <span>&middot;</span>
              <span>
                {t('blog.by')} {post.author.name}
              </span>
            </>
          )}
        </div>

        <h1 className="mt-4 text-4xl font-bold tracking-tight">{post.title}</h1>

        {post.categories && post.categories.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.categories.map((cat) => (
              <span
                key={cat.id}
                className="rounded-full bg-muted px-3 py-1 text-xs font-medium"
              >
                {cat.name}
              </span>
            ))}
          </div>
        )}

        {post.content && (
          <div
            className="mt-8 prose prose-gray max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
          />
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full bg-secondary px-3 py-1 text-xs font-medium"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {relatedPosts.length > 0 && (
        <div className="mx-auto mt-20 max-w-5xl">
          <h2 className="text-2xl font-bold mb-8">{t('blog.relatedPosts')}</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {relatedPosts.map((related) => (
              <BlogCard key={related.id} post={related} locale={locale} />
            ))}
          </div>
        </div>
      )}

      <StructuredData
        type="BlogPosting"
        data={{
          headline: post.title,
          description: post.excerpt,
          image: post.featuredImage,
          datePublished: post.publishedAt,
          author: post.author
            ? { '@type': 'Person', name: post.author.name }
            : undefined,
        }}
      />
    </article>
  );
}
