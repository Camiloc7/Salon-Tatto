import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Setting } from '../entities/setting.entity';
import { CreateSettingDto } from '../dto/create-setting.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<Record<string, string>> {
    const settings = await this.settingRepository.find();
    const result: Record<string, string> = {};
    for (const setting of settings) {
      result[setting.key] = setting.value;
    }
    return result;
  }

  async findByKey(key: string) {
    const setting = await this.settingRepository.findOne({ where: { key } });

    if (!setting) {
      throw new NotFoundException(`Setting "${key}" not found`);
    }

    return setting;
  }

  async bulkUpdate(settings: Record<string, string>) {
    return this.dataSource.transaction(async (manager) => {
      for (const [key, value] of Object.entries(settings)) {
        const existing = await manager.findOneBy(Setting, { key });
        if (existing) {
          existing.value = value;
          await manager.save(existing);
        }
      }
    });
  }

  async create(dto: CreateSettingDto) {
    const existing = await this.settingRepository.findOne({
      where: { key: dto.key },
    });

    if (existing) {
      throw new ConflictException(`Setting "${dto.key}" already exists`);
    }

    const setting = this.settingRepository.create({
      key: dto.key,
      value: dto.value,
      type: dto.type ?? 'string',
      group: dto.group ?? null,
    });

    return this.settingRepository.save(setting);
  }

  async remove(key: string) {
    const setting = await this.settingRepository.findOne({ where: { key } });

    if (!setting) {
      throw new NotFoundException(`Setting "${key}" not found`);
    }

    await this.settingRepository.remove(setting);

    return { message: `Setting "${key}" deleted successfully` };
  }
}
