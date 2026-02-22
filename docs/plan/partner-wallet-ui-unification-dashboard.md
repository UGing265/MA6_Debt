# Partner Wallet UI Unification Dashboard - Plan Snapshot

## Objective
- Unify debt partner and wallet adjustment UX across dashboard screens while standardizing money format to `xxx,xxx,xxx vnd`.
- Keep scope frontend-only and preserve existing backend/API contracts.

## Scope
- In scope: debt partner actions/dialogs, wallet adjust-sub-wallet modal, dashboard money formatting consistency, validation/accessibility hardening.
- Out of scope: backend logic, API endpoints/contracts, dependency changes, runtime QA execution.

## Key Tasks Executed (T3-T16)
- T3-T4: split partner actions (name vs money) and replace Guided/Direct with Adjust/Set contract.
- T5-T6: remove wallet modal preview, align inline `vnd` suffix UX, and normalize partner action icon alignment.
- T7-T10: wire name-only edit flow and money-only flow, remove stale Guided copy, align partner yellow style tokens with wallet baseline.
- T11-T14: roll out shared `formatVnd` usage across dashboard routes, harden parser/invalid-input behavior, and tighten keyboard/focus/aria consistency.
- T15-T16: run integrated journey and cross-screen regression checks via static audits (runtime QA skipped by user policy).

## Constraints
- No build/test/runtime QA execution per user policy.
- Runtime QA artifacts replaced by static code audits and traceable evidence docs.
- No plan checkbox changes, no backend edits, no dependency installation.

## Frontend File Map
- `frontend/src/app/(dashboard)/partners/page.tsx`
- `frontend/src/app/(dashboard)/wallets/page.tsx`
- `frontend/src/app/(dashboard)/wallets/dashboard/page.tsx`
- `frontend/src/app/(dashboard)/wallets/[id]/page.tsx`
- `frontend/src/features/debt/components/DebtPartnerForm.tsx`
- `frontend/src/features/debt/components/DebtPartnerList.tsx`
- `frontend/src/features/debt/components/HybridBalanceInput.tsx`
- `frontend/src/features/debt/components/PartnerMoneyDialog.tsx`
- `frontend/src/lib/utils.ts`

## Evidence Policy Note
- Runtime/browser evidence originally planned for several tasks is intentionally skipped and replaced with static audit artifacts due explicit user policy.
