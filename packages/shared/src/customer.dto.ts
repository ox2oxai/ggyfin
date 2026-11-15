import { z } from 'zod';
import {
  IndianMobileRegex,
  IndianPanRegex,
  AadhaarMaskRegex,
  IndianPincodeRegex,
  LegalNameRegex,
  StrictEmailRegex
} from './validation.js';

export { AadhaarMaskRegex, IndianPanRegex, IndianMobileRegex, IndianPincodeRegex };

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export const CreateCustomerSchema = z.object({
  fullName: z.string().trim().min(3, 'Full name must be at least 3 characters').max(70).regex(LegalNameRegex, 'Full name may only contain letters, spaces, dots, single quotes, and hyphens'),
  phone: z.string().regex(IndianMobileRegex, 'Must be a valid 10-digit Indian mobile number starting with 6-9'),
  email: z.string().trim().regex(StrictEmailRegex, 'Invalid email address').optional().or(z.literal('')),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be YYYY-MM-DD'),
  gender: z.nativeEnum(Gender),
  addressLine: z.string().trim().min(10, 'Address must be at least 10 characters'),
  pincode: z.string().regex(IndianPincodeRegex, 'Must be a valid 6-digit Indian PIN code'),
  state: z.string().trim().min(2, 'State name is required'),
  // Mandated by DPDP Act 2023: Explicit consent
  consentGranted: z.literal(true, {
    errorMap: () => ({ message: 'DPDP Act 2023 compliance: Explicit customer consent is mandatory for data processing' })
  })
});

export type CreateCustomerInput = z.infer<typeof CreateCustomerSchema>;

export interface CustomerResponse {
  id: string;
  cifNumber: string;
  fullName: string;
  phone: string;
  email?: string | null;
  dob: string;
  gender: Gender;
  addressLine: string;
  pincode: string;
  state: string;
  createdByUserId: string;
  createdAt: string;
}
