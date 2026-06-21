import { DataSource } from 'typeorm';
import { BlogPost } from '../../modules/blog/entities/blog-post.entity';
import { BlogPostTranslation } from '../../modules/blog/entities/blog-post-translation.entity';
import { Language } from '../../modules/languages/entities/language.entity';
import { User } from '../../modules/users/entities/user.entity';

export async function seedBlog(dataSource: DataSource) {
  const blogRepo = dataSource.getRepository(BlogPost);
  const transRepo = dataSource.getRepository(BlogPostTranslation);
  const langRepo = dataSource.getRepository(Language);
  const userRepo = dataSource.getRepository(User);

  const enLang = await langRepo.findOne({ where: { code: 'en' } });
  const esLang = await langRepo.findOne({ where: { code: 'es' } });
  const admin = await userRepo.findOne({ where: { email: 'admin@salontatto.com' } });

  if (!enLang || !esLang || !admin) {
    console.warn('Languages or Admin not found, skipping blog seeding.');
    return;
  }

  const count = await blogRepo.count();
  if (count > 0) {
    console.log('Blog posts already exist, skipping...');
    return;
  }

  console.log('Seeding mock blog posts...');

  const post1 = blogRepo.create({
    slug: 'guide-to-fine-line-tattoos',
    featuredImage: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
    status: 'published',
    publishedAt: new Date(),
    isActive: true,
    authorId: admin.id,
  });
  await blogRepo.save(post1);

  await transRepo.save([
    transRepo.create({
      blogPostId: post1.id,
      languageId: enLang.id,
      title: 'The Ultimate Guide to Fine Line Tattoos',
      excerpt: 'Everything you need to know before getting your first fine line tattoo.',
      content: '<p>Fine line tattoos are created using single needles or small groupings to create delicate, detailed designs. Healing them properly is crucial.</p>',
    }),
    transRepo.create({
      blogPostId: post1.id,
      languageId: esLang.id,
      title: 'La Guía Definitiva de Tatuajes Fine Line',
      excerpt: 'Todo lo que necesitas saber antes de hacerte tu primer tatuaje fine line.',
      content: '<p>Los tatuajes de línea fina se crean usando agujas únicas para diseños delicados. Su correcta curación es vital.</p>',
    }),
  ]);

  const post2 = blogRepo.create({
    slug: 'tattoo-aftercare',
    featuredImage: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
    status: 'published',
    publishedAt: new Date(),
    isActive: true,
    authorId: admin.id,
  });
  await blogRepo.save(post2);

  await transRepo.save([
    transRepo.create({
      blogPostId: post2.id,
      languageId: enLang.id,
      title: 'Tattoo Aftercare 101',
      excerpt: 'How to take care of your fresh ink to ensure it heals perfectly.',
      content: '<p>Keep it clean, keep it moisturized, and keep it out of the sun.</p>',
    }),
    transRepo.create({
      blogPostId: post2.id,
      languageId: esLang.id,
      title: 'Cuidado de Tatuajes 101',
      excerpt: 'Cómo cuidar tu nueva tinta para asegurar que sane perfectamente.',
      content: '<p>Mantenlo limpio, hidratado y fuera del alcance del sol directo.</p>',
    }),
  ]);

  console.log('Blog posts seeded successfully!');
}
