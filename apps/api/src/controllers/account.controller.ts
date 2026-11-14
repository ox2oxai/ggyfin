import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { AccountRepository } from '../repositories/account.repo.js';
import { MakerCheckerService, MakerCheckerValidationError } from '../services/maker-checker.service.js';
import { AuditRepository } from '../repositories/audit.repo.js';
import { AuditService } from '../services/audit.service.js';
import {
  CreateLoanAccountSchema,
  ApproveAccountSchema,
  RejectAccountSchema,
  SuspendAccountSchema,
  ReactivateAccountSchema,
  CloseAccountSchema,
  AccountStatus,
  AccountType,
  UserRole,
  AuditAction,
  calculateEMI
} from '@nbfc/shared';
import { requireRole } from '../middleware/auth.js';
import { NotificationService } from '../services/notification.service.js';

const accountRepo = new AccountRepository();
const makerCheckerService = new MakerCheckerService();
const auditRepo = new AuditRepository();
const auditService = new AuditService();
const notificationService = new NotificationService();

export async function accountRoutes(fastify: FastifyInstance) {
  /**
   * Maker: Submit Loan Application
   */
  fastify.post(
    '/',
    {
      preHandler: [
        fastify.authenticate,
        requireRole(UserRole.FIELD_OFFICER, UserRole.BRANCH_MANAGER)
      ]
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parseResult = CreateLoanAccountSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          success: false,
          statusCode: 400,
          message: 'Loan application validation failed',
          errors: parseResult.error.flatten()
        });
      }

      const input = parseResult.data;
      const emiAmount = calculateEMI(input.principalAmount, input.interestRatePercent, input.tenureMonths);

      const account = await accountRepo.createLoanAccount({
        customerId: input.customerId,
        accountType: AccountType.LOAN,
        loanPurpose: input.loanPurpose,
        principalAmount: input.principalAmount,
        interestRatePercent: input.interestRatePercent,
        tenureMonths: input.tenureMonths,
        emiAmount
      });

      // Audit Log
      await auditRepo.append(
        auditService.prepareAuditEntry({
          userId: request.userSession!.userId,
          action: AuditAction.LOAN_APPLICATION_SUBMITTED,
          entityType: 'ACCOUNT',
          entityId: account.id,
          ipAddress: request.ip,
          userAgent: request.headers['user-agent'],
          payloadAfter: {
            principalAmount: input.principalAmount,
            emiAmount,
            status: AccountStatus.PENDING_APPROVAL
          }
        })
      );

      return reply.status(201).send({
        success: true,
        statusCode: 201,
        message: 'Loan application drafted and submitted for Maker-Checker review',
        data: account
      });
    }
  );

  /**
   * Checker: View Pending Approvals Queue
   */
  fastify.get<{ Querystring: { limit?: string; offset?: string } }>(
    '/pending',
    {
      preHandler: [
        fastify.authenticate,
        requireRole(UserRole.AUTHORIZER, UserRole.BRANCH_MANAGER)
      ]
    },
    async (request, reply) => {
      const limit = Number(request.query.limit) || 20;
      const offset = Number(request.query.offset) || 0;
      const pendingAccounts = await accountRepo.listPendingApprovals(limit, offset);

      return reply.status(200).send({
        success: true,
        statusCode: 200,
        data: pendingAccounts
      });
    }
  );

  /**
   * Fetch Single Account Details
   */
  fastify.get<{ Params: { id: string } }>(
    '/:id',
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const result = await accountRepo.findById(request.params.id);
      if (!result) {
        return reply.status(404).send({
          success: false,
          statusCode: 404,
          message: 'Account not found'
        });
      }

      return reply.status(200).send({
        success: true,
        statusCode: 200,
        data: result
      });
    }
  );

  /**
   * Checker: Approve Account (Strict Maker-Checker Enforcement)
   */
  fastify.post<{ Params: { id: string } }>(
    '/:id/approve',
    {
      preHandler: [
        fastify.authenticate,
        requireRole(UserRole.AUTHORIZER) // Sole authority: Authorizer
      ]
    },
    async (request, reply) => {
      const parseResult = ApproveAccountSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          success: false,
          statusCode: 400,
          message: 'Approval remarks are required',
          errors: parseResult.error.flatten()
        });
      }

      const accountRecord = await accountRepo.findById(request.params.id);
      if (!accountRecord) {
        return reply.status(404).send({ success: false, statusCode: 404, message: 'Account not found' });
      }

      const makerUserId = accountRecord.customer?.createdByUserId || 'unknown';
      const checkerUserId = request.userSession!.userId;

      try {
        // Enforce RBI Dual-Control rule
        const validation = makerCheckerService.validateApproval({
          accountId: accountRecord.account.id,
          currentStatus: accountRecord.account.status as AccountStatus,
          makerUserId,
          checkerUserId,
          remarks: parseResult.data.remarks
        });

        // Update Account in Database
        const updated = await accountRepo.updateApproval(
          accountRecord.account.id,
          validation.accountNumber,
          checkerUserId
        );

        // Immutable Audit Log
        await auditRepo.append(
          auditService.prepareAuditEntry({
            userId: checkerUserId,
            action: AuditAction.LOAN_APPROVED,
            entityType: 'ACCOUNT',
            entityId: accountRecord.account.id,
            ipAddress: request.ip,
            userAgent: request.headers['user-agent'],
            payloadBefore: { status: accountRecord.account.status },
            payloadAfter: {
              status: AccountStatus.ACTIVE,
              accountNumber: validation.accountNumber,
              remarks: parseResult.data.remarks
            }
          })
        );

        // Automated TRAI DLT SMS & WhatsApp Notification
        if (accountRecord.customer?.phone) {
          await notificationService.notifyLoanApproved({
            phone: accountRecord.customer.phone,
            accountNumber: validation.accountNumber,
            amount: Number(accountRecord.loan?.principalAmount || 0),
            emi: Number(accountRecord.loan?.emiAmount || 0),
            dueDay: 5
          }).catch((e) => fastify.log.warn(`Notification failed: ${e.message}`));
        }

        return reply.status(200).send({
          success: true,
          statusCode: 200,
          message: 'Account successfully approved and activated under RBI dual-control',
          data: updated
        });
      } catch (err: unknown) {
        if (err instanceof MakerCheckerValidationError) {
          return reply.status(403).send({
            success: false,
            statusCode: 403,
            message: err.message
          });
        }
        throw err;
      }
    }
  );

  /**
   * Checker: Reject Account
   */
  fastify.post<{ Params: { id: string } }>(
    '/:id/reject',
    {
      preHandler: [
        fastify.authenticate,
        requireRole(UserRole.AUTHORIZER)
      ]
    },
    async (request, reply) => {
      const parseResult = RejectAccountSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          success: false,
          statusCode: 400,
          message: 'Rejection reason is mandatory',
          errors: parseResult.error.flatten()
        });
      }

      const accountRecord = await accountRepo.findById(request.params.id);
      if (!accountRecord) {
        return reply.status(404).send({ success: false, statusCode: 404, message: 'Account not found' });
      }

      const makerUserId = accountRecord.customer?.createdByUserId || 'unknown';
      const checkerUserId = request.userSession!.userId;

      try {
        makerCheckerService.validateRejection({
          accountId: accountRecord.account.id,
          currentStatus: accountRecord.account.status as AccountStatus,
          makerUserId,
          checkerUserId,
          remarks: parseResult.data.reason
        });

        const updated = await accountRepo.updateRejection(accountRecord.account.id);

        // Audit Log
        await auditRepo.append(
          auditService.prepareAuditEntry({
            userId: checkerUserId,
            action: AuditAction.LOAN_REJECTED,
            entityType: 'ACCOUNT',
            entityId: accountRecord.account.id,
            ipAddress: request.ip,
            userAgent: request.headers['user-agent'],
            payloadBefore: { status: accountRecord.account.status },
            payloadAfter: { status: AccountStatus.DRAFT, reason: parseResult.data.reason }
          })
        );

        return reply.status(200).send({
          success: true,
          statusCode: 200,
          message: 'Account returned to DRAFT with remediation notes for the Maker',
          data: updated
        });
      } catch (err: unknown) {
        if (err instanceof MakerCheckerValidationError) {
          return reply.status(403).send({
            success: false,
            statusCode: 403,
            message: err.message
          });
        }
        throw err;
      }
    }
  );

  /**
   * Authorizer / Branch Manager: Suspend Account (Risk hold / dispute)
   */
  fastify.post<{ Params: { id: string } }>(
    '/:id/suspend',
    {
      preHandler: [
        fastify.authenticate,
        requireRole(UserRole.AUTHORIZER, UserRole.BRANCH_MANAGER)
      ]
    },
    async (request, reply) => {
      const parseResult = SuspendAccountSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          success: false,
          statusCode: 400,
          message: 'Suspension reason is mandatory',
          errors: parseResult.error.flatten()
        });
      }

      const accountRecord = await accountRepo.findById(request.params.id);
      if (!accountRecord) {
        return reply.status(404).send({ success: false, statusCode: 404, message: 'Account not found' });
      }

      const makerUserId = accountRecord.customer?.createdByUserId || 'unknown';
      const checkerUserId = request.userSession!.userId;

      try {
        makerCheckerService.validateSuspension({
          accountId: accountRecord.account.id,
          currentStatus: accountRecord.account.status as AccountStatus,
          makerUserId,
          checkerUserId,
          reason: parseResult.data.reason
        });

        const updated = await accountRepo.updateStatus(accountRecord.account.id, AccountStatus.SUSPENDED);

        await auditRepo.append(
          auditService.prepareAuditEntry({
            userId: checkerUserId,
            action: AuditAction.ACCOUNT_SUSPENDED,
            entityType: 'ACCOUNT',
            entityId: accountRecord.account.id,
            ipAddress: request.ip,
            userAgent: request.headers['user-agent'],
            payloadBefore: { status: accountRecord.account.status },
            payloadAfter: { status: AccountStatus.SUSPENDED, reason: parseResult.data.reason }
          })
        );

        return reply.status(200).send({
          success: true,
          statusCode: 200,
          message: 'Account successfully suspended under dual-control',
          data: updated
        });
      } catch (err: unknown) {
        if (err instanceof MakerCheckerValidationError) {
          return reply.status(403).send({ success: false, statusCode: 403, message: err.message });
        }
        throw err;
      }
    }
  );

  /**
   * Authorizer / Branch Manager: Reactivate Suspended Account
   */
  fastify.post<{ Params: { id: string } }>(
    '/:id/reactivate',
    {
      preHandler: [
        fastify.authenticate,
        requireRole(UserRole.AUTHORIZER, UserRole.BRANCH_MANAGER)
      ]
    },
    async (request, reply) => {
      const parseResult = ReactivateAccountSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          success: false,
          statusCode: 400,
          message: 'Reactivation reason is mandatory',
          errors: parseResult.error.flatten()
        });
      }

      const accountRecord = await accountRepo.findById(request.params.id);
      if (!accountRecord) {
        return reply.status(404).send({ success: false, statusCode: 404, message: 'Account not found' });
      }

      const makerUserId = accountRecord.customer?.createdByUserId || 'unknown';
      const checkerUserId = request.userSession!.userId;

      try {
        makerCheckerService.validateReactivation({
          accountId: accountRecord.account.id,
          currentStatus: accountRecord.account.status as AccountStatus,
          makerUserId,
          checkerUserId,
          reason: parseResult.data.reason
        });

        const updated = await accountRepo.updateStatus(accountRecord.account.id, AccountStatus.ACTIVE);

        await auditRepo.append(
          auditService.prepareAuditEntry({
            userId: checkerUserId,
            action: AuditAction.ACCOUNT_REACTIVATED,
            entityType: 'ACCOUNT',
            entityId: accountRecord.account.id,
            ipAddress: request.ip,
            userAgent: request.headers['user-agent'],
            payloadBefore: { status: accountRecord.account.status },
            payloadAfter: { status: AccountStatus.ACTIVE, reason: parseResult.data.reason }
          })
        );

        return reply.status(200).send({
          success: true,
          statusCode: 200,
          message: 'Account successfully reactivated and restored to ACTIVE status',
          data: updated
        });
      } catch (err: unknown) {
        if (err instanceof MakerCheckerValidationError) {
          return reply.status(403).send({ success: false, statusCode: 403, message: err.message });
        }
        throw err;
      }
    }
  );

  /**
   * Authorizer: Close Loan Account & Issue No-Dues Certificate (NOC)
   * Strictly enforces Zero-Balance rule (outstanding <= 0.00).
   */
  fastify.post<{ Params: { id: string } }>(
    '/:id/close',
    {
      preHandler: [
        fastify.authenticate,
        requireRole(UserRole.AUTHORIZER)
      ]
    },
    async (request, reply) => {
      const parseResult = CloseAccountSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          success: false,
          statusCode: 400,
          message: 'Closure validation failed',
          errors: parseResult.error.flatten()
        });
      }

      const accountRecord = await accountRepo.findById(request.params.id);
      if (!accountRecord) {
        return reply.status(404).send({ success: false, statusCode: 404, message: 'Account not found' });
      }

      const makerUserId = accountRecord.customer?.createdByUserId || 'unknown';
      const checkerUserId = request.userSession!.userId;
      const currentBalance = Number(accountRecord.account.currentBalance || 0);

      try {
        const validation = makerCheckerService.validateClosure({
          accountId: accountRecord.account.id,
          currentStatus: accountRecord.account.status as AccountStatus,
          currentBalance,
          makerUserId,
          checkerUserId,
          reason: parseResult.data.remarks,
          customNoc: parseResult.data.nocReference
        });

        const updated = await accountRepo.updateStatus(accountRecord.account.id, AccountStatus.CLOSED);

        await auditRepo.append(
          auditService.prepareAuditEntry({
            userId: checkerUserId,
            action: AuditAction.ACCOUNT_CLOSED,
            entityType: 'ACCOUNT',
            entityId: accountRecord.account.id,
            ipAddress: request.ip,
            userAgent: request.headers['user-agent'],
            payloadBefore: { status: accountRecord.account.status, balance: currentBalance },
            payloadAfter: {
              status: AccountStatus.CLOSED,
              closureReason: parseResult.data.closureReason,
              nocNumber: validation.nocNumber,
              remarks: parseResult.data.remarks
            }
          })
        );

        return reply.status(200).send({
          success: true,
          statusCode: 200,
          message: 'Account successfully closed and No-Dues Certificate issued under RBI dual control',
          data: {
            ...updated,
            nocNumber: validation.nocNumber,
            closureReason: parseResult.data.closureReason
          }
        });
      } catch (err: unknown) {
        if (err instanceof MakerCheckerValidationError) {
          return reply.status(403).send({ success: false, statusCode: 403, message: err.message });
        }
        throw err;
      }
    }
  );
}
