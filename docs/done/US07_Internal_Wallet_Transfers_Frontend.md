# US07 Internal Wallet Transfers - Frontend

## Overview

This implementation adds a standalone Internal Wallet Transfer page (`/transfer`) to the MA6 Debt frontend, enabling users to transfer funds between their own wallets.

## Implementation Date

2026-02-23

## Files Created

| File | Purpose |
|------|---------|
| `frontend/src/features/transfers/types/transfer.ts` | TypeScript types for WalletDto, CreateTransferRequest, CreateTransferResponse |
| `frontend/src/features/transfers/api/transfers.ts` | API module with getTransferWallets() and createTransfer() using Bearer auth |
| `frontend/src/features/transfers/types/transferForm.ts` | Zod schema with validation rules + field map for server error mapping |
| `frontend/src/features/transfers/components/TransferForm.tsx` | Transfer form UI with wallet selects, swap, amount, note, submit |
| `frontend/src/app/(dashboard)/transfer/page.tsx` | Route page at /transfer rendering TransferForm |

## Files Modified

| File | Change |
|------|--------|
| `frontend/src/app/(dashboard)/layout.tsx` | Updated Transfer nav item: href changed from `/workspace?tab=transfer` to `/transfer`; removed "transfer" from placeholderTabs |

## Functional Changes

### New Route
- **Path**: `/transfer`
- **Access**: Via sidebar "Transfer" nav item
- **Auth**: Requires valid Bearer token

### Transfer Form Features
- **Từ ví** (From wallet): Dropdown populated from `GET /api/wallets`
- **Đến ví** (To wallet): Dropdown populated from `GET /api/wallets`
- **Swap button**: Exchanges source and destination wallets
- **Số tiền** (Amount): Numeric input, validates > 0 and <= source balance
- **Ghi chú** (Note): Optional text field (not sent to backend)
- **Chuyển tiền** (Submit): Calls `POST /api/transfers`

### Validation Rules (Client-side)
1. Source wallet required
2. Destination wallet required
3. Source != Destination
4. Amount > 0
5. Amount <= Source wallet balance

### API Integration
- **GET /api/wallets**: Fetches user's wallets for dropdowns
- **POST /api/transfers**: Creates transfer transaction
- **Auth**: Bearer token + credentials: include

### Success/Error Handling
- **Success**: Toast "Chuyển tiền thành công", form reset
- **Error**: Toast + field-level errors via parseErrorResponse

## Technical Details

### Type Definitions
```typescript
// WalletDto - matches backend WalletDto
interface WalletDto {
  id: string;
  name: string;
  balance: number;
  parentWalletId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

// CreateTransferRequest - matches backend CreateTransferRequest
interface CreateTransferRequest {
  fromWalletId: string;
  toWalletId: string;
  amount: number;
}

// CreateTransferResponse - matches backend TransferDto
interface CreateTransferResponse {
  id: string;
  fromWalletId: string;
  toWalletId: string;
  amount: number;
  createdAt: string | null;
}
```

### Validation Schema
```typescript
// Zod schema with superRefine for cross-field validation
TransferFormSchema = z.object({
  fromWalletId: z.string().min(1),
  toWalletId: z.string().min(1),
  amount: z.number().positive(),
  sourceBalance: z.number().min(0),
  note: z.string().max(500).optional(),
}).superRefine(/* cross-field rules */)
```

### Field Map for Server Errors
```typescript
TransferFormFieldMap = {
  FromWalletId: "fromWalletId",
  ToWalletId: "toWalletId",
  Amount: "amount",
}
```

## Scope Guardrails

- No backend files modified
- No test files created
- No workspace tab implementation
- No history/analytics features
- No dependency additions
- No build/test commands executed

## Manual Testing Checklist

1. Login with valid credentials
2. Navigate to `/transfer` via sidebar
3. Verify wallet dropdowns populate
4. Test swap button functionality
5. Test validation:
   - Same wallet for source and destination
   - Insufficient balance
   - Zero/negative amount
6. Submit valid transfer and verify success toast
7. Verify form resets after success

## Known Limitations

1. **Note field**: Collected in UI but not sent to backend (backend contract does not include note)
2. **No automated tests**: Per project constraint

## Related

- Backend: `docs/done/US07_Internal_Wallet_Transfers_Backend.md`
- SRS: `docs/main/SRS_v1.1.pdf` - US-07
