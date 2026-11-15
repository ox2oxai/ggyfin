import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.js';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const databaseUrl =
  process.env.GGYF_POSTGRES_URL_NON_POOLING ||
  process.env.GGYF_POSTGRES_URL ||
  process.env.GGYF_POSTGRES_PRISMA_URL ||
  process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    '[CRITICAL_DATABASE_CONFIG_ERROR] Database connection string is missing! Local database fallback is permanently disabled. Please configure GGYF_POSTGRES_URL or DATABASE_URL pointing to Supabase.'
  );
}

const isCloudOrSsl =
  databaseUrl.includes('supabase.co') ||
  databaseUrl.includes('supabase.com') ||
  databaseUrl.includes('neon.tech') ||
  databaseUrl.includes('sslmode=require') ||
  process.env.DB_SSL === 'true';

const cleanConnectionString = isCloudOrSsl
  ? databaseUrl.replace(/[?&]sslmode=[^&]+/, '')
  : databaseUrl;

export const pool = new Pool({
  connectionString: cleanConnectionString,
  ssl: isCloudOrSsl ? { rejectUnauthorized: false } : undefined,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
});

export const db = drizzle(pool, { schema });
