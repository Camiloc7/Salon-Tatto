export interface SeoPage {
  id: string;
  pageKey: string;
  canonicalUrl: string;
  isActive: boolean;
  // Translation fields
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  keywords?: string;
}

export interface SeoPageTranslation {
  id: string;
  seoPageId: string;
  languageCode: string;
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  keywords: string;
}
