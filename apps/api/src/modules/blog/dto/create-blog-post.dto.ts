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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBlogPostTranslationDto {
  @ApiProperty({ example: 'en' })
  @IsString()
  @IsIn(['en', 'es'])
  languageCode: string;

  @ApiProperty({ example: 'Blog Post Title' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title: string;

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

export class CreateBlogPostDto {
  @ApiProperty({ example: 'blog-post-title' })
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug: string;

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

  @ApiProperty({ type: [CreateBlogPostTranslationDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateBlogPostTranslationDto)
  @ArrayMinSize(1)
  translations: CreateBlogPostTranslationDto[];
}
