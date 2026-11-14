import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateEMI, LoanPurpose } from './loan.dto.js';
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
});
