import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 as Cloudinary } from 'cloudinary';
import { CLOUDINARY } from '../providers/cloudinary.provider';
import { UploadResponseDto } from '../dto/upload-response.dto';

@Injectable()
export class UploadService {
  constructor(
    @Inject(CLOUDINARY) private readonly cloudinary: typeof Cloudinary,
  ) {}

  async uploadFile(file: Express.Multer.File): Promise<UploadResponseDto> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const base64 = file.buffer.toString('base64');
    const dataUri = `data:${file.mimetype};base64,${base64}`;

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload(
        dataUri,
        {
          folder: 'salon-tatto/uploads',
          transformation: [
            { quality: 'auto', fetch_format: 'auto' },
          ],
        },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
    });

    return {
      url: result.secure_url,
      cloudinaryId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      originalName: file.originalname,
      size: file.size,
    };
  }

  async uploadFiles(files: Express.Multer.File[]): Promise<UploadResponseDto[]> {
    const results = await Promise.all(
      files.map((file) => this.uploadFile(file)),
    );
    return results;
  }

  async deleteFile(cloudinaryId: string): Promise<void> {
    await this.cloudinary.uploader.destroy(cloudinaryId);
  }
}
