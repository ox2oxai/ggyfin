import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { UserRepository } from '../repositories/user.repo.js';
import { LoginRequestSchema, UserRole } from '@nbfc/shared';
import bcrypt from 'bcryptjs';

const userRepo = new UserRepository();

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = LoginRequestSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        success: false,
        statusCode: 400,
        message: 'Validation failed',
        errors: parseResult.error.flatten()
      });
    }

    const { username, password } = parseResult.data;
    const user = await userRepo.findByUsername(username);

    if (!user || !user.isActive) {
      return reply.status(401).send({
        success: false,
        statusCode: 401,
        message: 'Invalid credentials or inactive account'
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return reply.status(401).send({
        success: false,
        statusCode: 401,
        message: 'Invalid credentials'
      });
    }

    const sessionPayload = {
      userId: user.id,
      username: user.username,
      role: user.role as UserRole,
      branchCode: user.branchCode
    };

    const token = fastify.jwt.sign(sessionPayload, { expiresIn: '8h' });

    return reply.status(200).send({
      success: true,
      statusCode: 200,
      message: 'Login successful',
      data: {
        accessToken: token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          branchCode: user.branchCode
        }
      }
    });
  });

  fastify.get('/me', { preHandler: [fastify.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.status(200).send({
      success: true,
      statusCode: 200,
      data: request.userSession
    });
  });
}
