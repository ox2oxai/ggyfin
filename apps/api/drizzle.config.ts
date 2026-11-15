import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url:
      process.env.GGYF_POSTGRES_URL_NON_POOLING ||
      process.env.GGYF_POSTGRES_URL ||
      process.env.GGYF_POSTGRES_PRISMA_URL ||
      process.env.DATABASE_URL ||
      'postgresql://postgres:postgres@localhost:5432/nbfc_db'
  },
  verbose: true,
  strict: true
});
