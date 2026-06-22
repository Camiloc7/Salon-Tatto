import { DataSource } from 'typeorm';
import { Artist } from '../../modules/artists/entities/artist.entity';
import { ArtistTranslation } from '../../modules/artists/entities/artist-translation.entity';
import { ArtistImage } from '../../modules/gallery/entities/artist-image.entity';
import { Language } from '../../modules/languages/entities/language.entity';

export async function seedArtists(dataSource: DataSource) {
  const languageRepo = dataSource.getRepository(Language);
  const artistRepo = dataSource.getRepository(Artist);
  const translationRepo = dataSource.getRepository(ArtistTranslation);
  const imageRepo = dataSource.getRepository(ArtistImage);

  const enLang = await languageRepo.findOne({ where: { code: 'en' } });
  const esLang = await languageRepo.findOne({ where: { code: 'es' } });

  if (!enLang || !esLang) {
    console.warn('Languages not found, skipping artist seeding.');
    return;
  }

  const existingArtists = await artistRepo.count();
  if (existingArtists > 0) {
    console.log('Artists already exist. Skipping seed.');
    return;
  }

  console.log('Seeding mock artists...');

  // Artist 1: Nathalia Cantillo
  const artist1 = artistRepo.create({
    slug: 'nathalia-cantillo',
    avatar: 'https://res.cloudinary.com/dlimmlxeh/image/upload/v1782088500/salon-tatto/uploads/idw8qosjdmo8ea3zapj7.jpg',
    instagramUrl: 'https://instagram.com/elenasilva.tattoo',
    isActive: true,
    orderIndex: 0,
  });
  await artistRepo.save(artist1);

  await translationRepo.save([
    translationRepo.create({
      artistId: artist1.id,
      languageId: enLang.id,
      name: 'Nathalia Cantillo',
      specialty: 'Fine Line & Micro Realism',
      biography: 'Nathalia is a specialist in fine line tattoos and micro realism.',
    }),
    translationRepo.create({
      artistId: artist1.id,
      languageId: esLang.id,
      name: 'Nathalia Cantillo',
      specialty: 'Fine Line y Micro Realismo',
      biography: 'Nathalia Cantillo es especialista en tatuajes de línea fina y micro realismo.',
    }),
  ]);

  await imageRepo.save([
    imageRepo.create({
      artistId: artist1.id,
      cloudinaryId: 'mock-1',
      url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      alt: 'Fine line floral tattoo',
      isFeatured: true,
      orderIndex: 0,
    }),
    imageRepo.create({
      artistId: artist1.id,
      cloudinaryId: 'mock-2',
      url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      alt: 'NYC Skyline minimalist tattoo',
      isFeatured: false,
      orderIndex: 1,
    }),
  ]);

  // Artist 2: Marcus Chen
  const artist2 = artistRepo.create({
    slug: 'marcus-chen',
    avatar: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
    instagramUrl: 'https://instagram.com/marcuschen.tattoo',
    isActive: true,
    orderIndex: 1,
  });
  await artistRepo.save(artist2);

  await translationRepo.save([
    translationRepo.create({
      artistId: artist2.id,
      languageId: enLang.id,
      name: 'Marcus Chen',
      specialty: 'Ornamental & Blackwork',
      biography: 'Marcus creates stunning ornamental designs using solid blackwork techniques.',
    }),
    translationRepo.create({
      artistId: artist2.id,
      languageId: esLang.id,
      name: 'Marcus Chen',
      specialty: 'Ornamental y Blackwork',
      biography: 'Marcus crea impresionantes diseños ornamentales utilizando técnicas de blackwork sólido.',
    }),
  ]);

  await imageRepo.save([
    imageRepo.create({
      artistId: artist2.id,
      cloudinaryId: 'mock-3',
      url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      alt: 'Ornamental back tattoo',
      isFeatured: true,
      orderIndex: 0,
    }),
    imageRepo.create({
      artistId: artist2.id,
      cloudinaryId: 'mock-4',
      url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      alt: 'Scorpion fine line tattoo',
      isFeatured: false,
      orderIndex: 1,
    }),
  ]);

  console.log('Artists seeded successfully!');
}
