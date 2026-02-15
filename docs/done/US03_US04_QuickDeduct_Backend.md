# US-03 + US-04: Quick Deduct Backend - COMPLETED

**Status**: Implementation completed  
**Features**: US-03 Quick Deduct + US-04 Debt Notification  
**Scope**: Backend only  
**Build/Test**: User handles (per RULES.md)

---

## Components Implemented

### 1. Domain Layer

**File**: `backend/src/Domain/Entities/Transaction.cs`

Extended Transaction entity with US-03 audit fields:
- `PayerMode` (int?): 0=ToiTra, 1=PartnerTra
- `TotalAmount` (decimal?): Original bill amount
- `DebtAmount` (decimal?): Partner/user consumed portion
- `PartnerBalanceBefore` (decimal?): Pre-transaction balance
- `PartnerBalanceAfter` (decimal?): Post-transaction balance

### 2. Application Layer

**DTOs**:
- `backend/src/Application/Features/Transactions/TransactionDto.cs` - Response model with PayerMode enum
- `backend/src/Application/Features/Transactions/QuickDeduct/QuickDeductResponse.cs` - Command response with DebtNotification

**Enums**:
```csharp
public enum PayerMode { ToiTra = 0, PartnerTra = 1 }
public enum DebtDirection { PartnerOwesUser = 0, UserOwesPartner = 1, Settled = 2 }
```

**Commands**:
- `backend/src/Application/Features/Transactions/QuickDeduct/QuickDeductCommand.cs`
  - Properties: UserId, WalletId?, PartnerId?, PayerMode, Total, DebtAmount?, Note, TransactionDate?

**Validators**:
- `backend/src/Application/Features/Transactions/QuickDeduct/QuickDeductValidator.cs`
  - Validates: Total > 0, DebtAmount ≤ Total, wallet/partner ownership, soft-delete checks
  - Smart defaults: Resolves from User.DefaultWalletId/DefaultPartnerId when not provided

**Handlers**:
- `backend/src/Application/Features/Transactions/QuickDeduct/QuickDeductCommandHandler.cs`
  - Implements US-03.3 hybrid formulas
  - Updates partner balance atomically
  - Generates US-04 debt notification with Vietnamese messages
  - Stores audit trail in transaction

**Queries**:
- `backend/src/Application/Features/Transactions/GetTransactions/GetTransactionsQuery.cs`
- `backend/src/Application/Features/Transactions/GetTransactions/GetTransactionsQueryHandler.cs`
  - Returns newest-first transaction list
  - Optional wallet filter
  - User-scoped only

