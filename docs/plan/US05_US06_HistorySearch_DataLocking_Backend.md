# US-05 + US-06: Transaction History Search & Data Locking Backend Implementation Plan

## Overview

Implement US-05 (Global History Search) and US-06 (Month-Based Data Locking) as a unified vertical slice extending transaction management. The feature enables users to search transaction history across notes and partner names, while enforcing edit/delete restrictions on transactions outside the current month.

**Status**: Planning Phase  
**Scope**: Backend only  
**Estimated Effort**: Medium-Large  
**Parallel Execution**: Yes (3 waves)

---

## Requirements

### US-05: Global History Search

1. **Keyword Search**: Filter transactions by search term matching note or partner name
2. **Case-Insensitive Matching**: Support partial matches across transaction history
3. **Preserve Existing Filters**: Maintain wallet filter and newest-first ordering
4. **User-Scoped Only**: Transactions visible to current user only

### US-06: Month-Based Data Locking

1. **Lock Rule**: Transactions outside current month (Vietnam timezone) become immutable
2. **Lock Status Display**: Include `isLocked` boolean in transaction read responses
3. **Prevent Edit on Lock**: Block note updates to locked transactions
4. **Prevent Delete on Lock**: Block deletion of locked transactions with safe rollback
5. **Safe Deletion**: Revert partner balance delta before removing transaction

---

## Lock Policy Definition

**Lock Rule**: Transaction is locked when `transactionDate` falls outside the current month (Vietnam timezone).

- **Current Month Transactions**: `isLocked = false` (editable, deletable)
- **Previous/Future Month Transactions**: `isLocked = true` (read-only)
- **Month Boundary**: Based on Vietnam timezone (`Asia/Ho_Chi_Minh`)

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions?walletId=&search=` | List transactions with keyword search |
| PUT | `/api/transactions/{id}/note` | Update transaction note (unlocked only) |
| DELETE | `/api/transactions/{id}` | Delete transaction (unlocked only) with rollback |
| GET | `/api/transactions/{id}` | Get transaction by ID (unchanged) |

### GET /api/transactions (Extended)

**Query Parameters**:
- `walletId` (optional): Filter by wallet (existing)
- `search` (optional): Filter by note or partner name (new)

**Response**:
```json
[
  {
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
    "debtAmount": 60000,
    "isLocked": false
  }
]
```

### PUT /api/transactions/{id}/note

**Request**:
```json
{
  "note": "Updated note text"
}
```

**Response** (200 OK):
```json
{
  "id": "uuid",
  "note": "Updated note text",
  "isLocked": false
}
```

**Error** (400 Bad Request - Locked):
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "Business Rule Violation",
  "status": 400,
  "errors": {
    "BusinessRule": ["Transaction is locked and cannot be modified"]
  }
}
```

### DELETE /api/transactions/{id}

**Response** (204 No Content)

**Error** (400 Bad Request - Locked):
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "Business Rule Violation",
  "status": 400,
  "errors": {
    "BusinessRule": ["Transaction is locked and cannot be deleted"]
  }
}
```

---

## Implementation Files

### Application Layer

**Queries**:
- `Application/Features/Transactions/GetTransactions/GetTransactionsQuery.cs` - Extended with search parameter
- `Application/Features/Transactions/GetTransactions/GetTransactionsQueryHandler.cs` - Search filtering logic
- `Application/Features/Transactions/GetTransactionById/GetTransactionByIdQueryHandler.cs` - Lock status projection

**Commands**:
- `Application/Features/Transactions/UpdateTransactionNote/UpdateTransactionNoteCommand.cs`
- `Application/Features/Transactions/UpdateTransactionNote/UpdateTransactionNoteValidator.cs`
- `Application/Features/Transactions/UpdateTransactionNote/UpdateTransactionNoteCommandHandler.cs`
- `Application/Features/Transactions/DeleteTransaction/DeleteTransactionCommand.cs`
- `Application/Features/Transactions/DeleteTransaction/DeleteTransactionValidator.cs`
- `Application/Features/Transactions/DeleteTransaction/DeleteTransactionCommandHandler.cs`

**DTOs**:
- `Application/Features/Transactions/TransactionDto.cs` - Extended with `isLocked` field

**Utilities**:
- `Application/Common/Locking/MonthLockPolicy.cs` - Reusable month-lock evaluation

### API Layer
- `API/Controllers/TransactionsController.cs` - New search, update, delete routes
- `API/Contracts/Transactions/UpdateTransactionNoteRequest.cs` - Request contract

---

## Key Logic

### US-05 Search Implementation

**Search Behavior**:
1. Split search term into keywords (space-separated)
2. Match case-insensitive against:
   - `Transaction.Note` (note field)
   - `DebtPartner.Name` (partner name, using `IgnoreQueryFilters()` for soft-deleted partners)
3. Preserve existing wallet filter and user scoping
4. Return newest-first ordering

**Example Query**:
```csharp
GET /api/transactions?search=phở
// Returns: transactions where note contains "Phở" or partner name contains "Phở"

