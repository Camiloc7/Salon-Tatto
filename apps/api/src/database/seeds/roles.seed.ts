import { DataSource } from 'typeorm';
import { Role } from '../../modules/users/entities/role.entity';

export async function seedRoles(dataSource: DataSource): Promise<void> {
  const roleRepository = dataSource.getRepository(Role);

  const existingRoles = await roleRepository.count();
  if (existingRoles > 0) {
    console.log('Roles already seeded, skipping...');
    return;
  }

  const roles = [
    { name: 'admin', description: 'Full system access' },
    { name: 'editor', description: 'Content management access' },
    { name: 'artist', description: 'Artist restricted access' },
  ];

  await roleRepository.save(roleRepository.create(roles));
  console.log('Roles seeded successfully');
}
