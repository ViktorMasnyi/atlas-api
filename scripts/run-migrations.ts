import 'dotenv/config';
import 'reflect-metadata';
import { AppDataSource } from '../src/database/data-source';

async function main(): Promise<void> {
  await AppDataSource.initialize();
  try {
    await AppDataSource.runMigrations();
    // eslint-disable-next-line no-console
    console.log('Migrations completed');
  } finally {
    await AppDataSource.destroy();
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

 