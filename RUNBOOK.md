# GGY Finance: Production Operational Runbook & Compliance Handbook

**Entity:** GGY Finance Ltd.  
**Classification:** RBI Base-Layer NBFC (Non-Banking Financial Company — Non-Deposit Taking)  
**Primary Domain:** Rural & Semi-Urban Micro Money Lending Platform  
**Target Region:** Karnataka Operations (Mandya, Ramanagara, Mysuru Clusters)  
**Regulatory Directives:** RBI Scale-Based Regulation (SBR), DPDP Act 2023, TRAI Telecom Commercial Communications Customer Preference Regulations (TCCCPR), NPCI UPI Operating Guidelines.

---

## 1. System Topology & Architecture Parity

```
                              [Internet / Cloudflare DNS]
                                           │
                        ┌──────────────────┴──────────────────┐
                        ▼                                     ▼
               https://ggyfinance.in               https://api.ggyfinance.in
               (Next.js 14 Web PWA)                (Fastify Core Banking API)
                        │                                     │
                        │                                     ├─► /metrics (Prometheus)
                        │                                     ├─► /health/liveness & readiness
                        │                                     └─► /openapi.json (Swagger 3.0)
                        │                                     │
                        └──────────────────┬──────────────────┘
                                           │
                     ┌─────────────────────┴─────────────────────┐
                     ▼                                           ▼
          [PostgreSQL 16 Transactional]              [AES-256-GCM Vault Storage]
       - 100% Dev/Prod Parity                     - Local Encrypted File System OR
       - AWS Mumbai (ap-south-1) Supabase        - AWS S3 / Cloudflare R2 (ap-south-1)
       - ACID Row-Level Locks (FOR UPDATE)       - 60-Second Ephemeral View Tokens
```

### Local Dev Ports:
* **Web Frontend:** `http://localhost:3000`
* **Core REST API:** `http://localhost:4000`
* **PostgreSQL 16 Database:** `localhost:5432`

---

## 2. Daily Developer & Operations Quickstart

### 1. Build and Test Suite
```bash
# Execute entire monorepo test suite (57 automated tests across @nbfc/shared & @nbfc/api)
npm test

# Build all TypeScript packages cleanly
npm run build
```

### 2. Database Migration & Seeding
```bash
# Apply immutable Drizzle ORM migrations to PostgreSQL 16
npm run db:migrate --workspace=@nbfc/api

# Seed core staff personas and realistic rural micro-loans (Mandya & Ramanagara)
npm run db:seed --workspace=@nbfc/api
```

### 3. Container Orchestration (Local Docker)
```bash
# Spin up complete stack (Postgres 16 Alpine + Fastify API + Next.js Web)
docker-compose up -d --build

# Verify container health
docker-compose ps
```

---

## 3. 1-Click Cloud Migration to Supabase (AWS Mumbai `ap-south-1`)

GGY Finance is designed with zero lock-in to easily transition from local Docker containers to managed cloud infrastructure in **AWS Mumbai (`ap-south-1`)** for 100% Indian data sovereignty:

