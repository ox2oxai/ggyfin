import { AccountStatus } from '@nbfc/shared';
import crypto from 'node:crypto';

export class MakerCheckerValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MakerCheckerValidationError';
  }
}

export interface AccountApprovalContext {
  accountId: string;
  currentStatus: AccountStatus;
  makerUserId: string;
  checkerUserId: string;
  remarks: string;
}

export class MakerCheckerService {
  /**
   * Generates a formal, standard Indian Core Banking account number.
   * Format: GGY + Year (4 digits) + 6 random alphanumeric characters
   * Example: GGY-2026-A8F2K9
   */
  public generateAccountNumber(): string {
    const year = new Date().getFullYear();
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `GGY-${year}-${randomHex}`;
  }

  /**
   * Generates a formal No-Dues Certificate (NOC) reference number for loan closure.
   * Format: NOC-GGY + Year + 6 random characters
   * Example: NOC-GGY-2026-B819FA
   */
  public generateNocNumber(): string {
    const year = new Date().getFullYear();
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `NOC-GGY-${year}-${randomHex}`;
  }

  /**
   * Validates if a submission from DRAFT to PENDING_APPROVAL is allowed.
   */
  public validateSubmissionForApproval(currentStatus: AccountStatus): void {
    if (currentStatus !== AccountStatus.DRAFT) {
      throw new MakerCheckerValidationError(
        `Cannot submit for approval: Account must be in DRAFT state (Current: ${currentStatus})`
      );
    }
  }

  /**
   * Enforces RBI Four-Eyes Principle (Maker-Checker):
   * 1. The Maker who drafted the application cannot approve it.
   * 2. The account must be in PENDING_APPROVAL state.
   * 3. Remarks are mandatory for audit compliance.
   */
  public validateApproval(context: AccountApprovalContext): { newStatus: AccountStatus; accountNumber: string } {
    if (context.makerUserId === context.checkerUserId) {
      throw new MakerCheckerValidationError(
        'RBI Dual-Control Violation: Maker cannot approve their own application. Authorizer must be a separate user.'
      );
    }

    if (context.currentStatus !== AccountStatus.PENDING_APPROVAL) {
      throw new MakerCheckerValidationError(
        `Invalid State Transition: Account must be PENDING_APPROVAL to be approved (Current: ${context.currentStatus})`
      );
    }

    if (!context.remarks || context.remarks.trim().length < 3) {
      throw new MakerCheckerValidationError('Mandatory remarks required for authorizer approval audit trail.');
    }

    return {
      newStatus: AccountStatus.ACTIVE,
      accountNumber: this.generateAccountNumber()
    };
  }

  /**
   * Enforces rules for application rejection.
   */
  public validateRejection(context: AccountApprovalContext): { newStatus: AccountStatus } {
    if (context.makerUserId === context.checkerUserId) {
      throw new MakerCheckerValidationError(
        'RBI Dual-Control Violation: Maker cannot reject their own application in checker queue.'
      );
    }

    if (context.currentStatus !== AccountStatus.PENDING_APPROVAL) {
      throw new MakerCheckerValidationError(
        `Invalid State Transition: Only PENDING_APPROVAL accounts can be rejected (Current: ${context.currentStatus})`
      );
    }

    if (!context.remarks || context.remarks.trim().length < 5) {
      throw new MakerCheckerValidationError('Mandatory reason required when rejecting an application.');
    }

    return {
      newStatus: AccountStatus.DRAFT // Returned to DRAFT so Maker can rectify KYC errors
    };
  }

  /**
   * Enforces rules for Account Suspension (Risk hold, fraud investigation, or legal order).
   * Requires Maker != Checker (Authorizer).
   */
  public validateSuspension(context: {
    accountId: string;
    currentStatus: AccountStatus;
    makerUserId: string;
    checkerUserId: string;
    reason: string;
  }): { newStatus: AccountStatus } {
    if (context.makerUserId === context.checkerUserId) {
      throw new MakerCheckerValidationError(
        'RBI Dual-Control Violation: Maker cannot unilaterally suspend an account. Authorizer confirmation required.'
      );
    }

    if (context.currentStatus !== AccountStatus.ACTIVE) {
      throw new MakerCheckerValidationError(
        `Invalid State Transition: Only ACTIVE accounts can be suspended (Current: ${context.currentStatus})`
      );
    }

    if (!context.reason || context.reason.trim().length < 5) {
      throw new MakerCheckerValidationError('Mandatory reason required for account suspension audit trail.');
    }

    return {
      newStatus: AccountStatus.SUSPENDED
    };
  }

  /**
   * Enforces rules for Account Reactivation (Lifting suspension after compliance clearance).
   */
  public validateReactivation(context: {
    accountId: string;
    currentStatus: AccountStatus;
    makerUserId: string;
    checkerUserId: string;
    reason: string;
  }): { newStatus: AccountStatus } {
    if (context.makerUserId === context.checkerUserId) {
      throw new MakerCheckerValidationError(
        'RBI Dual-Control Violation: Maker cannot unilaterally reactivate a suspended account.'
      );
    }

    if (context.currentStatus !== AccountStatus.SUSPENDED) {
      throw new MakerCheckerValidationError(
        `Invalid State Transition: Only SUSPENDED accounts can be reactivated (Current: ${context.currentStatus})`
      );
    }

    if (!context.reason || context.reason.trim().length < 5) {
      throw new MakerCheckerValidationError('Mandatory reason required for account reactivation audit trail.');
    }

    return {
      newStatus: AccountStatus.ACTIVE
    };
  }

  /**
   * Enforces rules for Loan Account Closure:
   * 1. Dual control: Maker != Checker.
   * 2. Zero-Balance Rule: Outstanding balance must be <= 0.00.
   * 3. Generates formal No-Dues Certificate (NOC) reference.
   */
  public validateClosure(context: {
    accountId: string;
    currentStatus: AccountStatus;
    currentBalance: number;
    makerUserId: string;
    checkerUserId: string;
    reason: string;
    customNoc?: string;
  }): { newStatus: AccountStatus; nocNumber: string } {
    if (context.makerUserId === context.checkerUserId) {
      throw new MakerCheckerValidationError(
        'RBI Dual-Control Violation: Maker cannot close an account without Authorizer verification.'
      );
    }

    if (context.currentStatus !== AccountStatus.ACTIVE && context.currentStatus !== AccountStatus.SUSPENDED) {
      throw new MakerCheckerValidationError(
        `Invalid State Transition: Cannot close account in ${context.currentStatus} status. Must be ACTIVE or SUSPENDED.`
      );
    }

    if (context.currentBalance > 0.00) {
      throw new MakerCheckerValidationError(
        `RBI Core Banking Violation: Cannot close loan with pending dues of ₹${context.currentBalance.toLocaleString('en-IN')}. Outstanding balance must be fully repaid or settled (<= ₹0.00).`
      );
    }

    if (!context.reason || context.reason.trim().length < 5) {
      throw new MakerCheckerValidationError('Mandatory closure remarks are required for audit trail.');
    }

    return {
      newStatus: AccountStatus.CLOSED,
      nocNumber: context.customNoc || this.generateNocNumber()
    };
  }
}
