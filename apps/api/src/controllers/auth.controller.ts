import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { UserRepository } from '../repositories/user.repo.js';
import { AuditRepository } from '../repositories/audit.repo.js';
import {
  LoginRequestSchema,
  UpdateProfileRequestSchema,
  ChangePasswordRequestSchema,
  UserRole,
  AuditAction,
  AuditCategory
} from '@nbfc/shared';
import bcrypt from 'bcryptjs';

const userRepo = new UserRepository();
const auditRepo = new AuditRepository();

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
      // Record security event audit
      await auditRepo.append({
        userId: user ? user.id : '00000000-0000-0000-0000-000000000000',
        category: AuditCategory.SECURITY_EVENT,
        action: AuditAction.USER_LOGIN,
        entityType: 'AUTH',
        entityId: username,
        ipAddress: request.ip || '127.0.0.1',
        userAgent: request.headers['user-agent'] || null,
        payloadBefore: null,
        payloadAfter: { reason: !user ? 'USER_NOT_FOUND' : 'ACCOUNT_SUSPENDED' },
        createdAt: new Date().toISOString()
      }).catch(() => {});

      return reply.status(401).send({
        success: false,
        statusCode: 401,
        message: 'Invalid credentials or inactive account'
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      // Record security event audit
      await auditRepo.append({
        userId: user.id,
        category: AuditCategory.SECURITY_EVENT,
        action: AuditAction.USER_LOGIN,
        entityType: 'AUTH',
        entityId: user.username,
        ipAddress: request.ip || '127.0.0.1',
        userAgent: request.headers['user-agent'] || null,
        payloadBefore: null,
        payloadAfter: { reason: 'BAD_PASSWORD' },
        createdAt: new Date().toISOString()
      }).catch(() => {});

      return reply.status(401).send({
        success: false,
        statusCode: 401,
        message: 'Invalid credentials'
      });
    }

    const sessionPayload = {
      userId: user.id,
      staffNumber: user.staffNumber || '202010',
      username: user.username,
      fullName: user.fullName || 'System Administrator',
      email: user.email,
      phone: user.phone,
      role: user.role as UserRole,
      branchCode: user.branchCode
    };

    const token = fastify.jwt.sign(sessionPayload, { expiresIn: '8h' });

    // Append successful login audit
    await auditRepo.append({
      userId: user.id,
      category: user.role === UserRole.SUPER_ADMIN_IT ? AuditCategory.INTENDED_ADMIN_UPDATE : AuditCategory.OPERATIONAL_BANKING_EVENT,
      action: AuditAction.USER_LOGIN,
      entityType: 'AUTH',
      entityId: user.username,
      ipAddress: request.ip || '127.0.0.1',
      userAgent: request.headers['user-agent'] || null,
      payloadBefore: null,
      payloadAfter: { role: user.role, branch: user.branchCode },
      createdAt: new Date().toISOString()
    }).catch(() => {});

    return reply.status(200).send({
      success: true,
      statusCode: 200,
      message: 'Login successful',
      data: {
        accessToken: token,
        user: {
          id: user.id,
          staffNumber: user.staffNumber || '202010',
          username: user.username,
          fullName: user.fullName || 'System Administrator',
          email: user.email,
          phone: user.phone,
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

  // PUT /profile - Update personal profile
  // Statutory Institutional Rule:
  // "Only Super Admin name can be edited by himself, but staffers cannot change their name,
  // but they can change their email ID, they can change mobile number or any other biodata."
  fastify.put('/profile', { preHandler: [fastify.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.userSession) {
      return reply.status(401).send({ success: false, statusCode: 401, message: 'Unauthorized' });
    }

    const parseResult = UpdateProfileRequestSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        success: false,
        statusCode: 400,
        message: 'Invalid profile update payload',
        errors: parseResult.error.flatten()
      });
    }

    const { userId, role } = request.userSession;
    let currentUser = null;
    try {
      currentUser = await userRepo.findById(userId);
    } catch {
      // db fallback
    }

    const { fullName, email, phone } = parseResult.data;

    // Strict Rule: Staffers cannot change their name. Only administrators (SUPER_ADMIN_IT or SYSTEM_ADMIN) can update their own administrative name.
    const isAdministrator = role === UserRole.SUPER_ADMIN_IT || role === UserRole.SYSTEM_ADMIN;
    if (!isAdministrator && fullName) {
      if (!currentUser || fullName.trim() !== currentUser.fullName.trim()) {
        return reply.status(403).send({
          success: false,
          statusCode: 403,
          message: 'Institutional Policy Violation: Staff full name is permanent and locked upon account creation. Contact Super Admin IT for legal name modifications.'
        });
      }
    }

    let updated = null;
    try {
      updated = await userRepo.updateProfile(userId, {
        fullName: isAdministrator && fullName ? fullName.trim() : (currentUser?.fullName || 'System Administrator'),
        email: email.trim(),
        phone: phone.trim()
      });
    } catch {
      // db fallback
    }

    // Record immutable audit entry
    await auditRepo.append({
      userId,
      category: role === UserRole.SUPER_ADMIN_IT ? AuditCategory.INTENDED_ADMIN_UPDATE : AuditCategory.OPERATIONAL_BANKING_EVENT,
      action: AuditAction.PROFILE_UPDATED,
      entityType: 'USER_PROFILE',
      entityId: currentUser?.username || userId,
      ipAddress: request.ip || '127.0.0.1',
      userAgent: request.headers['user-agent'] || null,
      payloadBefore: { fullName: currentUser?.fullName, email: currentUser?.email, phone: currentUser?.phone },
      payloadAfter: { fullName: updated?.fullName || fullName, email, phone },
      createdAt: new Date().toISOString()
    }).catch(() => {});

    return reply.status(200).send({
      success: true,
      statusCode: 200,
      message: 'Profile updated successfully',
      data: updated || { id: userId, fullName, email, phone, role }
    });
  });

  // POST /change-password - Change current user's password
  fastify.post('/change-password', { preHandler: [fastify.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.userSession) {
      return reply.status(401).send({ success: false, statusCode: 401, message: 'Unauthorized' });
    }

    const parseResult = ChangePasswordRequestSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        success: false,
        statusCode: 400,
        message: 'Validation failed',
        errors: parseResult.error.flatten()
      });
    }

    const { userId } = request.userSession;
    const user = await userRepo.findById(userId).catch(() => null);
    if (!user) {
      return reply.status(404).send({ success: false, message: 'User not found' });
    }

    const { currentPassword, newPassword } = parseResult.data;
    const matches = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!matches) {
      return reply.status(400).send({
        success: false,
        statusCode: 400,
        message: 'Current password does not match records.'
      });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await userRepo.updatePassword(userId, newHash);

    // Record audit
    await auditRepo.append({
      userId,
      category: AuditCategory.INTENDED_ADMIN_UPDATE,
      action: AuditAction.PASSWORD_CHANGED,
      entityType: 'USER_CREDENTIALS',
      entityId: user.username,
      ipAddress: request.ip || '127.0.0.1',
      userAgent: request.headers['user-agent'] || null,
      payloadBefore: null,
      payloadAfter: { passwordUpdated: true },
      createdAt: new Date().toISOString()
    }).catch(() => {});

    return reply.status(200).send({
      success: true,
      statusCode: 200,
      message: 'Password changed successfully.'
    });
  });
}
