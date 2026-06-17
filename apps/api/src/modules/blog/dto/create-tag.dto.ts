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

export class CreateTagTranslationDto {
  @ApiProperty({ example: 'en' })
  @IsString()
  @IsIn(['en', 'es'])
  languageCode: string;

  @ApiProperty({ example: 'Realism' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name: string;
}

export class CreateTagDto {
  @ApiProperty({ example: 'realism' })
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug: string;

  @ApiProperty({ type: [CreateTagTranslationDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateTagTranslationDto)
  @ArrayMinSize(1)
  translations: CreateTagTranslationDto[];
}
