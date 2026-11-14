import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  NotificationChannel,
  NotificationEventType,
  GGY_DLT_TEMPLATES
} from '@nbfc/shared';
import { NotificationService } from './notification.service.js';

describe('NotificationService (TRAI DLT SMS & WhatsApp Business Adapters)', () => {
  const service = new NotificationService([
    NotificationChannel.SMS_DLT,
    NotificationChannel.WHATSAPP
  ]);

  it('correctly substitutes TRAI DLT template variables', () => {
    const template = GGY_DLT_TEMPLATES[NotificationEventType.LOAN_APPROVED];
    const message = service.formatDltMessage(template, {
      var1: 'GGY-2026-M48101',
      var2: '50,000',
      var3: '4,500',
      var4: '5'
    });

    assert.equal(
      message,
      'Dear Customer, your GGY Finance loan account GGY-2026-M48101 is approved for Rs.50,000. Monthly EMI: Rs.4,500. Due on 5th of every month. - GGY Finance'
    );
  });

  it('builds compliant TRAI DLT SMS payload with 6-char header and template ID', () => {
    const payload = service.buildDltSmsPayload(
      NotificationEventType.REPAYMENT_RECEIVED,
      '9845012345',
      {
        var1: '4,607',
        var2: 'GGY-2026-M48101',
        var3: '45,393',
        var4: 'UPI-9876543210'
      }
    );

    assert.equal(payload.entityId, '1101234567890123456');
    assert.equal(payload.senderId, 'GGYFIN');
    assert.equal(payload.templateId, '1107168900123456782');
    assert.equal(payload.to, '919845012345');
    assert.match(payload.message, /repayment of Rs\.4,607 received/);
  });

  it('builds Meta WhatsApp Cloud API payload with language code and parameter array', () => {
    const payloadEn = service.buildWhatsAppPayload(
      NotificationEventType.LOAN_APPROVED,
      '9845012345',
      'en',
      ['GGY-2026-M48101', '50,000', '4,500', '5']
    );

    assert.equal(payloadEn.messaging_product, 'whatsapp');
    assert.equal(payloadEn.to, '919845012345');
    assert.equal(payloadEn.template.name, 'ggy_loan_approval_v1');
    assert.equal(payloadEn.template.language.code, 'en');
    assert.equal(payloadEn.template.components[0].parameters.length, 4);
    assert.equal(payloadEn.template.components[0].parameters[0].text, 'GGY-2026-M48101');

    // Kannada localized template
    const payloadKn = service.buildWhatsAppPayload(
      NotificationEventType.LOAN_APPROVED,
      '9845012345',
      'kn',
      ['GGY-2026-M48101', '50,000', '4,500', '5']
    );
    assert.equal(payloadKn.template.language.code, 'kn');
  });

  it('triggers loan approval event hook across configured channels', async () => {
    const results = await service.notifyLoanApproved({
      phone: '9845012345',
      accountNumber: 'GGY-2026-M48101',
      amount: 50000,
      emi: 4607,
      dueDay: 5,
      channels: [NotificationChannel.SMS_DLT, NotificationChannel.WHATSAPP]
    });

    assert.equal(results.length, 2);
    assert.equal(results[0].channel, NotificationChannel.SMS_DLT);
    assert.equal(results[0].success, true);
    assert.equal(results[1].channel, NotificationChannel.WHATSAPP);
    assert.equal(results[1].success, true);
  });

  it('triggers repayment received event hook with formatted currency strings', async () => {
    const results = await service.notifyRepaymentReceived({
      phone: '9845012345',
      accountNumber: 'GGY-2026-M48101',
      amount: 4607,
      balance: 45393,
      ref: 'TXN-20261114-1234',
      channels: [NotificationChannel.CONSOLE_MOCK]
    });

    assert.equal(results.length, 1);
    assert.equal(results[0].channel, NotificationChannel.CONSOLE_MOCK);
    assert.equal(results[0].success, true);
    assert.ok(results[0].messageId.startsWith('msg-'));
  });

  it('triggers cash receipt event hook with field agent identification', async () => {
    const results = await service.notifyCashReceiptIssued({
      phone: '9845012345',
      receiptNumber: 'RCP-20261114-001',
      amount: 3000,
      agentName: 'Ramesh (KA-BLR-01)',
      channels: [NotificationChannel.SMS_DLT]
    });

    assert.equal(results.length, 1);
    assert.equal(results[0].channel, NotificationChannel.SMS_DLT);
    assert.equal(results[0].success, true);
  });
});
