import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
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
} from '@nestjs/swagger';
import { SettingsService } from '../services/settings.service';
import { CreateSettingDto } from '../dto/create-setting.dto';
import { BulkUpdateSettingsDto } from '../dto/update-setting.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Public } from '../../../common/decorators/public.decorator';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all settings as key-value pairs' })
  @ApiResponse({ status: 200, description: 'Settings object' })
  async findAll() {
    return this.settingsService.findAll();
  }

  @Public()
  @Get(':key')
  @ApiOperation({ summary: 'Get a single setting by key' })
  @ApiResponse({ status: 200, description: 'Setting found' })
  @ApiResponse({ status: 404, description: 'Setting not found' })
  async findByKey(@Param('key') key: string) {
    return this.settingsService.findByKey(key);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bulk update settings (admin)' })
  @ApiResponse({ status: 200, description: 'Settings updated' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async bulkUpdate(@Body() dto: BulkUpdateSettingsDto) {
    await this.settingsService.bulkUpdate(dto.settings);
    return { message: 'Settings updated successfully' };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new setting (admin)' })
  @ApiResponse({ status: 201, description: 'Setting created' })
  @ApiResponse({ status: 409, description: 'Setting already exists' })
  async create(@Body() dto: CreateSettingDto) {
    return this.settingsService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':key')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a setting (admin)' })
  @ApiResponse({ status: 200, description: 'Setting deleted' })
  @ApiResponse({ status: 404, description: 'Setting not found' })
  async remove(@Param('key') key: string) {
    return this.settingsService.remove(key);
  }
}