- `backend/src/Application/Features/Transactions/GetTransactionById/GetTransactionByIdQuery.cs`
- `backend/src/Application/Features/Transactions/GetTransactionById/GetTransactionByIdQueryHandler.cs`
  - Returns single transaction by ID
  - Ownership verification (404 if not user's transaction)

### 3. API Layer

**File**: `backend/src/API/Controllers/TransactionsController.cs`

Endpoints:
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/transactions/quick-deduct` | Create quick deduct transaction |
| GET | `/api/transactions?walletId={id}` | List user transactions |
| GET | `/api/transactions/{id}` | Get transaction by ID |

Security:
- `[Authorize]` attribute on controller
- JWT `sub` claim extraction for UserId
- User-scoped queries (no cross-user data access)

---

## Key Logic

### US-03.3 Hybrid Formulas

**ToiTra (User pays)**:
```csharp
walletDelta = -Total;
partnerDelta = +DebtAmount;
```

**PartnerTra (Partner pays)**:
```csharp
walletDelta = 0;
partnerDelta = -(Total - DebtAmount);
```

### US-04 Debt Notification

Generated immediately after save with signed balance:
```csharp
balance > 0: "{Partner} đang nợ bạn {balance:N0} đ"
balance < 0: "Bạn đang nợ {Partner} {Math.Abs(balance):N0} đ"
balance = 0: "Bạn và {Partner} đã hết nợ"
```

### Smart Defaults Resolution

1. If `WalletId` null → use `User.DefaultWalletId`
2. If `PartnerId` null and `DebtAmount > 0` → use `User.DefaultPartnerId`
3. Validation fails if defaults not configured when needed

---

## API Examples

### Create Quick Deduct (ToiTra)

**Request**:
```bash
POST /api/transactions/quick-deduct
Authorization: Bearer {token}
Content-Type: application/json

{
  "payerMode": 0,
  "total": 200000,
  "debtAmount": 60000,
  "note": "Phở sáng"
}
```

**Response** (201):
```json
{
  "transaction": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "walletId": "...",
    "partnerId": "...",
    "partnerName": "Nguyễn Văn A",
    "amount": -200000,
    "note": "Phở sáng",
    "payerMode": 0,
    "totalAmount": 200000,
    "debtAmount": 60000
  },
  "notification": {
    "partnerId": "...",
    "partnerName": "Nguyễn Văn A",
    "remainingBalance": 60000,
    "message": "Nguyễn Văn A đang nợ bạn 60,000 đ",
    "direction": 0
  }
}
```

### Create Quick Deduct (PartnerTra)

**Request**:
```bash
POST /api/transactions/quick-deduct
{
  "payerMode": 1,
  "total": 300000,
  "debtAmount": 100000,
  "note": "Ăn trưa nhóm"
}
```

**Logic**:
- Total bill: 300k (A pays)
- A consumed: 100k
- You consumed: 200k
- Partner delta: -(300k - 100k) = -200k

### Validation Error

**Request** (DebtAmount > Total):
```bash
POST /api/transactions/quick-deduct
{
  "payerMode": 0,
  "total": 100000,
  "debtAmount": 150000
}
```

**Response** (400):
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "Validation Error",
  "status": 400,
  "errors": {
    "DebtAmount": ["DebtAmount cannot exceed Total amount"]
  }
}
```

---

## Architecture Compliance

✅ **Clean Architecture**: Domain → Application → API  
✅ **CQRS**: Separate Commands and Queries via MediatR  
✅ **FluentValidation**: Input validation in validators  
✅ **Snake Case DB**: EF Core naming convention preserved  
✅ **Soft Delete**: Partner query filter excludes deleted  
✅ **JWT Auth**: `[Authorize]` + `sub` claim extraction  

---

## Out of Scope (Not Implemented)

Per plan requirements, the following were explicitly excluded:

- US-05: Global history search
- US-06: 30-day data locking
- US-07: Internal wallet transfers
- Income recording (positive amounts)
- Receipt uploads
- Recurring/scheduled transactions
- ML/AI suggestions
- Budget integration

---

## Files Changed

```
backend/src/Domain/Entities/Transaction.cs
backend/src/Application/Features/Transactions/TransactionDto.cs
backend/src/Application/Features/Transactions/QuickDeduct/
  ├── QuickDeductCommand.cs
  ├── QuickDeductResponse.cs
  ├── QuickDeductValidator.cs
  └── QuickDeductCommandHandler.cs
backend/src/Application/Features/Transactions/GetTransactions/
  ├── GetTransactionsQuery.cs
  └── GetTransactionsQueryHandler.cs
backend/src/Application/Features/Transactions/GetTransactionById/
  ├── GetTransactionByIdQuery.cs
  └── GetTransactionByIdQueryHandler.cs
backend/src/API/Controllers/TransactionsController.cs
docs/plan/US03_US04_QuickDeduct_Backend.md
docs/done/US03_US04_QuickDeduct_Backend.md
```

---

## Verification Status

⚠️ **Build/Test**: Not executed per RULES.md  
✅ **Code Review**: Implementation matches plan  
✅ **Scope**: US-03 + US-04 only, no scope creep  
✅ **Documentation**: Plan and done files created  

---

## Notes

- Smart defaults use existing `User.DefaultWalletId` and `User.DefaultPartnerId` fields
- Debt model follows SRS v1.1 signed balance (no `Type` field)
- All amounts in base currency (single currency support)
- Transactions immutable after creation (audit trail)
- Partner balance updated atomically with transaction save

---

*Completed by OpenCode Agent on 2026-02-14*
