import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['role'],
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });
  }

  async findByIdOrFail(id: string): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findByIdWithRole(id: string): Promise<User | null> {
    return this.findById(id);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['role'],
      order: { createdAt: 'DESC' },
      select: ['id', 'email', 'name', 'avatar', 'isActive', 'createdAt', 'roleId', 'role']
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.findByEmail(createUserDto.email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(createUserDto.password, salt);

    const user = this.userRepository.create({
      email: createUserDto.email,
      name: createUserDto.name,
      passwordHash,
      avatar: createUserDto.avatar,
      isActive: createUserDto.isActive ?? true,
      roleId: createUserDto.roleId,
    });

    await this.userRepository.save(user);
    delete (user as any).passwordHash;
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findByIdOrFail(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existing = await this.findByEmail(updateUserDto.email);
      if (existing) {
        throw new ConflictException('Email already in use');
      }
      user.email = updateUserDto.email;
    }

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      user.passwordHash = await bcrypt.hash(updateUserDto.password, salt);
    }

    if (updateUserDto.name) user.name = updateUserDto.name;
    if (updateUserDto.avatar !== undefined) user.avatar = updateUserDto.avatar;
    if (updateUserDto.isActive !== undefined) user.isActive = updateUserDto.isActive;
    if (updateUserDto.roleId) user.roleId = updateUserDto.roleId;

    await this.userRepository.save(user);
    return this.findByIdOrFail(id);
  }

  async changePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<void> {
    const user = await this.findByIdOrFail(id);
    
    const isValidPassword = await bcrypt.compare(changePasswordDto.oldPassword, user.passwordHash);
    if (!isValidPassword) {
      throw new ConflictException('La contraseña antigua no es correcta');
    }

    const salt = await bcrypt.genSalt();
    user.passwordHash = await bcrypt.hash(changePasswordDto.newPassword, salt);
    
    await this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findByIdOrFail(id);
    await this.userRepository.softDelete(user.id);
  }

  async getRoles(): Promise<Role[]> {
    return this.roleRepository.find();
  }
}
