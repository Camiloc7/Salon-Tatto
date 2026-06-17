import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogPost } from './entities/blog-post.entity';
import { BlogPostTranslation } from './entities/blog-post-translation.entity';
import { Category } from './entities/category.entity';
import { CategoryTranslation } from './entities/category-translation.entity';
import { Tag } from './entities/tag.entity';
import { TagTranslation } from './entities/tag-translation.entity';
import { User } from '../users/entities/user.entity';
import { Language } from '../languages/entities/language.entity';
import { BlogController } from './controllers/blog.controller';
import { CategoriesController } from './controllers/categories.controller';
import { TagsController } from './controllers/tags.controller';
import { BlogService } from './services/blog.service';
import { CategoriesService } from './services/categories.service';
import { TagsService } from './services/tags.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BlogPost,
      BlogPostTranslation,
      Category,
      CategoryTranslation,
      Tag,
      TagTranslation,
      User,
      Language,
    ]),
  ],
  controllers: [BlogController, CategoriesController, TagsController],
  providers: [BlogService, CategoriesService, TagsService],
  exports: [BlogService],
})
export class BlogModule {}
