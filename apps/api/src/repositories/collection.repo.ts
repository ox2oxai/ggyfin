import { db } from '../db/client.js';
import { transactions, cashReceipts, accounts } from '../db/schema.js';
import { eq, sql } from 'drizzle-orm';
import { PaymentMode, ReceiptStatus, TransactionType } from '@nbfc/shared';

export interface RecordTransactionData {
  accountId: string;
  txnRefNumber: string;
  amount: number;
  txnType: TransactionType;
  mode: PaymentMode;
  notes?: string;
}

export interface LogCashReceiptData {
  accountId: string;
  amount: number;
  collectedByUserId: string;
  receiptNumber: string;
  notes?: string;
}

export class CollectionRepository {
  /**
   * Applies an inward credit repayment to an account inside an ACID transaction with row-level lock.
   * Handles partial payments, full settlement, and excess repayments with complete audit notes.
   */
  async recordCreditTransaction(data: RecordTransactionData) {
    if (data.amount <= 0) {
      throw new Error('Transaction amount must be strictly greater than zero');
    }

    return db.transaction(async (tx) => {
      // 1. Fetch current account with row-level lock
      const [acc] = await tx
        .select()
        .from(accounts)
        .where(eq(accounts.id, data.accountId))
        .for('update');

      if (!acc) {
        throw new Error('Account not found');
      }

      const currentBal = Number(acc.currentBalance);
      let newBal = 0;
      let transactionNotes = data.notes || '';

      if (data.amount >= currentBal) {
        // Loan fully settled
        newBal = 0;
        const excess = data.amount - currentBal;
        if (excess > 0) {
          transactionNotes += ` (Loan cleared in full. Excess advance of INR ${excess.toFixed(2)} credited to customer liability)`;
        } else {
          transactionNotes += ' (Loan cleared in full)';
        }

        // Transition account status to CLOSED if balance reaches 0
        await tx
          .update(accounts)
          .set({
            currentBalance: '0.00',
            status: 'CLOSED'
          })
          .where(eq(accounts.id, data.accountId));
      } else {
        newBal = Number((currentBal - data.amount).toFixed(2));
        await tx
          .update(accounts)
          .set({
            currentBalance: newBal.toFixed(2)
          })
          .where(eq(accounts.id, data.accountId));
      }

      // 2. Insert transaction record
      const [txn] = await tx
        .insert(transactions)
        .values({
          accountId: data.accountId,
          txnRefNumber: data.txnRefNumber,
          amount: data.amount.toFixed(2),
          txnType: data.txnType,
          mode: data.mode,
          balanceAfter: newBal.toFixed(2),
          notes: transactionNotes.trim() || null
        })
        .returning();

      return { transaction: txn, newBalance: newBal };
    });
  }

  async logCashReceipt(data: LogCashReceiptData) {
    const [receipt] = await db
      .insert(cashReceipts)
      .values({
        accountId: data.accountId,
        amount: data.amount.toFixed(2),
        collectedByUserId: data.collectedByUserId,
        receiptNumber: data.receiptNumber,
        status: ReceiptStatus.COLLECTED_PENDING_APPROVAL,
        notes: data.notes || null
      })
      .returning();

    return receipt;
  }

  async findCashReceiptById(id: string) {
    const results = await db.select().from(cashReceipts).where(eq(cashReceipts.id, id)).limit(1);
    return results[0] || null;
  }

  async verifyCashReceipt(receiptId: string, verifiedByUserId: string, newStatus: ReceiptStatus, transactionId: string) {
    const [updated] = await db
      .update(cashReceipts)
      .set({
        verifiedByUserId,
        status: newStatus,
        transactionId
      })
      .where(eq(cashReceipts.id, receiptId))
      .returning();

    return updated;
  }

  async listPendingCashReceipts() {
    return db
      .select()
      .from(cashReceipts)
      .where(eq(cashReceipts.status, ReceiptStatus.COLLECTED_PENDING_APPROVAL));
  }
}
