import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateEMI,
  LoanPurpose,
  generateAmortizationSchedule,
  generateKeyFactStatement,
  calculateNextDueDate
} from './loan.dto.js';
import { CreateCustomerSchema, AadhaarMaskRegex } from './customer.dto.js';
import { UploadKycMetadataSchema, KycDocType } from './kyc.dto.js';
import { generateUpiUri } from './payment.dto.js';

describe('Shared Financial & Validation Engine', () => {
  describe('calculateEMI (Reducing Balance Formula)', () => {
    it('correctly calculates EMI for ₹1,00,000 at 12% p.a. for 12 months', () => {
      // Standard banking amortization result for ₹1,00,000 @ 12% for 1 year is ~₹8,884.88
      const emi = calculateEMI(100000, 12, 12);
      assert.equal(emi, 8884.88);
    });

    it('correctly calculates EMI for ₹50,000 at 15% p.a. for 24 months', () => {
      const emi = calculateEMI(50000, 15, 24);
      assert.equal(emi, 2424.33);
    });

    it('handles zero interest gracefully as simple division', () => {
      const emi = calculateEMI(12000, 0, 12);
      assert.equal(emi, 1000);
    });
  });

  describe('Customer Data & Aadhaar Masking Validation', () => {
    it('accepts compliant masked Aadhaar (XXXX-XXXX-1234)', () => {
      assert.equal(AadhaarMaskRegex.test('XXXX-XXXX-5678'), true);
      assert.equal(AadhaarMaskRegex.test('XXXX-XXXX-0001'), true);
    });

    it('rejects unmasked 12-digit Aadhaar numbers', () => {
      assert.equal(AadhaarMaskRegex.test('123456789012'), false);
      assert.equal(AadhaarMaskRegex.test('1234 5678 9012'), false);
    });

    it('validates a complete, compliant Indian customer profile with DPDP consent', () => {
      const result = CreateCustomerSchema.safeParse({
        fullName: 'Ramesh Patel',
        phone: '9876543210',
        dob: '1985-05-15',
        gender: 'MALE',
        addressLine: 'House No. 12, Gram Panchayat Road, Taluka Karjat',
        pincode: '410201',
        state: 'Maharashtra',
        consentGranted: true
      });
      assert.equal(result.success, true);
    });

    it('rejects customer creation if DPDP explicit consent is not true', () => {
      const result = CreateCustomerSchema.safeParse({
        fullName: 'Ramesh Patel',
        phone: '9876543210',
        dob: '1985-05-15',
        gender: 'MALE',
        addressLine: 'House No. 12, Gram Panchayat Road',
        pincode: '410201',
        state: 'Maharashtra',
        consentGranted: false
      });
      assert.equal(result.success, false);
    });
  });

  describe('KYC Metadata UIDAI Compliance', () => {
    it('rejects unmasked Aadhaar identifier in KYC upload', () => {
      const result = UploadKycMetadataSchema.safeParse({
        customerId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        docType: KycDocType.AADHAAR,
        identifier: '987654321098' // Unmasked plain Aadhaar
      });
      assert.equal(result.success, false);
    });

    it('accepts masked Aadhaar identifier in KYC upload', () => {
      const result = UploadKycMetadataSchema.safeParse({
        customerId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        docType: KycDocType.AADHAAR,
        identifier: 'XXXX-XXXX-9876'
      });
      assert.equal(result.success, true);
    });
  });

  describe('NPCI UPI URI Generator', () => {
    it('generates valid upi://pay URI for borrower repayment', () => {
      const uri = generateUpiUri({
        vpa: 'ggycollect@icici',
        payeeName: 'GGY Finance',
        amount: 4650.00,
        transactionRef: 'TXN987654321',
        accountNumber: 'ACC00123'
      });
      assert.match(uri, /^upi:\/\/pay\?/);
      assert.match(uri, /pa=ggycollect%40icici/);
      assert.match(uri, /am=4650\.00/);
      assert.match(uri, /tr=TXN987654321/);
    });
  });

  describe('RBI Key Fact Statement (KFS) & Amortization Schedule', () => {
    it('generates exact 12-month amortization schedule with zero residual balance', () => {
      const schedule = generateAmortizationSchedule(100000, 12, 12, new Date('2026-01-15'), 5);
      assert.equal(schedule.length, 12);

      // First month
      assert.equal(schedule[0].installmentNumber, 1);
      assert.equal(schedule[0].openingBalance, 100000);
      assert.equal(schedule[0].interestComponent, 1000); // 1% of 100,000
      assert.equal(schedule[0].emiAmount, 8884.88);

      // Final month: closing balance must be strictly 0.00
      const lastMonth = schedule[11];
      assert.equal(lastMonth.installmentNumber, 12);
      assert.equal(lastMonth.closingBalance, 0);

      // Sum of all principal components must equal original principal (100,000)
      const totalPrincipal = Math.round(schedule.reduce((sum, s) => sum + s.principalComponent, 0));
      assert.equal(totalPrincipal, 100000);
    });

    it('handles month-end due date rollover correctly (e.g. 31st to Feb 28)', () => {
      // Due date on the 31st
      const febDueDate = calculateNextDueDate(new Date('2026-01-31'), 1, 31);
      // In 2026 (non-leap year), February has 28 days -> clamped to 2026-02-28
      assert.equal(febDueDate, '2026-02-28');

      // In 2028 (leap year), February has 29 days -> clamped to 2028-02-29
      const leapFebDueDate = calculateNextDueDate(new Date('2028-01-31'), 1, 31);
      assert.equal(leapFebDueDate, '2028-02-29');

      // Month after February (March has 31 days) -> returns 2026-03-31
      const marchDueDate = calculateNextDueDate(new Date('2026-01-31'), 2, 31);
      assert.equal(marchDueDate, '2026-03-31');
    });

    it('generates compliant RBI Key Fact Statement (KFS) with APR and processing fee', () => {
      const kfs = generateKeyFactStatement(50000, 15, 12);
      assert.equal(kfs.loanAmount, 50000);
      assert.equal(kfs.annualInterestRate, 15);
      assert.equal(kfs.tenureMonths, 12);
      assert.equal(kfs.monthlyEmi, 4512.92);
      // Processing fee: 1.5% of 50,000 = 750 + 18% GST = 885
      assert.equal(kfs.processingFee, 885);
      assert.ok(kfs.totalCostOfCredit > 0);
      assert.equal(kfs.annualPercentageRate, 10.08);
      assert.equal(kfs.schedule.length, 12);
    });
  });
});
