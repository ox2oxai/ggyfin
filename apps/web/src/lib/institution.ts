export interface InstitutionConfig {
  organizationName: string;
  platformTagline: string;
  registrationNumber: string;
  supportEmail: string;
  supportPhone: string;
  nodalOfficerName: string;
  nodalOfficerContact: string;
  headOfficeAddress: string;
  logoUrl?: string;
  // Dynamic NPCI UPI & Collection QR publishing parameters
  upiVpa?: string;
  upiPayeeName?: string;
  upiMerchantCode?: string;
  upiAccountNumber?: string;
  qrImageUrl?: string;
  enablePublicQr?: boolean;
  collectionInstructions?: string;
}

export interface CreditScheme {
  schemeCode: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  interestRate: number;
  defaultTenureMonths: number;
  minTenureMonths: number;
  maxTenureMonths: number;
  frequency: 'WEEKLY' | 'MONTHLY' | 'WEEKLY_OR_MONTHLY';
  purpose: string;
  isActive: boolean;
}

export interface BranchRecord {
  branchCode: string;
  solId: string;
  name: string;
  type: string;
  address: string;
  manager: string;
  phone: string;
  email: string;
  operatingHours?: string;
  isActive: boolean;
}

export const DEFAULT_INSTITUTION_CONFIG: InstitutionConfig = {
  organizationName: 'GGY Finance Ltd.',
  platformTagline: 'National Micro-Lending Platform • Direct Doorstep Credit',
  registrationNumber: 'NBFC-ND/2026/7742',
  supportEmail: 'support@ggyfinance.in',
  supportPhone: '1800-889-2020',
  nodalOfficerName: 'Smt. Anita Deshmukh',
  nodalOfficerContact: 'grievance@ggyfinance.in • 080-28491001',
  headOfficeAddress: '#104, Institutional Financial Zone, Outer Ring Road, Bengaluru - 560001',
  logoUrl: '',
  upiVpa: 'ggycollect@icici',
  upiPayeeName: 'GGY Finance Ltd',
  upiMerchantCode: '6012',
  upiAccountNumber: '1084-0101-702-0039-4',
  qrImageUrl: '',
  enablePublicQr: true,
  collectionInstructions: 'Scan using BHIM UPI, Google Pay, PhonePe, or Paytm. Specify your Loan Account Number in remarks for instant automated ledger credit.'
};

export const DEFAULT_CREDIT_SCHEMES: CreditScheme[] = [
  {
    schemeCode: 'SCHM-701',
    name: 'Kirana & Retail Working Capital',
    minAmount: 10000,
    maxAmount: 50000,
    interestRate: 11.5,
    defaultTenureMonths: 12,
    minTenureMonths: 6,
    maxTenureMonths: 18,
    frequency: 'WEEKLY_OR_MONTHLY',
    purpose: 'Inventory purchase, shop modernization & merchant daily liquidity',
    isActive: true
  },
  {
    schemeCode: 'SCHM-702',
    name: 'Dairy Development & Livestock Term Loan',
    minAmount: 20000,
    maxAmount: 100000,
    interestRate: 12.0,
    defaultTenureMonths: 24,
    minTenureMonths: 12,
    maxTenureMonths: 24,
    frequency: 'MONTHLY',
    purpose: 'Crossbred cattle purchase, cattle feed & milking equipment',
    isActive: true
  },
  {
    schemeCode: 'SCHM-703',
    name: 'Powerloom & Rural Artisan Credit',
    minAmount: 15000,
    maxAmount: 80000,
    interestRate: 12.5,
    defaultTenureMonths: 18,
    minTenureMonths: 12,
    maxTenureMonths: 24,
    frequency: 'MONTHLY',
    purpose: 'Yarn stock, weaving loom accessories & handicraft working capital',
    isActive: true
  },
  {
    schemeCode: 'SCHM-704',
    name: 'Micro-Agri & Allied Equipment Loan',
    minAmount: 25000,
    maxAmount: 200000,
    interestRate: 13.0,
    defaultTenureMonths: 24,
    minTenureMonths: 12,
    maxTenureMonths: 36,
    frequency: 'MONTHLY',
    purpose: 'Drip irrigation, solar fencing, polyhouse setup & small farm implements',
    isActive: true
  }
];

