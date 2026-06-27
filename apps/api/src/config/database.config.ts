import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const databaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST', 'postgres'),
  port: configService.get<number>('DATABASE_PORT', 5432),
  username: configService.get<string>('DATABASE_USER', 'app'),
  password: configService.get<string>('DATABASE_PASSWORD', 'change_me'),
  database: configService.get<string>('DATABASE_NAME', 'salon_tatto'),
  entities: [join(__dirname, '..', '**', '*.entity{.ts,.js}')],
  synchronize: configService.get<string>('NODE_ENV') !== 'production',
  logging: configService.get<string>('NODE_ENV') === 'development',
  ssl: false,
  extra: {
    max: 20,
    idleTimeoutMillis: 30000,
  },
});
