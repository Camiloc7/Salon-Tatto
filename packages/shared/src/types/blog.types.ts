export type BlogPostStatus = 'draft' | 'published';

export interface BlogPost {
  id: string;
  slug: string;
  featuredImage: string;
  status: BlogPostStatus;
  publishedAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Translation fields
  title?: string;
  excerpt?: string;
  content?: string;
  seoTitle?: string;
  seoDescription?: string;
  // Relations
  author?: { id: string; name: string; avatar: string };
  categories?: Category[];
  tags?: Tag[];
}

export interface BlogPostTranslation {
  id: string;
  blogPostId: string;
  languageCode: string;
  title: string;
  excerpt: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
}

export interface Category {
  id: string;
  slug: string;
  name?: string;
}

export interface CategoryTranslation {
  id: string;
  categoryId: string;
  languageCode: string;
  name: string;
}

export interface Tag {
  id: string;
  slug: string;
  name?: string;
}

export interface TagTranslation {
  id: string;
  tagId: string;
  languageCode: string;
  name: string;
}
