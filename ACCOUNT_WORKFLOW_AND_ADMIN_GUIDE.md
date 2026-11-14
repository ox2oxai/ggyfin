# GGY Finance: Core Banking Account Lifecycle & Admin Operations Guide

**Platform:** GGY Finance (Micro Money Lending Platform — RBI Base-Layer NBFC)  
**Parity:** 100% Native PostgreSQL 16 • **API Server:** `http://localhost:4000` • **Web App:** `http://localhost:3000`

---

## 1. Staff Authentication & Admin Login Setup

### 1. Pre-Configured Staff Accounts (Development & Demo)
The database seeder (`npm run db:seed --workspace=@nbfc/api`) provisions four distinct operational personas across Karnataka clusters:

| Role | Username | Default Password | Branch Code | Permissions & Responsibilities |
| :--- | :--- | :--- | :--- | :--- |
| **SYSTEM_ADMIN** | `admin` | `GGYSecurePassword@2026` | `KA-HQ-01` | System configuration, staff management, audit log inspection, cloud backups. |
| **BRANCH_MANAGER** | `manager_blr` | `GGYSecurePassword@2026` | `KA-BLR-01` | Branch operations, vault cash deposit verification, field schedule oversight. |
| **AUTHORIZER (Checker)** | `authorizer_blr` | `GGYSecurePassword@2026` | `KA-BLR-01` | **Sole approval authority**: Audits KYC documents, approves/rejects loans, issues account numbers, authorizes suspensions, issues No-Dues Certificates (NOC). |
| **FIELD_OFFICER (Maker)**| `officer_ramesh` | `GGYSecurePassword@2026` | `KA-BLR-01` | Doorstep customer onboarding, masked KYC upload, loan drafting, cash collection logging. |

---

### 2. How to Authenticate & Obtain a Staff JWT Token
Submit a `POST` request to `/api/v1/auth/login`:

```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "GGYSecurePassword@2026"
  }'
```

**Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "u-admin-uuid",
      "username": "admin",
      "email": "admin@ggyfinance.in",
      "role": "SYSTEM_ADMIN",
      "branchCode": "KA-HQ-01"
    }
  }
}
```
Include this token in all subsequent requests as:
```text
Authorization: Bearer <accessToken>
```

---

### 3. How to Set or Change Admin Password (Production)
In production, passwords use **Bcrypt** with 10 salt rounds. To generate a new hash:

```bash
node -e "console.log(require('bcryptjs').hashSync('YourNewStrongPassword@2026', 10))"
```
Update the admin user in PostgreSQL:
```sql
UPDATE users 
SET password_hash = '$2a$10$YourGeneratedBcryptHashHere...', 
    updated_at = NOW() 
WHERE username = 'admin';
```

---

## 2. Complete Core Banking Account Lifecycle & State Machine

```
                   [Field Officer / Maker]
                              │
                              ▼
                1. CREATE CUSTOMER (CIF)
                   - Masked Aadhaar (XXXX-XXXX-1234)
                   - Explicit DPDP 2023 Consent
                              │
                              ▼
                2. DRAFT LOAN ACCOUNT
                   - Status: PENDING_APPROVAL
                   - Temp No: DRAFT-XXXXXX
                              │
                              ▼
                   [Authorizer / Checker]
                              │
            ┌─────────────────┴─────────────────┐
            ▼                                   ▼
      REJECT LOAN                         APPROVE LOAN
      - Status: DRAFT                     - Status: ACTIVE
      - Remediation remarks               - Core Acc No: GGY-2026-M48101
                                          - TRAI SMS & WhatsApp dispatched
                                                │
                                                ▼
                                    3. DISBURSEMENT (DEBIT)
                                       - Disbursed to borrower bank account
                                                │
                                                ▼
                                    4. INWARD REPAYMENTS (CREDIT)
                                       - UPI QR (Instant settlement) OR
                                       - Cash Receipt (Dual-Control Verified)
                                       - Balance reduces under ACID row lock
                                                │
                     ┌──────────────────────────┴──────────────────────────┐
                     ▼                                                     ▼
            5. RISK HOLD / SUSPENSION                             6. ZERO-BALANCE SETTLEMENT
               - Status: SUSPENDED                                   - Current Balance = ₹0.00
               - Dual control authorized                             - Authorizer checks dues
                     │                                                     │
                     ▼                                                     ▼
            RESTORE TO ACTIVE                                     ISSUE NOC & CLOSE
            - Status: ACTIVE                                      - Status: CLOSED
                                                                  - Cert: NOC-GGY-2026-XXXXXX
