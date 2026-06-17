'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import type { Artist } from '@salon-tatto/shared';
import { getImageUrl } from '@/lib/utils';

export function FeaturedArtists() {
  const t = useTranslations();
  const locale = useLocale();

  const { data: artists, isLoading } = useQuery({
    queryKey: queryKeys.artists.list({ locale, limit: 4 }),
    queryFn: () =>
      api.get<Artist[]>('/artists', {
        params: { locale, limit: 4, isActive: true },
      }),
  });

  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t('featuredArtists.title')}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('featuredArtists.description')}
          </p>
        </div>

        {isLoading ? (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse space-y-4 rounded-lg border p-6">
                <div className="mx-auto h-24 w-24 rounded-full bg-muted" />
                <div className="mx-auto h-4 w-3/4 rounded bg-muted" />
                <div className="mx-auto h-3 w-1/2 rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {artists?.map((artist) => (
              <Link
                key={artist.id}
                href={`/${locale}/artistas/${artist.slug}`}
                className="group rounded-lg border p-6 text-center transition-colors hover:border-primary"
              >
                <Avatar className="mx-auto h-24 w-24">
                  <AvatarImage
                    src={getImageUrl(artist.avatar)}
                    alt={artist.name || ''}
                    className="rounded-full object-cover"
                  />
                  <AvatarFallback className="flex h-full w-full items-center justify-center rounded-full bg-muted text-2xl font-bold">
                    {artist.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="mt-4 font-semibold group-hover:text-primary transition-colors">
                  {artist.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {artist.specialty}
                </p>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href={`/${locale}/artistas`}>
            <Button variant="outline" size="lg">
              {t('actions.viewAll')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