GET /api/transactions?search=nguyễn&walletId=<wallet-id>
// Returns: filtered by wallet AND partner name contains "Nguyễn"
```

### US-06 Lock Policy

**Lock Evaluation** (application-level, post-materialization):
```csharp
private static bool IsTransactionLocked(Transaction transaction)
{
    var vietnamTz = TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh");
    var transactionMonth = TimeZoneInfo.ConvertTime(
        transaction.TransactionDate.Kind == DateTimeKind.Unspecified
            ? new DateTime(transaction.TransactionDate.Ticks, DateTimeKind.Utc)
            : transaction.TransactionDate,
        vietnamTz);
    
    var currentMonth = TimeZoneInfo.ConvertTime(
        DateTime.UtcNow,
        vietnamTz);
    
    return transactionMonth.Year != currentMonth.Year ||
           transactionMonth.Month != currentMonth.Month;
}
```

### Delete Rollback Logic

**Partner Balance Restoration** (prefers audit delta, falls back to formula):
```csharp
// Preferred: use audit fields if available
decimal delta = transaction.PartnerBalanceAfter - transaction.PartnerBalanceBefore;

// Fallback: reconstruct from PayerMode formula
if (transaction.PayerMode == 0) // ToiTra
    delta = transaction.DebtAmount;
else if (transaction.PayerMode == 1) // PartnerTra
    delta = -(transaction.TotalAmount - transaction.DebtAmount);

// Apply reverse delta to restore pre-transaction state
partner.Balance -= delta;
```

---

## Constraints

### Must Have
- [ ] Search filters note + partner name, case-insensitive
- [ ] Lock status projected in all transaction reads
- [ ] Lock blocks edit and delete operations with 400 business-rule error
- [ ] Delete safely reverts partner balance delta
- [ ] User isolation maintained (no cross-user data access)
- [ ] Existing wallet filter behavior preserved
- [ ] Newest-first ordering maintained

### Must NOT Have
- [ ] No modification to Transaction entity structure
- [ ] No database schema/migration changes (VM-3.1 constraint)
- [ ] No new NuGet packages
- [ ] No scope expansion into US-07 transfers
- [ ] No full transaction editor (note-only in this slice)

---

## Out of Scope

The following features are explicitly excluded from this plan:

- **US-07**: Internal wallet transfers
- **Bulk operations**: Batch search/delete
- **Advanced filtering**: Date ranges, amount ranges
- **Soft-delete recovery**: Restore deleted transactions
- **Lock override**: Admin/force-unlock flows
- **Audit logging**: Transaction change history (separate from audit fields)

---

## Verification

### Acceptance Criteria

1. **Search by note**: `GET /api/transactions?search=phở` returns matching transactions
2. **Search by partner**: `GET /api/transactions?search=nguyễn` matches partner names
3. **Lock status visible**: All transactions include `isLocked` boolean
4. **Edit lock enforcement**: PUT note on locked transaction returns 400
5. **Delete lock enforcement**: DELETE locked transaction returns 400
6. **Delete rollback**: Partner balance restored to pre-transaction state
7. **User isolation**: Foreign transaction access returns 404
8. **Search + filter combo**: `?search=...&walletId=...` respects both filters

### Example Flows

**Case 1**: Search current month transaction by note
```
GET /api/transactions?search=phở
User transactions where note contains "Phở" AND current month
→ Returns: newest-first, with isLocked=false
```

**Case 2**: Update note on unlocked transaction
```
PUT /api/transactions/{id}/note
Body: {"note":"Updated"}
Transaction is current-month (isLocked=false)
→ Returns: 200 OK with updated transaction
```

**Case 3**: Attempt update on locked transaction
```
PUT /api/transactions/{id}/note
Body: {"note":"Updated"}
Transaction is previous-month (isLocked=true)
→ Returns: 400 with business-rule error
```

**Case 4**: Delete transaction with rollback
```
DELETE /api/transactions/{id}
Transaction has partner link with PayerMode=0, DebtAmount=40000
Partner balance before delete: 100000
→ Reverses delta: balance becomes 60000
→ Returns: 204 No Content
```

---

## References

- `docs/main/SRS_v1.1.pdf` - US-05, US-06 requirements
- `RULES.md` - Project constraints (no DB changes, no build/test by agent)
- `docs/done/US03_US04_QuickDeduct_Backend.md` - Related transaction implementation
- `docs/plan/US03_US04_QuickDeduct_Backend.md` - Plan structure baseline

