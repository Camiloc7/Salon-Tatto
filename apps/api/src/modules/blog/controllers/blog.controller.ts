import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { BlogService } from '../services/blog.service';
import { CreateBlogPostDto } from '../dto/create-blog-post.dto';
import { UpdateBlogPostDto } from '../dto/update-blog-post.dto';
import { QueryBlogDto } from '../dto/query-blog.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Public } from '../../../common/decorators/public.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get paginated list of blog posts' })
  @ApiQuery({ name: 'locale', enum: ['en', 'es'], required: false })
  @ApiQuery({ name: 'status', enum: ['draft', 'published'], required: false })
  @ApiQuery({ name: 'categorySlug', required: false })
  @ApiQuery({ name: 'tagSlug', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({ status: 200, description: 'Paginated blog posts list' })
  async findAll(@Query() query: QueryBlogDto) {
    return this.blogService.findAll(query);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Get blog post by slug' })
  @ApiQuery({ name: 'locale', enum: ['en', 'es'], required: false })
  @ApiResponse({ status: 200, description: 'Blog post found' })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  async findBySlug(
    @Param('slug') slug: string,
    @Query('locale') locale?: string,
  ) {
    return this.blogService.findBySlug(slug, locale);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new blog post (admin/editor)' })
  @ApiResponse({ status: 201, description: 'Blog post created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(@Body() dto: CreateBlogPostDto, @CurrentUser('id') userId: string) {
    return this.blogService.create(dto, userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a blog post (admin/editor)' })
  @ApiResponse({ status: 200, description: 'Blog post updated' })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  async update(@Param('id') id: string, @Body() dto: UpdateBlogPostDto) {
    return this.blogService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft delete a blog post (admin/editor)' })
  @ApiResponse({ status: 200, description: 'Blog post deleted' })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  async remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @Patch(':id/publish')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle blog post draft/published status (admin/editor)' })
  @ApiResponse({ status: 200, description: 'Publish status toggled' })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  async togglePublish(@Param('id') id: string) {
    return this.blogService.togglePublish(id);
  }
}
