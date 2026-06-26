import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promotion } from './entities/promotion.entity';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectRepository(Promotion)
    private readonly promotionRepository: Repository<Promotion>,
  ) {}

  async create(createPromotionDto: CreatePromotionDto): Promise<Promotion> {
    if (createPromotionDto.isActive) {
      // If setting this as active, deactivate others
      await this.promotionRepository.update({ isActive: true }, { isActive: false });
    }
    const promotion = this.promotionRepository.create(createPromotionDto);
    return await this.promotionRepository.save(promotion);
  }

  async findAll(): Promise<Promotion[]> {
    return await this.promotionRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findActive(): Promise<Promotion | null> {
    const promotion = await this.promotionRepository.findOne({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
    
    if (!promotion) {
      throw new NotFoundException('No active promotion found');
    }
    return promotion;
  }

  async findOne(id: string): Promise<Promotion> {
    const promotion = await this.promotionRepository.findOne({ where: { id } });
    if (!promotion) {
      throw new NotFoundException(`Promotion with ID ${id} not found`);
    }
    return promotion;
  }

  async update(id: string, updatePromotionDto: UpdatePromotionDto): Promise<Promotion> {
    const promotion = await this.findOne(id);

    if (updatePromotionDto.isActive) {
      // If setting this as active, deactivate others
      await this.promotionRepository.update(
        { isActive: true },
        { isActive: false }
      );
    }

    Object.assign(promotion, updatePromotionDto);
    return await this.promotionRepository.save(promotion);
  }

  async remove(id: string): Promise<void> {
    const promotion = await this.findOne(id);
    await this.promotionRepository.remove(promotion);
  }
}
