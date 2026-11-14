import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { KycRepository } from '../repositories/kyc.repo.js';
import { KycVaultService } from '../services/kyc-vault.service.js';
import { AuditRepository } from '../repositories/audit.repo.js';
import { AuditService } from '../services/audit.service.js';
import { KycDocType, KycStatus, UserRole, AuditAction, UploadKycMetadataSchema } from '@nbfc/shared';
import { requireRole } from '../middleware/auth.js';
import { getStorageAdapter } from '../services/storage/storage.factory.js';

const kycRepo = new KycRepository();
const vaultService = new KycVaultService();
const auditRepo = new AuditRepository();
const auditService = new AuditService();
const storageAdapter = getStorageAdapter();

export async function kycRoutes(fastify: FastifyInstance) {

  /**
   * Upload KYC Document with AES-256-GCM Envelope Encryption
   */
  fastify.post(
    '/upload',
    {
      preHandler: [
        fastify.authenticate,
        requireRole(UserRole.FIELD_OFFICER, UserRole.BRANCH_MANAGER)
      ]
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const data = await request.file();
      if (!data) {
        return reply.status(400).send({
          success: false,
          statusCode: 400,
          message: 'No file uploaded'
        });
      }

      const buffer = await data.toBuffer();
      const fields = data.fields as Record<string, { value: string }>;

      const metadataValidation = UploadKycMetadataSchema.safeParse({
        customerId: fields.customerId?.value,
        docType: fields.docType?.value as KycDocType,
        identifier: fields.identifier?.value
      });

      if (!metadataValidation.success) {
        return reply.status(400).send({
          success: false,
          statusCode: 400,
          message: 'KYC metadata validation failed',
          errors: metadataValidation.error.flatten()
        });
      }

      const { customerId, docType, identifier } = metadataValidation.data;

      // 1. Encrypt document buffer using AES-256-GCM envelope encryption
      const encrypted = vaultService.encrypt(buffer);

      // 2. Persist encrypted payload to vault storage (format: IV (12b) + AuthTag (16b) + Ciphertext)
      const storageKey = `kyc_${customerId}_${docType}_${Date.now()}.enc`;
      const compositeBuffer = Buffer.concat([
        Buffer.from(encrypted.ivHex, 'hex'),
        Buffer.from(encrypted.authTagHex, 'hex'),
        encrypted.cipherBuffer
      ]);

      await storageAdapter.putObject(storageKey, compositeBuffer, { contentType: 'application/octet-stream' });

      // 3. Save document record
      const kycDoc = await kycRepo.save({
        customerId,
        docType,
        maskedIdentifier: identifier,
        storagePath: storageKey,
        encryptionAlgorithm: encrypted.algorithm,
        status: KycStatus.PENDING
      });

      // 4. Audit Log
      await auditRepo.append(
        auditService.prepareAuditEntry({
          userId: request.userSession!.userId,
          action: AuditAction.KYC_UPLOADED,
          entityType: 'KYC_DOCUMENT',
          entityId: kycDoc.id,
          ipAddress: request.ip,
          userAgent: request.headers['user-agent'],
          payloadAfter: { docType, maskedIdentifier: identifier }
        })
      );

      return reply.status(201).send({
        success: true,
        statusCode: 201,
        message: 'KYC document securely encrypted and stored in vault',
        data: {
          id: kycDoc.id,
          docType: kycDoc.docType,
          maskedIdentifier: kycDoc.maskedIdentifier,
          status: kycDoc.status
        }
      });
    }
  );

  /**
   * Generates a 60-Second Ephemeral View Token for Checkers
   */
  fastify.get<{ Params: { docId: string } }>(
    '/:docId/view-token',
    {
      preHandler: [
        fastify.authenticate,
        requireRole(UserRole.AUTHORIZER, UserRole.BRANCH_MANAGER)
      ]
    },
    async (request, reply) => {
      const doc = await kycRepo.findById(request.params.docId);
      if (!doc) {
        return reply.status(404).send({
          success: false,
          statusCode: 404,
          message: 'KYC document not found'
        });
      }

      const token = vaultService.generateEphemeralViewToken(doc.id, request.userSession!.userId, 60);

      // Audit View Token Generation
      await auditRepo.append(
        auditService.prepareAuditEntry({
          userId: request.userSession!.userId,
          action: AuditAction.KYC_VIEWED,
          entityType: 'KYC_DOCUMENT',
          entityId: doc.id,
          ipAddress: request.ip,
          userAgent: request.headers['user-agent']
        })
      );

      return reply.status(200).send({
        success: true,
        statusCode: 200,
        data: {
          docId: doc.id,
          viewUrl: `/api/v1/kyc/view/${token}`,
          expiresInSeconds: 60
        }
      });
    }
  );

  /**
   * Streams the Decrypted Document using the Ephemeral Token
   */
  fastify.get<{ Params: { token: string } }>(
    '/view/:token',
    async (request, reply) => {
      try {
        const payload = vaultService.verifyEphemeralViewToken(request.params.token);
        const doc = await kycRepo.findById(payload.docId);
        if (!doc) {
          return reply.status(404).send({ success: false, message: 'Document not found' });
        }

        const rawBuffer = await storageAdapter.getObject(doc.storagePath);

        // Extract IV (first 12 bytes), AuthTag (next 16 bytes), and CipherBuffer (remainder)
        const ivHex = rawBuffer.subarray(0, 12).toString('hex');
        const authTagHex = rawBuffer.subarray(12, 28).toString('hex');
        const cipherBuffer = rawBuffer.subarray(28);

        const decryptedBuffer = vaultService.decrypt(cipherBuffer, ivHex, authTagHex);

        reply.header('Content-Type', 'image/jpeg'); // Default stream type
        reply.header('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        return reply.send(decryptedBuffer);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Invalid or expired view token';
        return reply.status(403).send({
          success: false,
          statusCode: 403,
          message
        });
      }
    }
  );
}
