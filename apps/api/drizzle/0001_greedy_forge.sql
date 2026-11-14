CREATE INDEX IF NOT EXISTS "idx_accounts_customer_id" ON "accounts" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_accounts_status" ON "accounts" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_audit_logs_created_at" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_audit_logs_user_id" ON "audit_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_cash_receipts_account_id" ON "cash_receipts" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_cash_receipts_status" ON "cash_receipts" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_cash_receipts_collected_by" ON "cash_receipts" USING btree ("collected_by_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_customers_phone" ON "customers" USING btree ("phone");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_transactions_account_id" ON "transactions" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_transactions_created_at" ON "transactions" USING btree ("created_at");