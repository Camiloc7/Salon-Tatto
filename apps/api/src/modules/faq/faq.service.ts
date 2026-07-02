import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Faq } from './entities/faq.entity';
import { FaqTranslation } from './entities/faq-translation.entity';
import { Language } from '../languages/entities/language.entity';
import { CreateFaqSchema, UpdateFaqSchema } from '@salon-tatto/shared';
import { z } from 'zod';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(Faq)
    private readonly faqRepository: Repository<Faq>,
    @InjectRepository(FaqTranslation)
    private readonly faqTranslationRepository: Repository<FaqTranslation>,
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
  ) {}

  async findAll(isAdmin: boolean = false, locale?: string) {
    const query = this.faqRepository.createQueryBuilder('faq')
      .leftJoinAndSelect('faq.translations', 'translation')
      .leftJoinAndSelect('translation.language', 'language')
      .orderBy('faq.order', 'ASC');

    if (!isAdmin) {
      query.andWhere('faq.isActive = :isActive', { isActive: true });
    }
    
    if (locale) {
      query.andWhere('language.code = :locale', { locale });
    }

    const [items, total] = await query.getManyAndCount();

    return {
      items,
      total,
      page: 1,
      limit: items.length || 1,
    };
  }

  async findOne(id: string) {
    const faq = await this.faqRepository.findOne({
      where: { id },
      relations: ['translations', 'translations.language'],
    });

    if (!faq) {
      throw new NotFoundException(`Faq #${id} not found`);
    }

    return faq;
  }

  async create(createFaqDto: z.infer<typeof CreateFaqSchema>) {
    return this.faqRepository.manager.transaction(async (manager: EntityManager) => {
      const faq = manager.create(Faq, {
        order: createFaqDto.order,
        isActive: createFaqDto.isActive,
      });
      const savedFaq = await manager.save(faq);

      if (createFaqDto.translations && createFaqDto.translations.length > 0) {
        for (const transDto of createFaqDto.translations) {
          const language = await manager.findOne(Language, { where: { code: transDto.languageCode } });
          if (!language) {
            throw new NotFoundException(`Language ${transDto.languageCode} not found`);
          }

          const translation = manager.create(FaqTranslation, {
            faqId: savedFaq.id,
            languageId: language.id,
            question: transDto.question,
            answer: transDto.answer,
          });
          await manager.save(translation);
        }
      }

      return this.findOne(savedFaq.id);
    });
  }

  async update(id: string, updateFaqDto: z.infer<typeof UpdateFaqSchema>) {
    return this.faqRepository.manager.transaction(async (manager: EntityManager) => {
      const faq = await manager.findOne(Faq, { where: { id }, relations: ['translations'] });
      if (!faq) {
        throw new NotFoundException(`Faq #${id} not found`);
      }

      if (updateFaqDto.order !== undefined) faq.order = updateFaqDto.order;
      if (updateFaqDto.isActive !== undefined) faq.isActive = updateFaqDto.isActive;

      await manager.save(faq);

      if (updateFaqDto.translations) {
        // Delete old translations
        await manager.delete(FaqTranslation, { faqId: id });
        
        for (const transDto of updateFaqDto.translations) {
          const language = await manager.findOne(Language, { where: { code: transDto.languageCode } });
          if (!language) {
            throw new NotFoundException(`Language ${transDto.languageCode} not found`);
          }

          const translation = manager.create(FaqTranslation, {
            faqId: id,
            languageId: language.id,
            question: transDto.question,
            answer: transDto.answer,
          });
          await manager.save(translation);
        }
      }

      return this.findOne(id);
    });
  }

  async remove(id: string) {
    const faq = await this.findOne(id);
    await this.faqRepository.remove(faq);
    return { success: true };
  }
}
