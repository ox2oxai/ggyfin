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
  amount: z.number().positive().min(1)
});

export const LogCashReceiptSchema = z.object({
  accountId: z.string().uuid(),
  amount: z.number().positive().min(1),
  receiptNumber: z.string().min(5).max(30),
  notes: z.string().max(250).optional()
});

export type LogCashReceiptInput = z.infer<typeof LogCashReceiptSchema>;

export const VerifyCashReceiptSchema = z.object({
  receiptId: z.string().uuid(),
  status: z.enum([ReceiptStatus.VERIFIED_AND_DEPOSITED, ReceiptStatus.DISCREPANCY]),
  notes: z.string().max(250).optional()
});
