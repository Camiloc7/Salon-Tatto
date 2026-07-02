import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { FaqService } from './faq.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('FAQ')
@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get list of FAQs' })
  @ApiQuery({ name: 'locale', required: false })
  @ApiQuery({ name: 'isAdmin', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'FAQs list' })
  async findAll(
    @Query('locale') locale?: string,
    @Query('isAdmin') isAdmin?: string,
  ) {
    const isAdminMode = isAdmin === 'true';
    return this.faqService.findAll(isAdminMode, locale);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get FAQ by ID' })
  @ApiResponse({ status: 200, description: 'FAQ found' })
  @ApiResponse({ status: 404, description: 'FAQ not found' })
  async findOne(@Param('id') id: string) {
    return this.faqService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new FAQ (admin)' })
  @ApiResponse({ status: 201, description: 'FAQ created' })
  async create(@Body() dto: any) {
    return this.faqService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an FAQ (admin)' })
  @ApiResponse({ status: 200, description: 'FAQ updated' })
  async update(@Param('id') id: string, @Body() dto: any) {
    return this.faqService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an FAQ (admin)' })
  @ApiResponse({ status: 200, description: 'FAQ deleted' })
  async remove(@Param('id') id: string) {
    return this.faqService.remove(id);
  }
}
