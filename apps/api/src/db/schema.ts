import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  numeric,
  integer,
  date,
  jsonb,
  bigserial,
  pgEnum,
  index
} from 'drizzle-orm/pg-core';

// 1. Staff User Roles
export const userRoleEnum = pgEnum('user_role', [
  'SUPER_ADMIN_IT',
  'SYSTEM_ADMIN',
  'BRANCH_MANAGER',
  'AUTHORIZER',
  'FIELD_OFFICER'
]);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  staffNumber: varchar('staff_number', { length: 30 }).unique(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  fullName: varchar('full_name', { length: 150 }).default('System Administrator').notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  phone: varchar('phone', { length: 15 }).notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: userRoleEnum('role').notNull(),
  branchCode: varchar('branch_code', { length: 20 }).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

// 2. Customers Master Profile
export const customers = pgTable('customers', {
  id: uuid('id').defaultRandom().primaryKey(),
  cifNumber: varchar('cif_number', { length: 30 }).notNull().unique(),
  fullName: varchar('full_name', { length: 150 }).notNull(),
  phone: varchar('phone', { length: 15 }).notNull(),
  email: varchar('email', { length: 100 }),
  dob: date('dob').notNull(),
  gender: varchar('gender', { length: 10 }).notNull(),
  addressLine: text('address_line').notNull(),
  pincode: varchar('pincode', { length: 10 }).notNull(),
  state: varchar('state', { length: 50 }).notNull(),
  consentGranted: boolean('consent_granted').default(true).notNull(),
  createdByUserId: uuid('created_by_user_id').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
}, (table) => ({
  idx_customers_phone: index('idx_customers_phone').on(table.phone)
}));

// 3. KYC Documents Vault (Encrypted & Masked)
export const kycDocTypeEnum = pgEnum('kyc_doc_type', [
  'AADHAAR',
  'PAN',
  'VOTER_ID',
  'CUSTOMER_PHOTO',
  'SIGNATURE'
]);

export const kycStatusEnum = pgEnum('kyc_status', [
  'PENDING',
  'VERIFIED',
  'REJECTED'
]);

export const kycDocuments = pgTable('kyc_documents', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerId: uuid('customer_id')
    .references(() => customers.id, { onDelete: 'cascade' })
    .notNull(),
  docType: kycDocTypeEnum('doc_type').notNull(),
  maskedIdentifier: varchar('masked_identifier', { length: 50 }).notNull(),
  storagePath: varchar('storage_path', { length: 255 }).notNull(),
  encryptionAlgorithm: varchar('encryption_algorithm', { length: 30 })
    .default('AES-256-GCM')
    .notNull(),
  status: kycStatusEnum('status').default('PENDING').notNull(),
  verifiedByUserId: uuid('verified_by_user_id').references(() => users.id),
  verificationNotes: text('verification_notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

// 4. Accounts (Double-Entry Core Account Master)
export const accountTypeEnum = pgEnum('account_type', [
  'LOAN',
  'SAVINGS',
  'WALLET'
]);

export const accountStatusEnum = pgEnum('account_status', [
  'DRAFT',
  'PENDING_APPROVAL',
  'ACTIVE',
  'SUSPENDED',
  'CLOSED'
]);

export const accounts = pgTable('accounts', {
  id: uuid('id').defaultRandom().primaryKey(),
  accountNumber: varchar('account_number', { length: 30 }).notNull().unique(),
  customerId: uuid('customer_id').references(() => customers.id).notNull(),
  accountType: accountTypeEnum('account_type').default('LOAN').notNull(),
  status: accountStatusEnum('status').default('DRAFT').notNull(),
  currentBalance: numeric('current_balance', { precision: 15, scale: 2 })
    .default('0.00')
    .notNull(),
  currency: varchar('currency', { length: 3 }).default('INR').notNull(),
  approvedByUserId: uuid('approved_by_user_id').references(() => users.id),
  approvedAt: timestamp('approved_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
}, (table) => ({
  idx_accounts_customer_id: index('idx_accounts_customer_id').on(table.customerId),
  idx_accounts_status: index('idx_accounts_status').on(table.status)
}));

// 5. Loan Specific Details
export const loanDetails = pgTable('loan_details', {
  accountId: uuid('account_id')
    .primaryKey()
    .references(() => accounts.id, { onDelete: 'cascade' }),
  loanPurpose: varchar('loan_purpose', { length: 100 }).notNull(),
  principalAmount: numeric('principal_amount', { precision: 15, scale: 2 }).notNull(),
  interestRatePercent: numeric('interest_rate_percent', { precision: 5, scale: 2 }).notNull(),
  tenureMonths: integer('tenure_months').notNull(),
  emiAmount: numeric('emi_amount', { precision: 15, scale: 2 }).notNull(),
  disbursedAmount: numeric('disbursed_amount', { precision: 15, scale: 2 })
    .default('0.00')
    .notNull(),
  disbursedAt: timestamp('disbursed_at', { withTimezone: true })
});

// 6. Transactions & Ledger (Strict ACID with row-level locks)
export const transactionTypeEnum = pgEnum('transaction_type', ['CREDIT', 'DEBIT']);
export const paymentModeEnum = pgEnum('payment_mode', ['UPI', 'CASH', 'NEFT_IMPS', 'BANK_TRANSFER']);

export const transactions = pgTable('transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  accountId: uuid('account_id').references(() => accounts.id).notNull(),
  txnRefNumber: varchar('txn_ref_number', { length: 64 }).notNull().unique(),
  amount: numeric('amount', { precision: 15, scale: 2 }).notNull(),
  txnType: transactionTypeEnum('txn_type').notNull(),
  mode: paymentModeEnum('mode').notNull(),
  balanceAfter: numeric('balance_after', { precision: 15, scale: 2 }).notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
}, (table) => ({
  idx_transactions_account_id: index('idx_transactions_account_id').on(table.accountId),
  idx_transactions_created_at: index('idx_transactions_created_at').on(table.createdAt)
}));

// 7. Cash Receipts (Dual Maker-Checker for Field Cash Collections)
export const receiptStatusEnum = pgEnum('receipt_status', [
  'COLLECTED_PENDING_APPROVAL',
  'VERIFIED_AND_DEPOSITED',
  'DISCREPANCY'
]);

export const cashReceipts = pgTable('cash_receipts', {
  id: uuid('id').defaultRandom().primaryKey(),
  transactionId: uuid('transaction_id').references(() => transactions.id),
  accountId: uuid('account_id').references(() => accounts.id).notNull(),
  amount: numeric('amount', { precision: 15, scale: 2 }).notNull(),
  collectedByUserId: uuid('collected_by_user_id').references(() => users.id).notNull(),
  verifiedByUserId: uuid('verified_by_user_id').references(() => users.id),
  status: receiptStatusEnum('status').default('COLLECTED_PENDING_APPROVAL').notNull(),
  receiptNumber: varchar('receipt_number', { length: 30 }).notNull().unique(),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
}, (table) => ({
  idx_cash_receipts_account_id: index('idx_cash_receipts_account_id').on(table.accountId),
  idx_cash_receipts_status: index('idx_cash_receipts_status').on(table.status),
  idx_cash_receipts_collected_by: index('idx_cash_receipts_collected_by').on(table.collectedByUserId)
}));

// 8. Immutable Audit Trail (Append-Only)
export const auditLogs = pgTable('audit_logs', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  category: varchar('category', { length: 50 }).default('OPERATIONAL_BANKING_EVENT').notNull(),
  action: varchar('action', { length: 100 }).notNull(),
  entityType: varchar('entity_type', { length: 50 }).notNull(),
  entityId: varchar('entity_id', { length: 50 }).notNull(),
  ipAddress: varchar('ip_address', { length: 45 }).notNull(),
  userAgent: text('user_agent'),
  payloadBefore: jsonb('payload_before'),
  payloadAfter: jsonb('payload_after'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
}, (table) => ({
  idx_audit_logs_created_at: index('idx_audit_logs_created_at').on(table.createdAt),
  idx_audit_logs_user_id: index('idx_audit_logs_user_id').on(table.userId)
}));

// 9. Mutual Fund Asset Management Companies (AMCs)
export const mutualFundAmcs = pgTable('mutual_fund_amcs', {
  id: uuid('id').defaultRandom().primaryKey(),
  amcCode: varchar('amc_code', { length: 50 }).notNull().unique(),
  amcName: varchar('amc_name', { length: 150 }).notNull(),
  officialWebsiteUrl: text('official_website_url').notNull(),
  supportPhone: varchar('support_phone', { length: 50 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

// 10. Mutual Fund Schemes Master
export const mutualFundSchemes = pgTable('mutual_fund_schemes', {
  id: uuid('id').defaultRandom().primaryKey(),
  amfiSchemeCode: varchar('amfi_scheme_code', { length: 30 }).notNull().unique(),
  isinGrowth: varchar('isin_growth', { length: 30 }),
  isinDivPayout: varchar('isin_div_payout', { length: 30 }),
  isinDivReinvestment: varchar('isin_div_reinvestment', { length: 30 }),
  schemeName: varchar('scheme_name', { length: 255 }).notNull(),
  amcId: uuid('amc_id').references(() => mutualFundAmcs.id).notNull(),
  category: varchar('category', { length: 50 }).notNull(),
  subCategory: varchar('sub_category', { length: 80 }).notNull(),
  planType: varchar('plan_type', { length: 20 }).default('Regular').notNull(),
  optionType: varchar('option_type', { length: 20 }).default('Growth').notNull(),
  latestNav: numeric('latest_nav', { precision: 12, scale: 4 }),
  latestNavDate: date('latest_nav_date'),
  benchmarkName: varchar('benchmark_name', { length: 150 }),
  expenseRatio: numeric('expense_ratio', { precision: 5, scale: 2 }),
  riskometer: varchar('riskometer', { length: 30 }).default('Moderate'),
  inceptionDate: date('inception_date'),
  status: varchar('status', { length: 20 }).default('ACTIVE').notNull(),
  source: varchar('source', { length: 50 }).default('AMFI_INDIA').notNull(),
  lastUpdatedAt: timestamp('last_updated_at', { withTimezone: true }).defaultNow().notNull()
}, (table) => ({
  idx_mf_schemes_amfi: index('idx_mf_schemes_amfi').on(table.amfiSchemeCode),
  idx_mf_schemes_category: index('idx_mf_schemes_category').on(table.category),
  idx_mf_schemes_amc: index('idx_mf_schemes_amc').on(table.amcId)
}));

// 11. Historical Net Asset Value (NAV) Series
export const mutualFundNavHistory = pgTable('mutual_fund_nav_history', {
  id: uuid('id').defaultRandom().primaryKey(),
  schemeId: uuid('scheme_id').references(() => mutualFundSchemes.id, { onDelete: 'cascade' }).notNull(),
  nav: numeric('nav', { precision: 12, scale: 4 }).notNull(),
  navDate: date('nav_date').notNull(),
  source: varchar('source', { length: 50 }).default('AMFI_INDIA').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
}, (table) => ({
  idx_mf_nav_scheme_date: index('idx_mf_nav_scheme_date').on(table.schemeId, table.navDate)
}));

// 12. Mutual Fund Ingestion & Synchronization Audit Log
export const mutualFundSyncLogs = pgTable('mutual_fund_sync_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  source: varchar('source', { length: 50 }).default('AMFI_INDIA').notNull(),
  syncStartedAt: timestamp('sync_started_at', { withTimezone: true }).defaultNow().notNull(),
  syncCompletedAt: timestamp('sync_completed_at', { withTimezone: true }),
  recordsProcessed: integer('records_processed').default(0).notNull(),
  recordsInserted: integer('records_inserted').default(0).notNull(),
  recordsUpdated: integer('records_updated').default(0).notNull(),
  recordsRejected: integer('records_rejected').default(0).notNull(),
  status: varchar('status', { length: 20 }).default('SUCCESS').notNull(),
  errorDetails: text('error_details')
});
