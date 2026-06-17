import { DataSource } from 'typeorm';
import { Language } from '../../modules/languages/entities/language.entity';

export async function seedLanguages(dataSource: DataSource): Promise<void> {
  const languageRepository = dataSource.getRepository(Language);

  const existingLanguages = await languageRepository.count();
  if (existingLanguages > 0) {
    console.log('Languages already seeded, skipping...');
    return;
  }

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr', isActive: true },
    { code: 'es', name: 'Spanish', nativeName: 'Español', direction: 'ltr', isActive: true },
  ];

  await languageRepository.save(languageRepository.create(languages));
  console.log('Languages seeded successfully');
}
