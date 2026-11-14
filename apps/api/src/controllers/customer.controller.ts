import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { CustomerRepository } from '../repositories/customer.repo.js';
import { AuditRepository } from '../repositories/audit.repo.js';
import { AuditService } from '../services/audit.service.js';
import { CreateCustomerSchema, UserRole, AuditAction } from '@nbfc/shared';
import { requireRole } from '../middleware/auth.js';

const customerRepo = new CustomerRepository();
const auditRepo = new AuditRepository();
const auditService = new AuditService();

export async function customerRoutes(fastify: FastifyInstance) {
  // Allow Field Officers and Branch Managers to onboard customers
  fastify.post(
    '/',
    {
      preHandler: [
        fastify.authenticate,
        requireRole(UserRole.FIELD_OFFICER, UserRole.BRANCH_MANAGER)
      ]
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parseResult = CreateCustomerSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          success: false,
          statusCode: 400,
          message: 'Customer validation failed',
          errors: parseResult.error.flatten()
        });
      }

      const input = parseResult.data;
      const user = request.userSession!;

      const customer = await customerRepo.create({
        fullName: input.fullName,
        phone: input.phone,
        email: input.email || null,
        dob: input.dob,
        gender: input.gender,
        addressLine: input.addressLine,
        pincode: input.pincode,
        state: input.state,
        consentGranted: input.consentGranted,
        createdByUserId: user.userId
      });

      // Immutable Audit Log
      await auditRepo.append(
        auditService.prepareAuditEntry({
          userId: user.userId,
          action: AuditAction.CUSTOMER_CREATED,
          entityType: 'CUSTOMER',
          entityId: customer.id,
          ipAddress: request.ip,
          userAgent: request.headers['user-agent'],
          payloadAfter: { cifNumber: customer.cifNumber, fullName: customer.fullName }
        })
      );

      return reply.status(201).send({
        success: true,
        statusCode: 201,
        message: 'Customer profile created successfully with unique CIF',
        data: customer
      });
    }
  );

  fastify.get<{ Params: { id: string } }>(
    '/:id',
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const customer = await customerRepo.findById(request.params.id);
      if (!customer) {
        return reply.status(404).send({
          success: false,
          statusCode: 404,
          message: 'Customer not found'
        });
      }

      return reply.status(200).send({
        success: true,
        statusCode: 200,
        data: customer
      });
    }
  );

  fastify.get<{ Querystring: { limit?: string; offset?: string } }>(
    '/',
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const limit = Number(request.query.limit) || 20;
      const offset = Number(request.query.offset) || 0;
      const customerList = await customerRepo.list(limit, offset);

      return reply.status(200).send({
        success: true,
        statusCode: 200,
        data: customerList
      });
    }
  );
}
