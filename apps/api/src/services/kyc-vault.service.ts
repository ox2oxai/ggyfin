import crypto from 'node:crypto';

export interface EncryptedPayload {
  cipherBuffer: Buffer;
  ivHex: string;
  authTagHex: string;
  algorithm: string;
}

export interface EphemeralTokenPayload {
  docId: string;
  userId: string;
  expiresAt: number;
}

export class KycVaultService {
  private readonly algorithm = 'aes-256-gcm';
  private masterKey: Buffer;

  constructor(masterKeyHex?: string) {
    let keyHex = masterKeyHex || process.env.KYC_MASTER_KEY;
    if (!keyHex) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('SECURITY CRITICAL: KYC_MASTER_KEY environment variable is mandatory in production.');
      }
      keyHex = 'c39121a8eb83794d0e527d7f7e914bb491a61c3f2d2b51614e56994ec81358a9';
    }
    this.masterKey = Buffer.from(keyHex, 'hex');
    if (this.masterKey.length !== 32) {
      throw new Error('KYC Master Key must be exactly 32 bytes (64 hex characters) for AES-256-GCM.');
    }
  }

  /**
   * Encrypts a document buffer using AES-256-GCM envelope encryption.
   * A fresh 12-byte IV is generated for every document.
   */
  public encrypt(plainBuffer: Buffer): EncryptedPayload {
    const iv = crypto.randomBytes(12); // 12-byte IV recommended for GCM
    const cipher = crypto.createCipheriv(this.algorithm, this.masterKey, iv);

    const encrypted = Buffer.concat([cipher.update(plainBuffer), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return {
      cipherBuffer: encrypted,
      ivHex: iv.toString('hex'),
      authTagHex: authTag.toString('hex'),
      algorithm: 'AES-256-GCM'
    };
  }

  /**
   * Decrypts an encrypted document payload using AES-256-GCM.
   * Guarantees tamper detection via the GCM authentication tag.
   */
  public decrypt(cipherBuffer: Buffer, ivHex: string, authTagHex: string): Buffer {
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(this.algorithm, this.masterKey, iv);
    decipher.setAuthTag(authTag);

    return Buffer.concat([decipher.update(cipherBuffer), decipher.final()]);
  }

  /**
   * Generates a signed, ephemeral 60-second view token for Checkers to inspect documents safely.
   */
  public generateEphemeralViewToken(docId: string, userId: string, ttlSeconds = 60): string {
    const expiresAt = Math.floor(Date.now() / 1000) + ttlSeconds;
    const payload: EphemeralTokenPayload = { docId, userId, expiresAt };
    const dataString = JSON.stringify(payload);
    const signature = crypto
      .createHmac('sha256', this.masterKey)
      .update(dataString)
      .digest('hex');

    return Buffer.from(JSON.stringify({ payload, signature })).toString('base64url');
  }

  /**
   * Validates an ephemeral view token. Rejects expired tokens or invalid signatures.
   */
  public verifyEphemeralViewToken(token: string): EphemeralTokenPayload {
    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64url').toString('utf-8'));
      const { payload, signature } = decoded;
      const dataString = JSON.stringify(payload);

      const expectedSignature = crypto
        .createHmac('sha256', this.masterKey)
        .update(dataString)
        .digest('hex');

      if (!crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expectedSignature, 'hex'))) {
        throw new Error('Invalid token signature');
      }

      const now = Math.floor(Date.now() / 1000);
      if (payload.expiresAt < now) {
        throw new Error('Ephemeral view token has expired (strictly 60-second window)');
      }

      return payload;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid view token';
      throw new Error(`Token verification failed: ${message}`);
    }
  }
}
