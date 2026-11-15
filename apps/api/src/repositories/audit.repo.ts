import { db } from '../db/client.js';
import { auditLogs } from '../db/schema.js';
import { desc } from 'drizzle-orm';
import { AuditLogEntry } from '@nbfc/shared';

export class AuditRepository {
  async append(entry: Omit<AuditLogEntry, 'id'>) {
    const [inserted] = await db
      .insert(auditLogs)
      .values({
        userId: entry.userId,
        category: entry.category || 'OPERATIONAL_BANKING_EVENT',
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId,
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent || null,
        payloadBefore: entry.payloadBefore || null,
        payloadAfter: entry.payloadAfter || null
      })
      .returning();

    return inserted;
  }

  async list(limit = 50, offset = 0) {
    return db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit)
      .offset(offset);
  }
}
