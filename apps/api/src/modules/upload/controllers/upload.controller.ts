import {
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadService } from '../services/upload.service';
import { UploadResponseDto, BulkUploadResponseDto } from '../dto/upload-response.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

const imageFileFilter = (
  _req: any,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif', 'video/mp4', 'video/webm', 'video/quicktime'];
  if (allowedMimes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(
      new BadRequestException(
        `Invalid file type: ${file.mimetype}. Only Images and Videos are allowed.`,
      ),
      false,
    );
  }
};

const multerOptions = {
  storage: memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: imageFileFilter,
};

@ApiTags('Upload')
@Controller('upload')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@ApiBearerAuth()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Upload a single image (admin)' })
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully',
    type: UploadResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid file' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadResponseDto> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.uploadService.uploadFile(file);
  }

  @Post('images')
  @UseInterceptors(FilesInterceptor('files', 10, multerOptions))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @ApiOperation({ summary: 'Upload up to 10 images at once (admin)' })
  @ApiResponse({
    status: 201,
    description: 'Images uploaded successfully',
    type: BulkUploadResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid files' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async uploadImages(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<BulkUploadResponseDto> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }
    const images = await this.uploadService.uploadFiles(files);
    return { images };
  }

  @Delete(':cloudinaryId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an image from Cloudinary (admin)' })
  @ApiResponse({ status: 200, description: 'Image deleted successfully' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  async deleteImage(
    @Param('cloudinaryId') cloudinaryId: string,
  ): Promise<{ message: string }> {
    await this.uploadService.deleteFile(cloudinaryId);
    return { message: 'Image deleted successfully' };
  }
}
