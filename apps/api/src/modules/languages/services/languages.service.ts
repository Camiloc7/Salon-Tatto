import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Language } from '../entities/language.entity';

@Injectable()
export class LanguagesService {
  constructor(
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
  ) {}

  async findAll() {
    return this.languageRepository.find({
      where: { isActive: true },
    });
  }

  async findByCode(code: string) {
    const language = await this.languageRepository.findOne({
      where: { code, isActive: true },
    });

    if (!language) {
      throw new NotFoundException(`Language "${code}" not found`);
    }

    return language;
  }

  async getDefaultLanguage() {
    const language = await this.languageRepository.findOne({
      where: { code: 'en', isActive: true },
    });

    if (!language) {
      throw new NotFoundException('Default language (en) not found');
    }

    return language;
  }
}
