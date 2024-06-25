require('dotenv').config();

import { DataSource, DataSourceOptions } from 'typeorm';
import { entities } from './database_entities';

export const typeormOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities,
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
};

export const AppDataSource = new DataSource(typeormOptions);
