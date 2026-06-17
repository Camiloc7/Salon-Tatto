import { IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BulkUpdateSettingsDto {
  @ApiProperty({
    example: { site_name: 'My Site', site_description: 'Awesome site' },
  })
  @IsObject()
  settings: Record<string, string>;
}
