# Project Rules & Operating Guidelines: GGY Finance Platform

## Mandatory Operating Protocol: Plan-First & Explicit User Approval
1. **Always Plan First**: After the user gives any prompt or request, you must ALWAYS analyze the request, come up with a comprehensive, step-by-step implementation plan, and present it clearly to the user.
2. **Explicit Permission Required**: You must mandatorily request and receive the user's explicit permission / go-ahead before implementing any code, modifying files, or applying changes.
3. **Strict No-Unapproved-Implementation Rule**: Do NOT implement anything without explicit user approval.
4. **Build & Runtime Verification**: Every change made must build cleanly (`npm run build`), pass all unit/integration tests (`npm test`), and run without runtime or server crashes.
5. **Mandatory Two-Pass Code Review**: Always conduct a thorough self-code-review after finalizing any code. In Pass 1, inspect for logic flaws, edge cases, boundary conditions, UI/hydration errors, and regulatory compliance. Fix any findings. In Pass 2, verify the fixes and ensure no regressions. Strictly cap at two passes to avoid loops. Once two passes pass cleanly, commit and finalize.
6. **Port Hygiene & Zero Orphaned Server Policy (EADDRINUSE Prevention)**:
   - **Strict Prohibition on Orphaned Daemons**: Never leave any background or daemon Node.js servers running on developer ports (`3000` for web, `4000` for API) after completing a turn.
   - **Ephemeral Verification Only**: If a server is started to verify runtime HTTP status, it must be terminated immediately after the check finishes.
   - **Mandatory Port Release Check**: Before concluding any turn, always verify that ports 3000 and 4000 are 100% free (`netstat -ano | findstr LISTENING | findstr :3000` must return zero results). The user must always have immediate, unimpeded access to start `npm run dev:web`.
7. **Clean Build & Windows File-Lock Protection**:
   - **No Concurrent Builds**: Never run `npm run build` while a dev or start server is active on port 3000 or 4000 (prevents Windows file locks on `.next\server` chunks and `MODULE_NOT_FOUND` errors).
   - **Clean Cache Discipline**: If any chunk mismatch or build artifact corruption is detected, always purge the `.next` directory (`Remove-Item -Recurse -Force apps\web\.next`) before re-executing `npm run build`.
   - **Mandatory Post-Change Pipeline**: Every code modification must execute in this exact sequence:
     1. Unit & Integration Tests: `npm test` (all tests passing).
     2. Verify port 3000/4000 are free from background tasks.
     3. Clean Production Build: `npm run build` (all routes compiled cleanly).
     4. Ensure all verification processes are killed and ports 3000/4000 are fully released.
8. **Pure-Numeric Employee Identification Specification**:
   - **Strict Numeric Requirement**: Employee numbers must contain zero characters, zero hyphens, and zero spaces (`^\d+$`).
   - **Branch Numbering Structure**: Based on branch code (first branch: `2020`).
   - **Reserved Sequence**: The first 10 numbers (`202000` through `202009`) are reserved for branch infrastructure.
   - **Assigned Progression**: First employee number is strictly **`202010`**. Next employee is **`202011`**, then **`202012`**, etc.
   - **Monotonic ID Generation**: Never rely on array length (`length + 1`); always calculate `max(parsedId >= 202010) + 1` to prevent collisions on deprovisioning.
9. **Mandatory Dual-Layer Input Validation (Client & Server)**:
   - **Zero-Trust Input Principle**: Never assume any input is good or safe. Validation and character sanitization must be symmetrically enforced on BOTH the client-side UI and server-side Fastify controllers.
   - **Mobile Phone Numbers**: Strictly 10 digits starting with `[6-9]` (`/^[6-9]\d{9}$/`). Client-side inputs must strip non-digit characters (`\D`) on input/paste; server schemas must reject any non-compliant phone payload.
   - **Email Addresses**: RFC 5322 compliant regex (`/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`), min 5, max 254 characters (SMTP standard).
   - **Full Legal Names**: 2 to 70 characters, letters, spaces, dots, single quotes, and hyphens only (`/^[a-zA-Z\s.'-]+$/`). Strictly block HTML tags (`<`, `>`), curly brackets, and script injection vectors.
   - **Usernames**: 3 to 30 characters, alphanumeric, underscores, and hyphens only (`/^[a-zA-Z0-9_-]{3,30}$/`). No spaces, dots, or symbols.
   - **Passwords**: Min 8, max 128 characters. Must contain uppercase, lowercase, digit, and special character. Disallow reuse of current password on rotation.
   - **Financial Amounts & Statutory Caps**:
     - Principal Sanction: Positive number between ₹10,000 and ₹2,00,000.
     - Cash Collection: Positive number between ₹1 and ₹2,00,000 (Statutory Income Tax Act Sec 269ST cap).
     - UPI Repayment: Positive number between ₹1 and ₹1,00,000 with 12-digit UTR.

