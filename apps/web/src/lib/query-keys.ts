export const queryKeys = {
  artists: {
    all: ['artists'] as const,
    list: (params?: Record<string, unknown>) => ['artists', 'list', params] as const,
    detail: (slug: string, locale?: string) => ['artists', slug, locale] as const,
  },
  blog: {
    all: ['blog'] as const,
    list: (params?: Record<string, unknown>) => ['blog', 'list', params] as const,
    detail: (slug: string, locale?: string) => ['blog', slug, locale] as const,
    categories: ['blog', 'categories'] as const,
    tags: ['blog', 'tags'] as const,
  },
  gallery: {
    byArtist: (artistId: string) => ['gallery', artistId] as const,
  },
  settings: {
    all: ['settings'] as const,
  },
  seo: {
    byPage: (pageKey: string) => ['seo', pageKey] as const,
  },
  languages: {
    all: ['languages'] as const,
  },
  auth: {
    me: ['auth', 'me'] as const,
  },
};
