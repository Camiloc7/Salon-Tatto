import { DataSource } from 'typeorm';
import { Category } from '../../modules/blog/entities/category.entity';
import { CategoryTranslation } from '../../modules/blog/entities/category-translation.entity';
import { Language } from '../../modules/languages/entities/language.entity';

export async function seedCategories(dataSource: DataSource) {
  const langRepo = dataSource.getRepository(Language);
  const categoryRepo = dataSource.getRepository(Category);
  const transRepo = dataSource.getRepository(CategoryTranslation);

  const enLang = await langRepo.findOne({ where: { code: 'en' } });
  const esLang = await langRepo.findOne({ where: { code: 'es' } });

  if (!enLang || !esLang) {
    console.warn('Languages not found, skipping category seeding.');
    return;
  }

  const existingCount = await categoryRepo.count();
  if (existingCount > 0) {
    console.log('Categories already exist, skipping...');
    return;
  }

  console.log('Seeding categories...');

  const categoriesToSeed = [
    {
      slug: 'ornamental',
      en: { name: 'Ornamental Tattoos', description: 'Intricate patterns and decorative designs.' },
      es: { name: 'Tatuajes Ornamentales', description: 'Patrones intrincados y diseños decorativos.' },
    },
    {
      slug: 'custom',
      en: { name: 'Custom & One-of-a-kind', description: 'Unique tattoos tailored to your personal story.' },
      es: { name: 'Personalizados', description: 'Tatuajes únicos adaptados a tu historia personal.' },
    },
    {
      slug: 'uv',
      en: { name: 'UV Tattoos', description: 'Tattoos that glow under blacklight using special UV ink.' },
      es: { name: 'Tatuajes UV', description: 'Tatuajes que brillan bajo luz negra usando tinta UV especial.' },
    },
    {
      slug: 'fine-line',
      en: { name: 'Fine Line Tattoos', description: 'Delicate, highly detailed minimalist designs.' },
      es: { name: 'Línea Fina', description: 'Diseños minimalistas delicados y altamente detallados.' },
    },
    {
      slug: 'tourist',
      en: { name: 'Tourist Tattoos', description: 'Memorable souvenirs of your trip to New York.' },
      es: { name: 'Para Turistas', description: 'Recuerdos memorables de tu viaje a Nueva York.' },
    },
  ];

  for (const item of categoriesToSeed) {
    const category = categoryRepo.create({
      slug: item.slug,
    });
    await categoryRepo.save(category);

    await transRepo.save([
      transRepo.create({
        categoryId: category.id,
        languageId: enLang.id,
        name: item.en.name,
      }),
      transRepo.create({
        categoryId: category.id,
        languageId: esLang.id,
        name: item.es.name,
      }),
    ]);
  }

  console.log('Categories seeded successfully!');
}
