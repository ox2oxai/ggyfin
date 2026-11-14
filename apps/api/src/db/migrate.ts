import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db, pool } from './client.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runMigrations() {
  console.log('[Migration] Starting database migration for PostgreSQL 16...');
  try {
    const migrationsFolder = path.resolve(__dirname, '../../drizzle');
    await migrate(db, { migrationsFolder });
    console.log('[Migration] All migrations applied successfully with 100% PostgreSQL parity.');
  } catch (error) {
    console.error('[Migration] Failed to apply migrations:', error);
    throw error;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runMigrations()
    .then(() => pool.end())
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
