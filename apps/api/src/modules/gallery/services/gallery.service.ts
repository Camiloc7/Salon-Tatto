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
      relations: ['category', 'category.translations'],
    });
  }

  async getTotalCount() {
    const count = await this.imageRepository.count();
    return { count };
  }

  async upload(artistId: string, files: Express.Multer.File[], user?: any) {
    const artist = await this.artistRepository.findOne({
      where: { id: artistId },
    });

    if (!artist) {
      throw new NotFoundException(`Artist with id "${artistId}" not found`);
    }

    if (user?.role === 'artist' && artist.userId !== user.id) {
      throw new BadRequestException('You can only upload images to your own gallery');
    }

    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const uploadedImages: ArtistImage[] = [];

    for (const file of files) {
      if (!file.buffer) {
        throw new BadRequestException('File buffer missing. Check multer config.');
      }
      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `salon-tatto/artists/${artistId}`,
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        
        const stream = require('stream');
        const bufferStream = new stream.PassThrough();
        bufferStream.end(file.buffer);
        bufferStream.pipe(uploadStream);
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

  async reorder(imageId: string, orderIndex: number, user?: any) {
    const image = await this.imageRepository.findOne({ 
      where: { id: imageId },
      relations: ['artist'],
    });
    if (!image) throw new NotFoundException(`Image not found`);
    if (user?.role === 'artist' && image.artist?.userId !== user.id) {
      throw new BadRequestException('You can only manage your own gallery');
    }
    image.orderIndex = orderIndex;
    return this.imageRepository.save(image);
  }

  async bulkReorder(updates: { id: string; orderIndex: number }[], user?: any) {
    if (!updates || updates.length === 0) return { message: 'No updates provided' };

    return this.imageRepository.manager.transaction(async (manager) => {
      for (const update of updates) {
        const image = await manager.findOne(ArtistImage, {
          where: { id: update.id },
          relations: ['artist'],
        });

        if (!image) continue;

        if (user?.role === 'artist' && image.artist?.userId !== user.id) {
          throw new BadRequestException('You can only manage your own gallery');
        }

        image.orderIndex = update.orderIndex;
        await manager.save(image);
      }
      return { message: 'Bulk reorder successful' };
    });
  }

  async remove(imageId: string, user?: any) {
    const image = await this.imageRepository.findOne({
      where: { id: imageId },
      relations: ['artist'],
    });

    if (!image) {
      throw new NotFoundException(`Image with id "${imageId}" not found`);
    }
    if (user?.role === 'artist' && image.artist?.userId !== user.id) {
      throw new BadRequestException('You can only manage your own gallery');
    }

    try {
      await cloudinary.uploader.destroy(image.cloudinaryId);
    } catch {
      // Continue even if Cloudinary delete fails
    }

    await this.imageRepository.softDelete(imageId);

    return { message: 'Image deleted successfully' };
  }

  async setFeatured(imageId: string, user?: any) {
    const image = await this.imageRepository.findOne({
      where: { id: imageId },
      relations: ['artist'],
    });

    if (!image) {
      throw new NotFoundException(`Image with id "${imageId}" not found`);
    }
    if (user?.role === 'artist' && image.artist?.userId !== user.id) {
      throw new BadRequestException('You can only manage your own gallery');
    }

    await this.imageRepository.update(
      { artistId: image.artistId, isFeatured: true },
      { isFeatured: false },
    );

    image.isFeatured = true;
    return this.imageRepository.save(image);
  }



  async setCategory(imageId: string, categoryId: string | null, user?: any) {
    const image = await this.imageRepository.findOne({
      where: { id: imageId },
      relations: ['artist'],
    });

    if (!image) {
      throw new NotFoundException(`Image with id "${imageId}" not found`);
    }
    if (user?.role === 'artist' && image.artist?.userId !== user.id) {
      throw new BadRequestException('You can only manage your own gallery');
    }

    image.categoryId = categoryId;
    await this.imageRepository.save(image);

    return this.imageRepository.findOne({
      where: { id: imageId },
      relations: ['category', 'category.translations'],
    });
  }
}