```

---

## 3. Step-by-Step API Walkthrough with Examples

### Step 1: Create Customer Profile (CIF Onboarding)
**Role:** Field Officer / Branch Manager  
**Endpoint:** `POST /api/v1/customers`

```bash
curl -X POST http://localhost:4000/api/v1/customers \
  -H "Authorization: Bearer <FIELD_OFFICER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Smt. Shanthamma Gowda",
    "phone": "9845012399",
    "dob": "1988-05-14",
    "gender": "FEMALE",
    "addressLine": "House No. 24, Near Dairy Union, Maddur Taluk",
    "pincode": "571428",
    "state": "Karnataka",
    "consentGranted": true
  }'
```
*Note: `consentGranted: true` is strictly mandatory under DPDP Act 2023. Generates unique CIF: `CIF-2026-XXXXXX`.*

---

### Step 2: Upload Encrypted KYC Document
**Role:** Field Officer  
**Endpoint:** `POST /api/v1/kyc/upload` (Multipart Form)

```bash
curl -X POST http://localhost:4000/api/v1/kyc/upload \
  -H "Authorization: Bearer <FIELD_OFFICER_TOKEN>" \
  -F "customerId=<CUSTOMER_UUID>" \
  -F "docType=AADHAAR" \
  -F "identifier=XXXX-XXXX-4821" \
  -F "file=@/path/to/masked_aadhaar.jpg"
```
*Note: The backend envelope-encrypts the image with AES-256-GCM. Unmasked 12-digit Aadhaar identifiers are rejected.*

---

### Step 3: Maker Drafts Loan Application
**Role:** Field Officer (Maker)  
**Endpoint:** `POST /api/v1/accounts`

```bash
curl -X POST http://localhost:4000/api/v1/accounts \
  -H "Authorization: Bearer <FIELD_OFFICER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "<CUSTOMER_UUID>",
    "loanPurpose": "DAIRY_LIVESTOCK",
    "principalAmount": 75000,
    "interestRatePercent": 13.0,
    "tenureMonths": 18
  }'
```
**Outcome:**
* Generates a draft account in `PENDING_APPROVAL` status with temporary account number `DRAFT-XXXXXX`.
* Reducing balance EMI is calculated automatically (₹4,607.33/month).

---

### Step 4: Checker Approves Loan (4-Eyes Dual Control)
**Role:** Authorizer (Checker)  
**Rule:** `makerUserId !== checkerUserId` (Maker cannot approve their own application).  
**Endpoint:** `POST /api/v1/accounts/:id/approve`

```bash
curl -X POST http://localhost:4000/api/v1/accounts/<ACCOUNT_UUID>/approve \
  -H "Authorization: Bearer <AUTHORIZER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "remarks": "KYC verified in vault. Livelihood and milch cattle inspected. Approved under RBI dual control."
  }'
