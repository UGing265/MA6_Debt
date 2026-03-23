# US03/US04 - Quick Deduct Frontend Plan

## Overview
Implement FE-only Quick Deduct page with two tabs (Quick Debt + Adjustment) following warm cream/amber design system from screenshots.

## Scope
- FE-only (no backend changes)
- No test files
- No build/lint/test pipeline changes

## Design Reference
- Screenshot 1: `img/Screenshot 2026-02-23 001204.png`
- Screenshot 2: `img/Screenshot 2026-02-23 001245.png`

## Design Tokens

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--bg-page` | `#FBF6E9` | Page background |
| `--surface-card` | `#F9F6EF` | Card fill |
| `--border-card` | `#F2C38B` | Card border (2px) |
| `--accent-500` | `#E68600` | Primary orange |
| `--accent-600` | `#D97900` | Hover state |
| `--text-primary` | `#0B1B3A` | Main text |
| `--text-secondary` | `#6B7485` | Muted text |
| `--surface-muted` | `#F1EEE7` | Toggle row bg |

### Spacing
- Card padding: 24px
- Card border-radius: 14px
- Field height: 44px
- CTA height: 52px

## Tasks

### Wave 1: Feature Module
- [ ] 1. Create `frontend/src/features/transaction/types/transaction.ts`
  - TypeScript contracts, enums (PayerMode, AdjustmentDirection)
  
- [ ] 2. Create `frontend/src/features/transaction/api/transactions.ts`
  - `quickDeductTransaction()`, `createCashAdjustment()` with Bearer auth
  
- [ ] 3. Create `frontend/src/features/transaction/model/quickDeduct.ts`
  - Zod schemas + mappers for Quick Debt (ON/OFF tag logic)
  
- [ ] 4. Create `frontend/src/features/transaction/model/adjustment.ts`
  - Zod schema + mapper for Adjustment
  
- [ ] 5. Create `frontend/src/features/transaction/hooks/useTransactionSubmit.ts`
  - Submit hooks + `notifyTransactionSubmitSuccess()` for cross-feature refresh

### Wave 2: UI Components
- [ ] 6. Create `frontend/src/features/transaction/components/QuickDebtForm.tsx`
  - Amount input with label "Số tiền (- chi / + thu)"
  - Wallet selector with label "Ví con nguồn"
  - Note field with label "Ghi chú"
  - Payer buttons: "Tôi trả" + "Partner trả"
  - Debt tag toggle with label "Gắn thẻ nợ"
  - Conditional partner + debt amount fields
  - Submit button "Ghi nhận"
  
- [ ] 7. Create `frontend/src/features/transaction/components/AdjustmentForm.tsx`
  - Wallet, direction, amount, note fields
  - Submit button

### Wave 3: Route Integration
- [ ] 8. Create `frontend/src/app/(dashboard)/quick-deduct/page.tsx`
  - Two tabs: Quick Debt + Điều chỉnh ví
  - Card with warm cream styling
  - Tab buttons with orange active state
  
- [ ] 9. Update `frontend/src/app/(dashboard)/layout.tsx`
  - Nav Quick Deduct -> `/quick-deduct`
  - Remove "Soon" badge
  
- [ ] 10. Update `frontend/src/app/(dashboard)/workspace/page.tsx`
  - Redirect `?tab=quick-deduct` to `/quick-deduct`

### Wave 4: Cross-feature Refresh
- [ ] 11. Update `frontend/src/features/wallet/hooks/useWallets.ts`
  - Add `triggerWalletsRefresh()` listener
  
- [ ] 12. Update `frontend/src/features/debt/hooks/useDebtPartners.ts`
  - Add `triggerDebtPartnersRefresh()` listener

### Wave 5: Hardening
- [ ] 13. Fix error double-parsing in `frontend/src/features/auth/utils/errorParser.ts`
  - Handle already-parsed `{ general, fields }` format
  
- [ ] 14. UX improvements in QuickDebtForm
  - Disable submit when no child wallets
  - Clear notification on submit start

## API Endpoints
- `POST /api/transactions/quick-deduct`
- `POST /api/transactions/adjustment`
- `GET /api/wallets`
- `GET /api/debtpartners`

## Acceptance Criteria
- [ ] Login -> Dashboard -> Quick Deduct nav works
- [ ] Both tabs render correctly
- [ ] Quick Debt form submits to API
- [ ] Adjustment form submits to API
- [ ] Field errors display correctly
- [ ] Success toast shows after submit
- [ ] Dashboard data refreshes after submit
