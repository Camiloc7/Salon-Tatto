import {
  IsString,
  IsOptional,
  IsUrl,
  IsInt,
  Min,
  MaxLength,
  MinLength,
  IsIn,
  ValidateNested,
  ArrayMinSize,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateArtistTranslationDto {
  @ApiProperty({ example: 'en' })
  @IsString()
  @IsIn(['en', 'es'])
  languageCode: string;

  @ApiProperty({ example: 'Jane Doe' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name: string;

  @ApiPropertyOptional({ example: 'A talented tattoo artist...' })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  biography?: string;

  @ApiPropertyOptional({ example: 'Realism, Blackwork' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  specialty?: string;

  @ApiPropertyOptional({ example: 'Jane Doe | La Rola Tattoo NYC' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  seoTitle?: string;

  @ApiPropertyOptional({ example: 'Portfolio of Jane Doe...' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  seoDescription?: string;
}

export class CreateArtistDto {
  @ApiProperty({ example: 'jane-doe' })
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  avatar?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  instagramUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  orderIndex?: number;

  @ApiProperty({ type: [CreateArtistTranslationDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateArtistTranslationDto)
  @ArrayMinSize(1)
  translations: CreateArtistTranslationDto[];
}
