import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { CreateMessageDto } from '../dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    const message = this.messageRepository.create(createMessageDto);
    return this.messageRepository.save(message);
  }

  async findAll() {
    return this.messageRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async getPendingCount() {
    const count = await this.messageRepository.count({
      where: { status: 'pending' },
    });
    return { count };
  }

  async markAsRead(id: string) {
    const message = await this.messageRepository.findOne({ where: { id } });
    if (!message) {
      throw new NotFoundException(`Message with id "${id}" not found`);
    }
    
    message.status = 'read';
    return this.messageRepository.save(message);
  }

  async remove(id: string) {
    const message = await this.messageRepository.findOne({ where: { id } });
    if (!message) {
      throw new NotFoundException(`Message with id "${id}" not found`);
    }
    
    await this.messageRepository.softDelete(id);
    return { message: 'Message deleted successfully' };
  }
}