### Step 1: Provision Supabase Instance
1. Create a project in [Supabase Dashboard](https://supabase.com) selecting **Region: AWS South (Mumbai) `ap-south-1`**.
2. Note the Transaction Pooler Connection String (Port 6543) or Session Pooler (Port 5432).

### Step 2: Configure Environment
Update `DATABASE_URL` in production `.env` or Kubernetes secret:
```bash
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require"
DB_SSL=true
```

### Step 3: Execute Migrations
Run the Drizzle migration engine against the cloud instance:
```bash
npm run db:migrate --workspace=@nbfc/api
```
All tables (`users`, `customers`, `kyc_documents`, `accounts`, `loan_details`, `transactions`, `cash_receipts`, `audit_logs`) and secondary B-Tree indexes are created instantly with exact PostgreSQL 16 parity.

---

## 4. Cryptographic Key Management & Rotation Policy

### 1. Master KYC Envelope Encryption Key (`KYC_MASTER_KEY`)
* **Algorithm:** AES-256-GCM.
* **Format:** Exactly 64 hex characters (32 bytes).
* **Generation Command:**
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
* **Storage:** In Kubernetes Secrets or AWS Secrets Manager. Never committed to source control.
* **Rotation Procedure:**
  1. Generate new 32-byte key `NEW_KYC_KEY`.
  2. Implement dual-key reader script: read documents decrypting with `OLD_KEY`, re-encrypting with `NEW_KEY`.
  3. Promote `NEW_KYC_KEY` as active.

### 2. Ephemeral View Tokens
* HMAC-SHA256 signed URL parameters expiring in exactly **60 seconds**.
* Used exclusively by Authorizers/Checkers to inspect decrypted KYC documents.
* Browser streaming uses `Cache-Control: no-store, no-cache, must-revalidate, private` to prevent disk caching on staff workstations.

---

## 5. RBI Maker-Checker (4-Eyes) Dual Control Workflows

| Lifecycle Event | Maker Persona | Checker Persona | Validation Rule Enforced |
| :--- | :--- | :--- | :--- |
| **Loan Application** | Field Officer | Authorizer | `makerUserId !== checkerUserId`. Cannot approve own application. Mandatory authorizer remarks. |
| **Account Suspension** | Field Officer / BM | Authorizer | Account must be `ACTIVE`. Mandatory risk hold reason. Account marked `SUSPENDED`. |
| **Account Reactivation**| Field Officer / BM | Authorizer | Account must be `SUSPENDED`. Compliance remediation verified. Account marked `ACTIVE`. |
| **Account Closure & NOC**| Field Officer / BM | Authorizer | **Zero-Balance Rule:** Outstanding balance must be $\le ₹0.00$. Generates formal NOC `NOC-GGY-YYYY-XXXXXX`. |
| **Physical Cash Deposit**| Field Officer (Collector)| Branch Manager (Vault)| Dual control: collecting agent cannot verify own cash receipt. Atomic credit into core ledger. |

---

## 6. Observability & Monitoring Metrics

Scraped via Prometheus at `GET /metrics`:

| Metric Name | Type | Description | Alert Threshold |
| :--- | :--- | :--- | :--- |
| `nbfc_up` | Gauge | Application process status (1 = UP) | Alert if `== 0` |
| `nodejs_heap_used_bytes` | Gauge | Node.js allocated heap memory | Alert if $> 400\text{ MB}$ |
| `nodejs_rss_bytes` | Gauge | Process Resident Set Size | Alert if $> 800\text{ MB}$ |
| `nbfc_pg_pool_total` | Gauge | Total PostgreSQL connections | Monitor pool sizing |
| `nbfc_pg_pool_waiting` | Gauge | Database requests queued waiting for client | Alert if $> 5$ for $> 30\text{s}$ |

---

## 7. Disaster Recovery & Backup Plan

* **Recovery Time Objective (RTO):** $< 15$ minutes.
* **Recovery Point Objective (RPO):** $< 5$ minutes.
* **Point-in-Time Recovery (PITR):** Supabase / AWS RDS automated continuous WAL archiving with 7-day retention.
* **Cold Storage Offsite Backup:** Weekly snapshot encrypted with AES-256 and pushed to isolated GCS / S3 cold vault.

---

## 8. Regulatory Compliance Checklist

* [x] **DPDP Act 2023:** Explicit affirmative customer consent recorded with timestamp; right to account closure and erasure honored upon debt clearance.
* [x] **UIDAI Compliance:** Unmasked 12-digit Aadhaar numbers strictly rejected. Only masked format `XXXX-XXXX-1234` stored.
* [x] **RBI Digital Lending Directions 2022:** Key Fact Statement (KFS) provided with APR, itemized fees (1.5% + 18% GST), and exact zero-residual amortization schedules.
* [x] **TRAI DLT:** Pre-registered 6-character header `GGYFIN` and 19-digit numerical template IDs for SMS dispatch.
* [x] **NPCI UPI:** Universal dynamic `upi://pay` intent URIs with 12-digit UTR reconciliation.
