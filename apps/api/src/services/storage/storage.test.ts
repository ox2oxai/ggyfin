import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { LocalStorageAdapter } from './local-storage.adapter.js';
import { S3StorageAdapter } from './s3-storage.adapter.js';
import { getStorageAdapter } from './storage.factory.js';
import fs from 'node:fs/promises';
import path from 'node:path';

describe('Storage Adapters (Local & AWS S3 / Cloudflare R2)', () => {
  const testDir = path.resolve(process.cwd(), 'temp_test_storage');

  before(async () => {
    await fs.mkdir(testDir, { recursive: true });
  });

  after(async () => {
    await fs.rm(testDir, { recursive: true, force: true }).catch(() => {});
  });

  describe('LocalStorageAdapter', () => {
    const adapter = new LocalStorageAdapter(testDir);

    it('stores and retrieves binary data correctly', async () => {
      const data = Buffer.from('AES_ENCRYPTED_CIPHER_TEST_BYTES');
      const key = 'customers/c-123/aadhaar.enc';

      const savedPath = await adapter.putObject(key, data);
      assert.ok(savedPath);

      const exists = await adapter.hasObject(key);
      assert.equal(exists, true);

      const retrieved = await adapter.getObject(key);
      assert.deepEqual(retrieved, data);

      const deleted = await adapter.deleteObject(key);
      assert.equal(deleted, true);

      const existsAfter = await adapter.hasObject(key);
      assert.equal(existsAfter, false);
    });
  });

  describe('S3StorageAdapter (SigV4 Construction)', () => {
    const s3Adapter = new S3StorageAdapter({
      bucket: 'ggy-finance-kyc-vault',
      region: 'ap-south-1',
      accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
      secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
    });

    it('constructs valid AWS SigV4 authorization headers with ap-south-1 region scope', () => {
      const payloadHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
      const headers = s3Adapter.buildSignedHeaders('PUT', 'kyc/doc-01.enc', payloadHash, 'application/octet-stream');

      assert.ok(headers.Authorization);
      assert.match(headers.Authorization, /^AWS4-HMAC-SHA256 Credential=AKIAIOSFODNN7EXAMPLE\/\d{8}\/ap-south-1\/s3\/aws4_request/);
      assert.match(headers.Authorization, /SignedHeaders=/);
      assert.match(headers.Authorization, /Signature=[a-f0-9]{64}/);
      assert.equal(headers['x-amz-content-sha256'], payloadHash);
    });

    it('formats S3 object URI cleanly', async () => {
      const mockAdapter = new S3StorageAdapter(); // Uses MOCK_KEY
      const uri = await mockAdapter.putObject('customers/c-99/pan.enc', Buffer.from('test'));
      assert.equal(uri, 's3://ggy-finance-kyc-vault/customers/c-99/pan.enc');
    });
  });

  describe('StorageFactory', () => {
    it('defaults to LocalStorageAdapter for local environment', () => {
      delete process.env.STORAGE_DRIVER;
      delete process.env.S3_BUCKET_NAME;
      const adapter = getStorageAdapter();
      assert.equal(adapter.driverName, 'local');
    });
  });
});
