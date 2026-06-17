import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ImageOptimized } from '@/components/shared/image-optimized';
import { formatDate, getImageUrl } from '@/lib/utils';
import type { BlogPost } from '@salon-tatto/shared';

type BlogCardProps = {
  post: BlogPost;
  locale: string;
};

export function BlogCard({ post, locale }: BlogCardProps) {
  const t = useTranslations();

  return (
    <Link
      href={`/${locale}/blog/${post.slug}`}
      className="group rounded-lg border overflow-hidden transition-colors hover:border-primary"
    >
      <div className="aspect-video overflow-hidden">
        <ImageOptimized
          src={getImageUrl(post.featuredImage)}
          alt={post.title || ''}
          width={600}
          height={340}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
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
        <h3 className="mt-2 text-xl font-semibold group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        <p className="mt-2 text-muted-foreground line-clamp-2">
          {post.excerpt}
        </p>
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
      </div>
    </Link>
  );
}
