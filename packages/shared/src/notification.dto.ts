import { z } from 'zod';

export enum NotificationChannel {
  SMS_DLT = 'SMS_DLT',
  WHATSAPP = 'WHATSAPP',
  CONSOLE_MOCK = 'CONSOLE_MOCK'
}

export enum NotificationEventType {
  LOAN_APPROVED = 'LOAN_APPROVED',
  REPAYMENT_RECEIVED = 'REPAYMENT_RECEIVED',
  CASH_RECEIPT_ISSUED = 'CASH_RECEIPT_ISSUED',
  ACCOUNT_SUSPENDED = 'ACCOUNT_SUSPENDED',
  ACCOUNT_CLOSED = 'ACCOUNT_CLOSED'
}

export interface TraiDltTemplateConfig {
  entityId: string;
  header: string; // 6-character TRAI approved Header/SenderID (e.g. GGYFIN)
  templateId: string; // 19-digit numerical DLT registration ID
  contentTemplate: string;
}

/**
 * Standard Indian TRAI DLT Pre-Registered Templates for GGY Finance
 */
export const GGY_DLT_TEMPLATES: Record<NotificationEventType, TraiDltTemplateConfig> = {
  [NotificationEventType.LOAN_APPROVED]: {
    entityId: '1101234567890123456',
    header: 'GGYFIN',
    templateId: '1107168900123456781',
    contentTemplate: 'Dear Customer, your GGY Finance loan account {#var1#} is approved for Rs.{#var2#}. Monthly EMI: Rs.{#var3#}. Due on {#var4#}th of every month. - GGY Finance'
  },
  [NotificationEventType.REPAYMENT_RECEIVED]: {
    entityId: '1101234567890123456',
    header: 'GGYFIN',
    templateId: '1107168900123456782',
    contentTemplate: 'Dear Customer, repayment of Rs.{#var1#} received for GGY Finance account {#var2#}. Outstanding balance: Rs.{#var3#}. Ref: {#var4#}. - GGY Finance'
  },
  [NotificationEventType.CASH_RECEIPT_ISSUED]: {
    entityId: '1101234567890123456',
    header: 'GGYFIN',
    templateId: '1107168900123456783',
    contentTemplate: 'Cash collection receipt {#var1#} generated for Rs.{#var2#} by Field Agent {#var3#}. Pending dual verification. - GGY Finance'
  },
  [NotificationEventType.ACCOUNT_SUSPENDED]: {
    entityId: '1101234567890123456',
    header: 'GGYFIN',
    templateId: '1107168900123456784',
    contentTemplate: 'Important: Your GGY Finance account {#var1#} has been placed on temporary hold. Reason: {#var2#}. Please contact branch {#var3#}. - GGY Finance'
  },
  [NotificationEventType.ACCOUNT_CLOSED]: {
    entityId: '1101234567890123456',
    header: 'GGYFIN',
    templateId: '1107168900123456785',
    contentTemplate: 'Dear Customer, your GGY Finance loan {#var1#} is successfully CLOSED with zero outstanding dues. NOC Certificate Ref: {#var2#}. - GGY Finance'
  }
};

/**
 * WhatsApp Business Cloud API Template Mapping
 */
export const GGY_WHATSAPP_TEMPLATES = {
  [NotificationEventType.LOAN_APPROVED]: {
    templateName: 'ggy_loan_approval_v1',
    defaultLanguage: 'en'
  },
  [NotificationEventType.REPAYMENT_RECEIVED]: {
    templateName: 'ggy_repayment_receipt_v1',
    defaultLanguage: 'en'
  },
  [NotificationEventType.CASH_RECEIPT_ISSUED]: {
    templateName: 'ggy_cash_receipt_v1',
    defaultLanguage: 'en'
  },
  [NotificationEventType.ACCOUNT_SUSPENDED]: {
    templateName: 'ggy_account_suspension_v1',
    defaultLanguage: 'en'
  },
  [NotificationEventType.ACCOUNT_CLOSED]: {
    templateName: 'ggy_account_closure_v1',
    defaultLanguage: 'en'
  }
};

export const SendNotificationSchema = z.object({
  recipientPhone: z.string().regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian mobile number'),
  eventType: z.nativeEnum(NotificationEventType),
  channels: z.array(z.nativeEnum(NotificationChannel)).min(1),
  language: z.enum(['en', 'kn']).default('en'),
  variables: z.record(z.string(), z.string().or(z.number()))
});

export type SendNotificationDTO = z.infer<typeof SendNotificationSchema>;

export interface NotificationDeliveryResult {
  channel: NotificationChannel;
  success: boolean;
  messageId: string;
  deliveredAt: string;
  error?: string;
}
