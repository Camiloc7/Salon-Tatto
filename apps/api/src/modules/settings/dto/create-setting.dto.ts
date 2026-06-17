import { IsString, IsOptional, IsIn, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSettingDto {
  @ApiProperty({ minLength: 1, maxLength: 100 })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  key: string;

  @ApiProperty()
  @IsString()
  value: string;

  @ApiPropertyOptional({ enum: ['string', 'json', 'image'] })
  @IsOptional()
  @IsIn(['string', 'json', 'image'])
  type?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  group?: string;
}
