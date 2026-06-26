import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Artist } from '../entities/artist.entity';
import { ArtistTranslation } from '../entities/artist-translation.entity';
import { Language } from '../../languages/entities/language.entity';
import { CreateArtistDto } from '../dto/create-artist.dto';
import { UpdateArtistDto } from '../dto/update-artist.dto';
import { QueryArtistDto } from '../dto/query-artist.dto';
import { TranslationService } from '../../translation/translation.service';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
    private readonly dataSource: DataSource,
    private readonly translationService: TranslationService,
  ) {}

  async findAll(query: QueryArtistDto) {
    const { locale, isActive, page = 1, limit = 20 } = query;

    const qb = this.artistRepository
      .createQueryBuilder('artist')
      .leftJoinAndSelect('artist.translations', 'translation')
      .leftJoinAndSelect('translation.language', 'language')
      .leftJoinAndSelect('artist.images', 'images')
      .leftJoinAndSelect('images.category', 'imageCategory')
      .leftJoinAndSelect('imageCategory.translations', 'imageCategoryTranslation')
      .leftJoinAndSelect('imageCategoryTranslation.language', 'imageCategoryLanguage')
      .where('artist.deletedAt IS NULL');

    if (isActive !== undefined) {
      qb.andWhere('artist.isActive = :isActive', { isActive });
    }

    if (locale) {
      qb.andWhere('language.code = :locale', { locale });
    }

    qb.orderBy('artist.orderIndex', 'ASC').addOrderBy('artist.createdAt', 'DESC');

    const total = await qb.getCount();

    qb.skip((page - 1) * limit).take(limit);

    const artists = await qb.getMany();

    artists.forEach(artist => {
      imagesOrdering(artist.images);
    });

    const data = artists.map((artist) => this.applyTranslation(artist, locale));

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
    const qb = this.artistRepository
      .createQueryBuilder('artist')
      .leftJoinAndSelect('artist.translations', 'translation')
      .leftJoinAndSelect('translation.language', 'language')
      .leftJoinAndSelect('artist.images', 'images')
      .leftJoinAndSelect('images.category', 'imageCategory')
      .leftJoinAndSelect('imageCategory.translations', 'imageCategoryTranslation')
      .leftJoinAndSelect('imageCategoryTranslation.language', 'imageCategoryLanguage')
      .where('artist.slug = :slug', { slug })
      .andWhere('artist.deletedAt IS NULL');

    if (locale) {
      qb.andWhere('language.code = :locale', { locale });
    }

    const artist = await qb.getOne();

    if (!artist) {
      throw new NotFoundException(`Artist with slug "${slug}" not found`);
    }

    imagesOrdering(artist.images);

    return this.applyTranslation(artist, locale);
  }

  async findById(id: string, locale?: string) {
    const qb = this.artistRepository
      .createQueryBuilder('artist')
      .leftJoinAndSelect('artist.translations', 'translation')
      .leftJoinAndSelect('translation.language', 'language')
      .leftJoinAndSelect('artist.images', 'images')
      .leftJoinAndSelect('images.category', 'imageCategory')
      .leftJoinAndSelect('imageCategory.translations', 'imageCategoryTranslation')
      .leftJoinAndSelect('imageCategoryTranslation.language', 'imageCategoryLanguage')
      .where('artist.id = :id', { id })
      .andWhere('artist.deletedAt IS NULL');

    if (locale && locale !== 'all') {
      qb.andWhere('language.code = :locale', { locale });
    }

    const artist = await qb.getOne();

    if (!artist) {
      throw new NotFoundException(`Artist with id "${id}" not found`);
    }

    imagesOrdering(artist.images);

    if (locale === 'all') {
      return artist;
    }

    return this.applyTranslation(artist, locale);
  }

  async create(dto: CreateArtistDto) {
    const existing = await this.artistRepository.findOne({
      where: { slug: dto.slug },
      withDeleted: true,
    });

    if (existing) {
      throw new BadRequestException(`Artist with slug "${dto.slug}" already exists`);
    }

    return this.dataSource.transaction(async (manager) => {
      const artist = manager.create(Artist, {
        slug: dto.slug,
        avatar: dto.avatar ?? null,
        instagramUrl: dto.instagramUrl ?? null,
        orderIndex: dto.orderIndex ?? 0,
      });

      const savedArtist = await manager.save(artist);

      if (dto.translations) {
        const hasEs = dto.translations.some(t => t.languageCode === 'es');
        const hasEn = dto.translations.some(t => t.languageCode === 'en');
        
        if (hasEs && !hasEn) {
          const esTrans = dto.translations.find(t => t.languageCode === 'es');
          if (esTrans) {
            const translated = await this.translationService.translateObject(esTrans, [
              'name', 'biography', 'specialty', 'seoTitle', 'seoDescription'
            ]);
            dto.translations.push({
              ...esTrans,
              ...translated,
              languageCode: 'en',
            });
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

        const translation = manager.create(ArtistTranslation, {
          artistId: savedArtist.id,
          languageId: language.id,
          name: transDto.name,
          biography: transDto.biography ?? null,
          specialty: transDto.specialty ?? null,
          seoTitle: transDto.seoTitle ?? null,
          seoDescription: transDto.seoDescription ?? null,
        });

        await manager.save(translation);
        }
      }

      return manager.findOne(Artist, {
        where: { id: savedArtist.id },
        relations: ['translations', 'translations.language'],
      });
    });
  }

  async update(id: string, dto: UpdateArtistDto, user?: any) {
    const artist = await this.artistRepository.findOne({
      where: { id },
      relations: ['translations'],
    });

    if (!artist) {
      throw new NotFoundException(`Artist with id "${id}" not found`);
    }

    if (user?.role === 'artist' && artist.userId !== user.id) {
      throw new BadRequestException('You do not have permission to update this artist profile');
    }

    return this.dataSource.transaction(async (manager) => {
      if (dto.slug !== undefined) artist.slug = dto.slug;
      if (dto.avatar !== undefined) artist.avatar = dto.avatar;
      if (dto.instagramUrl !== undefined) artist.instagramUrl = dto.instagramUrl;
      if (dto.orderIndex !== undefined) artist.orderIndex = dto.orderIndex;

      await manager.save(artist);

      if (dto.translations) {
        const hasEs = dto.translations.some(t => t.languageCode === 'es');
        const hasEn = dto.translations.some(t => t.languageCode === 'en');
        
        if (hasEs && !hasEn) {
          const esTrans = dto.translations.find(t => t.languageCode === 'es');
          if (esTrans) {
            const translated = await this.translationService.translateObject(esTrans, [
              'name', 'biography', 'specialty', 'seoTitle', 'seoDescription'
            ]);
            dto.translations.push({
              ...esTrans,
              ...translated,
              languageCode: 'en',
            });
          }
        }

        await manager.delete(ArtistTranslation, { artistId: id });

        for (const transDto of dto.translations) {
          const language = await manager.findOneBy(Language, {
            code: transDto.languageCode,
          });

          if (!language) {
            throw new BadRequestException(
              `Language "${transDto.languageCode}" not found`,
            );
          }

          const translation = manager.create(ArtistTranslation, {
            artistId: id,
            languageId: language.id,
            name: transDto.name,
            biography: transDto.biography ?? null,
            specialty: transDto.specialty ?? null,
            seoTitle: transDto.seoTitle ?? null,
            seoDescription: transDto.seoDescription ?? null,
          });

          await manager.save(translation);
        }
      }

      return manager.findOne(Artist, {
        where: { id },
        relations: ['translations', 'translations.language'],
      });
    });
  }

  async remove(id: string) {
    const artist = await this.artistRepository.findOne({
      where: { id },
    });

    if (!artist) {
      throw new NotFoundException(`Artist with id "${id}" not found`);
    }

    await this.artistRepository.softDelete(id);

    return { message: 'Artist deleted successfully' };
  }

  async toggleActive(id: string) {
    const artist = await this.artistRepository.findOne({
      where: { id },
    });

    if (!artist) {
      throw new NotFoundException(`Artist with id "${id}" not found`);
    }

    artist.isActive = !artist.isActive;
    return this.artistRepository.save(artist);
  }

  private applyTranslation(artist: Artist, locale?: string) {
    if (!artist.translations || artist.translations.length === 0) {
      return artist;
    }

    let translation: ArtistTranslation | undefined;

    if (locale) {
      translation = artist.translations.find(
        (t) => t.language?.code === locale,
      );
    }

    if (!translation) {
      translation = artist.translations[0];
    }

    const { translations, ...artistData } = artist;

    if (artistData.images) {
      artistData.images = artistData.images.map((img: any) => {
        if (img.category && img.category.translations) {
          let catTrans = img.category.translations.find((t: any) => t.language?.code === locale);
          if (!catTrans && img.category.translations.length > 0) {
            catTrans = img.category.translations[0];
          }
          if (catTrans) {
            img.category.name = catTrans.name;
          }
          delete img.category.translations;
        }
        return img;
      });
    }

    return {
      ...artistData,
      name: translation.name,
      biography: translation.biography,
      specialty: translation.specialty,
      seoTitle: translation.seoTitle,
      seoDescription: translation.seoDescription,
    };
  }
}

function imagesOrdering(images: { orderIndex: number }[] | undefined) {
  if (images) {
    images.sort((a, b) => a.orderIndex - b.orderIndex);
  }
}
