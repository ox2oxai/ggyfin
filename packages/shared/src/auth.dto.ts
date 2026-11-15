import { z } from 'zod';
import {
  IndianMobileRegex,
  StrictEmailRegex,
  LegalNameRegex,
  UsernameRegex
} from './validation.js';

export enum UserRole {
  SUPER_ADMIN_IT = 'SUPER_ADMIN_IT',
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  BRANCH_MANAGER = 'BRANCH_MANAGER',
  AUTHORIZER = 'AUTHORIZER',
  FIELD_OFFICER = 'FIELD_OFFICER'
}

export interface UserSession {
  userId: string;
  username: string;
  staffNumber?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  role: UserRole;
  branchCode: string;
}

export const LoginRequestSchema = z.object({
  username: z.string().trim().min(3).max(30).regex(UsernameRegex, 'Username must be 3-30 characters alphanumeric, underscore, or hyphen'),
  password: z.string().min(8).max(128)
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const UpdateProfileRequestSchema = z.object({
  fullName: z.string().trim().min(2).max(70).regex(LegalNameRegex, 'Full name may only contain letters, spaces, dots, single quotes, and hyphens').optional(),
  email: z.string().trim().min(5).max(254).regex(StrictEmailRegex, 'Invalid email address'),
  phone: z.string().trim().regex(IndianMobileRegex, 'Must be a valid 10-digit Indian mobile number starting with 6-9')
});

export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequestSchema>;

export const ChangePasswordRequestSchema = z.object({
  currentPassword: z.string().min(8).max(128),
  newPassword: z.string().min(8).max(128)
});

export type ChangePasswordRequest = z.infer<typeof ChangePasswordRequestSchema>;

export const AuthResponseSchema = z.object({
  accessToken: z.string(),
  user: z.object({
    id: z.string().uuid(),
    username: z.string(),
    staffNumber: z.string().optional(),
    fullName: z.string().optional(),
    email: z.string().email(),
    phone: z.string().optional(),
    role: z.nativeEnum(UserRole),
    branchCode: z.string()
  })
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;
