import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  generateCustomerId,
  generateCBSAccountNumber,
  verifyCBSAccountNumber,
  calculateMod11CheckDigit,
  CBS_DEFAULT_BRANCHES,
  CBS_DEFAULT_SCHEMES
} from './cbs-account.js';
import {
  generateNextEmployeeNumber,
  isValidMobile,
  isValidEmail,
  isValidLegalName,
  isValidUsername,
  sanitizePhoneInput,
  sanitizeLegalName
} from './validation.js';

describe('Pure-Numeric Employee Numbering & Validation Engine', () => {
  it('generates strictly numeric employee numbers starting at 202010 with zero characters', () => {
    // When no employees exist, first is 202010
    const first = generateNextEmployeeNumber([], '2020');
    assert.equal(first, '202010');
    assert.match(first, /^\d+$/);
    assert.equal(first.includes('-'), false);
    assert.equal(first.includes(' '), false);

    // Sequential progression
    const second = generateNextEmployeeNumber(['202010'], '2020');
    assert.equal(second, '202011');

    // Handles gaps and deprovisioning monotonically
    const third = generateNextEmployeeNumber(['202010', '202011', '202015'], '2020');
    assert.equal(third, '202016');
  });

  it('validates Indian mobile numbers strictly (10 digits starting with 6-9)', () => {
    assert.equal(isValidMobile('9845012345'), true);
    assert.equal(isValidMobile('6361234567'), true);
    assert.equal(isValidMobile('7890123456'), true);
    assert.equal(isValidMobile('8901234567'), true);

    // Invalid mobile numbers
    assert.equal(isValidMobile('5845012345'), false); // starts with 5
    assert.equal(isValidMobile('984501234'), false); // 9 digits
    assert.equal(isValidMobile('98450123456'), false); // 11 digits
    assert.equal(isValidMobile('9845abc345'), false); // contains letters
    assert.equal(isValidMobile(''), false);
  });

  it('validates email addresses per RFC 5322 and length bounds', () => {
    assert.equal(isValidEmail('it.admin@ggyfinance.in'), true);
    assert.equal(isValidEmail('praveen.kumar@domain.co.in'), true);

    // Invalid emails
    assert.equal(isValidEmail('invalid-email'), false);
    assert.equal(isValidEmail('@nodomain.com'), false);
    assert.equal(isValidEmail('user@'), false);
  });

  it('validates legal names and sanitizes script/HTML injection vectors', () => {
    assert.equal(isValidLegalName('Praveen Kumar'), true);
    assert.equal(isValidLegalName("D'Souza"), true);
    assert.equal(isValidLegalName('Smt. Renukamma'), true);

    // Disallowed names with script tags or symbols
    assert.equal(isValidLegalName('<script>alert(1)</script>'), false);
    assert.equal(isValidLegalName('User@123!'), false);

    // Sanitizer removes malicious tags
    assert.equal(sanitizeLegalName('<script>alert(1)</script>Praveen'), 'alertPraveen');
    assert.equal(sanitizePhoneInput('+91-9845-012-345'), '9198450123');
  });
});

describe('Core Banking System (CBS) Account & Customer ID Engine', () => {
  it('generates a compliant 10-digit Customer ID (CIF) decoupled from account numbers', () => {
    const custId1 = generateCustomerId('1084', 1);
    assert.equal(custId1, '1084000001');
    assert.equal(custId1.length, 10);

    const custId42 = generateCustomerId('1084', 42);
    assert.equal(custId42, '1084000042');
  });

  it('generates a valid 16-digit Finacle/BaNCS compliant Core Banking Account Number', () => {
    const formatted = generateCBSAccountNumber('1084', '0101', '701', 42, true);
    // Format: 1084-0101-701-0042-X
    assert.match(formatted, /^1084-0101-701-0042-\d$/);

    const numeric = generateCBSAccountNumber('1084', '0101', '701', 42, false);
    assert.equal(numeric.length, 16);
    assert.match(numeric, /^108401017010042\d$/);
  });

  it('validates account numbers with embedded Mod-11 check digit', () => {
    const validFormatted = generateCBSAccountNumber('1084', '0102', '702', 105, true);
    assert.equal(verifyCBSAccountNumber(validFormatted), true);

    const validNumeric = generateCBSAccountNumber('1084', '0102', '702', 105, false);
    assert.equal(verifyCBSAccountNumber(validNumeric), true);

    // Tampered check digit should fail verification
    const tampered = validNumeric.slice(0, 15) + ((parseInt(validNumeric[15], 10) + 1) % 10);
    assert.equal(verifyCBSAccountNumber(tampered), false);
  });

  it('provides default branch SOL and scheme mapping for Karnataka NBFC operations', () => {
    assert.equal(CBS_DEFAULT_BRANCHES.length, 5);
    assert.equal(CBS_DEFAULT_BRANCHES[0].solId, '0101');
    assert.equal(CBS_DEFAULT_SCHEMES.length, 5);
    assert.equal(CBS_DEFAULT_SCHEMES.find(s => s.schemeCode === '702')?.name, 'Dairy Development Term Loan');
  });
});
