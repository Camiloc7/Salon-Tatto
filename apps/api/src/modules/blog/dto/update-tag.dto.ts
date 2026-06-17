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

class UpdateTagTranslationDto {
  @ApiPropertyOptional({ example: 'en' })
  @IsOptional()
  @IsString()
  @IsIn(['en', 'es'])
  languageCode?: string;

  @ApiPropertyOptional({ example: 'Realism' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name?: string;
}

export class UpdateTagDto {
  @ApiPropertyOptional({ example: 'realism' })
  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug?: string;

  @ApiPropertyOptional({ type: [UpdateTagTranslationDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateTagTranslationDto)
  @ArrayMinSize(1)
  translations?: UpdateTagTranslationDto[];
}
