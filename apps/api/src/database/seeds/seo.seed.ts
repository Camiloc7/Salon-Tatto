import { DataSource } from 'typeorm';
import { SeoPage } from '../../modules/seo/entities/seo-page.entity';
import { SeoPageTranslation } from '../../modules/seo/entities/seo-page-translation.entity';
import { Language } from '../../modules/languages/entities/language.entity';

export async function seedSeo(dataSource: DataSource): Promise<void> {
  const seoPageRepository = dataSource.getRepository(SeoPage);
  const translationRepository = dataSource.getRepository(SeoPageTranslation);
  const languageRepository = dataSource.getRepository(Language);

  const existingPages = await seoPageRepository.count();
  if (existingPages > 0) {
    console.log('SEO pages already seeded, skipping...');
    return;
  }

  const en = await languageRepository.findOne({ where: { code: 'en' } });
  const es = await languageRepository.findOne({ where: { code: 'es' } });

  if (!en || !es) {
    console.error('Languages not found. Run language seed first.');
    return;
  }

  const pages = [
    { pageKey: 'home', canonicalUrl: '' },
    { pageKey: 'studio', canonicalUrl: '/studio' },
    { pageKey: 'artists', canonicalUrl: '/artists' },
    { pageKey: 'gallery', canonicalUrl: '/gallery' },
    { pageKey: 'blog', canonicalUrl: '/blog' },
    { pageKey: 'contact', canonicalUrl: '/contact' },
  ];

  for (const pageData of pages) {
    const page = seoPageRepository.create(pageData);
    await seoPageRepository.save(page);

    const translations = [
      {
        seoPage: page,
        language: en,
        title: `La Rola Tattoo NYC - ${pageData.pageKey.charAt(0).toUpperCase() + pageData.pageKey.slice(1)}`,
        description: `Welcome to La Rola Tattoo NYC - professional tattoo studio`,
        ogTitle: `La Rola Tattoo NYC - ${pageData.pageKey.charAt(0).toUpperCase() + pageData.pageKey.slice(1)}`,
        ogDescription: `Welcome to La Rola Tattoo NYC - professional tattoo studio`,
        ogImage: '',
        keywords: 'tattoo, studio, salon tattoo',
      },
      {
        seoPage: page,
        language: es,
        title: `La Rola Tattoo NYC - ${pageData.pageKey === 'artists' ? 'Artistas' : pageData.pageKey === 'gallery' ? 'Galería' : pageData.pageKey === 'blog' ? 'Blog' : pageData.pageKey === 'contact' ? 'Contacto' : pageData.pageKey === 'studio' ? 'Estudio' : 'Inicio'}`,
        description: `Bienvenido a La Rola Tattoo NYC - estudio profesional de tatuajes`,
        ogTitle: `La Rola Tattoo NYC - ${pageData.pageKey}`,
        ogDescription: `Bienvenido a La Rola Tattoo NYC - estudio profesional de tatuajes`,
        ogImage: '',
        keywords: 'tatuaje, estudio, salon tattoo',
      },
    ];

    await translationRepository.save(translationRepository.create(translations));
  }

  console.log('SEO pages seeded successfully');
}
