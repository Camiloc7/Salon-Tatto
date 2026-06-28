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
import { ArtistsService } from '../services/artists.service';
import { CreateArtistDto } from '../dto/create-artist.dto';
import { UpdateArtistDto } from '../dto/update-artist.dto';
import { QueryArtistDto } from '../dto/query-artist.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Public } from '../../../common/decorators/public.decorator';

@ApiTags('Artists')
@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get paginated list of artists' })
  @ApiQuery({ name: 'locale', enum: ['en', 'es'], required: false })
  @ApiQuery({ name: 'isActive', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({ status: 200, description: 'Paginated artists list' })
  async findAll(@Query() query: QueryArtistDto) {
    return this.artistsService.findAll(query);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Get artist by slug' })
  @ApiQuery({ name: 'locale', enum: ['en', 'es'], required: false })
  @ApiResponse({ status: 200, description: 'Artist found' })
  @ApiResponse({ status: 404, description: 'Artist not found' })
  async findBySlug(
    @Param('slug') slug: string,
    @Query('locale') locale?: string,
  ) {
    return this.artistsService.findBySlug(slug, locale);
  }

  @Public()
  @Get('id/:id')
  @ApiOperation({ summary: 'Get artist by ID' })
  @ApiQuery({ name: 'locale', enum: ['en', 'es'], required: false })
  @ApiResponse({ status: 200, description: 'Artist found' })
  @ApiResponse({ status: 404, description: 'Artist not found' })
  async findById(
    @Param('id') id: string,
    @Query('locale') locale?: string,
  ) {
    return this.artistsService.findById(id, locale);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new artist (admin)' })
  @ApiResponse({ status: 201, description: 'Artist created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(@Body() dto: CreateArtistDto) {
    return this.artistsService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'artist')
  @Put(':id')
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an artist (admin or self)' })
  @ApiResponse({ status: 200, description: 'Artist updated' })
  @ApiResponse({ status: 404, description: 'Artist not found' })
  async update(
    @Param('id') id: string, 
    @Body() dto: UpdateArtistDto,
    @CurrentUser() user: any
  ) {
    return this.artistsService.update(id, dto, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft delete an artist (admin)' })
  @ApiResponse({ status: 200, description: 'Artist deleted' })
  @ApiResponse({ status: 404, description: 'Artist not found' })
  async remove(@Param('id') id: string) {
    return this.artistsService.remove(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/toggle-active')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle artist active status (admin)' })
  @ApiResponse({ status: 200, description: 'Active status toggled' })
  @ApiResponse({ status: 404, description: 'Artist not found' })
  async toggleActive(@Param('id') id: string) {
    return this.artistsService.toggleActive(id);
  }
}
