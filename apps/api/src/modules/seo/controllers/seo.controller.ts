import {
  Controller,
  Get,
  Put,
  Post,
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
import { SeoService } from '../services/seo.service';
import { UpdateSeoPageDto } from '../dto/update-seo.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Public } from '../../../common/decorators/public.decorator';

@ApiTags('SEO')
@Controller('seo')
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  @Public()
  @Get('pages')
  @ApiOperation({ summary: 'List all SEO pages with translations' })
  @ApiResponse({ status: 200, description: 'List of SEO pages' })
  async findAll() {
    return this.seoService.findAll();
  }

  @Public()
  @Get('pages/:pageKey')
  @ApiOperation({ summary: 'Get SEO page by page key' })
  @ApiQuery({ name: 'locale', enum: ['en', 'es'], required: false })
  @ApiResponse({ status: 200, description: 'SEO page found' })
  @ApiResponse({ status: 404, description: 'SEO page not found' })
  async findByPageKey(
    @Param('pageKey') pageKey: string,
    @Query('locale') locale?: string,
  ) {
    return this.seoService.findByPageKey(pageKey, locale);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put('pages/:pageKey')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update SEO page with translations (admin)' })
  @ApiResponse({ status: 200, description: 'SEO page updated' })
  @ApiResponse({ status: 404, description: 'SEO page not found' })
  async update(
    @Param('pageKey') pageKey: string,
    @Body() dto: UpdateSeoPageDto,
  ) {
    return this.seoService.update(pageKey, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('generate-sitemap')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Trigger sitemap generation (admin)' })
  @ApiResponse({ status: 200, description: 'Sitemap generation triggered' })
  async generateSitemap() {
    return { success: true, message: 'Sitemap generation triggered' };
  }
}
