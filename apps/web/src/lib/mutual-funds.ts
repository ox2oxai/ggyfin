import {
  MutualFundSchemeSummary,
  MutualFundSchemeDetail,
  MutualFundAmcRecord,
  MutualFundInquiryPayload
} from '@nbfc/shared';

export interface MutualFundsDataset {
  amcs: MutualFundAmcRecord[];
  schemes: MutualFundSchemeDetail[];
  syncMetadata: {
    lastSyncTimestamp: string;
    source: string;
    recordsProcessed: number;
    status: string;
    notice: string;
  };
}

import { MUTUAL_FUNDS_DATA } from './mutual-funds-data';

export const FALLBACK_MUTUAL_FUNDS: MutualFundsDataset = MUTUAL_FUNDS_DATA;
export const DEFAULT_MUTUAL_FUNDS: MutualFundsDataset = MUTUAL_FUNDS_DATA;

const STORAGE_KEY = 'nbfc_mutual_funds_dataset_v2';

export function getMutualFundsSync(): MutualFundsDataset {
  if (typeof window === 'undefined') return FALLBACK_MUTUAL_FUNDS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.schemes) && parsed.schemes.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return FALLBACK_MUTUAL_FUNDS;
}

export async function getMutualFundsAsync(): Promise<MutualFundsDataset> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/mutual-funds', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.dataset) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data.dataset));
          return data.dataset;
        }
      }
    } catch {}
    return getMutualFundsSync();
  }
  return FALLBACK_MUTUAL_FUNDS;
}

export async function submitMutualFundInquiry(
  payload: MutualFundInquiryPayload
): Promise<{ success: boolean; ticketRef?: string; message: string }> {
  try {
    const res = await fetch('/api/mutual-funds/inquire', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      return await res.json();
    }
    const err = await res.json();
    return { success: false, message: err.message || 'Failed to submit inquiry' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Network error' };
  }
}
