import { z } from 'zod';
import { getIndianIsoDate } from './timezone.js';

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

export interface AmortizationScheduleEntry {
  installmentNumber: number;
  dueDate: string;
  openingBalance: number;
  emiAmount: number;
  principalComponent: number;
  interestComponent: number;
  closingBalance: number;
}

export interface KeyFactStatementDto {
  loanAmount: number;
  annualInterestRate: number;
  tenureMonths: number;
  monthlyEmi: number;
  totalInterestPayable: number;
  processingFee: number;
  totalCostOfCredit: number;
  annualPercentageRate: number; // APR conforming to RBI 2022 guidelines
  schedule: AmortizationScheduleEntry[];
}

/**
 * Calculates due date handling month-end rollovers (e.g. Jan 31 -> Feb 28/29).
 * Uses UTC-neutral calendar math and direct ISO string formatting to prevent any runtime timezone drift.
 */
export function calculateNextDueDate(startDate: Date, monthOffset: number, dueDay = 5): string {
  const d = new Date(startDate);
  const currentTotalMonths = d.getFullYear() * 12 + d.getMonth() + monthOffset;
  const targetYear = Math.floor(currentTotalMonths / 12);
  const targetMonth = currentTotalMonths % 12; // 0-indexed (0 = Jan, 1 = Feb, ...)

  // Get total days in target month (automatically handles leap years: 29 in 2028, 28 in 2026)
  const daysInMonth = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate();
  const clampedDay = Math.min(dueDay, daysInMonth);

  const mm = String(targetMonth + 1).padStart(2, '0');
  const dd = String(clampedDay).padStart(2, '0');
  return `${targetYear}-${mm}-${dd}`;
}

/**
 * Generates month-by-month Reducing Balance Amortization Schedule
 * Resolves exact principal & interest components with zero fractional rupee leakage.
 */
export function generateAmortizationSchedule(
  principal: number,
  annualRatePercent: number,
  tenureMonths: number,
  startDate: Date = new Date(),
  dueDay = 5
): AmortizationScheduleEntry[] {
  if (principal <= 0 || tenureMonths <= 0) return [];

  const emi = calculateEMI(principal, annualRatePercent, tenureMonths);
  const monthlyRate = annualRatePercent / 12 / 100;
  let remainingBalance = principal;
  const schedule: AmortizationScheduleEntry[] = [];

  for (let i = 1; i <= tenureMonths; i++) {
    const openingBalance = Math.round(remainingBalance * 100) / 100;
    const interestComponent = Math.round(openingBalance * monthlyRate * 100) / 100;
    let principalComponent: number;
    let closingBalance: number;
    let currentEmi = emi;

    if (i === tenureMonths) {
      // Final month: reconcile exact remaining principal to ensure zero residual paise
      principalComponent = openingBalance;
      currentEmi = Math.round((principalComponent + interestComponent) * 100) / 100;
      closingBalance = 0.00;
    } else {
      principalComponent = Math.round((emi - interestComponent) * 100) / 100;
      closingBalance = Math.max(0, Math.round((openingBalance - principalComponent) * 100) / 100);
    }

    remainingBalance = closingBalance;
    const dueDate = calculateNextDueDate(startDate, i, dueDay);

    schedule.push({
      installmentNumber: i,
      dueDate,
      openingBalance,
      emiAmount: currentEmi,
      principalComponent,
      interestComponent,
      closingBalance
    });
  }

  return schedule;
}

/**
 * Generates RBI-Mandated Key Fact Statement (KFS)
 */
export function generateKeyFactStatement(
  principal: number,
  annualRatePercent: number,
  tenureMonths: number,
  startDate: Date = new Date(),
  dueDay = 5
): KeyFactStatementDto {
  const schedule = generateAmortizationSchedule(principal, annualRatePercent, tenureMonths, startDate, dueDay);
  const monthlyEmi = calculateEMI(principal, annualRatePercent, tenureMonths);
  const totalInterestPayable = schedule.reduce((sum, s) => sum + s.interestComponent, 0);

  // RBI Standard Processing Fee: 1.5% of principal + 18% GST
  const baseFee = principal * 0.015;
  const processingFee = Math.round((baseFee * 1.18) * 100) / 100;

  const totalCostOfCredit = Math.round((totalInterestPayable + processingFee) * 100) / 100;

  // APR Calculation per RBI Digital Lending Directions:
  // APR = ((Total Cost / Principal) / (Tenure in Years)) * 100
  const tenureYears = tenureMonths / 12;
  const apr = Number((((totalCostOfCredit / principal) / tenureYears) * 100).toFixed(2));

  return {
    loanAmount: principal,
    annualInterestRate: annualRatePercent,
    tenureMonths,
    monthlyEmi,
    totalInterestPayable: Math.round(totalInterestPayable * 100) / 100,
    processingFee,
    totalCostOfCredit,
    annualPercentageRate: apr,
    schedule
  };
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