export const DEFAULT_BRANCHES: BranchRecord[] = [
  {
    branchCode: '2020',
    solId: '2020',
    name: 'Headquarters & Primary Branch',
    type: 'Head Office & Principal SOL',
    address: '#104, Institutional Financial Zone, Outer Ring Road, Bengaluru - 560001',
    manager: 'Sri Suresh Hegde (Branch Head)',
    phone: '080-28491001',
    email: 'branch2020@ggyfinance.in',
    operatingHours: 'Mon - Sat: 9:00 AM - 6:00 PM',
    isActive: true
  }
];

// 1. Institution Config Helpers
export function getInstitutionConfigSync(): InstitutionConfig {
  if (typeof window === 'undefined') return DEFAULT_INSTITUTION_CONFIG;
  try {
    const raw = localStorage.getItem('nbfc_institution_config');
    if (raw) {
      const parsed = JSON.parse(raw);
      // Auto-migrate legacy instructions to prevent hydration text divergence
      if (parsed && typeof parsed.collectionInstructions === 'string' && parsed.collectionInstructions.includes('10-digit')) {
        parsed.collectionInstructions = DEFAULT_INSTITUTION_CONFIG.collectionInstructions;
        try {
          localStorage.setItem('nbfc_institution_config', JSON.stringify({ ...DEFAULT_INSTITUTION_CONFIG, ...parsed }));
        } catch {}
      }
      return { ...DEFAULT_INSTITUTION_CONFIG, ...parsed };
    }
  } catch {}
  return DEFAULT_INSTITUTION_CONFIG;
}

export async function getInstitutionConfigAsync(): Promise<InstitutionConfig> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/config', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.config) {
          localStorage.setItem('nbfc_institution_config', JSON.stringify(data.config));
          return data.config;
        }
      }
    } catch {}
    return getInstitutionConfigSync();
  }
  return DEFAULT_INSTITUTION_CONFIG;
}

export async function saveInstitutionConfig(config: InstitutionConfig): Promise<void> {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('nbfc_institution_config', JSON.stringify(config));
    } catch {}

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.config) {
          localStorage.setItem('nbfc_institution_config', JSON.stringify(data.config));
        }
      }
    } catch (err) {
      console.error('[Institution] Failed to persist config:', err);
    }

    // Dispatch update AFTER Supabase cloud write completes
    window.dispatchEvent(new Event('nbfc_config_updated'));
  }
}

// 2. Credit Scheme Helpers
export function getCreditSchemesSync(): CreditScheme[] {
  if (typeof window === 'undefined') return DEFAULT_CREDIT_SCHEMES;
  try {
    const raw = localStorage.getItem('nbfc_credit_schemes');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_CREDIT_SCHEMES;
}

export async function getCreditSchemesAsync(): Promise<CreditScheme[]> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/schemes', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.schemes)) {
          localStorage.setItem('nbfc_credit_schemes', JSON.stringify(data.schemes));
          return data.schemes;
        }
      }
    } catch {}
    return getCreditSchemesSync();
  }
  return DEFAULT_CREDIT_SCHEMES;
}

export async function saveCreditSchemes(schemes: CreditScheme[]): Promise<void> {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('nbfc_credit_schemes', JSON.stringify(schemes));
    } catch {}

    try {
      const res = await fetch('/api/schemes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schemes })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.schemes)) {
          localStorage.setItem('nbfc_credit_schemes', JSON.stringify(data.schemes));
        }
      }
    } catch (err) {
      console.error('[Institution] Failed to persist schemes:', err);
    }

    // Dispatch update AFTER server disk write completes
    window.dispatchEvent(new Event('nbfc_schemes_updated'));
  }
}

// 3. Branch Helpers
export function getBranchesSync(): BranchRecord[] {
  if (typeof window === 'undefined') return DEFAULT_BRANCHES;
  try {
    const raw = localStorage.getItem('nbfc_branches');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_BRANCHES;
}

export async function getBranchesAsync(): Promise<BranchRecord[]> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/branches', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.branches)) {
          localStorage.setItem('nbfc_branches', JSON.stringify(data.branches));
          return data.branches;
        }
      }
    } catch {}
    return getBranchesSync();
  }
  return DEFAULT_BRANCHES;
}

export async function saveBranches(branches: BranchRecord[]): Promise<void> {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('nbfc_branches', JSON.stringify(branches));
    } catch {}

    try {
      const res = await fetch('/api/branches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branches })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.branches)) {
          localStorage.setItem('nbfc_branches', JSON.stringify(data.branches));
        }
      }
    } catch (err) {
      console.error('[Institution] Failed to persist branches:', err);
    }

    // Dispatch update AFTER server disk write completes
    window.dispatchEvent(new Event('nbfc_branches_updated'));
  }
}
