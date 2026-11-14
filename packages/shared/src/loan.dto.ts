import { z } from 'zod';

export enum AccountType {
  LOAN = 'LOAN',
  SAVINGS = 'SAVINGS',
  WALLET = 'WALLET'
}

export enum AccountStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  CLOSED = 'CLOSED'
}

export enum LoanPurpose {
  KIRANA_STORE = 'KIRANA_STORE',
  DAIRY_LIVESTOCK = 'DAIRY_LIVESTOCK',
  TWO_WHEELER = 'TWO_WHEELER',
  AGRICULTURAL_EQUIPMENT = 'AGRICULTURAL_EQUIPMENT',
  MICRO_ENTERPRISE = 'MICRO_ENTERPRISE'
}

export const LoanPurposeLabels: Record<LoanPurpose, { title: string; defaultTenure: number; defaultRate: number; maxAmount: number }> = {
  [LoanPurpose.KIRANA_STORE]: {
    title: 'Kirana / Retail Inventory',
    defaultTenure: 12,
    defaultRate: 14.5,
    maxAmount: 200000
  },
  [LoanPurpose.DAIRY_LIVESTOCK]: {
    title: 'Dairy & Cattle Purchase',
    defaultTenure: 18,
    defaultRate: 13.0,
    maxAmount: 150000
  },
  [LoanPurpose.TWO_WHEELER]: {
    title: 'Two-Wheeler / Commercial Mobility',
    defaultTenure: 24,
    defaultRate: 15.0,
    maxAmount: 120000
  },
  [LoanPurpose.AGRICULTURAL_EQUIPMENT]: {
    title: 'Farm Machinery & Solar Pumps',
    defaultTenure: 36,
    defaultRate: 12.5,
    maxAmount: 500000
  },
  [LoanPurpose.MICRO_ENTERPRISE]: {
    title: 'Micro-Enterprise Working Capital',
    defaultTenure: 12,
    defaultRate: 16.0,
    maxAmount: 300000
  }
};

/**
 * Standard Reducing Balance EMI calculation:
 * Formula: E = P * r * (1 + r)^n / ((1 + r)^n - 1)
 * Where:
 * P = Principal loan amount
 * r = Monthly interest rate (annualRate / 12 / 100)
 * n = Tenure in months
 */
export function calculateEMI(principal: number, annualRatePercent: number, tenureMonths: number): number {
  if (principal <= 0 || tenureMonths <= 0) return 0;
  if (annualRatePercent === 0) return Math.round((principal / tenureMonths) * 100) / 100;

  const monthlyRate = annualRatePercent / 12 / 100;
  const growthFactor = Math.pow(1 + monthlyRate, tenureMonths);
  const emi = (principal * monthlyRate * growthFactor) / (growthFactor - 1);
  return Math.round(emi * 100) / 100;
}

export const CreateLoanAccountSchema = z.object({
  customerId: z.string().uuid('Valid customer ID is required'),
  loanPurpose: z.nativeEnum(LoanPurpose),
  principalAmount: z.number().positive().min(5000).max(1000000),
  interestRatePercent: z.number().positive().min(5).max(36),
  tenureMonths: z.number().int().positive().min(3).max(60)
});

export type CreateLoanAccountInput = z.infer<typeof CreateLoanAccountSchema>;

export const ApproveAccountSchema = z.object({
  remarks: z.string().min(3, 'Approval remarks are required for audit trail').max(500)
});

export const RejectAccountSchema = z.object({
  reason: z.string().min(5, 'Mandatory reason is required when rejecting an application').max(500)
});

export const SuspendAccountSchema = z.object({
  reason: z.string().min(5, 'Mandatory reason is required for account suspension').max(500)
});

export type SuspendAccountInput = z.infer<typeof SuspendAccountSchema>;

export const ReactivateAccountSchema = z.object({
  reason: z.string().min(5, 'Mandatory reason is required for account reactivation').max(500)
});

export type ReactivateAccountInput = z.infer<typeof ReactivateAccountSchema>;

export const CloseAccountSchema = z.object({
  closureReason: z.enum(['LOAN_PAID_IN_FULL', 'SETTLEMENT', 'WRITEOFF', 'FORECLOSURE']),
  remarks: z.string().min(5, 'Mandatory remarks are required for account closure').max(500),
  nocReference: z.string().optional()
});

export type CloseAccountInput = z.infer<typeof CloseAccountSchema>;
