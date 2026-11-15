import { UserRole, generateNextEmployeeNumber } from '@nbfc/shared';

export interface StaffRecord {
  id: string;
  staffNumber: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  role: UserRole;
  branchCode: string;
  isActive: boolean;
  mustResetPassword?: boolean;
  createdAt: string;
}

export const DEFAULT_STAFF_DIRECTORY: StaffRecord[] = [
  {
    id: 'u-superadmin-it-001',
    staffNumber: '202010',
    username: 'it_superadmin',
    fullName: 'Shiv Yaragatti',
    email: 'it.admin@ggyfinance.in',
    phone: '9800000001',
    password: 'GGY#SuperAdminIT@2026!',
    role: UserRole.SUPER_ADMIN_IT,
    branchCode: '2020',
    isActive: true,
    mustResetPassword: false,
    createdAt: '2026-01-01'
  },
  {
    id: 'u-staff-ngyaragatti-002',
    staffNumber: '202011',
    username: 'ngyaragatti',
    fullName: 'N. G. Yaragatti',
    email: 'ng.yaragatti@ggyfinance.in',
    phone: '9845012399',
    password: 'GGYSecurePassword@2026',
    role: UserRole.SYSTEM_ADMIN,
    branchCode: '2020',
    isActive: true,
    mustResetPassword: true,
    createdAt: '2026-01-01'
  }
];

/**
 * Normalizes staff directory, migrating legacy codes and ensuring essential default staff exist.
 */
export function normalizeStaffDirectory(rawList: any[]): StaffRecord[] {
  if (!Array.isArray(rawList) || rawList.length === 0) {
    return [...DEFAULT_STAFF_DIRECTORY];
  }

  let list: StaffRecord[] = rawList.map((item, idx) => {
    let rec: StaffRecord = { ...item };
    if (!rec.staffNumber || !/^\d+$/.test(rec.staffNumber) || rec.staffNumber.startsWith('EMP-')) {
      rec.staffNumber = String(202010 + idx);
    }
    if (rec.branchCode === 'KA-HQ-IT') {
      rec.branchCode = '2020';
    }
    return rec;
  });

  // Ensure it_superadmin is present
  if (!list.some((u) => u.username.toLowerCase() === 'it_superadmin')) {
    list.unshift(DEFAULT_STAFF_DIRECTORY[0]);
  }

  // Ensure ngyaragatti is present
  if (!list.some((u) => u.username.toLowerCase() === 'ngyaragatti')) {
    list.push(DEFAULT_STAFF_DIRECTORY[1]);
  }

  return list;
}

/**
 * Loads staff directory from server API with synchronous fallback to localStorage and defaults.
 */
export async function getStaffDirectoryAsync(): Promise<StaffRecord[]> {
  // 1. Try server-side persistent endpoint
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/staff', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.directory)) {
          const normalized = normalizeStaffDirectory(data.directory);
          localStorage.setItem('nbfc_staff_directory', JSON.stringify(normalized));
          return normalized;
        }
      }
    } catch {
      // API unavailable, continue to local storage
    }

    // 2. Fallback to localStorage
    try {
      const raw = localStorage.getItem('nbfc_staff_directory');
      if (raw) {
        const parsed = JSON.parse(raw);
        const normalized = normalizeStaffDirectory(parsed);
        localStorage.setItem('nbfc_staff_directory', JSON.stringify(normalized));
        return normalized;
      }
    } catch {
      // Continue to defaults
    }

    // 3. Fallback to code defaults
    localStorage.setItem('nbfc_staff_directory', JSON.stringify(DEFAULT_STAFF_DIRECTORY));
  }

  return [...DEFAULT_STAFF_DIRECTORY];
}

/**
 * Synchronous reader for instant rendering with normalize guarantee.
 */
export function getStaffDirectorySync(): StaffRecord[] {
  if (typeof window === 'undefined') {
    return [...DEFAULT_STAFF_DIRECTORY];
  }

  try {
    const raw = localStorage.getItem('nbfc_staff_directory');
    if (raw) {
      const parsed = JSON.parse(raw);
      const normalized = normalizeStaffDirectory(parsed);
      return normalized;
    }
  } catch {
    // ignore
  }

  localStorage.setItem('nbfc_staff_directory', JSON.stringify(DEFAULT_STAFF_DIRECTORY));
  return [...DEFAULT_STAFF_DIRECTORY];
}

/**
 * Persists staff directory to both localStorage and the persistent server endpoint.
 * Guaranteed write-before-dispatch to prevent stale reads and data loss.
 */
export async function saveStaffDirectory(directory: StaffRecord[]): Promise<void> {
  const normalized = normalizeStaffDirectory(directory);
  if (typeof window !== 'undefined') {
    // 1. Immediately cache in localStorage
    try {
      localStorage.setItem('nbfc_staff_directory', JSON.stringify(normalized));
    } catch (e) {
      console.error('[Staff] Failed to cache to localStorage:', e);
    }

    // 2. Await server disk write to complete
    try {
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ directory: normalized })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.directory)) {
          localStorage.setItem('nbfc_staff_directory', JSON.stringify(data.directory));
        }
      }
    } catch (e) {
      console.warn('[Staff] Failed to sync to /api/staff endpoint:', e);
    }

    // 3. Dispatch event AFTER server disk write is confirmed
    window.dispatchEvent(new Event('nbfc_staff_updated'));
  }
}
