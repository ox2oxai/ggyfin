import { FastifyRequest, FastifyReply } from 'fastify';
import { UserRole, UserSession } from '@nbfc/shared';

declare module 'fastify' {
  interface FastifyRequest {
    userSession?: UserSession;
  }
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    const payload = await request.jwtVerify<UserSession>();
    request.userSession = payload;
  } catch (err) {
    return reply.status(401).send({
      success: false,
      statusCode: 401,
      message: 'Unauthorized: Invalid or expired authentication token'
    });
  }
}

export function requireRole(...allowedRoles: UserRole[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.userSession) {
      return reply.status(401).send({
        success: false,
        statusCode: 401,
        message: 'Unauthorized: Authentication required'
      });
    }

    if (!allowedRoles.includes(request.userSession.role)) {
      return reply.status(403).send({
        success: false,
        statusCode: 403,
        message: `Forbidden: Access restricted. Required role: ${allowedRoles.join(', ')}`
      });
    }
  };
}
