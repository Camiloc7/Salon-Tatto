import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LanguagesService } from '../services/languages.service';
import { LanguageResponseDto } from '../dto/language-response.dto';
import { Public } from '../../../common/decorators/public.decorator';

@ApiTags('Languages')
@Controller('languages')
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all active languages' })
  @ApiResponse({
    status: 200,
    description: 'List of active languages',
    type: [LanguageResponseDto],
  })
  async findAll() {
    return this.languagesService.findAll();
  }
}
