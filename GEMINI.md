# Project Rules & Operating Guidelines: GGY Finance Platform

## Mandatory Operating Protocol: Plan-First & Explicit User Approval
1. **Always Plan First**: After the user gives any prompt or request, you must ALWAYS analyze the request, come up with a comprehensive, step-by-step implementation plan, and present it clearly to the user.
2. **Explicit Permission Required**: You must mandatorily request and receive the user's explicit permission / go-ahead before implementing any code, modifying files, or applying changes.
3. **Strict No-Unapproved-Implementation Rule**: Do NOT implement anything without explicit user approval.
4. **Build & Runtime Verification**: Every change made must build cleanly (`npm run build`), pass all unit/integration tests (`npm test`), and run without runtime or server crashes.
5. **Mandatory Two-Pass Code Review**: Always conduct a thorough self-code-review after finalizing any code. In Pass 1, inspect for logic flaws, edge cases, boundary conditions, UI/hydration errors, and regulatory compliance. Fix any findings. In Pass 2, verify the fixes and ensure no regressions. Strictly cap at two passes to avoid loops. Once two passes pass cleanly, commit and finalize.
