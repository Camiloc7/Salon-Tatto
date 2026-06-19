import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { GalleryService } from '../services/gallery.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Public } from '../../../common/decorators/public.decorator';

@ApiTags('Gallery')
@Controller()
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Public()
  @Get('artists/:artistId/images')
  @ApiOperation({ summary: 'Get all images for an artist' })
  @ApiResponse({ status: 200, description: 'Images list' })
  @ApiResponse({ status: 404, description: 'Artist not found' })
  async findByArtist(@Param('artistId') artistId: string) {
    return this.galleryService.findByArtist(artistId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('artists/:artistId/images')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload images for an artist (admin)' })
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
  @ApiResponse({ status: 201, description: 'Images uploaded' })
  @ApiResponse({ status: 400, description: 'No files provided' })
  @ApiResponse({ status: 404, description: 'Artist not found' })
  async upload(
    @Param('artistId') artistId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.galleryService.upload(artistId, files);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('gallery/:imageId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an image (admin)' })
  @ApiResponse({ status: 200, description: 'Image deleted' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  async remove(@Param('imageId') imageId: string) {
    return this.galleryService.remove(imageId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('gallery/:imageId/featured')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set image as featured (admin)' })
  @ApiResponse({ status: 200, description: 'Featured image set' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  async setFeatured(@Param('imageId') imageId: string) {
    return this.galleryService.setFeatured(imageId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('gallery/:imageId/reorder')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reorder image (admin)' })
  @ApiBody({ schema: { type: 'object', properties: { orderIndex: { type: 'number' } } } })
  @ApiResponse({ status: 200, description: 'Image reordered' })
  async reorder(
    @Param('imageId') imageId: string,
    @Body('orderIndex') orderIndex: number,
  ) {
    return this.galleryService.reorder(imageId, orderIndex);
  }
}
