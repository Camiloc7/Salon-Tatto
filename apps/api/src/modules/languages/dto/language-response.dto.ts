import { ApiProperty } from '@nestjs/swagger';

export class LanguageResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  nativeName: string;

  @ApiProperty()
  direction: string;
}
