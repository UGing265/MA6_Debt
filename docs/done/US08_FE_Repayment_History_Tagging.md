# US08 - FE Repayment and History Tagging Iteration

## Overview
Documenting the latest frontend changes requested in this iteration, focused on debt repayment UX, history clarity, and partner-related UI cleanup.

## Implementation Date
2026-03-02

## Scope Completed

### 1) Wallet Detail Cleanup
- Removed "Adjust Sub-wallet Balance" section from wallet detail page UI.
- Reason: this action should not appear in the transaction detail flow requested by user.

### 2) Dashboard Recent History: Mock -> Real API
- Replaced mock recent history data with `getHistory({ page: 1, pageSize: 5 })`.
- Added refresh subscription via `subscribeToHistoryRefresh(...)`.
- Added loading/error/empty states for dashboard recent history.

### 3) Partners List Cleanup
- Removed partner card history button from partners page as requested.

### 4) History Presentation Improvements
- Added explicit full date (`dd/mm/yyyy`) in history rows.
- Note/title is now emphasized (`text-base`, `font-semibold`).
- Added payer mode tag for partner transactions:
  - `Toi tra`
  - `Partner tra`

### 5) Quick Debt Validation Fix
- Fixed immediate validation error when toggling payer mode to Partner Pays.
- Removed eager validation trigger on payer mode buttons in `QuickDebtForm`.
- Validation remains enforced on submit.

### 6) New Partners "Repay Debt" Feature
- Added dedicated `Repay Debt` action on partner cards.
- Added repayment dialog with:
  - Child wallet selection
  - Amount input
  - Note input
  - Who paid selector (`I Paid` / `Partner Paid`)
  - Projected balance preview
- Added safety guard: prevent submission when selected payer mode increases debt instead of reducing it.
- Decision applied: user decides payer mode, system gives smart default suggestion from current balance.

### 7) History Tag Taxonomy (Requested)
- Added transaction kind tags in history surfaces:
  - `bill`: partner-related non-repayment debt entries
  - `repay`: debt repayment entries
  - `consume`: non-partner spending (`amount < 0`)
  - `salary`: non-partner inflow (`amount > 0`)
- Transfer entries (`transferId != null`) are excluded from these tags.

## Repay Marker Strategy
- Introduced internal marker: `[repay]` for repayment notes.
- Marker is added when creating repayment transactions.
- Marker is stripped from UI display so user sees clean note text.
- Marker is preserved when editing existing repayment notes.

## Key Files Updated
- `frontend/src/app/(dashboard)/wallets/[id]/page.tsx`
- `frontend/src/app/(dashboard)/wallets/dashboard/page.tsx`
- `frontend/src/app/(dashboard)/partners/page.tsx`
- `frontend/src/features/transaction/components/QuickDebtForm.tsx`
- `frontend/src/features/debt/components/PartnerRepaymentDialog.tsx`
- `frontend/src/features/history/components/HistoryRow.tsx`
- `frontend/src/features/history/components/TransactionDetailPage.tsx`
- `frontend/src/features/history/utils/historyKind.ts`

## Verification Notes
- Static diff verification completed for all modified files.
- Runtime LSP/typecheck/build could not run in this environment because `node` is unavailable for `typescript-language-server`.
- No test files were added (per FE-only request in this cycle).
