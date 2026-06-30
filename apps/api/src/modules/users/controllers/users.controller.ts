import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('admin')
  @Get('roles')
  @ApiOperation({ summary: 'Get all roles (Admin)' })
  async getRoles() {
    return this.usersService.getRoles();
  }

  @Put('change-password')
  @ApiOperation({ summary: 'Change own password' })
  async changePassword(@Request() req: any, @Body() changePasswordDto: ChangePasswordDto) {
    const userId = req.user.sub;
    await this.usersService.changePassword(userId, changePasswordDto);
    return { success: true };
  }

  @Roles('admin')
  @Post()
  @ApiOperation({ summary: 'Create a new user (Admin)' })
  @ApiResponse({ status: 201, description: 'User created' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Roles('admin')
  @Get()
  @ApiOperation({ summary: 'Get all users (Admin)' })
  async findAll() {
    return this.usersService.findAll();
  }

  @Roles('admin')
  @Get(':id')
  @ApiOperation({ summary: 'Get a user by id (Admin)' })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findByIdOrFail(id);
    delete (user as any).passwordHash;
    return user;
  }

  @Roles('admin')
  @Put(':id')
  @ApiOperation({ summary: 'Update a user (Admin)' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(id, updateUserDto);
    delete (user as any).passwordHash;
    return user;
  }

  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user (Admin)' })
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
    return { success: true };
  }
}
