import { z } from 'zod';
import { AadhaarMaskRegex, IndianPanRegex } from './customer.dto.js';

export enum KycDocType {
  AADHAAR = 'AADHAAR',
  PAN = 'PAN',
  VOTER_ID = 'VOTER_ID',
  CUSTOMER_PHOTO = 'CUSTOMER_PHOTO',
  SIGNATURE = 'SIGNATURE'
}

export enum KycStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED'
}

export const UploadKycMetadataSchema = z.object({
  customerId: z.string().uuid('Customer ID must be a valid UUID'),
  docType: z.nativeEnum(KycDocType),
  // Masked identifier: If Aadhaar, must match XXXX-XXXX-1234; if PAN, must match PAN regex; otherwise string
  identifier: z.string().min(4).max(50)
}).superRefine((val, ctx) => {
  if (val.docType === KycDocType.AADHAAR && !AadhaarMaskRegex.test(val.identifier)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'UIDAI Compliance: Aadhaar must be masked with first 8 digits hidden (format: XXXX-XXXX-1234)',
      path: ['identifier']
    });
  }
  if (val.docType === KycDocType.PAN && !IndianPanRegex.test(val.identifier)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Invalid PAN format. Must be 5 uppercase letters, 4 digits, 1 uppercase letter (e.g. ABCDE1234F)',
      path: ['identifier']
    });
  }
});

export type UploadKycMetadata = z.infer<typeof UploadKycMetadataSchema>;

export interface KycDocumentResponse {
  id: string;
  customerId: string;
  docType: KycDocType;
  maskedIdentifier: string;
  status: KycStatus;
  verifiedByUserId?: string | null;
  verificationNotes?: string | null;
  createdAt: string;
}

export interface EphemeralViewTokenResponse {
  docId: string;
  viewUrl: string;
  expiresInSeconds: number; // strictly 60 seconds
  issuedAt: string;
}
