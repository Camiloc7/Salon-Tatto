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

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        {
          folder: 'salon-tatto/uploads',
          resource_type: 'auto',
        },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      
      const stream = require('stream');
      const bufferStream = new stream.PassThrough();
      bufferStream.end(file.buffer);
      bufferStream.pipe(uploadStream);
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
    try {
      await this.cloudinary.uploader.destroy(cloudinaryId);
    } catch (e) {
      // Ignore errors if file doesn't exist
    }
  }

  async deleteFileByUrl(url: string): Promise<void> {
    if (!url) return;
    try {
      // Extract public_id from Cloudinary URL
      // Example: https://res.cloudinary.com/cloud/image/upload/v1234/folder/image.jpg
      const match = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
      if (match && match[1]) {
        await this.deleteFile(match[1]);
      }
    } catch (e) {
      // Ignore errors during deletion
    }
  }
}
