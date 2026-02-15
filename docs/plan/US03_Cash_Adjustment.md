# US-03 Cash Adjustment Transaction Implementation Plan

## Overview

Dedicated transaction flow for manual wallet cash adjustments (add/subtract), separate from QuickDeduct. Personal-only with mandatory reason for audit trail.

**Status**: Planning Phase  
**Scope**: Backend (Application + API layers)  
**Risk Level**: Low (uses existing transaction infrastructure)

---

## Problem Statement

Current system lacks a dedicated flow for:
- Setting initial wallet balance ("opening balance" without that naming)
- Adding cash to wallet (e.g., ATM withdrawal → cash)
- Subtracting cash (e.g., gave cash to friend)

QuickDeduct (US-03) is designed for expenses with optional debt tagging, not for pure cash movements.

---

## Solution Approach

### 1. Dedicated Adjustment Flow

New endpoint: `POST /api/transactions/adjustment`

**Characteristics**:
- Personal-only (no partner, no debt)
- Reason required (audit trail)
- Direction-based: credit (add) / debit (subtract)
- Uses existing transaction ledger

### 2. Data Flow

```
Request: { walletId, direction, amount, reason }
  ↓
Validation: wallet ownership, amount > 0, reason length
  ↓
Handler: signedAmount = direction == credit ? +amount : -amount
  ↓
Transaction: { amount: signedAmount, note: reason, partnerId: null }
  ↓
Response: TransactionDto
```

---

## API Contract

### Request

```json
POST /api/transactions/adjustment
{
  "walletId": "550e8400-e29b-41d4-a716-446655440000",
  "direction": 0,  // 0 = Credit (add), 1 = Debit (subtract)
  "amount": 500000,
  "reason": "Rút tiền ATM chuyển sang tiền mặt",
  "transactionDate": "2026-02-15T10:30:00Z"
}
```

### Response (201 Created)

```json
{
  "id": "...",
  "walletId": "550e8400-e29b-41d4-a716-446655440000",
  "partnerId": null,
  "partnerName": null,
  "amount": 500000,
  "note": "Rút tiền ATM chuyển sang tiền mặt",
  "transactionDate": "2026-02-15T10:30:00Z",
  "createdAt": "2026-02-15T10:30:00Z",
  "payerMode": null,
  "totalAmount": null,
  "debtAmount": null
}
```

### Validation Errors (400)

- Missing `walletId`
- `amount <= 0`
- Missing/short `reason` (< 3 chars)
- `reason` too long (> 255 chars)
- Wallet not found/not owned

---

## Implementation Files

### New Files

1. `backend/src/Application/Features/Transactions/CashAdjustment/CreateCashAdjustmentCommand.cs`
   - Command DTO with direction enum

2. `backend/src/Application/Features/Transactions/CashAdjustment/CreateCashAdjustmentValidator.cs`
   - Validation rules (wallet ownership, reason required)

3. `backend/src/Application/Features/Transactions/CashAdjustment/CreateCashAdjustmentCommandHandler.cs`
   - Handler logic (signed amount calculation)

### Modified Files

4. `backend/src/API/Controllers/TransactionsController.cs`
   - Add `POST /api/transactions/adjustment` endpoint

### Documentation

5. `docs/plan/US03_Cash_Adjustment.md` (this file)
6. `docs/done/US03_Cash_Adjustment.md` (completion report)

---

## Validation Rules

| Rule | Validation | Error Message |
|------|------------|---------------|
| UserId required | Not empty | "UserId is required" |
| WalletId required | Not empty | "WalletId is required" |
| Amount positive | > 0 | "Amount must be greater than 0" |
| Reason required | Not empty | "Reason is required for audit trail" |
| Reason min length | >= 3 | "Reason must be at least 3 characters" |
| Reason max length | <= 255 | "Reason cannot exceed 255 characters" |
| Wallet ownership | DB check | "Wallet does not belong to current user" |

---

## Design Decisions

### Why Separate from QuickDeduct?

- QuickDeduct has debt tagging complexity
- Adjustment is pure wallet movement
- Different business semantics

### Why Direction Enum Instead of Signed Amount?

- Clearer API (credit/debit vs positive/negative)
- Prevents double-negative confusion
- Matches accounting terminology

### Why Reason Required?

- Audit trail for manual adjustments
- Distinguishes from automated transactions
- Financial accountability

---

## Constraints & Guardrails

### Must Follow
- ✅ Reuse existing `transactions` table
- ✅ Use existing wallet balance calculation
- ✅ Return `TransactionDto` (consistent format)
- ✅ Set `partnerId = null` (personal-only)

### Must NOT Do
- ❌ Allow partner/debt fields in request
- ❌ Name as "opening balance"
- ❌ Create separate adjustments table
- ❌ Modify schema

---

## Out of Scope

- Bulk adjustments
- Scheduled/recurring adjustments
- Approval workflow
- Notifications
- Analytics/reporting
- UI components

---

## Verification Checklist

### Before Implementation
- [ ] Confirm TransactionDto has all needed fields
- [ ] Verify wallet balance calculation logic

### After Implementation
- [ ] Credit adjustment increases wallet balance
- [ ] Debit adjustment decreases wallet balance
- [ ] Missing reason returns 400
- [ ] Non-owned wallet returns 404
- [ ] Transaction appears in GET /api/transactions

---

## References

- `docs/main/SRS_v1.1.pdf` - US-03 Quick Deduct (reference only)
- `docs/done/US03_US04_QuickDeduct_Backend.md` - QuickDeduct implementation
- `RULES.md` - Project conventions

---

*Plan created by Atlas on 2026-02-15*
