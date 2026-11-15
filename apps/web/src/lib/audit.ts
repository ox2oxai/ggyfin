export type AuditCategory = 'INTENDED_ADMIN_UPDATE' | 'OPERATIONAL_BANKING_EVENT' | 'SECURITY_EVENT';

export interface AuditLogPayload {
  category: AuditCategory;
  action: string;
  actorStaffNumber?: string;
  actorUsername?: string;
  actorRole?: string;
  target: string;
  details: string;
  ip?: string;
}

/**
 * Appends an immutable audit log entry into `nbfc_audit_trail` and dispatches `nbfc_audit_updated`
 * for real-time reactivity across IT Admin & CEO oversight consoles.
 */
export function recordAuditLog(payload: AuditLogPayload): void {
  if (typeof window === 'undefined') return;

  try {
    let staffNumber = payload.actorStaffNumber;
    let username = payload.actorUsername;
    let role = payload.actorRole;

    if (!staffNumber || !username || !role) {
      const rawSession = localStorage.getItem('nbfc_staff_session');
      if (rawSession) {
        const s = JSON.parse(rawSession);
        if (!staffNumber && s.staffNumber) staffNumber = s.staffNumber;
        if (!username && s.username) username = s.username;
        if (!role && s.role) role = s.role;
      }
    }

    const raw = localStorage.getItem('nbfc_audit_trail');
    const existing = raw ? JSON.parse(raw) : [];

    const newEntry = {
      id: `aud-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      category: payload.category,
      action: payload.action,
      actorStaffNumber: staffNumber || 'EMP-1084-001',
      actorUsername: username || 'system',
      actorRole: role || 'SYSTEM',
      target: payload.target,
      details: payload.details,
      ip: payload.ip || '127.0.0.1'
    };

    localStorage.setItem('nbfc_audit_trail', JSON.stringify([newEntry, ...existing]));
    window.dispatchEvent(new Event('nbfc_audit_updated'));
  } catch (err) {
    console.error('[Audit] Failed to append audit record:', err);
  }
}

/**
 * Calculates the next unique Staff ID monotonically (max + 1) to prevent collisions
 * when users are deprovisioned or sequence numbers have gaps.
 */
export function getNextStaffNumber(staffList: Array<{ staffNumber?: string }>): string {
  let maxSeq = 0;
  for (const s of staffList) {
    if (s.staffNumber && s.staffNumber.startsWith('EMP-1084-')) {
      const numPart = s.staffNumber.replace('EMP-1084-', '');
      const parsed = parseInt(numPart, 10);
      if (!isNaN(parsed) && parsed > maxSeq) {
        maxSeq = parsed;
      }
    }
  }
  return `EMP-1084-${String(maxSeq + 1).padStart(3, '0')}`;
}
