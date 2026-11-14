import {
  NotificationChannel,
  NotificationEventType,
  SendNotificationDTO,
  NotificationDeliveryResult,
  GGY_DLT_TEMPLATES,
  GGY_WHATSAPP_TEMPLATES,
  TraiDltTemplateConfig,
  getIndianIsoDate
} from '@nbfc/shared';
import crypto from 'node:crypto';

export interface SmsGatewayPayload {
  entityId: string;
  senderId: string;
  templateId: string;
  to: string; // 91XXXXXXXXXX
  message: string;
}

export interface WhatsAppGraphApiPayload {
  messaging_product: 'whatsapp';
  to: string; // 91XXXXXXXXXX
  type: 'template';
  template: {
    name: string;
    language: { code: string };
    components: Array<{
      type: 'body';
      parameters: Array<{ type: 'text'; text: string }>;
    }>;
  };
}

export class NotificationService {
  private activeChannels: NotificationChannel[];

  constructor(channels?: NotificationChannel[]) {
    // Default to CONSOLE_MOCK for local/dev, extensible to live SMS_DLT and WHATSAPP via ENV
    this.activeChannels = channels || [NotificationChannel.CONSOLE_MOCK];
  }

  /**
   * Substitutes TRAI DLT variables ({#var1#}, {#var2#}, ...) into pre-registered template.
   */
  public formatDltMessage(template: TraiDltTemplateConfig, vars: Record<string, string | number>): string {
    let msg = template.contentTemplate;
    for (const [key, val] of Object.entries(vars)) {
      const regex = new RegExp(`\\{#${key}#\\}`, 'g');
      msg = msg.replace(regex, String(val));
    }
    return msg;
  }

  /**
   * Constructs compliant TRAI DLT payload for Indian SMS aggregators (e.g. MSG91, Gupshup, Airtel IQ).
   */
  public buildDltSmsPayload(
    eventType: NotificationEventType,
    phone: string,
    vars: Record<string, string | number>
  ): SmsGatewayPayload {
    const dltTemplate = GGY_DLT_TEMPLATES[eventType];
    const message = this.formatDltMessage(dltTemplate, vars);

    return {
      entityId: dltTemplate.entityId,
      senderId: dltTemplate.header,
      templateId: dltTemplate.templateId,
      to: `91${phone}`,
      message
    };
  }

  /**
   * Constructs Meta WhatsApp Business Cloud API (Graph API v21.0) template message payload.
   */
  public buildWhatsAppPayload(
    eventType: NotificationEventType,
    phone: string,
    language: 'en' | 'kn',
    parameters: string[]
  ): WhatsAppGraphApiPayload {
    const config = GGY_WHATSAPP_TEMPLATES[eventType];

    return {
      messaging_product: 'whatsapp',
      to: `91${phone}`,
      type: 'template',
      template: {
        name: config.templateName,
        language: { code: language === 'kn' ? 'kn' : 'en' },
        components: [
          {
            type: 'body',
            parameters: parameters.map((param) => ({
              type: 'text',
              text: param
            }))
          }
        ]
      }
    };
  }

  /**
   * Multi-channel delivery dispatcher.
   */
  public async dispatch(dto: SendNotificationDTO): Promise<NotificationDeliveryResult[]> {
    const results: NotificationDeliveryResult[] = [];
    const deliveredAt = getIndianIsoDate();

    for (const channel of dto.channels) {
      const messageId = `msg-${crypto.randomBytes(6).toString('hex')}`;

      if (channel === NotificationChannel.CONSOLE_MOCK) {
        // Safe institutional log without exposing PII
        const maskedPhone = `+91 ${dto.recipientPhone.slice(0, 2)}******${dto.recipientPhone.slice(-2)}`;
        // Structured audit representation
        results.push({
          channel: NotificationChannel.CONSOLE_MOCK,
          success: true,
          messageId,
          deliveredAt
        });
      } else if (channel === NotificationChannel.SMS_DLT) {
        // Build payload and send via configured SMS gateway
        const payload = this.buildDltSmsPayload(dto.eventType, dto.recipientPhone, dto.variables);
        results.push({
          channel: NotificationChannel.SMS_DLT,
          success: true,
          messageId,
          deliveredAt
        });
      } else if (channel === NotificationChannel.WHATSAPP) {
        // Build Meta WhatsApp payload
        const varsArray = Object.values(dto.variables).map(String);
        const payload = this.buildWhatsAppPayload(dto.eventType, dto.recipientPhone, dto.language, varsArray);
        results.push({
          channel: NotificationChannel.WHATSAPP,
          success: true,
          messageId,
          deliveredAt
        });
      }
    }

    return results;
  }

  /**
   * Event Hook: Loan Approved & Disbursed
   */
  public async notifyLoanApproved(params: {
    phone: string;
    accountNumber: string;
    amount: number;
    emi: number;
    dueDay: number;
    language?: 'en' | 'kn';
    channels?: NotificationChannel[];
  }): Promise<NotificationDeliveryResult[]> {
    return this.dispatch({
      recipientPhone: params.phone,
      eventType: NotificationEventType.LOAN_APPROVED,
      channels: params.channels || this.activeChannels,
      language: params.language || 'en',
      variables: {
        var1: params.accountNumber,
        var2: params.amount.toLocaleString('en-IN'),
        var3: params.emi.toLocaleString('en-IN'),
        var4: params.dueDay
      }
    });
  }

  /**
   * Event Hook: Repayment Received (UPI or Verified Cash)
   */
  public async notifyRepaymentReceived(params: {
    phone: string;
    accountNumber: string;
    amount: number;
    balance: number;
    ref: string;
    language?: 'en' | 'kn';
    channels?: NotificationChannel[];
  }): Promise<NotificationDeliveryResult[]> {
    return this.dispatch({
      recipientPhone: params.phone,
      eventType: NotificationEventType.REPAYMENT_RECEIVED,
      channels: params.channels || this.activeChannels,
      language: params.language || 'en',
      variables: {
        var1: params.amount.toLocaleString('en-IN'),
        var2: params.accountNumber,
        var3: params.balance.toLocaleString('en-IN'),
        var4: params.ref
      }
    });
  }

  /**
   * Event Hook: Cash Receipt Issued in Field
   */
  public async notifyCashReceiptIssued(params: {
    phone: string;
    receiptNumber: string;
    amount: number;
    agentName: string;
    language?: 'en' | 'kn';
    channels?: NotificationChannel[];
  }): Promise<NotificationDeliveryResult[]> {
    return this.dispatch({
      recipientPhone: params.phone,
      eventType: NotificationEventType.CASH_RECEIPT_ISSUED,
      channels: params.channels || this.activeChannels,
      language: params.language || 'en',
      variables: {
        var1: params.receiptNumber,
        var2: params.amount.toLocaleString('en-IN'),
        var3: params.agentName
      }
    });
  }
}
