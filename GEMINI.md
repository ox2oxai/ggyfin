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
