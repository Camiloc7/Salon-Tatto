import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { getImageUrl } from '@/lib/utils';
import type { Artist } from '@salon-tatto/shared';

type ArtistCardProps = {
  artist: Artist;
  locale: string;
};

export function ArtistCard({ artist, locale }: ArtistCardProps) {
  const featuredImage = artist.images?.find((img) => img.isFeatured);
  const coverUrl = featuredImage 
    ? getImageUrl(featuredImage.url || featuredImage.cloudinaryId) 
    : getImageUrl(artist.avatar);

  return (
    <Link
      href={`/${locale}/artistas/${artist.slug}`}
      className="group rounded-lg border p-6 text-center transition-colors hover:border-primary"
    >
      <Avatar className="mx-auto h-32 w-32">
        <AvatarImage
          src={coverUrl}
          alt={artist.name || ''}
          className="rounded-full object-cover h-full w-full"
        />
        <AvatarFallback className="flex h-full w-full items-center justify-center rounded-full bg-muted text-3xl font-bold">
          {artist.name?.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <h3 className="mt-4 text-lg font-semibold group-hover:text-primary transition-colors">
        {artist.name}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">{artist.specialty}</p>
    </Link>
  );
}
