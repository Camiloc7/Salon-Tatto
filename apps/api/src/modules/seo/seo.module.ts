import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeoPage } from './entities/seo-page.entity';
import { SeoPageTranslation } from './entities/seo-page-translation.entity';
import { Language } from '../languages/entities/language.entity';
import { SeoController } from './controllers/seo.controller';
import { SeoService } from './services/seo.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SeoPage, SeoPageTranslation, Language]),
  ],
  controllers: [SeoController],
  providers: [SeoService],
  exports: [SeoService],
})
export class SeoModule {}
