import { db } from '../db/client.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { UserRole } from '@nbfc/shared';

export interface CreateUserData {
  username: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: UserRole;
  branchCode: string;
}

export class UserRepository {
  async findByUsername(username: string) {
    const results = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return results[0] || null;
  }

  async findById(id: string) {
    const results = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return results[0] || null;
  }

  async create(data: CreateUserData) {
    const results = await db.insert(users).values(data).returning();
    return results[0];
  }
}
