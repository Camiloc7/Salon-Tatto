import {
  IsString,
  IsOptional,
  IsUrl,
  IsIn,
  ValidateNested,
  ArrayMinSize,
  MinLength,
  MaxLength,
  Matches,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

class UpdateBlogPostTranslationDto {
  @ApiPropertyOptional({ example: 'en' })
  @IsOptional()
  @IsString()
  @IsIn(['en', 'es'])
  languageCode?: string;

  @ApiPropertyOptional({ example: 'Blog Post Title' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({ example: 'A short excerpt...' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  excerpt?: string;

  @ApiPropertyOptional({ example: 'Full content here...' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ example: 'SEO Title | La Rola Tattoo NYC' })
  @IsOptional()
  @IsString()
  @MaxLength(70)
  seoTitle?: string;

  @ApiPropertyOptional({ example: 'SEO description for the post' })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  seoDescription?: string;
}

export class UpdateBlogPostDto {
  @ApiPropertyOptional({ example: 'blog-post-title' })
  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  featuredImage?: string;

  @ApiPropertyOptional({ enum: ['draft', 'published'] })
  @IsOptional()
  @IsIn(['draft', 'published'])
  status?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsUUID('4', { each: true })
  categoryIds?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsUUID('4', { each: true })
  tagIds?: string[];

  @ApiPropertyOptional({ type: [UpdateBlogPostTranslationDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateBlogPostTranslationDto)
  @ArrayMinSize(1)
  translations?: UpdateBlogPostTranslationDto[];
}
