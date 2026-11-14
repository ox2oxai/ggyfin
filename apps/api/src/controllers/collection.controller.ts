import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { CollectionRepository } from '../repositories/collection.repo.js';
import { AccountRepository } from '../repositories/account.repo.js';
import { CollectionService, CollectionValidationError } from '../services/collection.service.js';
import { AuditRepository } from '../repositories/audit.repo.js';
import { AuditService } from '../services/audit.service.js';
import {
  GenerateUpiQrSchema,
  LogCashReceiptSchema,
  VerifyCashReceiptSchema,
  ConfirmUpiPaymentSchema,
  ReceiptStatus,
  PaymentMode,
  TransactionType,
  UserRole,
  AuditAction
} from '@nbfc/shared';
import { requireRole } from '../middleware/auth.js';
import { NotificationService } from '../services/notification.service.js';

const collectionRepo = new CollectionRepository();
const accountRepo = new AccountRepository();
const collectionService = new CollectionService();
const auditRepo = new AuditRepository();
const auditService = new AuditService();
const notificationService = new NotificationService();

export async function collectionRoutes(fastify: FastifyInstance) {
  /**
   * Generates Dynamic NPCI UPI QR for Repayments
   */
  fastify.post(
    '/upi/qr',
    { preHandler: [fastify.authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parseResult = GenerateUpiQrSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          success: false,
          statusCode: 400,
          message: 'Invalid UPI QR request',
          errors: parseResult.error.flatten()
        });
      }

      const { accountId, amount } = parseResult.data;
      const accountRecord = await accountRepo.findById(accountId);
      if (!accountRecord) {
        return reply.status(404).send({ success: false, statusCode: 404, message: 'Account not found' });
      }

      const qrData = collectionService.generateRepaymentQr({
        accountId,
        accountNumber: accountRecord.account.accountNumber,
        amount
      });

      // Audit Log
      await auditRepo.append(
        auditService.prepareAuditEntry({
          userId: request.userSession!.userId,
          action: AuditAction.UPI_COLLECTION_INITIATED,
          entityType: 'ACCOUNT',
          entityId: accountId,
          ipAddress: request.ip,
          userAgent: request.headers['user-agent'],
          payloadAfter: { transactionRef: qrData.transactionRef, amount: qrData.amount }
        })
      );

      return reply.status(200).send({
        success: true,
        statusCode: 200,
        message: 'Dynamic UPI QR generated successfully',
        data: qrData
      });
    }
  );

  /**
   * Confirms Settled Inward UPI Repayment (NPCI UTR/RRN)
   */
  fastify.post(
    '/upi/confirm',
    {
      preHandler: [
        fastify.authenticate,
        requireRole(UserRole.BRANCH_MANAGER, UserRole.AUTHORIZER, UserRole.SYSTEM_ADMIN)
      ]
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parseResult = ConfirmUpiPaymentSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          success: false,
          statusCode: 400,
          message: 'Invalid UPI repayment confirmation payload',
          errors: parseResult.error.flatten()
        });
      }

      const input = parseResult.data;
      const accountRecord = await accountRepo.findById(input.accountId);
      if (!accountRecord) {
        return reply.status(404).send({ success: false, statusCode: 404, message: 'Account not found' });
      }

      try {
        const { transaction, newBalance } = await collectionRepo.recordCreditTransaction({
          accountId: input.accountId,
          txnRefNumber: input.utrNumber,
          amount: input.amount,
          txnType: TransactionType.CREDIT,
          mode: PaymentMode.UPI,
          notes: input.notes || `UPI repayment via UTR ${input.utrNumber}`
        });

        // Audit Log
        await auditRepo.append(
          auditService.prepareAuditEntry({
            userId: request.userSession!.userId,
            action: AuditAction.UPI_PAYMENT_CONFIRMED,
            entityType: 'ACCOUNT',
            entityId: input.accountId,
            ipAddress: request.ip,
            userAgent: request.headers['user-agent'],
            payloadAfter: {
              utrNumber: input.utrNumber,
              amount: input.amount,
              newBalance
            }
          })
        );

        // Automated Notification
        if (accountRecord.customer?.phone) {
          await notificationService.notifyRepaymentReceived({
            phone: accountRecord.customer.phone,
            accountNumber: accountRecord.account.accountNumber,
            amount: input.amount,
            balance: newBalance,
            ref: input.utrNumber
          }).catch((e) => fastify.log.warn(`Repayment notification failed: ${e.message}`));
        }

        return reply.status(200).send({
          success: true,
          statusCode: 200,
          message: 'UPI repayment credited to loan account successfully',
          data: {
            transaction,
            newBalance
          }
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to record UPI payment';
        return reply.status(400).send({
          success: false,
          statusCode: 400,
          message
        });
      }
    }
  );

  /**
   * Field Officer: Log Inward Cash Collection
   */
  fastify.post(
    '/cash/receipt',
    {
      preHandler: [
        fastify.authenticate,
        requireRole(UserRole.FIELD_OFFICER, UserRole.BRANCH_MANAGER)
      ]
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parseResult = LogCashReceiptSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          success: false,
          statusCode: 400,
          message: 'Invalid cash collection payload',
          errors: parseResult.error.flatten()
        });
      }

      const input = parseResult.data;
      const user = request.userSession!;

      const receipt = await collectionRepo.logCashReceipt({
        accountId: input.accountId,
        amount: input.amount,
        collectedByUserId: user.userId,
        receiptNumber: input.receiptNumber,
        notes: input.notes
      });

      // Audit Log
      await auditRepo.append(
        auditService.prepareAuditEntry({
          userId: user.userId,
          action: AuditAction.CASH_COLLECTION_LOGGED,
          entityType: 'CASH_RECEIPT',
          entityId: receipt.id,
          ipAddress: request.ip,
          userAgent: request.headers['user-agent'],
          payloadAfter: { receiptNumber: receipt.receiptNumber, amount: receipt.amount }
        })
      );

      // Automated Field Collection SMS & WhatsApp Notification
      const accountRecord = await accountRepo.findById(input.accountId);
      if (accountRecord?.customer?.phone) {
        await notificationService.notifyCashReceiptIssued({
          phone: accountRecord.customer.phone,
          receiptNumber: receipt.receiptNumber,
          amount: Number(receipt.amount),
          agentName: user.username
        }).catch((e) => fastify.log.warn(`Notification dispatch failed: ${e.message}`));
      }

      return reply.status(201).send({
        success: true,
        statusCode: 201,
        message: 'Cash collection logged and submitted for dual-control branch deposit verification',
        data: receipt
      });
    }
  );

  /**
   * Branch Manager: View Pending Cash Receipts to be deposited
   */
  fastify.get(
    '/cash/pending',
    {
      preHandler: [
        fastify.authenticate,
        requireRole(UserRole.BRANCH_MANAGER, UserRole.AUTHORIZER)
      ]
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      const pendingReceipts = await collectionRepo.listPendingCashReceipts();
      return reply.status(200).send({
        success: true,
        statusCode: 200,
        data: pendingReceipts
      });
    }
  );

  /**
   * Branch Manager / Authorizer: Verify & Close Cash Deposit
   */
  fastify.post<{ Params: { receiptId: string } }>(
    '/cash/:receiptId/verify',
    {
      preHandler: [
        fastify.authenticate,
        requireRole(UserRole.BRANCH_MANAGER, UserRole.AUTHORIZER)
      ]
    },
    async (request, reply) => {
      const parseResult = VerifyCashReceiptSchema.safeParse({
        receiptId: request.params.receiptId,
        ...(request.body as object)
      });

      if (!parseResult.success) {
        return reply.status(400).send({
          success: false,
          statusCode: 400,
          message: 'Verification payload invalid',
          errors: parseResult.error.flatten()
        });
      }

      const { receiptId, status, notes } = parseResult.data;
      const receipt = await collectionRepo.findCashReceiptById(receiptId);
      if (!receipt) {
        return reply.status(404).send({ success: false, statusCode: 404, message: 'Receipt not found' });
      }

      const verifierUserId = request.userSession!.userId;

      try {
        // Enforce dual-control & atomic credit inside a single ACID transaction with row-level locks
        const { receipt, transaction, newBalance } = await collectionRepo.verifyCashReceiptWithCredit({
          receiptId,
          verifiedByUserId: verifierUserId,
          status,
          notes
        });

        if (transaction) {
          // Automated Repayment Confirmation SMS & WhatsApp
          const accountRecord = await accountRepo.findById(receipt.accountId);
          if (accountRecord?.customer?.phone) {
            await notificationService.notifyRepaymentReceived({
              phone: accountRecord.customer.phone,
              accountNumber: accountRecord.account.accountNumber || 'GGY-LOAN',
              amount: Number(receipt.amount),
              balance: Number(transaction.balanceAfter),
              ref: transaction.txnRefNumber
            }).catch((e) => fastify.log.warn(`Repayment notification failed: ${e.message}`));
          }
        }

        // Audit Log
        await auditRepo.append(
          auditService.prepareAuditEntry({
            userId: verifierUserId,
            action: AuditAction.CASH_RECEIPT_VERIFIED,
            entityType: 'CASH_RECEIPT',
            entityId: receipt.id,
            ipAddress: request.ip,
            userAgent: request.headers['user-agent'],
            payloadAfter: { status, receiptNumber: receipt.receiptNumber, newBalance }
          })
        );

        return reply.status(200).send({
          success: true,
          statusCode: 200,
          message: 'Cash receipt verified and account balance credited under dual control',
          data: {
            receipt,
            transaction
          }
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Cash verification failed';
        return reply.status(403).send({
          success: false,
          statusCode: 403,
          message
        });
      }
    }
  );
}
