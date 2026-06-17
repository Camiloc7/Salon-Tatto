import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../data-source';
import { seedRoles } from './roles.seed';
import { seedLanguages } from './languages.seed';
import { seedAdmin } from './admin.seed';
import { seedSettings } from './settings.seed';
import { seedSeo } from './seo.seed';
import { seedArtists } from './artists.seed';
import { seedBlog } from './blog.seed';

async function runSeeds() {
  const dataSource = new DataSource(dataSourceOptions);
  await dataSource.initialize();
  console.log('Database connected. Running seeds...\n');

  await seedRoles(dataSource);
  await seedLanguages(dataSource);
  await seedAdmin(dataSource);
  await seedSettings(dataSource);
  await seedSeo(dataSource);
  await seedArtists(dataSource);
  await seedBlog(dataSource);

  console.log('\nAll seeds completed successfully!');
  await dataSource.destroy();
}

runSeeds().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
