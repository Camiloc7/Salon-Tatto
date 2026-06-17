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
import { ApiPropertyOptional } from '@nestjs/swagger';

class UpdateArtistTranslationDto {
  @ApiPropertyOptional({ example: 'en' })
  @IsOptional()
  @IsString()
  @IsIn(['en', 'es'])
  languageCode: string;

  @ApiPropertyOptional({ example: 'Jane Doe' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name?: string;

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

  @ApiPropertyOptional({ example: 'Jane Doe | Salon Tatto' })
  @IsOptional()
  @IsString()
  @MaxLength(70)
  seoTitle?: string;

  @ApiPropertyOptional({ example: 'Portfolio of Jane Doe...' })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  seoDescription?: string;
}

export class UpdateArtistDto {
  @ApiPropertyOptional({ example: 'jane-doe' })
  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug?: string;

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

  @ApiPropertyOptional({ type: [UpdateArtistTranslationDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateArtistTranslationDto)
  @ArrayMinSize(1)
  translations?: UpdateArtistTranslationDto[];
}
