import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ImageOptimized } from '@/components/shared/image-optimized';
import { formatDate, getImageUrl, cn } from '@/lib/utils';
import type { BlogPost } from '@salon-tatto/shared';

type BlogCardProps = {
  post: BlogPost;
  locale: string;
  featured?: boolean;
};

export function BlogCard({ post, locale, featured = false }: BlogCardProps) {
  const t = useTranslations();

  // A basic reading time estimator (approx 200 words per minute)
  const wordCount = post.content?.split(' ').length || post.excerpt?.split(' ').length || 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-xl bg-neutral-950 transition-all duration-700 ease-out hover:shadow-2xl hover:shadow-primary/20",
        featured ? "md:col-span-2 md:row-span-2 min-h-[500px] md:min-h-[600px]" : "min-h-[400px]"
      )}
    >
      <Link href={`/${locale}/blog/${post.slug}`} className="absolute inset-0 z-20" aria-label={`Read article: ${post.title}`}>
        <span className="sr-only">{post.title}</span>
      </Link>

      <div className="absolute inset-0 z-0">
        <ImageOptimized
          src={getImageUrl(post.featuredImage)}
          alt={post.title || ''}
          fill
          priority={featured}
          sizes={featured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
          className="object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105 opacity-80 group-hover:opacity-100"
        />
        {/* Dark Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-700" />
      </div>

      <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 md:p-8">
        <div className="translate-y-4 transition-transform duration-500 ease-out group-hover:translate-y-0">
          
          {post.categories && post.categories.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {post.categories.map((cat) => (
                <span
                  key={cat.id}
                  className="rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-medium text-white/90 uppercase tracking-widest border border-white/20"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          )}

          <h2 
            className={cn(
              "font-serif font-bold text-white leading-tight mb-3 transition-colors duration-300 group-hover:text-primary-foreground",
              featured ? "text-3xl md:text-5xl" : "text-2xl"
            )}
          >
            {post.title}
          </h2>
          
          <p 
            className={cn(
              "text-white/70 line-clamp-2 mb-4 font-light",
              featured ? "text-lg md:text-xl line-clamp-3" : "text-sm"
            )}
          >
            {post.excerpt}
          </p>

          <div className="flex items-center gap-3 text-xs md:text-sm text-white/50 uppercase tracking-widest font-medium">
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
    </article>
  );
}
