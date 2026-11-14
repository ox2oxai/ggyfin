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
