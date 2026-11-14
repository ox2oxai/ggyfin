import { db } from '../db/client.js';
import { customers } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';
import crypto from 'node:crypto';

export interface CreateCustomerData {
  fullName: string;
  phone: string;
  email?: string | null;
  dob: string;
  gender: string;
  addressLine: string;
  pincode: string;
  state: string;
  consentGranted: boolean;
  createdByUserId: string;
}

export class CustomerRepository {
  public generateCifNumber(): string {
    const year = new Date().getFullYear();
    const rand = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `CIF-${year}-${rand}`;
  }

  async create(data: CreateCustomerData) {
    const cifNumber = this.generateCifNumber();
    const results = await db.insert(customers).values({
      ...data,
      cifNumber
    }).returning();
    return results[0];
  }

  async findById(id: string) {
    const results = await db.select().from(customers).where(eq(customers.id, id)).limit(1);
    return results[0] || null;
  }

  async findByCif(cifNumber: string) {
    const results = await db.select().from(customers).where(eq(customers.cifNumber, cifNumber)).limit(1);
    return results[0] || null;
  }

  async list(limit = 20, offset = 0) {
    return db.select().from(customers).orderBy(desc(customers.createdAt)).limit(limit).offset(offset);
  }
}
