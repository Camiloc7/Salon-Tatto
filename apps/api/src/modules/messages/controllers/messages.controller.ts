import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MessagesService } from '../services/messages.service';
import { CreateMessageDto } from '../dto/create-message.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Public } from '../../../common/decorators/public.decorator';

@ApiTags('Messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Send a new message (Public)' })
  @ApiResponse({ status: 201, description: 'Message sent successfully' })
  async create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all messages (Admin)' })
  @ApiResponse({ status: 200, description: 'List of messages' })
  async findAll() {
    return this.messagesService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('count/pending')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get count of pending messages (Admin)' })
  @ApiResponse({ status: 200, description: 'Count of pending messages' })
  async getPendingCount() {
    return this.messagesService.getPendingCount();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/read')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark message as read (Admin)' })
  @ApiResponse({ status: 200, description: 'Message marked as read' })
  async markAsRead(@Param('id') id: string) {
    return this.messagesService.markAsRead(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a message (Admin)' })
  @ApiResponse({ status: 200, description: 'Message deleted' })
  async remove(@Param('id') id: string) {
    return this.messagesService.remove(id);
  }
}
