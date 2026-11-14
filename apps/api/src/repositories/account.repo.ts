import { db } from '../db/client.js';
import { accounts, loanDetails, customers } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';
import { AccountStatus, AccountType, LoanPurpose } from '@nbfc/shared';
import crypto from 'node:crypto';

export interface CreateLoanAccountData {
  customerId: string;
  accountType: AccountType;
  loanPurpose: LoanPurpose;
  principalAmount: number;
  interestRatePercent: number;
  tenureMonths: number;
  emiAmount: number;
}

export class AccountRepository {
  public generateDraftAccountNumber(): string {
    const rand = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `DRAFT-${rand}`;
  }

  /**
   * Creates an Account and its associated Loan Details atomically inside a single ACID transaction.
   */
  async createLoanAccount(data: CreateLoanAccountData) {
    const draftAccNo = this.generateDraftAccountNumber();

    return db.transaction(async (tx) => {
      const [newAccount] = await tx
        .insert(accounts)
        .values({
          accountNumber: draftAccNo,
          customerId: data.customerId,
          accountType: data.accountType,
          status: AccountStatus.PENDING_APPROVAL, // Submitted for Maker-Checker review
          currentBalance: data.principalAmount.toFixed(2),
          currency: 'INR'
        })
        .returning();

      const [newLoanDetail] = await tx
        .insert(loanDetails)
        .values({
          accountId: newAccount.id,
          loanPurpose: data.loanPurpose,
          principalAmount: data.principalAmount.toFixed(2),
          interestRatePercent: data.interestRatePercent.toFixed(2),
          tenureMonths: data.tenureMonths,
          emiAmount: data.emiAmount.toFixed(2)
        })
        .returning();

      return {
        ...newAccount,
        loan: newLoanDetail
      };
    });
  }

  async findById(id: string) {
    const results = await db
      .select({
        account: accounts,
        loan: loanDetails,
        customer: customers
      })
      .from(accounts)
      .leftJoin(loanDetails, eq(accounts.id, loanDetails.accountId))
      .leftJoin(customers, eq(accounts.customerId, customers.id))
      .where(eq(accounts.id, id))
      .limit(1);

    return results[0] || null;
  }

  async findByAccountNumber(accountNumber: string) {
    const results = await db
      .select({
        account: accounts,
        loan: loanDetails,
        customer: customers
      })
      .from(accounts)
      .leftJoin(loanDetails, eq(accounts.id, loanDetails.accountId))
      .leftJoin(customers, eq(accounts.customerId, customers.id))
      .where(eq(accounts.accountNumber, accountNumber))
      .limit(1);

    return results[0] || null;
  }

  async listPendingApprovals(limit = 20, offset = 0) {
    return db
      .select({
        account: accounts,
        loan: loanDetails,
        customer: customers
      })
      .from(accounts)
      .leftJoin(loanDetails, eq(accounts.id, loanDetails.accountId))
      .leftJoin(customers, eq(accounts.customerId, customers.id))
      .where(eq(accounts.status, AccountStatus.PENDING_APPROVAL))
      .orderBy(desc(accounts.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async updateApproval(id: string, newAccountNumber: string, approvedByUserId: string) {
    const results = await db
      .update(accounts)
      .set({
        accountNumber: newAccountNumber,
        status: AccountStatus.ACTIVE,
        approvedByUserId,
        approvedAt: new Date()
      })
      .where(eq(accounts.id, id))
      .returning();

    return results[0] || null;
  }

  async updateRejection(id: string) {
    const results = await db
      .update(accounts)
      .set({
        status: AccountStatus.DRAFT
      })
      .where(eq(accounts.id, id))
      .returning();

    return results[0] || null;
  }

  async updateStatus(id: string, status: AccountStatus) {
    const results = await db
      .update(accounts)
      .set({ status })
      .where(eq(accounts.id, id))
      .returning();

    return results[0] || null;
  }
}
