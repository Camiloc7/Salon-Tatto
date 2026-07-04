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
      canonical: `/${locale}/blog/${slug}`,
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

  // A basic reading time estimator
  const wordCount = post.content?.split(' ').length || post.excerpt?.split(' ').length || 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <article className="min-h-screen pb-20">
      {/* Immersive Hero Header */}
      <header className="relative h-[60vh] min-h-[500px] w-full bg-neutral-950 flex flex-col justify-end">
        {post.featuredImage && (
          <div className="absolute inset-0 z-0">
            <ImageOptimized
              src={getImageUrl(post.featuredImage)}
              alt={post.title || ''}
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>
        )}

        <div className="container relative z-10 pb-12 md:pb-20">
          <div className="max-w-4xl">
            {post.categories && post.categories.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {post.categories.map((cat) => (
                  <span
                    key={cat.id}
                    className="rounded-full bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-white uppercase tracking-widest border border-white/20"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-foreground leading-[1.1] mb-6">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-sm md:text-base text-muted-foreground uppercase tracking-widest font-medium">
              {post.publishedAt && (
                <time dateTime={post.publishedAt}>
                  {formatDate(post.publishedAt, locale)}
                </time>
              )}
              <span>&middot;</span>
              <span>{readingTime} min read</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content Section */}
      <div className="container mt-12 md:mt-16">
        <div className="mx-auto max-w-3xl">
          {post.content && (
            <div
              className="rich-content text-base md:text-lg max-w-none [&>h1]:font-serif [&>h2]:font-serif [&>h3]:font-serif [&>h4]:font-serif [&>h5]:font-serif [&>h6]:font-serif [&>h1]:tracking-tight [&>h2]:tracking-tight [&>h3]:tracking-tight"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
            />
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="mt-16 pt-8 border-t flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-full bg-secondary/50 hover:bg-secondary transition-colors cursor-default px-4 py-2 text-xs font-medium uppercase tracking-wider"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
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
