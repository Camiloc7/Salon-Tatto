import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../modules/users/entities/user.entity';
import { Role } from '../../modules/users/entities/role.entity';

export async function seedAdmin(dataSource: DataSource): Promise<void> {
  const userRepository = dataSource.getRepository(User);
  const roleRepository = dataSource.getRepository(Role);

  const passwordHash = await bcrypt.hash('admin123', 12);

  const existingAdmin = await userRepository.findOne({ where: { email: 'admin@salontatto.com' } });
  if (existingAdmin) {
    console.log('Admin user exists. Forcing password update to admin123...');
    existingAdmin.passwordHash = passwordHash;
    await userRepository.save(existingAdmin);
    return;
  }

  const adminRole = await roleRepository.findOne({ where: { name: 'admin' } });
  if (!adminRole) {
    console.error('Admin role not found. Run role seed first.');
    return;
  }


  const admin = userRepository.create({
    email: 'admin@salontatto.com',
    passwordHash,
    name: 'Admin',
    role: adminRole,
    isActive: true,
  });

  await userRepository.save(admin);
  console.log('Admin user seeded successfully (email: admin@salontatto.com, password: admin123)');
}
