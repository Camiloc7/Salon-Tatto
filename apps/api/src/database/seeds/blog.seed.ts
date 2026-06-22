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

  console.log('Checking for missing blog posts...');

  console.log('Seeding mock blog posts...');

  const existing_post1 = await blogRepo.findOne({ where: { slug: 'guide-to-fine-line-tattoos' } });
  if (!existing_post1) {
    const post1 = blogRepo.create({
    slug: 'guide-to-fine-line-tattoos',
    featuredImage: 'https://images.unsplash.com/photo-1598371839696-5e5bb00b059b?q=80&w=800&auto=format&fit=crop',
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
  }

  const existing_post2 = await blogRepo.findOne({ where: { slug: 'tattoo-aftercare' } });
  if (!existing_post2) {
    const post2 = blogRepo.create({
    slug: 'tattoo-aftercare',
    featuredImage: 'https://images.unsplash.com/photo-1611501271465-9eb84ff6a24d?q=80&w=800&auto=format&fit=crop',
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
  }

  const existing_post3 = await blogRepo.findOne({ where: { slug: 'choosing-tattoo-placement' } });
  if (!existing_post3) {
    const post3 = blogRepo.create({
    slug: 'choosing-tattoo-placement',
    featuredImage: 'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=800&auto=format&fit=crop',
    status: 'published',
    publishedAt: new Date(),
    isActive: true,
    authorId: admin.id,
  });
    await blogRepo.save(post3);
    await transRepo.save([
    transRepo.create({
      blogPostId: post3.id,
      languageId: enLang.id,
      title: 'Choosing the Right Placement',
      excerpt: 'Pain charts, aging, and visibility: what to consider when deciding where to get tattooed.',
      content: '<p>The placement of a tattoo can drastically affect both the pain level and how the tattoo ages over time. Areas with high friction tend to fade faster.</p>',
    }),
    transRepo.create({
      blogPostId: post3.id,
      languageId: esLang.id,
      title: 'Eligiendo el Lugar Correcto',
      excerpt: 'Mapas de dolor, envejecimiento y visibilidad: qué considerar al decidir dónde tatuarse.',
      content: '<p>La ubicación de un tatuaje puede afectar drásticamente tanto el nivel de dolor como la forma en que el tatuaje envejece con el tiempo.</p>',
    }),
  ]);
  }

  const existing_post4 = await blogRepo.findOne({ where: { slug: 'history-traditional-tattoos' } });
  if (!existing_post4) {
    const post4 = blogRepo.create({
    slug: 'history-traditional-tattoos',
    featuredImage: 'https://images.unsplash.com/photo-1590246814883-57832eed39bc?q=80&w=800&auto=format&fit=crop',
    status: 'published',
    publishedAt: new Date(),
    isActive: true,
    authorId: admin.id,
  });
    await blogRepo.save(post4);
    await transRepo.save([
    transRepo.create({
      blogPostId: post4.id,
      languageId: enLang.id,
      title: 'The History of Traditional Tattoos',
      excerpt: 'A deep dive into American Traditional tattoos and their timeless aesthetic.',
      content: '<p>Characterized by bold black outlines and a limited color palette, traditional tattoos have stood the test of time.</p>',
    }),
    transRepo.create({
      blogPostId: post4.id,
      languageId: esLang.id,
      title: 'La Historia de los Tatuajes Tradicionales',
      excerpt: 'Una inmersión profunda en los tatuajes tradicionales americanos y su estética atemporal.',
      content: '<p>Caracterizados por líneas negras gruesas y una paleta de colores limitada, los tatuajes tradicionales han resistido la prueba del tiempo.</p>',
    }),
  ]);
  }

  const existing_post5 = await blogRepo.findOne({ where: { slug: 'minimalist-tattoos-trend' } });
  if (!existing_post5) {
    const post5 = blogRepo.create({
    slug: 'minimalist-tattoos-trend',
    featuredImage: 'https://images.unsplash.com/photo-1542382025-a1c2cb0dd3db?q=80&w=800&auto=format&fit=crop',
    status: 'published',
    publishedAt: new Date(),
    isActive: true,
    authorId: admin.id,
  });
    await blogRepo.save(post5);
    await transRepo.save([
    transRepo.create({
      blogPostId: post5.id,
      languageId: enLang.id,
      title: 'Minimalist Tattoos: Less is More',
      excerpt: 'Why small, elegant, and subtle tattoos are dominating the industry right now.',
      content: '<p>Minimalism isn’t just a lifestyle; it has become one of the most requested tattoo styles globally. It requires incredible precision.</p>',
    }),
    transRepo.create({
      blogPostId: post5.id,
      languageId: esLang.id,
      title: 'Tatuajes Minimalistas: Menos es Más',
      excerpt: 'Por qué los tatuajes pequeños, elegantes y sutiles están dominando la industria ahora mismo.',
      content: '<p>El minimalismo no es solo un estilo de vida; se ha convertido en uno de los estilos de tatuaje más solicitados a nivel mundial.</p>',
    }),
  ]);
  }

  const existing_post6 = await blogRepo.findOne({ where: { slug: 'watercolor-tattoos' } });
  if (!existing_post6) {
    const post6 = blogRepo.create({
    slug: 'watercolor-tattoos',
    featuredImage: 'https://images.unsplash.com/photo-1550537687-c91072c4792d?q=80&w=800&auto=format&fit=crop',
    status: 'published',
    publishedAt: new Date(),
    isActive: true,
    authorId: admin.id,
  });
    await blogRepo.save(post6);
    await transRepo.save([
    transRepo.create({
      blogPostId: post6.id,
      languageId: enLang.id,
      title: 'Watercolor Tattoos Explained',
      excerpt: 'The technique behind vibrant, brush-stroke tattoos and how they heal.',
      content: '<p>Watercolor tattoos simulate the effect of a watercolor painting on the skin. They require a very specific approach to ensure longevity.</p>',
    }),
    transRepo.create({
      blogPostId: post6.id,
      languageId: esLang.id,
      title: 'Explicación de los Tatuajes Acuarela',
      excerpt: 'La técnica detrás de los tatuajes vibrantes con efecto de pinceladas y cómo curan.',
      content: '<p>Los tatuajes de acuarela simulan el efecto de una pintura sobre la piel. Requieren un enfoque muy específico para garantizar su longevidad.</p>',
    }),
  ]);
  }
  // --- New Articles ---
  const existing_post7 = await blogRepo.findOne({ where: { slug: 'prepare-custom-tattoo' } });
  if (!existing_post7) {
    const post7 = blogRepo.create({
    slug: 'prepare-custom-tattoo',
    featuredImage: 'https://images.unsplash.com/photo-1598371839696-5e5bb00b059b?q=80&w=800&auto=format&fit=crop',
    status: 'published',
    publishedAt: new Date(),
    isActive: true,
    authorId: admin.id,
  });
    await blogRepo.save(post7);
    await transRepo.save([
    transRepo.create({
      blogPostId: post7.id,
      languageId: enLang.id,
      title: 'How to Prepare for Your First Custom Tattoo',
      excerpt: 'Tips and tricks to ensure your custom design session goes smoothly.',
      content: '<p>A custom tattoo requires clear communication with your artist. Bring references, stay hydrated, and trust the professional process.</p>',
    }),
    transRepo.create({
      blogPostId: post7.id,
      languageId: esLang.id,
      title: 'Cómo prepararte para tu primer tatuaje personalizado',
      excerpt: 'Consejos y trucos para asegurar que tu sesión de diseño a medida sea un éxito.',
      content: '<p>Un tatuaje personalizado requiere comunicación clara con tu artista. Trae referencias, mantente hidratado y confía en el proceso profesional.</p>',
    }),
  ]);
  }

  const existing_post8 = await blogRepo.findOne({ where: { slug: 'rise-uv-tattoos' } });
  if (!existing_post8) {
    const post8 = blogRepo.create({
    slug: 'rise-uv-tattoos',
    featuredImage: 'https://images.unsplash.com/photo-1611501271465-9eb84ff6a24d?q=80&w=800&auto=format&fit=crop',
    status: 'published',
    publishedAt: new Date(),
    isActive: true,
    authorId: admin.id,
  });
    await blogRepo.save(post8);
    await transRepo.save([
    transRepo.create({
      blogPostId: post8.id,
      languageId: enLang.id,
      title: 'The Rise of UV Tattoos: What You Need to Know',
      excerpt: 'Everything about blacklight tattoos, from safety to aftercare.',
      content: '<p>UV tattoos use reactive ink that glows under blacklight but remains practically invisible under normal light. They are a unique way to hide or highlight your ink.</p>',
    }),
    transRepo.create({
      blogPostId: post8.id,
      languageId: esLang.id,
      title: 'El auge de los tatuajes UV: Lo que necesitas saber',
      excerpt: 'Todo sobre los tatuajes de luz negra, desde la seguridad hasta los cuidados.',
      content: '<p>Los tatuajes UV usan tinta reactiva que brilla bajo luz negra pero permanece casi invisible bajo luz normal. Son una forma única de ocultar o resaltar tu tinta.</p>',
    }),
  ]);
  }

  const existing_post9 = await blogRepo.findOne({ where: { slug: 'tattoo-etiquette-tourists-nyc' } });
  if (!existing_post9) {
    const post9 = blogRepo.create({
    slug: 'tattoo-etiquette-tourists-nyc',
    featuredImage: 'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=800&auto=format&fit=crop',
    status: 'published',
    publishedAt: new Date(),
    isActive: true,
    authorId: admin.id,
  });
    await blogRepo.save(post9);
    await transRepo.save([
    transRepo.create({
      blogPostId: post9.id,
      languageId: enLang.id,
      title: 'Tattoo Etiquette for Tourists in NYC',
      excerpt: 'Getting inked in New York? Here are the unspoken rules you should know.',
      content: '<p>Getting a souvenir tattoo in NYC is a rite of passage. Be sure to book in advance, respect shop minimums, and always tip your artist!</p>',
    }),
    transRepo.create({
      blogPostId: post9.id,
      languageId: esLang.id,
      title: 'Etiqueta de tatuajes para turistas en NYC',
      excerpt: '¿Te vas a tatuar en Nueva York? Aquí tienes las reglas no escritas que debes conocer.',
      content: '<p>Hacerse un tatuaje de recuerdo en NYC es un rito de paso. Asegúrate de reservar con tiempo, respetar los mínimos del estudio y ¡siempre dar propina a tu artista!</p>',
    }),
  ]);
  }

  const existing_post10 = await blogRepo.findOne({ where: { slug: 'ornamental-tattoos-timeless' } });
  if (!existing_post10) {
    const post10 = blogRepo.create({
    slug: 'ornamental-tattoos-timeless',
    featuredImage: 'https://images.unsplash.com/photo-1590246814883-57832eed39bc?q=80&w=800&auto=format&fit=crop',
    status: 'published',
    publishedAt: new Date(),
    isActive: true,
    authorId: admin.id,
  });
    await blogRepo.save(post10);
    await transRepo.save([
    transRepo.create({
      blogPostId: post10.id,
      languageId: enLang.id,
      title: 'Why Ornamental Tattoos Are Timeless',
      excerpt: 'Exploring the beauty of decorative body art that flows with your anatomy.',
      content: '<p>Ornamental tattoos mimic the look of jewelry, lace, or mandalas. Their elegance comes from how perfectly they conform to the natural curves of the body.</p>',
    }),
    transRepo.create({
      blogPostId: post10.id,
      languageId: esLang.id,
      title: 'Por qué los tatuajes ornamentales son atemporales',
      excerpt: 'Explorando la belleza del arte corporal decorativo que fluye con tu anatomía.',
      content: '<p>Los tatuajes ornamentales imitan el aspecto de las joyas, encajes o mandalas. Su elegancia proviene de lo perfectamente que se adaptan a las curvas del cuerpo.</p>',
    }),
  ]);
  }

  console.log('Blog posts seeded successfully!');
}
