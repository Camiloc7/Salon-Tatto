import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseDto {
  @ApiProperty()
  url: string;

  @ApiProperty()
  cloudinaryId: string;

  @ApiProperty()
  width: number;

  @ApiProperty()
  height: number;

  @ApiProperty()
  format: string;

  @ApiProperty()
  originalName: string;

  @ApiProperty()
  size: number;
}

export class BulkUploadResponseDto {
  @ApiProperty({ type: [UploadResponseDto] })
  images: UploadResponseDto[];
}
