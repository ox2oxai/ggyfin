import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';
dotenv.config();

const dbUrl =
  process.env.GGYF_POSTGRES_URL_NON_POOLING ||
  process.env.GGYF_POSTGRES_URL ||
  process.env.GGYF_POSTGRES_PRISMA_URL ||
  process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error(
    '[CRITICAL_DATABASE_CONFIG_ERROR] Database connection string is missing in drizzle.config.ts! Local fallback is disabled.'
  );
}

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: dbUrl
  },
  verbose: true,
  strict: true
});
