import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../modules/users/users.service';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../modules/users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  const userRepository = app.get<Repository<User>>(getRepositoryToken(User));

  const targetEmail = 'rolatattoo@gmail.com';
  const oldEmail = 'admin@salontatto.com';
  const newPassword = 'larolatattoo123*';

  console.log(`Buscando usuario administrador...`);
  let admin = await usersService.findByEmail(targetEmail);

  if (!admin) {
    console.log(`No se encontró ${targetEmail}. Buscando el admin por defecto (${oldEmail})...`);
    admin = await usersService.findByEmail(oldEmail);
    if (admin) {
      console.log(`Encontrado. Actualizando su correo a ${targetEmail}...`);
      admin.email = targetEmail;
    }
  }

  if (!admin) {
    console.error(`ERROR: No se encontró ningún usuario administrador para resetear.`);
    process.exit(1);
  }

  console.log(`Generando nueva contraseña (${newPassword})...`);
  const salt = await bcrypt.genSalt();
  admin.passwordHash = await bcrypt.hash(newPassword, salt);

  await userRepository.save(admin);
  console.log(`¡Éxito! El correo es ${targetEmail} y la contraseña ha sido reseteada a '${newPassword}'.`);
  
  await app.close();
  process.exit(0);
}

bootstrap();
