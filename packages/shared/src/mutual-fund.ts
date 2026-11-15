import { z } from 'zod';
import { isValidMobile, isValidEmail, isValidLegalName } from './validation.js';

export enum MutualFundCategory {
  EQUITY = 'Equity',
  DEBT = 'Debt',
  HYBRID = 'Hybrid',
  SOLUTION_ORIENTED = 'Solution Oriented',
  INDEX_FUNDS = 'Index Funds',
  ELSS = 'ELSS',
  OTHER = 'Other Schemes'
}

export enum RiskometerLevel {
  LOW = 'Low',
  LOW_TO_MODERATE = 'Low to Moderate',
  MODERATE = 'Moderate',
  MODERATELY_HIGH = 'Moderately High',
  HIGH = 'High',
  VERY_HIGH = 'Very High'
}

export interface NavObservation {
  date: string; // YYYY-MM-DD or DD-Mon-YYYY
  nav: number;
}

export interface MutualFundAmcRecord {
  code: string;
  name: string;
  officialWebsiteUrl: string;
  supportPhone?: string;
  totalAumCr?: number;
}

export interface MutualFundSchemeSummary {
  id: string;
  amfiCode: string;
  schemeName: string;
  amcCode: string;
  amcName: string;
  category: MutualFundCategory | string;
  subCategory: string;
  planType: 'Regular' | 'Direct';
  optionType: 'Growth' | 'IDCW';
  latestNav: number;
  latestNavDate: string;
  returns1Y: number | null;
  cagr3Y: number | null;
  cagr5Y: number | null;
  riskometer: RiskometerLevel | string;
  expenseRatio?: number | null;
  amcOfficialUrl: string;
}

export interface MutualFundSchemeDetail extends MutualFundSchemeSummary {
  isinGrowth?: string;
  isinDivPayout?: string;
  isinDivReinvestment?: string;
  benchmarkName?: string;
  inceptionDate?: string;
  fundManager?: string;
  sidUrl?: string;
  kimUrl?: string;
  factsheetUrl?: string;
  milestonesNavHistory: NavObservation[];
  dataFreshnessNote?: string;
}

export interface MutualFundInquiryPayload {
  fullName: string;
  phone: string;
  email?: string;
  schemeId?: string;
  schemeName?: string;
  message?: string;
  consentGranted: boolean;
  sourcePage?: string;
}

/**
 * Zod Schema for Lead Inquiries on Mutual Fund Explorer
 */
export const MutualFundInquirySchema = z.object({
  fullName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(70, 'Name cannot exceed 70 characters')
    .refine((val) => isValidLegalName(val), {
      message: 'Name contains disallowed characters'
    }),
  phone: z
    .string()
    .refine((val) => isValidMobile(val), {
      message: 'Phone number must be exactly 10 digits starting with 6-9'
    }),
  email: z
    .string()
    .optional()
    .refine((val) => !val || isValidEmail(val), {
      message: 'Invalid email address format'
    }),
  schemeId: z.string().optional(),
  schemeName: z.string().optional(),
  message: z.string().max(500, 'Message cannot exceed 500 characters').optional(),
  consentGranted: z.boolean().refine((val) => val === true, {
    message: 'Explicit DPDP consent is mandatory to be contacted by an AMFI registered distributor'
  }),
  sourcePage: z.string().default('/mutual-funds')
});

/**
 * Point-to-Point Absolute Return Calculation
 * Return (%) = ((Ending NAV / Starting NAV) - 1) * 100
 */
export function calculateAbsoluteReturn(startNav: number, endNav: number): number | null {
  if (typeof startNav !== 'number' || typeof endNav !== 'number') return null;
  if (startNav <= 0 || endNav <= 0 || !isFinite(startNav) || !isFinite(endNav)) return null;
  const ret = ((endNav / startNav) - 1) * 100;
  return Number(ret.toFixed(2));
}

/**
 * Compound Annual Growth Rate (CAGR) Calculation for Multi-Year Periods
 * CAGR (%) = ((Ending NAV / Starting NAV) ^ (365 / Days) - 1) * 100
 */
export function calculateCAGR(startNav: number, endNav: number, days: number): number | null {
  if (typeof startNav !== 'number' || typeof endNav !== 'number' || typeof days !== 'number') return null;
  if (startNav <= 0 || endNav <= 0 || days <= 0 || !isFinite(startNav) || !isFinite(endNav) || !isFinite(days)) {
    return null;
  }
  // If period is less than 1 year (365 days), CAGR should not be annualized without sufficient duration
  if (days < 360) {
    return calculateAbsoluteReturn(startNav, endNav);
  }
  const cagr = (Math.pow(endNav / startNav, 365 / days) - 1) * 100;
  return Number(cagr.toFixed(2));
}

/**
 * Downsamples a long historical NAV series into key milestone points (e.g. 12 to 36 points max)
 * Keeps payload lightweight (<2KB) for rural / low-bandwidth mobile browsers.
 */
export function downsampleNavHistory(
  observations: NavObservation[],
  maxPoints: number = 36
): NavObservation[] {
  if (!Array.isArray(observations) || observations.length === 0) return [];
  if (observations.length <= maxPoints) {
    return [...observations].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  const sorted = [...observations].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const step = (sorted.length - 1) / (maxPoints - 1);
  const result: NavObservation[] = [];

  for (let i = 0; i < maxPoints; i++) {
    const index = Math.min(Math.round(i * step), sorted.length - 1);
    result.push(sorted[index]);
  }

  // Ensure last observation is strictly preserved
  if (result.length > 0 && result[result.length - 1].date !== sorted[sorted.length - 1].date) {
    result[result.length - 1] = sorted[sorted.length - 1];
  }

  return result;
}

/**
 * Color and styling tokens for SEBI Riskometer display
 */
export function getRiskometerColor(riskometer: RiskometerLevel | string): {
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
} {
  switch (riskometer) {
    case RiskometerLevel.LOW:
      return { badgeBg: 'bg-emerald-50', badgeText: 'text-emerald-800', badgeBorder: 'border-emerald-200' };
    case RiskometerLevel.LOW_TO_MODERATE:
      return { badgeBg: 'bg-teal-50', badgeText: 'text-teal-800', badgeBorder: 'border-teal-200' };
    case RiskometerLevel.MODERATE:
      return { badgeBg: 'bg-blue-50', badgeText: 'text-blue-800', badgeBorder: 'border-blue-200' };
    case RiskometerLevel.MODERATELY_HIGH:
      return { badgeBg: 'bg-amber-50', badgeText: 'text-amber-800', badgeBorder: 'border-amber-200' };
    case RiskometerLevel.HIGH:
      return { badgeBg: 'bg-orange-50', badgeText: 'text-orange-800', badgeBorder: 'border-orange-200' };
    case RiskometerLevel.VERY_HIGH:
      return { badgeBg: 'bg-rose-50', badgeText: 'text-rose-800', badgeBorder: 'border-rose-200' };
    default:
      return { badgeBg: 'bg-slate-50', badgeText: 'text-slate-800', badgeBorder: 'border-slate-200' };
  }
}
