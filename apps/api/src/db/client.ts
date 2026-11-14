import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.js';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/nbfc_db';

const isCloudOrSsl =
  databaseUrl.includes('supabase.co') ||
  databaseUrl.includes('neon.tech') ||
  databaseUrl.includes('sslmode=require') ||
  process.env.DB_SSL === 'true';

export const pool = new Pool({
  connectionString: databaseUrl,
  ssl: isCloudOrSsl ? { rejectUnauthorized: false } : undefined,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
});

export const db = drizzle(pool, { schema });
