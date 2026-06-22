import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CategoryTranslation } from '../entities/category-translation.entity';
import { Language } from '../../languages/entities/language.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(locale?: string) {
    const qb = this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.translations', 'translation')
      .leftJoinAndSelect('translation.language', 'language')
      .where('category.deletedAt IS NULL');

    if (locale) {
      qb.andWhere('language.code = :locale', { locale });
    }

    qb.orderBy('category.createdAt', 'DESC');

    const categories = await qb.getMany();

    return categories.map((category) => this.applyTranslation(category, locale));
  }

  async findBySlug(slug: string) {
    const category = await this.categoryRepository.findOne({
      where: { slug },
      relations: ['translations', 'translations.language'],
    });

    if (!category) {
      throw new NotFoundException(`Category with slug "${slug}" not found`);
    }

    return category;
  }

  async create(dto: CreateCategoryDto) {
    const existing = await this.categoryRepository.findOne({
      where: { slug: dto.slug },
      withDeleted: true,
    });

    if (existing) {
      throw new BadRequestException(`Category with slug "${dto.slug}" already exists`);
    }

    return this.dataSource.transaction(async (manager) => {
      const category = manager.create(Category, {
        slug: dto.slug,
      });

      const savedCategory = await manager.save(category);

      for (const transDto of dto.translations) {
        const language = await manager.findOneBy(Language, {
          code: transDto.languageCode,
        });

        if (!language) {
          throw new BadRequestException(
            `Language "${transDto.languageCode}" not found`,
          );
        }

        const translation = manager.create(CategoryTranslation, {
          categoryId: savedCategory.id,
          languageId: language.id,
          name: transDto.name,
        });

        await manager.save(translation);
      }

      return manager.findOne(Category, {
        where: { id: savedCategory.id },
        relations: ['translations', 'translations.language'],
      });
    });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['translations'],
    });

    if (!category) {
      throw new NotFoundException(`Category with id "${id}" not found`);
    }

    return this.dataSource.transaction(async (manager) => {
      if (dto.slug !== undefined) category.slug = dto.slug;

      await manager.save(category);

      if (dto.translations) {
        await manager.delete(CategoryTranslation, { categoryId: id });

        for (const transDto of dto.translations) {
          const language = await manager.findOneBy(Language, {
            code: transDto.languageCode,
          });

          if (!language) {
            throw new BadRequestException(
              `Language "${transDto.languageCode}" not found`,
            );
          }

          const translation = manager.create(CategoryTranslation, {
            categoryId: id,
            languageId: language.id,
            name: transDto.name,
          });

          await manager.save(translation);
        }
      }

      return manager.findOne(Category, {
        where: { id },
        relations: ['translations', 'translations.language'],
      });
    });
  }

  async remove(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with id "${id}" not found`);
    }

    await this.categoryRepository.softDelete(id);

    return { message: 'Category deleted successfully' };
  }

  private applyTranslation(category: Category, locale?: string) {
    if (!category.translations || category.translations.length === 0) {
      return category;
    }

    if (locale === 'all') {
      return category;
    }

    let translation: CategoryTranslation | undefined;

    if (locale) {
      translation = category.translations.find(
        (t) => t.language?.code === locale,
      );
    }

    if (!translation) {
      translation = category.translations[0];
    }

    const { translations, ...categoryData } = category as any;

    return {
      ...categoryData,
      name: translation.name,
    };
  }
}
