import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { KycVaultService } from './kyc-vault.service.js';
import { MakerCheckerService, MakerCheckerValidationError } from './maker-checker.service.js';
import { CollectionService, CollectionValidationError } from './collection.service.js';
import { AuditService } from './audit.service.js';
import { AccountStatus, AuditAction, ReceiptStatus } from '@nbfc/shared';

describe('NBFC Core Security & Business Logic Services', () => {
  describe('KycVaultService (AES-256-GCM Envelope Encryption)', () => {
    const vault = new KycVaultService();
    const mockDocumentContent = Buffer.from('CONFIDENTIAL_INDIAN_PAN_CARD_DATA_RAMESH_PATEL_ABCDE1234F');

    it('encrypts raw document into authenticated ciphertext', () => {
      const encrypted = vault.encrypt(mockDocumentContent);
      assert.notEqual(encrypted.cipherBuffer.toString(), mockDocumentContent.toString());
      assert.equal(encrypted.ivHex.length, 24); // 12 bytes = 24 hex characters
      assert.equal(encrypted.authTagHex.length, 32); // 16 bytes = 32 hex characters
      assert.equal(encrypted.algorithm, 'AES-256-GCM');
    });

    it('decrypts encrypted document byte-for-byte to original content', () => {
      const encrypted = vault.encrypt(mockDocumentContent);
      const decrypted = vault.decrypt(encrypted.cipherBuffer, encrypted.ivHex, encrypted.authTagHex);
      assert.equal(decrypted.toString(), mockDocumentContent.toString());
    });

    it('fails decryption and flags tampering if authentication tag is corrupted', () => {
      const encrypted = vault.encrypt(mockDocumentContent);
      const corruptedTag = encrypted.authTagHex.slice(0, -2) + '00';
      assert.throws(() => {
        vault.decrypt(encrypted.cipherBuffer, encrypted.ivHex, corruptedTag);
      }, /Unsupported state or unable to authenticate data/);
    });

    it('generates and verifies 60-second ephemeral view tokens for Checkers', () => {
      const docId = 'c0a80101-0000-0000-0000-000000000001';
      const checkerId = 'c0a80101-0000-0000-0000-000000000002';
      const token = vault.generateEphemeralViewToken(docId, checkerId, 60);

      const verified = vault.verifyEphemeralViewToken(token);
      assert.equal(verified.docId, docId);
      assert.equal(verified.userId, checkerId);
    });

    it('rejects expired ephemeral view tokens', () => {
      const docId = 'c0a80101-0000-0000-0000-000000000001';
      const checkerId = 'c0a80101-0000-0000-0000-000000000002';
      // Issue a token with -10 second TTL (already expired)
      const token = vault.generateEphemeralViewToken(docId, checkerId, -10);

      assert.throws(() => {
        vault.verifyEphemeralViewToken(token);
      }, /Token verification failed: Ephemeral view token has expired/);
    });
  });

  describe('MakerCheckerService (RBI Four-Eyes Principle)', () => {
    const mcService = new MakerCheckerService();
    const makerId = 'u-maker-001';
    const checkerId = 'u-checker-002';

    it('strictly forbids Maker from approving their own application', () => {
      assert.throws(() => {
        mcService.validateApproval({
          accountId: 'acc-001',
          currentStatus: AccountStatus.PENDING_APPROVAL,
          makerUserId: makerId,
          checkerUserId: makerId, // VIOLATION: Maker trying to approve themselves
          remarks: 'Looks good'
        });
      }, (err: Error) => {
        assert(err instanceof MakerCheckerValidationError);
        assert.match(err.message, /RBI Dual-Control Violation: Maker cannot approve their own application/);
        return true;
      });
    });

    it('rejects approval if application is not in PENDING_APPROVAL status', () => {
      assert.throws(() => {
        mcService.validateApproval({
          accountId: 'acc-001',
          currentStatus: AccountStatus.DRAFT, // Still in DRAFT
          makerUserId: makerId,
          checkerUserId: checkerId,
          remarks: 'Approved by checker'
        });
      }, (err: Error) => {
        assert(err instanceof MakerCheckerValidationError);
        assert.match(err.message, /Invalid State Transition/);
        return true;
      });
    });

    it('successfully approves and issues account number when Maker and Checker are distinct', () => {
      const result = mcService.validateApproval({
        accountId: 'acc-001',
        currentStatus: AccountStatus.PENDING_APPROVAL,
        makerUserId: makerId,
        checkerUserId: checkerId,
        remarks: 'KYC verified and approved by senior risk officer'
      });

      assert.equal(result.newStatus, AccountStatus.ACTIVE);
      assert.match(result.accountNumber, /^GGY-\d{4}-[A-Z0-9]{6}$/);
    });

    it('enforces dual-control when suspending an account', () => {
      assert.throws(() => {
        mcService.validateSuspension({
          accountId: 'acc-001',
          currentStatus: AccountStatus.ACTIVE,
          makerUserId: makerId,
          checkerUserId: makerId, // VIOLATION
          reason: 'Potential fraudulent KYC document'
        });
      }, (err: Error) => {
        assert(err instanceof MakerCheckerValidationError);
        assert.match(err.message, /RBI Dual-Control Violation/);
        return true;
      });

      const validResult = mcService.validateSuspension({
        accountId: 'acc-001',
        currentStatus: AccountStatus.ACTIVE,
        makerUserId: makerId,
        checkerUserId: checkerId,
        reason: 'Delinquency review hold'
      });
      assert.equal(validResult.newStatus, AccountStatus.SUSPENDED);
    });

    it('enforces dual-control when reactivating a suspended account', () => {
      const validResult = mcService.validateReactivation({
        accountId: 'acc-001',
        currentStatus: AccountStatus.SUSPENDED,
        makerUserId: makerId,
        checkerUserId: checkerId,
        reason: 'Borrower cleared compliance audit'
      });
      assert.equal(validResult.newStatus, AccountStatus.ACTIVE);
    });

    it('strictly forbids loan closure if balance > 0 (Zero-Balance Rule)', () => {
      assert.throws(() => {
        mcService.validateClosure({
          accountId: 'acc-001',
          currentStatus: AccountStatus.ACTIVE,
          currentBalance: 12500.50, // PENDING DUES!
          makerUserId: makerId,
          checkerUserId: checkerId,
          reason: 'Customer requested closure'
        });
      }, (err: Error) => {
        assert(err instanceof MakerCheckerValidationError);
        assert.match(err.message, /Cannot close loan with pending dues/);
        return true;
      });
    });

    it('successfully closes loan and generates NOC when balance is zero', () => {
      const result = mcService.validateClosure({
        accountId: 'acc-001',
        currentStatus: AccountStatus.ACTIVE,
        currentBalance: 0.00,
        makerUserId: makerId,
        checkerUserId: checkerId,
        reason: 'Final EMI paid in full. No dues pending.'
      });

      assert.equal(result.newStatus, AccountStatus.CLOSED);
      assert.match(result.nocNumber, /^NOC-GGY-\d{4}-[A-Z0-9]{6}$/);
    });
  });

  describe('CollectionService (UPI Repayment & Dual Cash Controls)', () => {
    const collectionService = new CollectionService();

    it('generates valid dynamic UPI repayment payload', () => {
      const result = collectionService.generateRepaymentQr({
        accountId: 'acc-123',
        accountNumber: 'GGY-2026-A1B2C3',
        amount: 3250.00
      });

      assert.equal(result.amount, 3250.00);
      assert.match(result.transactionRef, /^UPI\d{8}[A-Z0-9]{8}$/);
      assert.match(result.upiUri, /pa=ggycollect%40icici/);
      assert.match(result.upiUri, /am=3250\.00/);
    });

    it('enforces dual-control: field agent cannot verify their own cash collection', () => {
      const agentId = 'agent-001';
      assert.throws(() => {
        collectionService.validateCashReceiptVerification({
          collectedByUserId: agentId,
          verifiedByUserId: agentId, // VIOLATION
          currentStatus: ReceiptStatus.COLLECTED_PENDING_APPROVAL,
          newStatus: ReceiptStatus.VERIFIED_AND_DEPOSITED
        });
      }, (err: Error) => {
        assert(err instanceof CollectionValidationError);
        assert.match(err.message, /Dual-Control Cash Violation/);
        return true;
      });
    });

    it('allows manager to verify cash collected by field agent', () => {
      const agentId = 'agent-001';
      const managerId = 'manager-002';
      assert.doesNotThrow(() => {
        collectionService.validateCashReceiptVerification({
          collectedByUserId: agentId,
          verifiedByUserId: managerId,
          currentStatus: ReceiptStatus.COLLECTED_PENDING_APPROVAL,
          newStatus: ReceiptStatus.VERIFIED_AND_DEPOSITED
        });
      });
    });
  });

  describe('AuditService (Immutable Audit Logs)', () => {
    const auditService = new AuditService();

    it('prepares complete audit log entry conforming to DPDP Act 2023', () => {
      const entry = auditService.prepareAuditEntry({
        userId: 'u-user-001',
        action: AuditAction.LOAN_APPROVED,
        entityType: 'ACCOUNT',
        entityId: 'acc-123',
        ipAddress: '49.36.120.45',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        payloadBefore: { status: 'PENDING_APPROVAL' },
        payloadAfter: { status: 'ACTIVE', accountNumber: 'GGY-2026-987654' }
      });

      assert.equal(entry.action, AuditAction.LOAN_APPROVED);
      assert.equal(entry.ipAddress, '49.36.120.45');
      assert.deepEqual(entry.payloadBefore, { status: 'PENDING_APPROVAL' });
      assert.deepEqual(entry.payloadAfter, { status: 'ACTIVE', accountNumber: 'GGY-2026-987654' });
      assert.ok(entry.createdAt);
    });
  });
});
