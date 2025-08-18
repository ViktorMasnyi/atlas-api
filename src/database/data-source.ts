import 'reflect-metadata';
import { DataSource } from 'typeorm';
import 'dotenv/config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'atlas',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  migrations: [__dirname + '/../migrations/*.{ts,js}'],
  synchronize: false,
  logging: false,
});

export default AppDataSource;
