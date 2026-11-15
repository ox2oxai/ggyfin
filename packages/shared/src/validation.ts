/**
 * Centralized Regulatory & Security Input Validation Engine
 * Enforces RBI, UIDAI, TRAI, and OWASP boundary validation standards
 * across both client-side UI and server-side Fastify controllers.
 */

// 1. Regex Specifications
export const IndianMobileRegex = /^[6-9]\d{9}$/;
export const IndianPanRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
export const IndianPincodeRegex = /^[1-9][0-9]{5}$/;
export const StrictEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const LegalNameRegex = /^[a-zA-Z\s.'-]+$/;
export const UsernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
export const PasswordPolicyRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_-])[A-Za-z\d@$!%*?&#^()_-]{8,128}$/;
export const AadhaarMaskRegex = /^XXXX-XXXX-\d{4}$/;
export const AadhaarStrictRegex = /^(\d{12}|[X\d]{4}-[X\d]{4}-\d{4})$/;
export const BranchCodeRegex = /^\d{4}$/; // Single branch code: 2020

// 2. Client-Side Keystroke & Input Sanitizers
export function sanitizeDigits(input: string, maxLen?: number): string {
  const digits = (input || '').replace(/\D/g, '');
  return typeof maxLen === 'number' ? digits.slice(0, maxLen) : digits;
}

export function sanitizePhoneInput(input: string): string {
  return sanitizeDigits(input, 10);
}

export function sanitizeUsername(input: string): string {
  return (input || '').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 30);
}

export function sanitizeLegalName(input: string): string {
  // Strip any HTML tags completely, then preserve legitimate name characters (letters, spaces, dots, single quotes, hyphens)
  const noTags = (input || '').replace(/<[^>]*>?/gm, '');
  return noTags.replace(/[^a-zA-Z\s.'-]/g, '').slice(0, 70);
}

// 3. Predicate Validators
export function isValidMobile(phone: string): boolean {
  return IndianMobileRegex.test((phone || '').trim());
}

export function isValidEmail(email: string): boolean {
  const trimmed = (email || '').trim();
  return trimmed.length >= 5 && trimmed.length <= 254 && StrictEmailRegex.test(trimmed);
}

export function isValidLegalName(name: string): boolean {
  const trimmed = (name || '').trim();
  return trimmed.length >= 2 && trimmed.length <= 70 && LegalNameRegex.test(trimmed);
}

export function isValidUsername(username: string): boolean {
  const trimmed = (username || '').trim();
  return trimmed.length >= 3 && trimmed.length <= 30 && UsernameRegex.test(trimmed);
}

export function isValidAadhaarInput(val: string): boolean {
  return AadhaarStrictRegex.test((val || '').trim());
}

/**
 * Pure-Numeric Employee Numbering Engine
 * Branch code: 2020
 * First 10 numbers reserved (202000 to 202009)
 * First assigned employee number: 202010
 * Monotonic sequence: 202011, 202012, etc. (no characters, no hyphens, no spaces)
 */
export function generateNextEmployeeNumber(
  existingNumbers: Array<string | undefined | null>,
  branchCode: string = '2020'
): string {
  const branch = /^\d+$/.test(branchCode) ? branchCode : '2020';
  const minEmp = parseInt(`${branch}10`, 10); // 202010
  let maxNum = minEmp - 1; // 202009

  for (const num of existingNumbers) {
    if (!num) continue;
    const digits = num.replace(/\D/g, '');
    const parsed = parseInt(digits, 10);
    if (!isNaN(parsed) && digits.startsWith(branch) && parsed >= minEmp) {
      if (parsed > maxNum) {
        maxNum = parsed;
      }
    }
  }

  return String(maxNum + 1);
}
