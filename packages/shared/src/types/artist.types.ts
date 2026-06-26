export type ArtistStatus = 'active' | 'inactive';

export interface Artist {
  id: string;
  slug: string;
  avatar: string;
  instagramUrl: string;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Translation fields (flattened)
  name?: string;
  biography?: string;
  specialty?: string;
  seoTitle?: string;
  seoDescription?: string;
  images?: ArtistImage[];
  translations?: ArtistTranslation[];
}

export interface ArtistTranslation {
  id: string;
  artistId: string;
  languageCode: string;
  name: string;
  biography: string;
  specialty: string;
  seoTitle: string;
  seoDescription: string;
}

export interface ArtistImage {
  id: string;
  artistId: string;
  cloudinaryId: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  format: string;
  isFeatured: boolean;
  orderIndex: number;
}
