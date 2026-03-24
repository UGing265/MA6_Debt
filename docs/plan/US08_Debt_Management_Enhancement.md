---
title: US-08: Debt Management Enhancement
status: completed
created: 2026-02-26
priority: high
---

# US-08: Debt Management Enhancement

## Business Requirements

### BR-1: Add Debt to Existing Transaction
**Scenario:** User pays 100k bill (includes partner A's share), but forgets to tag debt at that moment.
- User enters 100k via Quick Deduct WITHOUT debt info
- Later, user wants to add "Partner A owes 30k" to this transaction
- **Flow:** History → Transaction Detail → "Add Debt" button → Select Partner + Amount → Save

### BR-2: View Partner Transaction History
**Scenario:** User wants to see why Partner A's balance is 150k.
- **Flow:** Partners → Click History icon on partner card → See all transactions with that partner

### BR-3: Edit Existing Debt Info
**Scenario:** User entered wrong debt amount, wants to correct it.
- **Flow:** History → Transaction Detail → "Edit Debt" button → Modify fields → Save

### BR-4: Fix PartnerTra Bug (Critical)
**Bug:** PartnerTra mode was calculating wrong partner balance
- Input: Total=100k, DebtAmount=30k (user consumed 30k, partner paid)
- Expected: Partner balance = -30k (user owes partner 30k)
- Actual (before fix): Partner balance = -70k ❌

---

## Technical Design

### Backend Changes

#### 1. Fix PartnerTra Bug
**Files:**
- `QuickDeductCommandHandler.cs`
- `UpdateTransactionCommandHandler.cs`

**Before:**
```csharp
partnerDelta = -(request.Total - debtAmount.Value);  // -70k ❌
```

**After:**
```csharp
partnerDelta = -debtAmount.Value;  // -30k ✅
```

#### 2. Add PartnerId to Update Transaction
**Files:**
- `UpdateTransactionRequest.cs` - Add `PartnerId` field
- `UpdateTransactionCommand.cs` - Add `PartnerId` field
- `UpdateTransactionCommandHandler.cs` - Handle adding NEW partner to transaction

**Logic:**
- If transaction has no partner and `PartnerId` is provided → Add debt info
- If transaction has partner and `PartnerId` changes → Switch partner + recalculate balances
- Rollback old partner balance, apply new partner balance

#### 3. Add PartnerId Filter to GET Transactions
**Files:**
- `GetTransactionsQuery.cs` - Add `PartnerId` property
- `GetTransactionsQueryHandler.cs` - Filter by partnerId
- `TransactionsController.cs` - Add `partnerId` query param

**API:**
```
GET /api/transactions?partnerId={guid}
```

---

### Frontend Changes

#### 1. Add Debt Dialog in TransactionDetailPage
**Files:**
- `TransactionDetailPage.tsx` - Add "Add/Edit Debt" button + dialog
- `history.ts` (API) - Add `updateTransactionDebt` function

**Dialog Fields:**
- Partner (dropdown with balance)
- Who Paid? (I Paid / Partner Paid buttons)
- Debt Amount (number with vnd suffix)

#### 2. View History Button in PartnersPage
**Files:**
- `partners/page.tsx` - Add History icon button
- `useHistoryQueryState.ts` - Add `partnerId` state
- `HistoryPageContainer.tsx` - Pass partnerId to API
- `history.ts` (API) - Add `partnerId` param

**Flow:**
```
Partners → Click History icon → Redirect to /history?partnerId=xxx
```

---

## API Contracts

### PUT /api/transactions/{id}
**Request (extended):**
```json
{
  "partnerId": "guid?",
  "payerMode": 0,
  "total": 100000,
  "debtAmount": 30000,
  "note": "string?",
  "transactionDate": "datetime?"
}
```

**Response:**
```json
{
  "id": "guid",
  "walletId": "guid",
  "partnerId": "guid?",
  "partnerName": "string?",
  "amount": -100000,
  "payerMode": 0,
  "totalAmount": 100000,
  "debtAmount": 30000,
  ...
}
```

### GET /api/transactions?partnerId={id}
Returns paginated transactions filtered by partner.

---

## Implementation Phases

| Phase | Task | Status |
|-------|------|--------|
| 1 | Fix PartnerTra bug in QuickDeductCommandHandler | ✅ Done |
| 2 | Fix PartnerTra bug in UpdateTransactionCommandHandler | ✅ Done |
| 3 | Add PartnerId to UpdateTransactionRequest/Command | ✅ Done |
| 4 | Handle adding NEW partner in UpdateTransactionCommandHandler | ✅ Done |
| 5 | Add partnerId filter to GET transactions | ✅ Done |
| 6 | Add updateTransactionDebt API function (frontend) | ✅ Done |
| 7 | Add Debt dialog to TransactionDetailPage | ✅ Done |
| 8 | Add View History button to PartnersPage | ✅ Done |
| 9 | Add partnerId to useHistoryQueryState | ✅ Done |

---

## Files Changed

### Backend
| File | Change |
|------|--------|
| `QuickDeductCommandHandler.cs` | Fix partnerDelta calculation |
| `UpdateTransactionCommandHandler.cs` | Fix + add partner switching logic |
| `UpdateTransactionRequest.cs` | Add PartnerId field |
| `UpdateTransactionCommand.cs` | Add PartnerId field |
| `GetTransactionsQuery.cs` | Add PartnerId filter |
| `GetTransactionsQueryHandler.cs` | Filter by partnerId |
| `TransactionsController.cs` | Add partnerId param |

### Frontend
| File | Change |
|------|--------|
| `history.ts` | Add updateTransactionDebt, partnerId param |
| `TransactionDetailPage.tsx` | Add Debt dialog |
| `useHistoryQueryState.ts` | Add partnerId state |
| `HistoryPageContainer.tsx` | Pass partnerId to API |
| `partners/page.tsx` | Add History icon button |

---

## Success Criteria

- [x] PartnerTra mode calculates correct partner balance (-debtAmount, not -(total-debtAmount))
- [x] Can add debt info to transaction that has no partner
- [x] Can edit existing debt info on transactions
- [x] Can view all transactions for a specific partner
- [x] Partner balance updates correctly when adding/editing debt
- [x] History page supports ?partnerId=xxx URL param
