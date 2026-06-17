import { DataSource } from 'typeorm';
import { Setting } from '../../modules/settings/entities/setting.entity';

export async function seedSettings(dataSource: DataSource): Promise<void> {
  const settingRepository = dataSource.getRepository(Setting);

  const existingSettings = await settingRepository.count();
  if (existingSettings > 0) {
    console.log('Settings already seeded, skipping...');
    return;
  }

  const settings = [
    { key: 'studioName', value: 'Salon Tatto', type: 'string', group: 'general' },
    { key: 'address', value: '', type: 'string', group: 'contact' },
    { key: 'phone', value: '', type: 'string', group: 'contact' },
    { key: 'whatsapp', value: '', type: 'string', group: 'contact' },
    { key: 'email', value: 'info@salontatto.com', type: 'string', group: 'contact' },
    { key: 'instagram', value: '', type: 'string', group: 'social' },
    { key: 'facebook', value: '', type: 'string', group: 'social' },
    { key: 'tiktok', value: '', type: 'string', group: 'social' },
    { key: 'googleMapsLat', value: '', type: 'string', group: 'location' },
    { key: 'googleMapsLng', value: '', type: 'string', group: 'location' },
    { key: 'mondayHours', value: '', type: 'string', group: 'hours' },
    { key: 'tuesdayHours', value: '', type: 'string', group: 'hours' },
    { key: 'wednesdayHours', value: '', type: 'string', group: 'hours' },
    { key: 'thursdayHours', value: '', type: 'string', group: 'hours' },
    { key: 'fridayHours', value: '', type: 'string', group: 'hours' },
    { key: 'saturdayHours', value: '', type: 'string', group: 'hours' },
    { key: 'sundayHours', value: '', type: 'string', group: 'hours' },
  ];

  await settingRepository.save(settingRepository.create(settings));
  console.log('Settings seeded successfully');
}
