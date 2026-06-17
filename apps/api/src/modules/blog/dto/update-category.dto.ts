import {
  IsString,
  IsOptional,
  IsIn,
  ValidateNested,
  ArrayMinSize,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

class UpdateCategoryTranslationDto {
  @ApiPropertyOptional({ example: 'en' })
  @IsOptional()
  @IsString()
  @IsIn(['en', 'es'])
  languageCode?: string;

  @ApiPropertyOptional({ example: 'Tattoo Styles' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name?: string;
}

export class UpdateCategoryDto {
  @ApiPropertyOptional({ example: 'tattoo-styles' })
  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug?: string;

  @ApiPropertyOptional({ type: [UpdateCategoryTranslationDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateCategoryTranslationDto)
  @ArrayMinSize(1)
  translations?: UpdateCategoryTranslationDto[];
}
