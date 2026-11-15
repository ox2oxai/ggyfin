CREATE TABLE IF NOT EXISTS "branches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sol_id" varchar(20) NOT NULL,
	"name" varchar(150) NOT NULL,
	"type" varchar(50) NOT NULL,
	"address" text NOT NULL,
	"manager" varchar(100) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"email" varchar(100) NOT NULL,
	"operating_hours" varchar(100) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "branches_sol_id_unique" UNIQUE("sol_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "credit_schemes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scheme_code" varchar(50) NOT NULL,
	"name" varchar(150) NOT NULL,
	"min_amount" numeric(12, 2) NOT NULL,
	"max_amount" numeric(12, 2) NOT NULL,
	"interest_rate" numeric(5, 2) NOT NULL,
	"default_tenure_months" integer NOT NULL,
	"min_tenure_months" integer NOT NULL,
	"max_tenure_months" integer NOT NULL,
	"frequency" varchar(50) NOT NULL,
	"purpose" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "credit_schemes_scheme_code_unique" UNIQUE("scheme_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "institution_config" (
	"id" varchar(50) PRIMARY KEY DEFAULT 'PRIMARY_CONFIG' NOT NULL,
	"organization_name" varchar(150) NOT NULL,
	"platform_tagline" text,
	"registration_number" varchar(50),
	"support_email" varchar(100),
	"support_phone" varchar(20),
	"nodal_officer_name" varchar(100),
	"nodal_officer_contact" varchar(150),
	"head_office_address" text,
	"logo_url" text,
	"upi_vpa" varchar(100),
	"upi_payee_name" varchar(150),
	"upi_merchant_code" varchar(20),
	"upi_account_number" varchar(50),
	"qr_image_url" text,
	"enable_public_qr" boolean DEFAULT true NOT NULL,
	"collection_instructions" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
