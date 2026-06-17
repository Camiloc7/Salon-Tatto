import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v2 as cloudinary } from 'cloudinary';
import { ArtistImage } from '../entities/artist-image.entity';
import { Artist } from '../../artists/entities/artist.entity';

@Injectable()
export class GalleryService {
  constructor(
    @InjectRepository(ArtistImage)
    private readonly imageRepository: Repository<ArtistImage>,
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
  ) {}

  async findByArtist(artistId: string) {
    const artist = await this.artistRepository.findOne({
      where: { id: artistId },
    });

    if (!artist) {
      throw new NotFoundException(`Artist with id "${artistId}" not found`);
    }

    return this.imageRepository.find({
      where: { artistId },
      order: { orderIndex: 'ASC', createdAt: 'DESC' },
    });
  }

  async upload(artistId: string, files: Express.Multer.File[]) {
    const artist = await this.artistRepository.findOne({
      where: { id: artistId },
    });

    if (!artist) {
      throw new NotFoundException(`Artist with id "${artistId}" not found`);
    }

    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const uploadedImages: ArtistImage[] = [];

    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: `salon-tatto/artists/${artistId}`,
        transformation: [
          {
            width: 1200,
            height: 1200,
            crop: 'limit',
            quality: 'auto',
            fetch_format: 'auto',
          },
        ],
      });

      const image = this.imageRepository.create({
        artistId,
        cloudinaryId: result.public_id,
        url: result.secure_url,
        width: result.width ?? null,
        height: result.height ?? null,
        format: result.format ?? null,
        orderIndex: 0,
      });

      const saved = await this.imageRepository.save(image);
      uploadedImages.push(saved);
    }

    return uploadedImages;
  }

  async remove(imageId: string) {
    const image = await this.imageRepository.findOne({
      where: { id: imageId },
    });

    if (!image) {
      throw new NotFoundException(`Image with id "${imageId}" not found`);
    }

    try {
      await cloudinary.uploader.destroy(image.cloudinaryId);
    } catch {
      // Continue even if Cloudinary delete fails
    }

    await this.imageRepository.softDelete(imageId);

    return { message: 'Image deleted successfully' };
  }

  async setFeatured(imageId: string) {
    const image = await this.imageRepository.findOne({
      where: { id: imageId },
    });

    if (!image) {
      throw new NotFoundException(`Image with id "${imageId}" not found`);
    }

    await this.imageRepository.update(
      { artistId: image.artistId, isFeatured: true },
      { isFeatured: false },
    );

    image.isFeatured = true;
    return this.imageRepository.save(image);
  }
}
