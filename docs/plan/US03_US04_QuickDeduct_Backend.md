# US-03 + US-04: Quick Deduct Backend Implementation Plan

## Overview

Implement backend Quick Deduct (US-03) with immediate debt notification (US-04) as a unified vertical slice. The feature enables users to record expenses with hybrid debt-tagging logic for shared bills.

**Status**: Planning Phase  
**Scope**: Backend only  
**Estimated Effort**: Large  
**Parallel Execution**: Yes (3 waves)

---

## Requirements

### US-03: Quick Deduct with Smart Preferences

1. **Quick Expense Recording**: Fast endpoint to record cash deductions
2. **Smart Defaults**: Auto-fill from user preferences (`DefaultWalletId`, `DefaultPartnerId`)
3. **Hybrid Debt-Tagging**: Support two payer modes for shared bills

### US-04: Debt Notification

Immediate calculation and display of remaining debt balance after transaction save.

---

## Debt Model (SRS v1.1 Signed Balance)

**No Type Field**: Debt direction determined solely by `DebtPartner.Balance` sign:
- `Balance > 0`: Partner owes user (receivable)
- `Balance < 0`: User owes partner (payable)
- `Balance = 0`: Settled

---

## Hybrid Debt-Tagging Formulas (US-03.3)

### PayerMode.ToiTra (User pays)
- **Wallet**: Decreases by `Total`
- **Partner**: Increases by `DebtAmount` (what partner consumed)
- **Formula**:
  ```
  walletDelta = -Total
  partnerDelta = +DebtAmount
  ```

### PayerMode.PartnerTra (Partner pays)
- **Wallet**: Unchanged (0)
- **Partner**: Decreases by `(Total - DebtAmount)` (what user consumed)
- **Formula**:
  ```
  walletDelta = 0
  partnerDelta = -(Total - DebtAmount)
  ```

### Validation
- `DebtAmount` must be ≤ `Total`
- Cross-user wallet/partner access blocked
- Soft-deleted partners rejected

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/transactions/quick-deduct` | US-03: Create quick deduct transaction |
| GET | `/api/transactions` | List user transactions (opt. wallet filter) |
| GET | `/api/transactions/{id}` | Get transaction by ID |

### POST /api/transactions/quick-deduct

**Request**:
```json
{
  "walletId": "uuid?",
  "partnerId": "uuid?",
  "payerMode": 0,
  "total": 200000,
  "debtAmount": 60000,
  "note": "Phở sáng",
  "transactionDate": "2026-02-15T08:00:00Z"
}
```

**Response** (201 Created):
```json
{
  "transaction": {
    "id": "uuid",
    "walletId": "uuid",
    "partnerId": "uuid",
    "partnerName": "Nguyễn Văn A",
    "amount": -200000,
    "note": "Phở sáng",
    "transactionDate": "2026-02-15T08:00:00Z",
    "createdAt": "2026-02-15T08:00:00Z",
    "payerMode": 0,
    "totalAmount": 200000,
    "debtAmount": 60000
  },
  "notification": {
    "partnerId": "uuid",
    "partnerName": "Nguyễn Văn A",
    "remainingBalance": 40000,
    "message": "Nguyễn Văn A đang nợ bạn 40,000 đ",
    "direction": 0
  }
}
```

---

## Implementation Files

### Application Layer
- `Application/Features/Transactions/TransactionDto.cs` - DTO with PayerMode enum
- `Application/Features/Transactions/QuickDeduct/QuickDeductCommand.cs`
- `Application/Features/Transactions/QuickDeduct/QuickDeductResponse.cs`
- `Application/Features/Transactions/QuickDeduct/QuickDeductValidator.cs`
- `Application/Features/Transactions/QuickDeduct/QuickDeductCommandHandler.cs`
- `Application/Features/Transactions/GetTransactions/GetTransactionsQuery.cs`
- `Application/Features/Transactions/GetTransactions/GetTransactionsQueryHandler.cs`
- `Application/Features/Transactions/GetTransactionById/GetTransactionByIdQuery.cs`
- `Application/Features/Transactions/GetTransactionById/GetTransactionByIdQueryHandler.cs`

### API Layer
- `API/Controllers/TransactionsController.cs`

### Domain Layer
- `Domain/Entities/Transaction.cs` - Extended with US-03 audit fields

---

## Key Logic

### Smart Defaults Resolution
1. If `WalletId` provided → use it
2. Else use `User.DefaultWalletId`
3. If `PartnerId` provided → use it
4. Else if `DebtAmount > 0` → use `User.DefaultPartnerId`

### Debt Notification Generation (US-04)
```csharp
var message = balance switch {
    > 0 => $"{partner.Name} đang nợ bạn {balance:N0} đ",
    < 0 => $"Bạn đang nợ {partner.Name} {Math.Abs(balance):N0} đ",
    _   => $"Bạn và {partner.Name} đã hết nợ"
};
```

### Audit Fields
Every US-03 transaction stores:
- `PayerMode`: 0 (ToiTra) or 1 (PartnerTra)
- `TotalAmount`: Original bill amount
- `DebtAmount`: Partner/user consumed amount
- `PartnerBalanceBefore`: Pre-transaction partner balance
- `PartnerBalanceAfter`: Post-transaction partner balance

---

## Constraints

### Must Have
- [ ] Hybrid formulas match SRS exactly
- [ ] Validation blocks invalid debt amounts
- [ ] Cross-user access prevented
- [ ] Soft-deleted partners rejected
- [ ] Immediate debt notification in response

### Must NOT Have
- [ ] No implementation of US-05, US-06, US-07
- [ ] No new packages without approval
- [ ] No build/test execution
- [ ] No reintroduction of `DebtPartner.Type`

---

## Out of Scope

The following features are explicitly excluded from this plan:

- **US-05**: Global history search and filtering
- **US-06**: Data locking after 30 days
- **US-07**: Internal wallet transfers
- **Income recording**: US-03 focuses on expenses (negative amounts)
- **Receipt uploads**: File attachments
- **Recurring transactions**: Scheduled/cron jobs
- **ML/AI suggestions**: Rule-based heuristics only

---

## Verification

### Acceptance Criteria

1. **ToiTra branch**: Wallet -Total, Partner +DebtAmount
2. **PartnerTra branch**: Wallet 0, Partner -(Total-DebtAmount)
3. **Invalid rejection**: DebtAmount > Total returns 400
4. **Cross-user block**: Foreign wallet/partner returns 404
5. **Notification format**: Vietnamese message with signed balance

### Example Flows

**Case 1**: Bạn trả hóa đơn 200k, A dùng 40k
```
POST { payerMode: ToiTra, total: 200000, debtAmount: 40000 }
→ Wallet: -200000
→ Partner Balance: +40000
→ Message: "A đang nợ bạn 40,000 đ"
```

**Case 2**: A trả hóa đơn 300k, bạn dùng 200k (A dùng 100k)
```
POST { payerMode: PartnerTra, total: 300000, debtAmount: 100000 }
→ Wallet: 0
→ Partner Delta: -(300000-100000) = -200000
→ Partner Balance: +40000 - 200000 = -160000
→ Message: "Bạn đang nợ A 160,000 đ"
```

---

## References

- `docs/main/SRS_v1.1.pdf` - Source requirements
- `RULES.md` - Project conventions
- `docs/done/US02_DebtPartner_Backend.md` - Prior implementation style
