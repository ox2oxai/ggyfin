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
          transactionNotes += ' (Loan cleared in full. Eligible for formal No-Dues Certificate closure)';
        }

        // Set balance to 0.00 while preserving ACTIVE status for Authorizer Maker-Checker NOC issuance
        await tx
          .update(accounts)
          .set({
            currentBalance: '0.00'
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

  /**
   * Atomically verifies a cash receipt and applies credit to the loan account in a single ACID transaction.
   * Utilizes PostgreSQL 16 row-level locks (FOR UPDATE) to prevent race conditions or double crediting.
   */
  async verifyCashReceiptWithCredit(params: {
    receiptId: string;
    verifiedByUserId: string;
    status: ReceiptStatus;
    notes?: string;
  }) {
    return db.transaction(async (tx) => {
      // 1. Fetch and lock receipt
      const [receipt] = await tx
        .select()
        .from(cashReceipts)
        .where(eq(cashReceipts.id, params.receiptId))
        .for('update');

      if (!receipt) {
        throw new Error('Receipt not found');
      }

      if (receipt.status !== ReceiptStatus.COLLECTED_PENDING_APPROVAL) {
        throw new Error(`Receipt is not in pending approval status (Current: ${receipt.status})`);
      }

      if (receipt.collectedByUserId === params.verifiedByUserId) {
        throw new Error('Dual-Control Cash Violation: The field agent who collected the cash cannot verify its deposit');
      }

      if (params.status === ReceiptStatus.DISCREPANCY) {
        const [updatedReceipt] = await tx
          .update(cashReceipts)
          .set({
            verifiedByUserId: params.verifiedByUserId,
            status: ReceiptStatus.DISCREPANCY,
            notes: params.notes || receipt.notes
          })
          .where(eq(cashReceipts.id, params.receiptId))
          .returning();

        return { receipt: updatedReceipt, transaction: null, newBalance: null };
      }

      // 2. Fetch and lock loan account
      const [acc] = await tx
        .select()
        .from(accounts)
        .where(eq(accounts.id, receipt.accountId))
        .for('update');

      if (!acc) {
        throw new Error('Associated loan account not found');
      }

      const currentBal = Number(acc.currentBalance);
      const amount = Number(receipt.amount);
      let newBal = 0;
      let transactionNotes = params.notes || 'Cash verified and deposited into branch counter';

      if (amount >= currentBal) {
        newBal = 0;
        const excess = amount - currentBal;
        if (excess > 0) {
          transactionNotes += ` (Loan cleared in full. Excess advance of INR ${excess.toFixed(2)} credited to customer liability)`;
        } else {
          transactionNotes += ' (Loan cleared in full. Eligible for formal No-Dues Certificate closure)';
        }

        await tx
          .update(accounts)
          .set({ currentBalance: '0.00' })
          .where(eq(accounts.id, receipt.accountId));
      } else {
        newBal = Number((currentBal - amount).toFixed(2));
        await tx
          .update(accounts)
          .set({ currentBalance: newBal.toFixed(2) })
          .where(eq(accounts.id, receipt.accountId));
      }

      // 3. Insert transaction record
      const [txn] = await tx
        .insert(transactions)
        .values({
          accountId: receipt.accountId,
          txnRefNumber: receipt.receiptNumber,
          amount: amount.toFixed(2),
          txnType: TransactionType.CREDIT,
          mode: PaymentMode.CASH,
          balanceAfter: newBal.toFixed(2),
          notes: transactionNotes.trim()
        })
        .returning();

      // 4. Update cash receipt with verified status and transaction link
      const [updatedReceipt] = await tx
        .update(cashReceipts)
        .set({
          verifiedByUserId: params.verifiedByUserId,
          status: ReceiptStatus.VERIFIED_AND_DEPOSITED,
          transactionId: txn.id,
          notes: params.notes || receipt.notes
        })
        .where(eq(cashReceipts.id, params.receiptId))
        .returning();

      return { receipt: updatedReceipt, transaction: txn, newBalance: newBal };
    });
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
