DO $$ BEGIN
 CREATE TYPE "public"."account_status" AS ENUM('DRAFT', 'PENDING_APPROVAL', 'ACTIVE', 'SUSPENDED', 'CLOSED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."account_type" AS ENUM('LOAN', 'SAVINGS', 'WALLET');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."kyc_doc_type" AS ENUM('AADHAAR', 'PAN', 'VOTER_ID', 'CUSTOMER_PHOTO', 'SIGNATURE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."kyc_status" AS ENUM('PENDING', 'VERIFIED', 'REJECTED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."payment_mode" AS ENUM('UPI', 'CASH', 'NEFT_IMPS', 'BANK_TRANSFER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."receipt_status" AS ENUM('COLLECTED_PENDING_APPROVAL', 'VERIFIED_AND_DEPOSITED', 'DISCREPANCY');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."transaction_type" AS ENUM('CREDIT', 'DEBIT');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."user_role" AS ENUM('SYSTEM_ADMIN', 'BRANCH_MANAGER', 'AUTHORIZER', 'FIELD_OFFICER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_number" varchar(30) NOT NULL,
	"customer_id" uuid NOT NULL,
	"account_type" "account_type" DEFAULT 'LOAN' NOT NULL,
	"status" "account_status" DEFAULT 'DRAFT' NOT NULL,
	"current_balance" numeric(15, 2) DEFAULT '0.00' NOT NULL,
	"currency" varchar(3) DEFAULT 'INR' NOT NULL,
	"approved_by_user_id" uuid,
	"approved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "accounts_account_number_unique" UNIQUE("account_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "audit_logs" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"action" varchar(100) NOT NULL,
	"entity_type" varchar(50) NOT NULL,
	"entity_id" varchar(50) NOT NULL,
	"ip_address" varchar(45) NOT NULL,
	"user_agent" text,
	"payload_before" jsonb,
	"payload_after" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cash_receipts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"transaction_id" uuid,
	"account_id" uuid NOT NULL,
	"amount" numeric(15, 2) NOT NULL,
	"collected_by_user_id" uuid NOT NULL,
	"verified_by_user_id" uuid,
	"status" "receipt_status" DEFAULT 'COLLECTED_PENDING_APPROVAL' NOT NULL,
	"receipt_number" varchar(30) NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cash_receipts_receipt_number_unique" UNIQUE("receipt_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cif_number" varchar(30) NOT NULL,
	"full_name" varchar(150) NOT NULL,
	"phone" varchar(15) NOT NULL,
	"email" varchar(100),
	"dob" date NOT NULL,
	"gender" varchar(10) NOT NULL,
	"address_line" text NOT NULL,
	"pincode" varchar(10) NOT NULL,
	"state" varchar(50) NOT NULL,
	"consent_granted" boolean DEFAULT true NOT NULL,
	"created_by_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "customers_cif_number_unique" UNIQUE("cif_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kyc_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid NOT NULL,
	"doc_type" "kyc_doc_type" NOT NULL,
	"masked_identifier" varchar(50) NOT NULL,
	"storage_path" varchar(255) NOT NULL,
	"encryption_algorithm" varchar(30) DEFAULT 'AES-256-GCM' NOT NULL,
	"status" "kyc_status" DEFAULT 'PENDING' NOT NULL,
	"verified_by_user_id" uuid,
	"verification_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "loan_details" (
	"account_id" uuid PRIMARY KEY NOT NULL,
	"loan_purpose" varchar(100) NOT NULL,
	"principal_amount" numeric(15, 2) NOT NULL,
	"interest_rate_percent" numeric(5, 2) NOT NULL,
	"tenure_months" integer NOT NULL,
	"emi_amount" numeric(15, 2) NOT NULL,
	"disbursed_amount" numeric(15, 2) DEFAULT '0.00' NOT NULL,
	"disbursed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid NOT NULL,
	"txn_ref_number" varchar(64) NOT NULL,
	"amount" numeric(15, 2) NOT NULL,
	"txn_type" "transaction_type" NOT NULL,
	"mode" "payment_mode" NOT NULL,
	"balance_after" numeric(15, 2) NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "transactions_txn_ref_number_unique" UNIQUE("txn_ref_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(50) NOT NULL,
	"email" varchar(100) NOT NULL,
	"phone" varchar(15) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"role" "user_role" NOT NULL,
	"branch_code" varchar(20) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_approved_by_user_id_users_id_fk" FOREIGN KEY ("approved_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cash_receipts" ADD CONSTRAINT "cash_receipts_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cash_receipts" ADD CONSTRAINT "cash_receipts_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cash_receipts" ADD CONSTRAINT "cash_receipts_collected_by_user_id_users_id_fk" FOREIGN KEY ("collected_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cash_receipts" ADD CONSTRAINT "cash_receipts_verified_by_user_id_users_id_fk" FOREIGN KEY ("verified_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customers" ADD CONSTRAINT "customers_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kyc_documents" ADD CONSTRAINT "kyc_documents_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kyc_documents" ADD CONSTRAINT "kyc_documents_verified_by_user_id_users_id_fk" FOREIGN KEY ("verified_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "loan_details" ADD CONSTRAINT "loan_details_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
