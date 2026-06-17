import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Tag } from '../entities/tag.entity';
import { TagTranslation } from '../entities/tag-translation.entity';
import { Language } from '../../languages/entities/language.entity';
import { CreateTagDto } from '../dto/create-tag.dto';
import { UpdateTagDto } from '../dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(locale?: string) {
    const qb = this.tagRepository
      .createQueryBuilder('tag')
      .leftJoinAndSelect('tag.translations', 'translation')
      .leftJoinAndSelect('translation.language', 'language')
      .where('tag.deletedAt IS NULL');

    if (locale) {
      qb.andWhere('language.code = :locale', { locale });
    }

    qb.orderBy('tag.createdAt', 'DESC');

    const tags = await qb.getMany();

    return tags.map((tag) => this.applyTranslation(tag, locale));
  }

  async findBySlug(slug: string) {
    const tag = await this.tagRepository.findOne({
      where: { slug },
      relations: ['translations', 'translations.language'],
    });

    if (!tag) {
      throw new NotFoundException(`Tag with slug "${slug}" not found`);
    }

    return tag;
  }

  async create(dto: CreateTagDto) {
    const existing = await this.tagRepository.findOne({
      where: { slug: dto.slug },
      withDeleted: true,
    });

    if (existing) {
      throw new BadRequestException(`Tag with slug "${dto.slug}" already exists`);
    }

    return this.dataSource.transaction(async (manager) => {
      const tag = manager.create(Tag, {
        slug: dto.slug,
      });

      const savedTag = await manager.save(tag);

      for (const transDto of dto.translations) {
        const language = await manager.findOneBy(Language, {
          code: transDto.languageCode,
        });

        if (!language) {
          throw new BadRequestException(
            `Language "${transDto.languageCode}" not found`,
          );
        }

        const translation = manager.create(TagTranslation, {
          tagId: savedTag.id,
          languageId: language.id,
          name: transDto.name,
        });

        await manager.save(translation);
      }

      return manager.findOne(Tag, {
        where: { id: savedTag.id },
        relations: ['translations', 'translations.language'],
      });
    });
  }

  async update(id: string, dto: UpdateTagDto) {
    const tag = await this.tagRepository.findOne({
      where: { id },
      relations: ['translations'],
    });

    if (!tag) {
      throw new NotFoundException(`Tag with id "${id}" not found`);
    }

    return this.dataSource.transaction(async (manager) => {
      if (dto.slug !== undefined) tag.slug = dto.slug;

      await manager.save(tag);

      if (dto.translations) {
        await manager.delete(TagTranslation, { tagId: id });

        for (const transDto of dto.translations) {
          const language = await manager.findOneBy(Language, {
            code: transDto.languageCode,
          });

          if (!language) {
            throw new BadRequestException(
              `Language "${transDto.languageCode}" not found`,
            );
          }

          const translation = manager.create(TagTranslation, {
            tagId: id,
            languageId: language.id,
            name: transDto.name,
          });

          await manager.save(translation);
        }
      }

      return manager.findOne(Tag, {
        where: { id },
        relations: ['translations', 'translations.language'],
      });
    });
  }

  async remove(id: string) {
    const tag = await this.tagRepository.findOne({
      where: { id },
    });

    if (!tag) {
      throw new NotFoundException(`Tag with id "${id}" not found`);
    }

    await this.tagRepository.softDelete(id);

    return { message: 'Tag deleted successfully' };
  }

  private applyTranslation(tag: Tag, locale?: string) {
    if (!tag.translations || tag.translations.length === 0) {
      return tag;
    }

    let translation: TagTranslation | undefined;

    if (locale) {
      translation = tag.translations.find(
        (t) => t.language?.code === locale,
      );
    }

    if (!translation) {
      translation = tag.translations[0];
    }

    const { translations, ...tagData } = tag as any;

    return {
      ...tagData,
      name: translation.name,
    };
  }
}
