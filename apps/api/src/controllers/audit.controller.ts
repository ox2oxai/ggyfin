import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { AuditRepository } from '../repositories/audit.repo.js';
import { UserRole } from '@nbfc/shared';
import { requireRole } from '../middleware/auth.js';

const auditRepo = new AuditRepository();

export async function auditRoutes(fastify: FastifyInstance) {
  /**
   * Super Admin & Authorizers: Search Immutable Audit Trail
   */
  fastify.get<{ Querystring: { limit?: string; offset?: string } }>(
    '/logs',
    {
      preHandler: [
        fastify.authenticate,
        requireRole(UserRole.SYSTEM_ADMIN, UserRole.AUTHORIZER)
      ]
    },
    async (request, reply) => {
      const limit = Number(request.query.limit) || 50;
      const offset = Number(request.query.offset) || 0;
      const logs = await auditRepo.list(limit, offset);

      return reply.status(200).send({
        success: true,
        statusCode: 200,
        data: logs
      });
    }
  );
}
