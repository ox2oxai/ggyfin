# GGY Finance — Micro Money Lending Platform

> **RBI Scale-Based Regulatory Framework (SBR: Base Layer NBFC)**  
> Production-grade, single-tenant, white-label Core Banking & Lending Platform built with 100% native PostgreSQL 16 Dev/Prod parity.

---

## 1. Architectural Highlights

* **Brand & Category**: **GGY Finance** — *Micro Money Lending Platform*
* **Design Philosophy**: Non-copycat **Bharat-Modern** UI (deep forest green `#163323`, warm sandstone, and terracotta accents `#C05621`).
* **Regional Language Localization**: Strictly bilingual (**English & Kannada (ಕನ್ನಡ)**) with instant 1-click toggle on all consumer touchpoints.
* **100% PostgreSQL 16 Parity**: Developed on native PostgreSQL 16 dialect with version-controlled migrations (`drizzle/`) and secondary B-Tree performance indexes. Zero toy/in-memory databases.
* **Instant Cloud/Supabase Switch**: Seamless 1-minute cloud database transition to **Supabase (AWS Mumbai `ap-south-1`)** with auto-detecting TLS/SSL connection pooling.
* **Zero-Leak Cryptographic KYC Vault**: Sensitive identity proofs are encrypted at rest using **AES-256-GCM envelope encryption** with unique 12-byte IVs. Checkers review documents via 60-second HMAC-signed ephemeral tokens.
* **Complete RBI Maker-Checker Engine**: Four-Eyes Principle strictly enforced across the complete loan account lifecycle:
  * Application Approval & Account Allocation (`GGY-YYYY-XXXXXX`)
  * Application Rejection with remediation remarks
  * Risk Hold & Account Suspension
  * Compliance Reactivation
  * Zero-Balance Account Closure & No-Dues Certificate (NOC) generation
* **Dual Inward Collection**:
  * **Digital UPI**: Dynamic NPCI Universal QR generation (`upi://pay?pa=...&am=...&tr=...`) compatible with PhonePe, Google Pay, Paytm, and BHIM.
  * **Rural Cash Collections**: Dual counter verification ensuring field officers cannot verify their own cash collections.
* **Event-Driven Notification Bus**:
  * Indian **TRAI DLT SMS** compliant templates (Header: `GGYFIN`, 19-digit template IDs).
  * **Meta WhatsApp Business Cloud API** (Graph API v21.0) template payloads with bilingual support.
* **Pluggable Cloud Object Storage**: Unified `IStorageAdapter` supporting local encrypted disk storage and cloud **AWS S3 (AWS Mumbai `ap-south-1`)** / Cloudflare R2 / Supabase Storage via native AWS SigV4.
* **Institutional Portfolio Intelligence**: Executive dashboard providing gross AUM, collection efficiency ratio (CER), quarterly turnover, estimated profit, RBI SMA-0/1/2 and Gross NPA overdue aging, PAR 30/60/90, 78% female borrower diversity metrics, taluk concentration risk alerts, and 1-click statutory CSV downloads.

---

## 2. Monorepo Structure

```
d:/Projects/GGY/
├── packages/
│   └── shared/               # Core Zod DTOs, reducing-balance EMI math, Aadhaar masking, UPI builders, TRAI DLT/WhatsApp schemas
├── apps/
│   ├── api/                  # Fastify REST API, Drizzle ORM, AES-256-GCM Vault, Maker-Checker, Analytics, Notifications
│   │   ├── drizzle/          # Version-controlled PostgreSQL DDL migration scripts & secondary indexes
│   │   └── src/              # Controllers, repositories, services, and middlewares
│   └── web/                  # Next.js 14 (App Router) + Tailwind CSS (Landing Page + Staff Portal + Analytics Console)
├── Dockerfile.api            # Multi-stage production build for Fastify REST backend
├── Dockerfile.web            # Multi-stage production build for Next.js web application
├── docker-compose.yml        # Turnkey 1-click deployment stack (Postgres 16 + API + Web)
└── README.md
```

---

## 3. Quickstart & Local Execution

### Prerequisites
* **Node.js**: v20+ or v22+
* **npm**: v10+
* **PostgreSQL 16** (or Docker)

### 1. Install Dependencies
```bash
npm install
```

### 2. Build Monorepo
```bash
npm run build
```

### 3. Run Automated Test Suite
```bash
npm test --workspaces
```
* **Status**: **47 automated unit & integration tests passing 100%**.
* **Next.js Production Build**: Compiles cleanly with 0 errors across all 9 static routes.

### 4. Start Development Servers
In separate terminal sessions:
```bash
# Terminal 1: Fastify REST API (Port 4000)
npm run dev:api

# Terminal 2: Next.js Frontend (Port 3000)
npm run dev:web
```

---

## 4. Turnkey Docker Deployment

To launch the full white-label GGY Finance stack (PostgreSQL 16, API, and Web):

```bash
# Build and launch all containers in detached mode
npm run docker:up

# View live container logs
npm run docker:logs

# Tear down stack
npm run docker:down
```

| Service | Port | Description |
| :--- | :--- | :--- |
| **PostgreSQL 16** | `5432` | Transactional database with persistent volume `ggy_postgres_data` |
| **REST API** | `4000` | Fastify backend (`http://localhost:4000/health`) |
| **Web Portal** | `3000` | Public Landing Page & Staff Portal (`http://localhost:3000`) |

---

## 5. Staff Personas & Demo Credentials

Access the Staff Portal at `http://localhost:3000/login`. Use the pre-configured quick switchers:

| Role | Username | Password | Key Responsibilities |
| :--- | :--- | :--- | :--- |
| **Branch Manager** | `manager_kavitha` | `SecurePass@123` | Branch counter vault cash verification, daily operations, portfolio monitoring |
| **Authorizer / Checker** | `authorizer_anand` | `SecurePass@123` | Dual-control 4-eyes approval, risk suspensions, zero-balance account closure |
| **Field Officer / Maker** | `field_officer_ramesh` | `SecurePass@123` | Doorstep customer onboarding, masked Aadhaar capture, dynamic UPI QR collections |
| **System Admin** | `admin_rajesh` | `SecurePass@123` | System configuration, audit trail monitoring, user role management |

---

## 6. Cloud Migration to Supabase (1-Minute Switch)

GGY Finance is engineered for seamless cloud hosting on Supabase:

1. Create a project at [supabase.com](https://supabase.com) and select **AWS Mumbai (`ap-south-1`)** for Indian data localization.
2. In `apps/api/.env`, update `DATABASE_URL`:
   ```bash
   DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=require
   ```
3. Run the migration:
   ```bash
   npm run db:migrate
   ```
4. **Done**: The database pool client automatically performs TLS/SSL handshakes, and all 8 tables, enums, and indexes are deployed instantly.

---

## 7. Compliance & Regulatory Alignment

* **RBI Digital Lending Guidelines (2022)**: Direct account-to-account disbursement, zero pass-through accounts, transparent APR/reducing balance display, and explicit DPDP Act 2023 consent capture.
* **UIDAI Aadhaar Regulations**: Strictly enforces client-side and server-side masking (`XXXX-XXXX-1234`). Storage of raw 12-digit Aadhaar numbers is strictly prevented.
* **TRAI DLT Master Direction**: Mandatory 6-character header (`GGYFIN`) and 19-digit registered template IDs for all financial transactional SMS.
* **Data Sovereignty**: Architecture strictly complies with RBI Master Direction on IT Framework, mandating data residency within Indian borders.
