import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, In } from 'typeorm';
import { BlogPost } from '../entities/blog-post.entity';
import { BlogPostTranslation } from '../entities/blog-post-translation.entity';
import { Category } from '../entities/category.entity';
import { Tag } from '../entities/tag.entity';
import { Language } from '../../languages/entities/language.entity';
import { CreateBlogPostDto } from '../dto/create-blog-post.dto';
import { UpdateBlogPostDto } from '../dto/update-blog-post.dto';
import { QueryBlogDto } from '../dto/query-blog.dto';
import { TranslationService } from '../../translation/translation.service';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogPost)
    private readonly blogPostRepository: Repository<BlogPost>,
    private readonly dataSource: DataSource,
    private readonly translationService: TranslationService,
  ) {}

  async findAll(query: QueryBlogDto) {
    const { locale, status, categorySlug, tagSlug, search, page = 1, limit = 20 } = query;

    const qb = this.blogPostRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.translations', 'translation')
      .leftJoinAndSelect('translation.language', 'language')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.categories', 'categories')
      .leftJoinAndSelect('post.tags', 'tags')
      .where('post.deletedAt IS NULL');

    if (status) {
      qb.andWhere('post.status = :status', { status });
    }

    if (locale && locale !== 'all') {
      qb.andWhere('language.code = :locale', { locale });
    }

    if (search) {
      qb.andWhere('translation.title ILIKE :search', { search: `%${search}%` });
    }

    if (categorySlug) {
      qb.andWhere('categories.slug = :categorySlug', { categorySlug });
    }

    if (tagSlug) {
      qb.andWhere('tags.slug = :tagSlug', { tagSlug });
    }

    qb.orderBy('post.createdAt', 'DESC');

    const total = await qb.getCount();

    qb.skip((page - 1) * limit).take(limit);

    const posts = await qb.getMany();

    const data = posts.map((post) => this.applyTranslation(post, locale));

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string, locale?: string) {
    const qb = this.blogPostRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.translations', 'translation')
      .leftJoinAndSelect('translation.language', 'language')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.categories', 'categories')
      .leftJoinAndSelect('categories.translations', 'categoryTranslation')
      .leftJoinAndSelect('categoryTranslation.language', 'catLang')
      .leftJoinAndSelect('post.tags', 'tags')
      .leftJoinAndSelect('tags.translations', 'tagTranslation')
      .leftJoinAndSelect('tagTranslation.language', 'tagLang')
      .where('post.slug = :slug', { slug })
      .andWhere('post.deletedAt IS NULL');

    if (locale && locale !== 'all') {
      qb.andWhere('language.code = :locale', { locale });
    }

    const post = await qb.getOne();

    if (!post) {
      throw new NotFoundException(`Blog post with slug "${slug}" not found`);
    }

    return this.applyTranslation(post, locale);
  }

  async findById(id: string, locale?: string) {
    const qb = this.blogPostRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.translations', 'translation')
      .leftJoinAndSelect('translation.language', 'language')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.categories', 'categories')
      .leftJoinAndSelect('categories.translations', 'categoryTranslation')
      .leftJoinAndSelect('categoryTranslation.language', 'catLang')
      .leftJoinAndSelect('post.tags', 'tags')
      .leftJoinAndSelect('tags.translations', 'tagTranslation')
      .leftJoinAndSelect('tagTranslation.language', 'tagLang')
      .where('post.id = :id', { id })
      .andWhere('post.deletedAt IS NULL');

    if (locale && locale !== 'all') {
      qb.andWhere('language.code = :locale', { locale });
    }

    const post = await qb.getOne();

    if (!post) {
      throw new NotFoundException(`Blog post with id "${id}" not found`);
    }

    return this.applyTranslation(post, locale);
  }

  async create(dto: CreateBlogPostDto, userId: string) {
    const existing = await this.blogPostRepository.findOne({
      where: { slug: dto.slug },
      withDeleted: true,
    });

    if (existing) {
      throw new BadRequestException(`Blog post with slug "${dto.slug}" already exists`);
    }

    return this.dataSource.transaction(async (manager) => {
      const post = manager.create(BlogPost, {
        slug: dto.slug,
        featuredImage: dto.featuredImage ?? null,
        status: dto.status ?? 'draft',
        authorId: userId,
        publishedAt: dto.status === 'published' ? new Date() : null,
      });

      const savedPost = await manager.save(post);

      if (dto.translations) {
        let esTrans = dto.translations.find(t => t.languageCode === 'es');
        let enTrans = dto.translations.find(t => t.languageCode === 'en');
        
        if (esTrans || enTrans) {
          if (!esTrans) {
            esTrans = { languageCode: 'es' } as any;
            dto.translations.push(esTrans!);
          }
          if (!enTrans) {
            enTrans = { languageCode: 'en' } as any;
            dto.translations.push(enTrans!);
          }
          
          const fieldsToTranslateToEn: any[] = [];
          const fieldsToTranslateToEs: any[] = [];
          const fieldsToCheck = ['title', 'excerpt', 'content', 'seoTitle', 'seoDescription'] as const;
          
          for (const field of fieldsToCheck) {
            const esValue = (esTrans as any)[field];
            const enValue = (enTrans as any)[field];
            
            const hasEs = esValue && (typeof esValue !== 'string' || esValue.trim() !== '');
            const hasEn = enValue && (typeof enValue !== 'string' || enValue.trim() !== '');

            if (hasEs && !hasEn) {
              fieldsToTranslateToEn.push(field);
            } else if (hasEn && !hasEs) {
              fieldsToTranslateToEs.push(field);
            }
          }
          
          if (fieldsToTranslateToEn.length > 0) {
            const translated = await this.translationService.translateObject(esTrans as any, fieldsToTranslateToEn, 'es', 'en');
            for (const field of fieldsToTranslateToEn) {
              if ((translated as any)[field]) {
                let val = (translated as any)[field];
                if (['title', 'seoTitle', 'seoDescription'].includes(field) && typeof val === 'string' && val.length > 255) {
                  val = val.substring(0, 255);
                }
                (enTrans as any)[field] = val;
              }
            }
          }

          if (fieldsToTranslateToEs.length > 0) {
            const translated = await this.translationService.translateObject(enTrans as any, fieldsToTranslateToEs, 'en', 'es');
            for (const field of fieldsToTranslateToEs) {
              if ((translated as any)[field]) {
                let val = (translated as any)[field];
                if (['title', 'seoTitle', 'seoDescription'].includes(field) && typeof val === 'string' && val.length > 255) {
                  val = val.substring(0, 255);
                }
                (esTrans as any)[field] = val;
              }
            }
          }
        }

        for (const transDto of dto.translations) {
          const language = await manager.findOneBy(Language, {
            code: transDto.languageCode,
          });

          if (!language) {
            throw new BadRequestException(
              `Language "${transDto.languageCode}" not found`,
            );
          }

          const translation = manager.create(BlogPostTranslation, {
            blogPostId: savedPost.id,
            languageId: language.id,
            title: transDto.title ? transDto.title.substring(0, 255) : transDto.title,
            excerpt: transDto.excerpt ?? null,
            content: transDto.content ?? null,
            seoTitle: transDto.seoTitle ? transDto.seoTitle.substring(0, 255) : null,
            seoDescription: transDto.seoDescription ? transDto.seoDescription.substring(0, 255) : null,
          });

          await manager.save(translation);
        }
      }

      if (dto.categoryIds && dto.categoryIds.length > 0) {
        const categories = await manager.findBy(Category, { id: In(dto.categoryIds) });
        savedPost.categories = categories;
        await manager.save(savedPost);
      }

      if (dto.tagIds && dto.tagIds.length > 0) {
        const tags = await manager.findBy(Tag, { id: In(dto.tagIds) });
        savedPost.tags = tags;
        await manager.save(savedPost);
      }

      return manager.findOne(BlogPost, {
        where: { id: savedPost.id },
        relations: [
          'translations',
          'translations.language',
          'author',
          'categories',
          'tags',
        ],
      });
    });
  }

  async update(id: string, dto: UpdateBlogPostDto) {
    const post = await this.blogPostRepository.findOne({
      where: { id },
      relations: ['translations'],
    });

    if (!post) {
      throw new NotFoundException(`Blog post with id "${id}" not found`);
    }

    return this.dataSource.transaction(async (manager) => {
      if (dto.slug !== undefined) post.slug = dto.slug;
      if (dto.featuredImage !== undefined) post.featuredImage = dto.featuredImage;
      if (dto.status !== undefined) post.status = dto.status;

      if (dto.categoryIds) {
        post.categories = dto.categoryIds.length > 0
          ? await manager.findBy(Category, { id: In(dto.categoryIds) })
          : [];
      }

      if (dto.tagIds) {
        post.tags = dto.tagIds.length > 0
          ? await manager.findBy(Tag, { id: In(dto.tagIds) })
          : [];
      }

      if (dto.translations) {
        let esTrans = dto.translations.find(t => t.languageCode === 'es');
        let enTrans = dto.translations.find(t => t.languageCode === 'en');
        
        if (esTrans || enTrans) {
          if (!esTrans) {
            esTrans = { languageCode: 'es' } as any;
            dto.translations.push(esTrans!);
          }
          if (!enTrans) {
            enTrans = { languageCode: 'en' } as any;
            dto.translations.push(enTrans!);
          }
          
          const fieldsToTranslateToEn: any[] = [];
          const fieldsToTranslateToEs: any[] = [];
          const fieldsToCheck = ['title', 'excerpt', 'content', 'seoTitle', 'seoDescription'] as const;
          
          for (const field of fieldsToCheck) {
            const esValue = (esTrans as any)[field];
            const enValue = (enTrans as any)[field];
            
            const hasEs = esValue && (typeof esValue !== 'string' || esValue.trim() !== '');
            const hasEn = enValue && (typeof enValue !== 'string' || enValue.trim() !== '');

            if (hasEs && !hasEn) {
              fieldsToTranslateToEn.push(field);
            } else if (hasEn && !hasEs) {
              fieldsToTranslateToEs.push(field);
            }
          }
          
          if (fieldsToTranslateToEn.length > 0) {
            const translated = await this.translationService.translateObject(esTrans as any, fieldsToTranslateToEn, 'es', 'en');
            for (const field of fieldsToTranslateToEn) {
              if ((translated as any)[field]) {
                let val = (translated as any)[field];
                if (['title', 'seoTitle', 'seoDescription'].includes(field) && typeof val === 'string' && val.length > 255) {
                  val = val.substring(0, 255);
                }
                (enTrans as any)[field] = val;
              }
            }
          }

          if (fieldsToTranslateToEs.length > 0) {
            const translated = await this.translationService.translateObject(enTrans as any, fieldsToTranslateToEs, 'en', 'es');
            for (const field of fieldsToTranslateToEs) {
              if ((translated as any)[field]) {
                let val = (translated as any)[field];
                if (['title', 'seoTitle', 'seoDescription'].includes(field) && typeof val === 'string' && val.length > 255) {
                  val = val.substring(0, 255);
                }
                (esTrans as any)[field] = val;
              }
            }
          }
        }

        await manager.delete(BlogPostTranslation, { blogPostId: id });

        const newTranslations = [];
        for (const transDto of dto.translations) {
          const language = await manager.findOneBy(Language, {
            code: transDto.languageCode,
          });

          if (!language) {
            throw new BadRequestException(
              `Language "${transDto.languageCode}" not found`,
            );
          }

          newTranslations.push(
            manager.create(BlogPostTranslation, {
              blogPostId: id,
              languageId: language.id,
              title: transDto.title ? transDto.title.substring(0, 255) : transDto.title,
              excerpt: transDto.excerpt ?? null,
              content: transDto.content ?? null,
              seoTitle: transDto.seoTitle ? transDto.seoTitle.substring(0, 255) : null,
              seoDescription: transDto.seoDescription ? transDto.seoDescription.substring(0, 255) : null,
            })
          );
        }
        post.translations = newTranslations;
      }

      await manager.save(post);

      return manager.findOne(BlogPost, {
        where: { id },
        relations: [
          'translations',
          'translations.language',
          'author',
          'categories',
          'tags',
        ],
      });
    });
  }

  async remove(id: string) {
    const post = await this.blogPostRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Blog post with id "${id}" not found`);
    }

    await this.blogPostRepository.softDelete(id);

    return { message: 'Blog post deleted successfully' };
  }

  async togglePublish(id: string) {
    const post = await this.blogPostRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Blog post with id "${id}" not found`);
    }

    if (post.status === 'published') {
      post.status = 'draft';
    } else {
      post.status = 'published';
      if (!post.publishedAt) {
        post.publishedAt = new Date();
      }
    }

    return this.blogPostRepository.save(post);
  }

  private applyTranslation(post: BlogPost, locale?: string) {
    if (!post.translations || post.translations.length === 0 || locale === 'all') {
      return post;
    }

    let translation: BlogPostTranslation | undefined;

    if (locale) {
      translation = post.translations.find(
        (t) => t.language?.code === locale,
      );
    }

    if (!translation) {
      translation = post.translations[0];
    }

    const { translations, ...postData } = post as any;

    if (postData.categories) {
      postData.categories = postData.categories.map((cat: any) => {
        if (cat.translations && cat.translations.length > 0) {
          const catTrans = cat.translations.find((t: any) => t.language?.code === locale) || cat.translations[0];
          return { ...cat, name: catTrans.name };
        }
        return cat;
      });
    }

    if (postData.tags) {
      postData.tags = postData.tags.map((tag: any) => {
        if (tag.translations && tag.translations.length > 0) {
          const tagTrans = tag.translations.find((t: any) => t.language?.code === locale) || tag.translations[0];
          return { ...tag, name: tagTrans.name };
        }
        return tag;
      });
    }

    return {
      ...postData,
      title: translation.title,
      excerpt: translation.excerpt,
      content: translation.content,
      seoTitle: translation.seoTitle,
      seoDescription: translation.seoDescription,
    };
  }
}
