import { IStorageAdapter, StoragePutOptions } from './storage.interface.js';
import crypto from 'node:crypto';

export interface S3AdapterConfig {
  bucket: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  endpoint?: string; // Optional custom endpoint for Cloudflare R2, MinIO, or Supabase
}

export class S3StorageAdapter implements IStorageAdapter {
  public readonly driverName = 's3' as const;
  private bucket: string;
  private region: string;
  private accessKeyId: string;
  private secretAccessKey: string;
  private endpoint: string;

  constructor(config?: Partial<S3AdapterConfig>) {
    this.bucket = config?.bucket || process.env.S3_BUCKET_NAME || 'ggy-finance-kyc-vault';
    this.region = config?.region || process.env.S3_REGION || 'ap-south-1'; // Default: AWS Mumbai
    this.accessKeyId = config?.accessKeyId || process.env.AWS_ACCESS_KEY_ID || 'MOCK_KEY';
    this.secretAccessKey = config?.secretAccessKey || process.env.AWS_SECRET_ACCESS_KEY || 'MOCK_SECRET';
    this.endpoint = config?.endpoint || process.env.S3_ENDPOINT || `https://${this.bucket}.s3.${this.region}.amazonaws.com`;
  }

  /**
   * Computes AWS Signature Version 4 HMAC key derivation
   */
  private getSignatureKey(key: string, dateStamp: string, regionName: string, serviceName: string): Buffer {
    const kDate = crypto.createHmac('sha256', `AWS4${key}`).update(dateStamp).digest();
    const kRegion = crypto.createHmac('sha256', kDate).update(regionName).digest();
    const kService = crypto.createHmac('sha256', kRegion).update(serviceName).digest();
    return crypto.createHmac('sha256', kService).update('aws4_request').digest();
  }

  /**
   * Signs and executes an authenticated S3 REST API call
   */
  public buildSignedHeaders(
    method: 'PUT' | 'GET' | 'HEAD' | 'DELETE',
    pathKey: string,
    payloadHash: string,
    contentType?: string
  ): Record<string, string> {
    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
    const dateStamp = amzDate.substring(0, 8);

    const host = new URL(this.endpoint).host;
    const canonicalUri = `/${pathKey.replace(/^\/+/, '')}`;

    const headers: Record<string, string> = {
      host,
      'x-amz-date': amzDate,
      'x-amz-content-sha256': payloadHash
    };
    if (contentType) {
      headers['content-type'] = contentType;
    }

    const sortedHeaderKeys = Object.keys(headers).sort();
    const canonicalHeaders = sortedHeaderKeys.map((k) => `${k}:${headers[k]}\n`).join('');
    const signedHeaders = sortedHeaderKeys.join(';');

    const canonicalRequest = [
      method,
      canonicalUri,
      '', // query string
      canonicalHeaders,
      signedHeaders,
      payloadHash
    ].join('\n');

    const credentialScope = `${dateStamp}/${this.region}/s3/aws4_request`;
    const stringToSign = [
      'AWS4-HMAC-SHA256',
      amzDate,
      credentialScope,
      crypto.createHash('sha256').update(canonicalRequest).digest('hex')
    ].join('\n');

    const signingKey = this.getSignatureKey(this.secretAccessKey, dateStamp, this.region, 's3');
    const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex');

    const authorization = `AWS4-HMAC-SHA256 Credential=${this.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    return {
      ...headers,
      Authorization: authorization
    };
  }

  public async putObject(key: string, data: Buffer, options?: StoragePutOptions): Promise<string> {
    const sanitizedKey = key.replace(/^\/+/, '');
    const payloadHash = crypto.createHash('sha256').update(data).digest('hex');
    const headers = this.buildSignedHeaders('PUT', sanitizedKey, payloadHash, options?.contentType || 'application/octet-stream');

    const targetUrl = `${this.endpoint.replace(/\/+$/, '')}/${sanitizedKey}`;

    // For testing and local mock without live network
    if (this.accessKeyId === 'MOCK_KEY') {
      return `s3://${this.bucket}/${sanitizedKey}`;
    }

    const response = await fetch(targetUrl, {
      method: 'PUT',
      headers,
      body: new Uint8Array(data)
    });

    if (!response.ok) {
      throw new Error(`S3 PutObject failed [${response.status}]: ${await response.text()}`);
    }

    return `s3://${this.bucket}/${sanitizedKey}`;
  }

  public async getObject(key: string): Promise<Buffer> {
    const sanitizedKey = key.replace(/^\/+/, '').replace(/^s3:\/\/[^/]+\//, '');
    const emptyPayloadHash = crypto.createHash('sha256').update('').digest('hex');
    const headers = this.buildSignedHeaders('GET', sanitizedKey, emptyPayloadHash);

    const targetUrl = `${this.endpoint.replace(/\/+$/, '')}/${sanitizedKey}`;

    if (this.accessKeyId === 'MOCK_KEY') {
      // Mock fallback
      return Buffer.from('MOCK_S3_PAYLOAD');
    }

    const response = await fetch(targetUrl, { method: 'GET', headers });
    if (!response.ok) {
      throw new Error(`S3 GetObject failed [${response.status}]: ${await response.text()}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  public async deleteObject(key: string): Promise<boolean> {
    const sanitizedKey = key.replace(/^\/+/, '').replace(/^s3:\/\/[^/]+\//, '');
    const emptyPayloadHash = crypto.createHash('sha256').update('').digest('hex');
    const headers = this.buildSignedHeaders('DELETE', sanitizedKey, emptyPayloadHash);

    const targetUrl = `${this.endpoint.replace(/\/+$/, '')}/${sanitizedKey}`;

    if (this.accessKeyId === 'MOCK_KEY') return true;

    try {
      const response = await fetch(targetUrl, { method: 'DELETE', headers });
      return response.ok;
    } catch {
      return false;
    }
  }

  public async hasObject(key: string): Promise<boolean> {
    const sanitizedKey = key.replace(/^\/+/, '').replace(/^s3:\/\/[^/]+\//, '');
    const emptyPayloadHash = crypto.createHash('sha256').update('').digest('hex');
    const headers = this.buildSignedHeaders('HEAD', sanitizedKey, emptyPayloadHash);

    const targetUrl = `${this.endpoint.replace(/\/+$/, '')}/${sanitizedKey}`;

    if (this.accessKeyId === 'MOCK_KEY') return true;

    try {
      const response = await fetch(targetUrl, { method: 'HEAD', headers });
      return response.ok;
    } catch {
      return false;
    }
  }
}
