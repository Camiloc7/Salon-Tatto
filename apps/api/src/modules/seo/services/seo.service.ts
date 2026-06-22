import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { SeoPage } from '../entities/seo-page.entity';
import { SeoPageTranslation } from '../entities/seo-page-translation.entity';
import { Language } from '../../languages/entities/language.entity';
import { UpdateSeoPageDto } from '../dto/update-seo.dto';

@Injectable()
export class SeoService {
  constructor(
    @InjectRepository(SeoPage)
    private readonly seoPageRepository: Repository<SeoPage>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll() {
    return this.seoPageRepository.find({
      relations: ['translations', 'translations.language'],
    });
  }

  async findByPageKey(pageKey: string, locale?: string) {
    const qb = this.seoPageRepository
      .createQueryBuilder('seoPage')
      .leftJoinAndSelect('seoPage.translations', 'translation')
      .leftJoinAndSelect('translation.language', 'language')
      .where('seoPage.pageKey = :pageKey', { pageKey });

    if (locale) {
      qb.andWhere('language.code = :locale', { locale });
    }

    const page = await qb.getOne();

    if (!page) {
      throw new NotFoundException(`SEO page "${pageKey}" not found`);
    }

    return this.applyTranslation(page, locale);
  }

  async update(pageKey: string, dto: UpdateSeoPageDto) {
    let page = await this.seoPageRepository.findOne({
      where: { pageKey },
      relations: ['translations'],
    });

    return this.dataSource.transaction(async (manager) => {
      if (!page) {
        page = manager.create(SeoPage, { pageKey });
        page = await manager.save(page);
      }

      if (dto.canonicalUrl !== undefined) {
        page.canonicalUrl = dto.canonicalUrl;
      }
      if (dto.noIndex !== undefined) {
        page.noIndex = dto.noIndex;
      }
      if (dto.noFollow !== undefined) {
        page.noFollow = dto.noFollow;
      }

      await manager.save(page);

      if (dto.translations) {
        await manager.delete(SeoPageTranslation, { seoPageId: page.id });

        for (const transDto of dto.translations) {
          const language = await manager.findOneBy(Language, {
            code: transDto.languageCode,
          });

          if (!language) {
            throw new BadRequestException(
              `Language "${transDto.languageCode}" not found`,
            );
          }

          const translation = manager.create(SeoPageTranslation, {
            seoPageId: page.id,
            languageId: language.id,
            title: transDto.title ?? null,
            description: transDto.description ?? null,
            ogTitle: transDto.ogTitle ?? null,
            ogDescription: transDto.ogDescription ?? null,
            ogImage: transDto.ogImage ?? null,
            keywords: transDto.keywords ?? null,
          });

          await manager.save(translation);
        }
      }

      return manager.findOne(SeoPage, {
        where: { id: page.id },
        relations: ['translations', 'translations.language'],
      });
    });
  }

  async remove(pageKey: string) {
    const page = await this.seoPageRepository.findOne({
      where: { pageKey },
    });

    if (!page) {
      throw new NotFoundException(`SEO page "${pageKey}" not found`);
    }

    await this.seoPageRepository.softDelete(page.id);
    return { message: 'SEO page deleted successfully' };
  }

  private applyTranslation(page: SeoPage, locale?: string) {
    if (!page.translations || page.translations.length === 0) {
      return page;
    }

    let translation: SeoPageTranslation | undefined;

    if (locale) {
      translation = page.translations.find(
        (t) => t.language?.code === locale,
      );
    }

    if (!translation) {
      translation = page.translations[0];
    }

    const { translations, ...pageData } = page;

    return {
      ...pageData,
      title: translation.title,
      description: translation.description,
      ogTitle: translation.ogTitle,
      ogDescription: translation.ogDescription,
      ogImage: translation.ogImage,
      keywords: translation.keywords,
    };
  }
}
