import { generateUpiUri, ReceiptStatus, getIndianDateString } from '@nbfc/shared';
import crypto from 'node:crypto';

export class CollectionValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CollectionValidationError';
  }
}

export class CollectionService {
  private merchantVpa: string;
  private payeeName: string;

  constructor(merchantVpa?: string, payeeName?: string) {
    this.merchantVpa = merchantVpa || process.env.UPI_MERCHANT_VPA || 'ggycollect@icici';
    this.payeeName = payeeName || process.env.UPI_PAYEE_NAME || 'GGY Finance';
  }

  /**
   * Generates a unique transaction reference for UPI payment tracking.
   * Standardized to Indian Standard Time (IST) to prevent midnight date-shift bugs.
   * Format: UPI + YYYYMMDD (IST) + 8-char random hex
   */
  public generateTransactionRef(): string {
    const dateStr = getIndianDateString();
    const rand = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `UPI${dateStr}${rand}`;
  }

  /**
   * Generates a formal UPI repayment payload for dynamic QR display.
   */
  public generateRepaymentQr(params: {
    accountId: string;
    accountNumber: string;
    amount: number;
  }): { upiUri: string; transactionRef: string; amount: number } {
    if (params.amount <= 0) {
      throw new CollectionValidationError('Repayment amount must be greater than zero.');
    }

    const transactionRef = this.generateTransactionRef();
    const upiUri = generateUpiUri({
      vpa: this.merchantVpa,
      payeeName: this.payeeName,
      amount: params.amount,
      transactionRef,
      accountNumber: params.accountNumber
    });

    return {
      upiUri,
      transactionRef,
      amount: params.amount
    };
  }

  /**
   * Generates a sequential physical cash receipt number in Indian Standard Time (IST).
   * Format: RCPT-YYYYMMDD-XXXX
   */
  public generateReceiptNumber(): string {
    const dateStr = getIndianDateString();
    const rand = crypto.randomBytes(2).toString('hex').toUpperCase();
    return `RCPT-${dateStr}-${rand}`;
  }

  /**
   * Dual-Control Cash Verification:
   * The field officer who collected the physical cash CANNOT verify their own cash deposit.
   * Only the Branch Manager or Cashier can confirm the cash has reached the branch vault.
   */
  public validateCashReceiptVerification(params: {
    collectedByUserId: string;
    verifiedByUserId: string;
    currentStatus: ReceiptStatus;
    newStatus: ReceiptStatus;
  }): void {
    if (params.collectedByUserId === params.verifiedByUserId) {
      throw new CollectionValidationError(
        'Dual-Control Cash Violation: The field agent who collected the cash cannot verify its vault deposit.'
      );
    }

    if (params.currentStatus !== ReceiptStatus.COLLECTED_PENDING_APPROVAL) {
      throw new CollectionValidationError(
        `Invalid Receipt Status: Receipt must be COLLECTED_PENDING_APPROVAL (Current: ${params.currentStatus})`
      );
    }
  }
}
