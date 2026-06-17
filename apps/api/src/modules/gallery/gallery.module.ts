import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistImage } from './entities/artist-image.entity';
import { Artist } from '../artists/entities/artist.entity';
import { GalleryController } from './controllers/gallery.controller';
import { GalleryService } from './services/gallery.service';

@Module({
  imports: [TypeOrmModule.forFeature([ArtistImage, Artist])],
  controllers: [GalleryController],
  providers: [GalleryService],
  exports: [GalleryService],
})
export class GalleryModule {}