```
**Outcome:**
* Status transitions to `ACTIVE`.
* Core Banking Account Number allocated: `GGY-2026-XXXXXX`.
* Dispatches welcome notification to borrower via TRAI DLT SMS and WhatsApp.

---

### Step 5: Money & Transactions (Inward Repayments)

#### Option A: Dynamic UPI Repayment
1. **Generate Dynamic QR:** `POST /api/v1/collections/upi/qr`
   ```bash
   curl -X POST http://localhost:4000/api/v1/collections/upi/qr \
     -H "Authorization: Bearer <TOKEN>" \
     -H "Content-Type: application/json" \
     -d '{
       "accountId": "<ACCOUNT_UUID>",
       "amount": 4650
     }'
   ```
2. **Customer Scans & Pays** using PhonePe, GPay, Paytm, or BHIM.
3. **Confirm UPI Settlement via NPCI UTR:** `POST /api/v1/collections/upi/confirm`
   ```bash
   curl -X POST http://localhost:4000/api/v1/collections/upi/confirm \
     -H "Authorization: Bearer <AUTHORIZER_OR_MANAGER_TOKEN>" \
     -H "Content-Type: application/json" \
     -d '{
       "accountId": "<ACCOUNT_UUID>",
       "amount": 4650,
       "utrNumber": "432109876543",
       "notes": "EMI installment received via PhonePe UPI"
     }'
   ```
   *Outcome: Atomically locks account row (`FOR UPDATE`), deducts balance, inserts into `transactions` table, and sends digital receipt.*

#### Option B: Dual-Control Physical Cash Receipt
1. **Field Agent Collects Cash & Logs Receipt:**
   ```bash
   curl -X POST http://localhost:4000/api/v1/collections/cash/receipt \
     -H "Authorization: Bearer <FIELD_OFFICER_TOKEN>" \
     -H "Content-Type: application/json" \
     -d '{
       "accountId": "<ACCOUNT_UUID>",
       "amount": 4650,
       "receiptNumber": "RCPT-20261114-A101",
       "notes": "Cash collected at Shivaji Chowk"
     }'
   ```
2. **Branch Manager Verifies Physical Deposit in Vault:**
   ```bash
   curl -X POST http://localhost:4000/api/v1/collections/cash/<RECEIPT_UUID>/verify \
     -H "Authorization: Bearer <BRANCH_MANAGER_TOKEN>" \
     -H "Content-Type: application/json" \
     -d '{
       "status": "VERIFIED_AND_DEPOSITED",
       "notes": "Physical cash verified and deposited into Mandya branch counter safe"
     }'
   ```
   *Outcome: The field agent is blocked from verifying their own cash. The manager confirms deposit, crediting the loan ledger atomically.*

---

### Step 6: Account Suspension & Reactivation (Risk Hold)
If an account is under investigation (e.g. legal inquiry or dispute):

```bash
# 1. Suspend Account (Authorizer)
curl -X POST http://localhost:4000/api/v1/accounts/<ACCOUNT_UUID>/suspend \
  -H "Authorization: Bearer <AUTHORIZER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{ "reason": "Investigating suspected identity discrepancy" }'

# 2. Reactivate Account (Authorizer)
curl -X POST http://localhost:4000/api/v1/accounts/<ACCOUNT_UUID>/reactivate \
  -H "Authorization: Bearer <AUTHORIZER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{ "reason": "Discrepancy resolved. Re-verified by branch manager." }'
```

---

### Step 7: How to Delete / Close an Account (Zero-Balance Rule)

> [!IMPORTANT]
> **Why Accounts Cannot Be Deleted via `DELETE FROM accounts`**:  
> In RBI-regulated core banking, financial transaction records and ledger histories cannot be deleted from the database. PMLA (Prevention of Money Laundering Act) and RBI guidelines mandate retaining audit trails for **at least 8 years**. Instead, accounts undergo formal **Closure**.

#### The Strict Zero-Balance Guard:
* If an account has an outstanding balance $> ₹0.00$, the system **strictly rejects closure with HTTP 403**:
  `"RBI Core Banking Violation: Cannot close loan with pending dues of ₹X. Outstanding balance must be fully repaid or settled (<= ₹0.00)."`
* Once the customer pays all EMIs and the balance reaches `₹0.00`, the Authorizer calls:

```bash
curl -X POST http://localhost:4000/api/v1/accounts/<ACCOUNT_UUID>/close \
  -H "Authorization: Bearer <AUTHORIZER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "closureReason": "LOAN_PAID_IN_FULL",
    "remarks": "All 18 EMIs received in full. Outstanding balance is exactly ₹0.00. Loan closed."
  }'
```

**Outcome (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Account successfully closed and No-Dues Certificate issued under RBI dual control",
  "data": {
    "id": "<ACCOUNT_UUID>",
    "accountNumber": "GGY-2026-M48101",
    "status": "CLOSED",
    "nocNumber": "NOC-GGY-2026-B819FA",
    "closureReason": "LOAN_PAID_IN_FULL"
  }
}
```
* Generates official digital **No-Dues Certificate reference (`NOC-GGY-YYYY-XXXXXX`)**.
* Releases all customer liabilities and triggers automated closure notification.
* Preserves complete historical audit trail in `audit_logs` and `transactions` for RBI inspections.
