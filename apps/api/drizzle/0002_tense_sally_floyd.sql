ALTER TYPE "user_role" ADD VALUE 'SUPER_ADMIN_IT';--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mutual_fund_amcs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"amc_code" varchar(50) NOT NULL,
	"amc_name" varchar(150) NOT NULL,
	"official_website_url" text NOT NULL,
	"support_phone" varchar(50),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "mutual_fund_amcs_amc_code_unique" UNIQUE("amc_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mutual_fund_nav_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scheme_id" uuid NOT NULL,
	"nav" numeric(12, 4) NOT NULL,
	"nav_date" date NOT NULL,
	"source" varchar(50) DEFAULT 'AMFI_INDIA' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mutual_fund_schemes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"amfi_scheme_code" varchar(30) NOT NULL,
	"isin_growth" varchar(30),
	"isin_div_payout" varchar(30),
	"isin_div_reinvestment" varchar(30),
	"scheme_name" varchar(255) NOT NULL,
	"amc_id" uuid NOT NULL,
	"category" varchar(50) NOT NULL,
	"sub_category" varchar(80) NOT NULL,
	"plan_type" varchar(20) DEFAULT 'Regular' NOT NULL,
	"option_type" varchar(20) DEFAULT 'Growth' NOT NULL,
	"latest_nav" numeric(12, 4),
	"latest_nav_date" date,
	"benchmark_name" varchar(150),
	"expense_ratio" numeric(5, 2),
	"riskometer" varchar(30) DEFAULT 'Moderate',
	"inception_date" date,
	"status" varchar(20) DEFAULT 'ACTIVE' NOT NULL,
	"source" varchar(50) DEFAULT 'AMFI_INDIA' NOT NULL,
	"last_updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "mutual_fund_schemes_amfi_scheme_code_unique" UNIQUE("amfi_scheme_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mutual_fund_sync_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source" varchar(50) DEFAULT 'AMFI_INDIA' NOT NULL,
	"sync_started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"sync_completed_at" timestamp with time zone,
	"records_processed" integer DEFAULT 0 NOT NULL,
	"records_inserted" integer DEFAULT 0 NOT NULL,
	"records_updated" integer DEFAULT 0 NOT NULL,
	"records_rejected" integer DEFAULT 0 NOT NULL,
	"status" varchar(20) DEFAULT 'SUCCESS' NOT NULL,
	"error_details" text
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD COLUMN "category" varchar(50) DEFAULT 'OPERATIONAL_BANKING_EVENT' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "staff_number" varchar(30);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "full_name" varchar(150) DEFAULT 'System Administrator' NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mutual_fund_nav_history" ADD CONSTRAINT "mutual_fund_nav_history_scheme_id_mutual_fund_schemes_id_fk" FOREIGN KEY ("scheme_id") REFERENCES "public"."mutual_fund_schemes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mutual_fund_schemes" ADD CONSTRAINT "mutual_fund_schemes_amc_id_mutual_fund_amcs_id_fk" FOREIGN KEY ("amc_id") REFERENCES "public"."mutual_fund_amcs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_mf_nav_scheme_date" ON "mutual_fund_nav_history" USING btree ("scheme_id","nav_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_mf_schemes_amfi" ON "mutual_fund_schemes" USING btree ("amfi_scheme_code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_mf_schemes_category" ON "mutual_fund_schemes" USING btree ("category");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_mf_schemes_amc" ON "mutual_fund_schemes" USING btree ("amc_id");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_staff_number_unique" UNIQUE("staff_number");