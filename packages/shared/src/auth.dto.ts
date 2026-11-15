import { z } from 'zod';

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
  username: z.string().min(3).max(50),
  password: z.string().min(8).max(100)
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const UpdateProfileRequestSchema = z.object({
  fullName: z.string().min(2).max(150).optional(),
  email: z.string().email(),
  phone: z.string().min(10).max(15)
});

export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequestSchema>;

export const ChangePasswordRequestSchema = z.object({
  currentPassword: z.string().min(8).max(100),
  newPassword: z.string().min(8).max(100)
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
