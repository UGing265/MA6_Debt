# US03/US04 - Quick Deduct Frontend Implementation

## Overview
Implement FE-only Quick Deduct page with two tabs (Quick Debt + Adjustment) following warm cream/amber design system.

## Implementation Date
2026-02-23

## Files Modified/Created

### New Files
- `frontend/src/features/transaction/types/transaction.ts` - TypeScript contracts, enums (PayerMode, AdjustmentDirection)
- `frontend/src/features/transaction/api/transactions.ts` - API functions with Bearer auth
- `frontend/src/features/transaction/model/quickDeduct.ts` - Zod schemas + mappers for Quick Debt
- `frontend/src/features/transaction/model/adjustment.ts` - Zod schema + mapper for Adjustment
- `frontend/src/features/transaction/model/index.ts` - Barrel export
- `frontend/src/features/transaction/components/QuickDebtForm.tsx` - Form with Vietnamese labels
- `frontend/src/features/transaction/components/AdjustmentForm.tsx` - Adjustment form
- `frontend/src/features/transaction/components/index.ts` - Component barrel
- `frontend/src/features/transaction/hooks/useTransactionSubmit.ts` - Submit hooks + refresh orchestration

### Modified Files
- `frontend/src/app/(dashboard)/quick-deduct/page.tsx` - New route with tabs
- `frontend/src/app/(dashboard)/layout.tsx` - Nav rewired to `/quick-deduct`
- `frontend/src/app/(dashboard)/workspace/page.tsx` - Legacy redirect handoff
- `frontend/src/features/wallet/hooks/useWallets.ts` - Added `triggerWalletsRefresh()`
- `frontend/src/features/debt/hooks/useDebtPartners.ts` - Added `triggerDebtPartnersRefresh()`
- `frontend/src/features/auth/utils/errorParser.ts` - Fixed double-parsing bug

## Features

### Quick Debt Tab
- Amount input with label "Số tiền (- chi / + thu)"
- Wallet selector (child wallets only) with label "Ví con nguồn"
- Note field with label "Ghi chú"
- Payer buttons: "Tôi trả" (filled) + "Partner trả" (outlined)
- Debt tag toggle with label "Gắn thẻ nợ"
- Conditional fields when debt tag ON:
  - Partner dropdown
  - Debt amount input
- Submit button "Ghi nhận" with lightning icon

### Adjustment Tab
- Wallet selector (child wallets only)
- Direction selector (Credit/Debit)
- Amount input
- Note field
- Submit button

## Design Tokens

### Colors
- Background page: `#FBF6E9` (warm cream)
- Card surface: `#F9F6EF`
- Card border: `#F2C38B` (light orange)
- Primary orange: `#E68600`
- Text primary: `#0B1B3A`
- Text secondary: `#6B7485`
- Input background: `#FBF7EA`
- Muted row: `#F1EEE7`

### Spacing
- Card padding: 24px
- Border radius: 14px
- Border width: 2px

## Bug Fixes Applied

### Critical
- **Error double-parsing**: Fixed `parseErrorResponse` to handle already-parsed `{ general, fields }` format

### Medium
- **Submit disabled**: Button disabled when no child wallets available
- **Stale notification**: Cleared at submit start to prevent showing old success messages

## API Integration
- `POST /api/transactions/quick-deduct` - Quick debt submission
- `POST /api/transactions/adjustment` - Cash adjustment
- `GET /api/wallets` - Fetch wallets for dropdown
- `GET /api/debtpartners` - Fetch partners for dropdown

## Constraints
- FE-only implementation (no backend changes)
- No test files created
- No build/lint/test pipeline changes

## Known Limitations
- Runtime QA blocked due to Node unavailability in environment
- Static verification only
