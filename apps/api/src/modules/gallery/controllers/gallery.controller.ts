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
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

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
  @Roles('admin', 'artist')
  @Post('artists/:artistId/images')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload images for an artist (admin or self)' })
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
    @CurrentUser() user: any,
  ) {
    return this.galleryService.upload(artistId, files, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'artist')
  @Delete('gallery/:imageId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an image (admin or self)' })
  @ApiResponse({ status: 200, description: 'Image deleted' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  async remove(@Param('imageId') imageId: string, @CurrentUser() user: any) {
    return this.galleryService.remove(imageId, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'artist')
  @Patch('gallery/:imageId/featured')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set image as featured (admin or self)' })
  @ApiResponse({ status: 200, description: 'Featured image set' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  async setFeatured(@Param('imageId') imageId: string, @CurrentUser() user: any) {
    return this.galleryService.setFeatured(imageId, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'artist')
  @Patch('gallery/:imageId/reorder')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reorder image (admin or self)' })
  @ApiBody({ schema: { type: 'object', properties: { orderIndex: { type: 'number' } } } })
  @ApiResponse({ status: 200, description: 'Image reordered' })
  async reorder(
    @Param('imageId') imageId: string,
    @Body('orderIndex') orderIndex: number,
    @CurrentUser() user: any,
  ) {
    return this.galleryService.reorder(imageId, orderIndex, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'artist')
  @Patch('gallery/bulk-reorder')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bulk reorder images (admin or self)' })
  @ApiBody({ schema: { type: 'object', properties: { updates: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, orderIndex: { type: 'number' } } } } } } })
  @ApiResponse({ status: 200, description: 'Images reordered' })
  async bulkReorder(
    @Body('updates') updates: { id: string; orderIndex: number }[],
    @CurrentUser() user: any,
  ) {
    return this.galleryService.bulkReorder(updates, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'artist')
  @Patch('gallery/:imageId/category')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set category for an image (admin or self)' })
  @ApiBody({ schema: { type: 'object', properties: { categoryId: { type: 'string', nullable: true } } } })
  @ApiResponse({ status: 200, description: 'Category updated' })
  async setCategory(
    @Param('imageId') imageId: string,
    @Body('categoryId') categoryId: string | null,
    @CurrentUser() user: any,
  ) {
    return this.galleryService.setCategory(imageId, categoryId, user);
  }
}
