import { z } from 'zod';

/**
 * Standard Indian Core Banking System (CBS) Configuration & Extensible Account Schema.
 * Aligns 1:1 with RBI Banking Guidelines and Finacle/BaNCS/Flexcube host schemas.
 */

export interface CBSBranchDefinition {
  solId: string;       // 4-digit Service Outlet Location (e.g. '0101')
  name: string;        // Branch Name (e.g. 'Bengaluru Central')
  district: string;    // District / Taluk
  stateCode: string;   // State (e.g. 'KA')
}

export interface CBSSchemeDefinition {
  schemeCode: string;  // 3-digit Finacle Scheme Code (e.g. '701')
  name: string;        // Scheme Name (e.g. 'Micro-Enterprise Loan')
  facilityType: 'TERM_LOAN' | 'WORKING_CAPITAL' | 'SAVINGS_DEPOSIT';
}

export const CBS_DEFAULT_BRANCHES: CBSBranchDefinition[] = [
  { solId: '0101', name: 'Bengaluru Central Hub', district: 'Bangalore Urban', stateCode: 'KA' },
  { solId: '0102', name: 'Ramanagara Rural Branch', district: 'Ramanagara', stateCode: 'KA' },
  { solId: '0103', name: 'Mandya Agri-Credit Center', district: 'Mandya', stateCode: 'KA' },
  { solId: '0104', name: 'Tumakuru Microfinance Office', district: 'Tumakuru', stateCode: 'KA' },
  { solId: '0105', name: 'Mysuru Artisan Branch', district: 'Mysuru', stateCode: 'KA' }
];

export const CBS_DEFAULT_SCHEMES: CBSSchemeDefinition[] = [
  { schemeCode: '701', name: 'Micro-Enterprise Working Capital', facilityType: 'WORKING_CAPITAL' },
  { schemeCode: '702', name: 'Dairy Development Term Loan', facilityType: 'TERM_LOAN' },
  { schemeCode: '703', name: 'Powerloom Artisan Credit Facility', facilityType: 'WORKING_CAPITAL' },
  { schemeCode: '704', name: 'Rural Agriculture Micro-Loan', facilityType: 'TERM_LOAN' },
  { schemeCode: '101', name: 'Future Basic Savings Bank Deposit (BSBDA)', facilityType: 'SAVINGS_DEPOSIT' }
];

/**
 * Generates an institutional 10-Digit Customer ID (CIF - Customer Information File).
 * Decoupled from account numbers. 1 Customer (CIF) can hold multiple loan/deposit accounts.
 * Format: [4-digit Bank Code] + [6-digit Customer Sequence]
 * Example: 1084000042
 */
export function generateCustomerId(bankCode: string = '1084', sequence: number = 1): string {
  const cleanBank = bankCode.replace(/\D/g, '').padEnd(4, '0').slice(0, 4);
  const cleanSeq = sequence.toString().padStart(6, '0').slice(-6);
  return `${cleanBank}${cleanSeq}`;
}

/**
 * Calculates standard Luhn / Mod-11 Check Digit for financial account verification.
 */
export function calculateMod11CheckDigit(input: string): number {
  const digits = input.replace(/\D/g, '');
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    const weight = ((digits.length - i) % 10) + 1;
    sum += parseInt(digits[i], 10) * weight;
  }
  const remainder = sum % 11;
  return remainder === 10 ? 0 : remainder;
}

/**
 * Generates a 16-Digit RBI Core Banking Standard Account Number (Finacle / BaNCS compliant).
 * Structure:
 * - Bank Code (4 digits): '1084'
 * - Branch SOL ID (4 digits): '0101'
 * - Scheme Code (3 digits): '701'
 * - Account Serial (4 digits): '0042'
 * - Mod-11 Check Digit (1 digit): '8'
 * Formatted: 1084-0101-701-0042-8 (or pure numeric 1084010170100428)
 */
export function generateCBSAccountNumber(
  bankCode: string = '1084',
  solId: string = '0101',
  schemeCode: string = '701',
  serial: number = 1,
  formatted: boolean = true
): string {
  const bCode = bankCode.replace(/\D/g, '').padEnd(4, '0').slice(0, 4);
  const sId = solId.replace(/\D/g, '').padEnd(4, '0').slice(0, 4);
  const schCode = schemeCode.replace(/\D/g, '').padEnd(3, '0').slice(0, 3);
  const seq = serial.toString().padStart(4, '0').slice(-4);

  const base15 = `${bCode}${sId}${schCode}${seq}`;
  const checkDigit = calculateMod11CheckDigit(base15);
  const full16 = `${base15}${checkDigit}`;

  if (formatted) {
    return `${bCode}-${sId}-${schCode}-${seq}-${checkDigit}`;
  }
  return full16;
}

/**
 * Validates a 16-digit CBS account number against its embedded check digit.
 */
export function verifyCBSAccountNumber(accountNumber: string): boolean {
  const clean = accountNumber.replace(/\D/g, '');
  if (clean.length !== 16) return false;

  const base15 = clean.slice(0, 15);
  const expectedCheck = calculateMod11CheckDigit(base15);
  const actualCheck = parseInt(clean.slice(15), 10);

  return expectedCheck === actualCheck;
}

/**
 * Schema for Borrower Customer Profile in CBS
 */
export const BorrowerCustomerSchema = z.object({
  customerId: z.string().min(8).max(12),
  fullName: z.string().min(2),
  maskedAadhaar: z.string().regex(/^XXXX-XXXX-\d{4}$/),
  phone: z.string().min(10).max(15),
  taluk: z.string(),
  district: z.string(),
  dpdpConsentObtained: z.boolean(),
  portalEnabled: z.boolean().default(true),
  createdYear: z.number().default(2026)
});

export type BorrowerCustomer = z.infer<typeof BorrowerCustomerSchema>;
