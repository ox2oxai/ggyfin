export enum AuditAction {
  USER_LOGIN = 'USER_LOGIN',
  CUSTOMER_CREATED = 'CUSTOMER_CREATED',
  CUSTOMER_UPDATED = 'CUSTOMER_UPDATED',
  KYC_UPLOADED = 'KYC_UPLOADED',
  KYC_VIEWED = 'KYC_VIEWED',
  LOAN_APPLICATION_SUBMITTED = 'LOAN_APPLICATION_SUBMITTED',
  LOAN_APPROVED = 'LOAN_APPROVED',
  LOAN_REJECTED = 'LOAN_REJECTED',
  ACCOUNT_SUSPENDED = 'ACCOUNT_SUSPENDED',
  ACCOUNT_REACTIVATED = 'ACCOUNT_REACTIVATED',
  ACCOUNT_CLOSED = 'ACCOUNT_CLOSED',
  UPI_COLLECTION_INITIATED = 'UPI_COLLECTION_INITIATED',
  UPI_PAYMENT_CONFIRMED = 'UPI_PAYMENT_CONFIRMED',
  CASH_COLLECTION_LOGGED = 'CASH_COLLECTION_LOGGED',
  CASH_RECEIPT_VERIFIED = 'CASH_RECEIPT_VERIFIED'
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  ipAddress: string;
  userAgent?: string | null;
  payloadBefore?: Record<string, unknown> | null;
  payloadAfter?: Record<string, unknown> | null;
  createdAt: string;
}
