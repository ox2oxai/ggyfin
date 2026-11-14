import { db } from '../db/client.js';
import { kycDocuments } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';
import { KycDocType, KycStatus } from '@nbfc/shared';

export interface SaveKycDocumentData {
  customerId: string;
  docType: KycDocType;
  maskedIdentifier: string;
  storagePath: string;
  encryptionAlgorithm: string;
  status: KycStatus;
}

export class KycRepository {
  async save(data: SaveKycDocumentData) {
    const results = await db.insert(kycDocuments).values(data).returning();
    return results[0];
  }

  async findById(id: string) {
    const results = await db.select().from(kycDocuments).where(eq(kycDocuments.id, id)).limit(1);
    return results[0] || null;
  }

  async listByCustomerId(customerId: string) {
    return db.select().from(kycDocuments).where(eq(kycDocuments.customerId, customerId)).orderBy(desc(kycDocuments.createdAt));
  }

  async updateStatus(id: string, status: KycStatus, verifiedByUserId: string, notes?: string) {
    const results = await db
      .update(kycDocuments)
      .set({
        status,
        verifiedByUserId,
        verificationNotes: notes || null
      })
      .where(eq(kycDocuments.id, id))
      .returning();
    return results[0] || null;
  }
}
