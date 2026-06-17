import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { join, resolve } from 'path';

config({ path: resolve(__dirname, '..', '..', '..', '..', '.env') });

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'postgres',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'app',
  password: process.env.DATABASE_PASSWORD || 'change_me',
  database: process.env.DATABASE_NAME || 'salon_tatto',
  entities: [join(__dirname, '..', '**', '*.entity{.ts,.js}')],
  migrations: [join(__dirname, 'migrations', '*{.ts,.js}')],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
