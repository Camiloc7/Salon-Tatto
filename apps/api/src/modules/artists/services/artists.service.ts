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

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(query: QueryArtistDto) {
    const { locale, isActive, page = 1, limit = 20 } = query;

    const qb = this.artistRepository
      .createQueryBuilder('artist')
      .leftJoinAndSelect('artist.translations', 'translation')
      .leftJoinAndSelect('translation.language', 'language')
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

      return manager.findOne(Artist, {
        where: { id: savedArtist.id },
        relations: ['translations', 'translations.language'],
      });
    });
  }

  async update(id: string, dto: UpdateArtistDto) {
    const artist = await this.artistRepository.findOne({
      where: { id },
      relations: ['translations'],
    });

    if (!artist) {
      throw new NotFoundException(`Artist with id "${id}" not found`);
    }

    return this.dataSource.transaction(async (manager) => {
      if (dto.slug !== undefined) artist.slug = dto.slug;
      if (dto.avatar !== undefined) artist.avatar = dto.avatar;
      if (dto.instagramUrl !== undefined) artist.instagramUrl = dto.instagramUrl;
      if (dto.orderIndex !== undefined) artist.orderIndex = dto.orderIndex;

      await manager.save(artist);

      if (dto.translations) {
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
