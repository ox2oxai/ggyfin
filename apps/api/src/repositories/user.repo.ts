import { db } from '../db/client.js';
import { users } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';
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
  async findAll() {
    return db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        phone: users.phone,
        role: users.role,
        branchCode: users.branchCode,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
      })
      .from(users)
      .orderBy(desc(users.createdAt));
  }

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

  async updateRole(id: string, role: UserRole) {
    const results = await db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        username: users.username,
        role: users.role,
        updatedAt: users.updatedAt
      });
    return results[0] || null;
  }

  async updateActiveStatus(id: string, isActive: boolean) {
    const results = await db
      .update(users)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        username: users.username,
        isActive: users.isActive,
        updatedAt: users.updatedAt
      });
    return results[0] || null;
  }

  async delete(id: string) {
    const results = await db.delete(users).where(eq(users.id, id)).returning({ id: users.id });
    return results[0] || null;
  }
}
