import { z } from 'zod';

export enum TransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT'
}

export enum PaymentMode {
  UPI = 'UPI',
  CASH = 'CASH',
  NEFT_IMPS = 'NEFT_IMPS',
  BANK_TRANSFER = 'BANK_TRANSFER'
}

export enum ReceiptStatus {
  COLLECTED_PENDING_APPROVAL = 'COLLECTED_PENDING_APPROVAL',
  VERIFIED_AND_DEPOSITED = 'VERIFIED_AND_DEPOSITED',
  DISCREPANCY = 'DISCREPANCY'
}

/**
 * NPCI UPI Spec (Universal UPI Intent / QR standard)
 * Format: upi://pay?pa=VPA&pn=NAME&am=AMOUNT&cu=INR&tr=TXNREF&tn=NOTE
 */
export function generateUpiUri(params: {
  vpa: string;
  payeeName: string;
  amount: number;
  transactionRef: string;
  accountNumber: string;
}): string {
  const note = `EMI Repayment for Acc ${params.accountNumber}`;
  const query = new URLSearchParams({
    pa: params.vpa,
    pn: params.payeeName,
    am: params.amount.toFixed(2),
    tr: params.transactionRef,
    tn: note,
    cu: 'INR'
  });
  return `upi://pay?${query.toString()}`;
}

export const GenerateUpiQrSchema = z.object({
  accountId: z.string().uuid(),
  amount: z.number().positive().min(1).max(100000)
});

export const LogCashReceiptSchema = z.object({
  accountId: z.string().uuid(),
  amount: z.number().positive().min(1).max(200000),
  receiptNumber: z.string().trim().min(5).max(30).regex(/^[a-zA-Z0-9_-]+$/, 'Receipt number must be alphanumeric'),
  notes: z.string().trim().max(250).regex(/^[a-zA-Z0-9\s,./#'()-]*$/, 'Notes contain disallowed characters').optional()
});

export type LogCashReceiptInput = z.infer<typeof LogCashReceiptSchema>;

export const VerifyCashReceiptSchema = z.object({
  receiptId: z.string().uuid(),
  status: z.enum([ReceiptStatus.VERIFIED_AND_DEPOSITED, ReceiptStatus.DISCREPANCY]),
  notes: z.string().trim().max(250).regex(/^[a-zA-Z0-9\s,./#'()-]*$/, 'Notes contain disallowed characters').optional()
});

export const ConfirmUpiPaymentSchema = z.object({
  accountId: z.string().uuid(),
  amount: z.number().positive().min(1).max(200000),
  utrNumber: z.string().trim().min(8, 'Valid 12-digit NPCI UTR or reference is required').max(35).regex(/^[a-zA-Z0-9_-]+$/, 'UTR must be alphanumeric'),
  transactionRef: z.string().trim().min(5).max(64).regex(/^[a-zA-Z0-9_-]+$/, 'Reference must be alphanumeric').optional(),
  notes: z.string().trim().max(250).regex(/^[a-zA-Z0-9\s,./#'()-]*$/, 'Notes contain disallowed characters').optional()
});

export type ConfirmUpiPaymentInput = z.infer<typeof ConfirmUpiPaymentSchema>;
