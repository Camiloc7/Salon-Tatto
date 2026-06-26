import { IsString, IsOptional, IsBoolean, IsHexColor, MaxLength } from 'class-validator';

export class CreatePromotionDto {
  @IsString()
  @IsOptional()
  @MaxLength(50)
  code?: string;

  @IsString()
  @MaxLength(255)
  message: string;

  @IsHexColor()
  @IsOptional()
  backgroundColor?: string;

  @IsHexColor()
  @IsOptional()
  textColor?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
