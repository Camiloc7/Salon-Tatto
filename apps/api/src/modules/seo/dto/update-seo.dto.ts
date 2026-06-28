import { IsString, IsOptional, IsIn, IsUrl, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SeoTranslationDto {
  @ApiProperty({ example: 'en' })
  @IsString()
  @IsIn(['en', 'es'])
  languageCode: string;

  @ApiPropertyOptional({ maxLength: 70 })
  @IsOptional()
  @IsString()
  @MaxLength(70)
  title?: string;

  @ApiPropertyOptional({ maxLength: 160 })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  description?: string;

  @ApiPropertyOptional({ maxLength: 70 })
  @IsOptional()
  @IsString()
  @MaxLength(70)
  ogTitle?: string;

  @ApiPropertyOptional({ maxLength: 160 })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  ogDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ogImage?: string;

  @ApiPropertyOptional({ maxLength: 300 })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  keywords?: string;
}

export class UpdateSeoPageDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  canonicalUrl?: string;

  @ApiPropertyOptional({ type: [SeoTranslationDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SeoTranslationDto)
  translations?: SeoTranslationDto[];

  @ApiPropertyOptional()
  @IsOptional()
  noIndex?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  noFollow?: boolean;
}
