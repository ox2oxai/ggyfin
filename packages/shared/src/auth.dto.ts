import { z } from 'zod';

export enum UserRole {
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  BRANCH_MANAGER = 'BRANCH_MANAGER',
  AUTHORIZER = 'AUTHORIZER',
  FIELD_OFFICER = 'FIELD_OFFICER'
}

export interface UserSession {
  userId: string;
  username: string;
  role: UserRole;
  branchCode: string;
}

export const LoginRequestSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(8).max(100)
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const AuthResponseSchema = z.object({
  accessToken: z.string(),
  user: z.object({
    id: z.string().uuid(),
    username: z.string(),
    email: z.string().email(),
    role: z.nativeEnum(UserRole),
    branchCode: z.string()
  })
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;
