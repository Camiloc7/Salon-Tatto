import {
  IsString,
  IsIn,
  ValidateNested,
  ArrayMinSize,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryTranslationDto {
  @ApiProperty({ example: 'en' })
  @IsString()
  @IsIn(['en', 'es'])
  languageCode: string;

  @ApiProperty({ example: 'Tattoo Styles' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name: string;
}

export class CreateCategoryDto {
  @ApiProperty({ example: 'tattoo-styles' })
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug: string;

  @ApiProperty({ type: [CreateCategoryTranslationDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateCategoryTranslationDto)
  @ArrayMinSize(1)
  translations: CreateCategoryTranslationDto[];
}
