# US07 Internal Wallet Transfers - Frontend Implementation Plan

## Status: COMPLETED ✅

## Overview

Implement a standalone Internal Wallet Transfer page (`/transfer`) for the MA6 Debt frontend, enabling users to transfer funds between their own wallets.

## Requirements Source

- SRS: `docs/main/SRS_v1.1.pdf` - US-07
- Backend: `docs/done/US07_Internal_Wallet_Transfers_Backend.md`

## Scope

### In Scope
- Transfer route page at `/transfer`
- Transfer form with wallet selection, amount input, note field
- Swap wallet functionality
- Client-side validation (source != destination, amount > 0, no overdraft)
- API integration with existing backend endpoints
- Sidebar navigation update

### Out of Scope
- Backend changes
- Test files
- Build/test commands
- Workspace tab transfer implementation
- Transfer history/analytics

## Technical Design

### Route Structure
```
frontend/src/app/(dashboard)/transfer/page.tsx
```

### Feature Structure
```
frontend/src/features/transfers/
├── api/
│   └── transfers.ts          # API module
├── components/
│   └── TransferForm.tsx      # Form component
└── types/
    ├── transfer.ts           # API types
    └── transferForm.ts       # Form schema + field map
```

### API Endpoints
- `GET /api/wallets` - Fetch user's wallets
- `POST /api/transfers` - Create transfer

### Auth Style
Match existing wallet API pattern:
- `Authorization: Bearer <token>`
- `credentials: "include"`

## Tasks

### Phase 1: Foundation
- [x] 1. Create transfer type contracts from backend DTOs
- [x] 2. Implement transfer API module with auth
- [x] 3. Create transfer form schema with validation

### Phase 2: UI & Integration
- [x] 4. Build TransferForm component
- [x] 5. Create `/transfer` route page
- [x] 6. Update sidebar nav to point to `/transfer`

### Phase 3: Verification
- [x] 7. Static bug-check and change-impact summary

## Validation Rules

| Rule | Field | Message |
|------|-------|---------|
| Required | fromWalletId | FromWalletId is required |
| Required | toWalletId | ToWalletId is required |
| Positive | amount | Amount must be greater than zero |
| Different wallets | toWalletId | FromWalletId and ToWalletId must be different |
| No overdraft | amount | Insufficient balance in source wallet |

## Files to Create

1. `frontend/src/features/transfers/types/transfer.ts`
2. `frontend/src/features/transfers/api/transfers.ts`
3. `frontend/src/features/transfers/types/transferForm.ts`
4. `frontend/src/features/transfers/components/TransferForm.tsx`
5. `frontend/src/app/(dashboard)/transfer/page.tsx`

## Files to Modify

1. `frontend/src/app/(dashboard)/layout.tsx` - nav update only

## Dependencies

- Backend US-07 must be complete (✅)
- Auth token storage must be working (✅)
- Wallet API must be functional (✅)

## Success Criteria

- [x] Transfer accessible at `/transfer` from sidebar
- [x] Transfer form loads wallets via API
- [x] Validation prevents invalid transfers
- [x] Submit creates transfer via API
- [x] Success toast shown on completion
- [x] No backend files modified
- [x] No test files created

## Implementation Notes

- Note field collected in UI but not sent to backend (backend contract limitation)
- Used `.positive()` for amount validation (Zod compatibility)
- Field map handles both PascalCase (backend) and camelCase (frontend) error keys

## Completed

2026-02-23

## Related Documentation

- Done: `docs/done/US07_Internal_Wallet_Transfers_Frontend.md`
- Backend: `docs/done/US07_Internal_Wallet_Transfers_Backend.md`
