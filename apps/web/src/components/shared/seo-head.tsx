type SeoData = {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  keywords?: string;
};

export function SeoHead({ seo }: { seo: SeoData }) {
  return null;
}
