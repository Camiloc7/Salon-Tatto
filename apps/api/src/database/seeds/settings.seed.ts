import { DataSource } from 'typeorm';
import { Setting } from '../../modules/settings/entities/setting.entity';

export async function seedSettings(dataSource: DataSource): Promise<void> {
  const settingRepository = dataSource.getRepository(Setting);

  const settings = [
    { key: 'studioName', value: 'La Rola Tattoo NYC', type: 'string', group: 'general' },
    { key: 'heroSubtitle_en', value: 'Custom Tattoo Studio in Midtown Manhattan\n\nCustom tattoos designed exclusively for you. Specializing in Fine Line, Black & Grey, Color, Ornamental, UV Ink, and Cover-Up tattoos. Serving both New Yorkers and visitors by appointment only.', type: 'string', group: 'general' },
    { key: 'heroSubtitle_es', value: 'Estudio de Tatuajes Personalizados en Midtown Manhattan\n\nTatuajes personalizados diseñados exclusivamente para ti. Especialistas en Fine Line, Black & Grey, Color, Ornamental, Tinta UV y Cover-Up. Atendemos a neoyorquinos y visitantes solo con cita previa.', type: 'string', group: 'general' },
    { key: 'address', value: '', type: 'string', group: 'contact' },
    { key: 'phone', value: '+12125550199', type: 'string', group: 'contact' },
    { key: 'whatsapp', value: '+12125550199', type: 'string', group: 'contact' },
    { key: 'email', value: 'booking@nyctattoostudio.com', type: 'string', group: 'contact' },
    { key: 'instagram', value: 'https://instagram.com/nyctattoostudio', type: 'string', group: 'social' },
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
    { key: 'licenseNumber', value: '#50107542', type: 'string', group: 'credentials' },
    { key: 'licenseDates', value: '01/07/2025 - 12/31/2026', type: 'string', group: 'credentials' },
  ];

  for (const setting of settings) {
    const existing = await settingRepository.findOne({ where: { key: setting.key } });
    if (existing) {
      existing.value = setting.value;
      await settingRepository.save(existing);
    } else {
      await settingRepository.save(settingRepository.create(setting));
    }
  }

  console.log('Settings seeded/updated successfully');
}
