import { AuditAction, AuditLogEntry } from '@nbfc/shared';

export interface RecordAuditParams {
  userId?: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  ipAddress: string;
  userAgent?: string;
  payloadBefore?: Record<string, unknown>;
  payloadAfter?: Record<string, unknown>;
}

export class AuditService {
  /**
   * Formats an audit log entry strictly adhering to immutable logging rules.
   */
  public prepareAuditEntry(params: RecordAuditParams): Omit<AuditLogEntry, 'id'> {
    return {
      userId: params.userId || '00000000-0000-0000-0000-000000000000',
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent || null,
      payloadBefore: params.payloadBefore || null,
      payloadAfter: params.payloadAfter || null,
      createdAt: new Date().toISOString()
    };
  }
}
