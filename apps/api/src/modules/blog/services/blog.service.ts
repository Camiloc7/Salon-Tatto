import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BlogPost } from '../entities/blog-post.entity';
import { BlogPostTranslation } from '../entities/blog-post-translation.entity';
import { Category } from '../entities/category.entity';
import { Tag } from '../entities/tag.entity';
import { Language } from '../../languages/entities/language.entity';
import { CreateBlogPostDto } from '../dto/create-blog-post.dto';
import { UpdateBlogPostDto } from '../dto/update-blog-post.dto';
import { QueryBlogDto } from '../dto/query-blog.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogPost)
    private readonly blogPostRepository: Repository<BlogPost>,
    private readonly dataSource: DataSource,
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

    if (locale) {
      qb.andWhere('language.code = :locale', { locale });
    }

    if (search) {
      qb.andWhere('translation.title ILIKE :search', { search: `%${search}%` });
    }

    if (categorySlug) {
      qb.andWhere(
        `EXISTS (SELECT 1 FROM blog_post_categories bpc
                 INNER JOIN categories c ON c.id = bpc."categoryId"
                 WHERE bpc."blogPostId" = post.id AND c.slug = :categorySlug)`,
        { categorySlug },
      );
    }

    if (tagSlug) {
      qb.andWhere(
        `EXISTS (SELECT 1 FROM blog_post_tags bpt
                 INNER JOIN tags t ON t.id = bpt."tagId"
                 WHERE bpt."blogPostId" = post.id AND t.slug = :tagSlug)`,
        { tagSlug },
      );
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

    if (locale) {
      qb.andWhere('language.code = :locale', { locale });
    }

    const post = await qb.getOne();

    if (!post) {
      throw new NotFoundException(`Blog post with slug "${slug}" not found`);
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
            title: transDto.title,
            excerpt: transDto.excerpt ?? null,
            content: transDto.content ?? null,
            seoTitle: transDto.seoTitle ?? null,
            seoDescription: transDto.seoDescription ?? null,
          });

          await manager.save(translation);
        }
      }

      if (dto.categoryIds && dto.categoryIds.length > 0) {
        const categories = await manager.findByIds(Category, dto.categoryIds);
        savedPost.categories = categories;
        await manager.save(savedPost);
      }

      if (dto.tagIds && dto.tagIds.length > 0) {
        const tags = await manager.findByIds(Tag, dto.tagIds);
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

      await manager.save(post);

      if (dto.translations) {
        await manager.delete(BlogPostTranslation, { blogPostId: id });

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
            blogPostId: id,
            languageId: language.id,
            title: transDto.title,
            excerpt: transDto.excerpt ?? null,
            content: transDto.content ?? null,
            seoTitle: transDto.seoTitle ?? null,
            seoDescription: transDto.seoDescription ?? null,
          });

          await manager.save(translation);
        }
      }

      if (dto.categoryIds) {
        const categories = dto.categoryIds.length > 0
          ? await manager.findByIds(Category, dto.categoryIds)
          : [];
        post.categories = categories;
        await manager.save(post);
      }

      if (dto.tagIds) {
        const tags = dto.tagIds.length > 0
          ? await manager.findByIds(Tag, dto.tagIds)
          : [];
        post.tags = tags;
        await manager.save(post);
      }

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
    if (!post.translations || post.translations.length === 0) {
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
