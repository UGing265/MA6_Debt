# Update Transaction Endpoint Plan

## Goal

Enable full update of an existing transaction via PUT /api/transactions/{id}, allowing edits to payerMode, total, debtAmount, note, and transactionDate, while enforcing MonthLockPolicy and without changing the database schema.

---

## Scope

### In Scope
- Add endpoint: PUT /api/transactions/{id}
- Update fields: payerMode, total, debtAmount, note, transactionDate
- Apply MonthLockPolicy: block edits if the transaction month is locked (past month)
- Recalculate partner balance if payerMode or debtAmount changes

### Out of Scope
- Edit walletId or partnerId (IDs immutable)
- Edit createdAt (immutable timestamp)
- Edit transactions by other users (ownership check)

---

## 3. Constraints

### Business Rules
| Rule | Logic |
|------|------|
| MonthLockPolicy | Transaction month older than current month cannot be edited |
| DebtAmount ≤ Total | Validation error if debtAmount > total |
| DebtAmount ≥ 0 | Validation error if debtAmount < 0 |
| Total > 0 | Validation error if total ≤ 0 |
| PayerMode valid | Accept only 0 (ToiTra) or 1 (PartnerTra) |

### Partner Balance Recalculation
If either payerMode or debtAmount changes:
- Rollback partner balance using partnerBalanceBefore
- Recalculate and apply new partner balance

---

## 4. API Contract

### Request
```json
PUT /api/transactions/{id}
Content-Type: application/json
Authorization: Bearer {token}

{
  "payerMode": 0,          // 0 = ToiTra / 1 = PartnerTra
  "total": 200000,          // Total bill amount
  "debtAmount": 120000,      // Debt amount (can be 0 or omitted)
  "note": "Updated note",    // Optional note
  "transactionDate": "2026-02-20T18:00:00Z" // Transaction date
}
```

### Response (200 OK)
```json
{
  "id": "...",
  "walletId": "...",
  "partnerId": "...",
  "partnerName": "Name Surname",
  "amount": -80000,           // Recalculated balance impact
  "note": "Updated note",
  "transactionDate": "2026-02-20T18:00:00Z",
  "createdAt": "...",
  "payerMode": 0,
  "totalAmount": 200000,
  "debtAmount": 120000
}
```

### Validation Errors (400)
- Total ≤ 0
- DebtAmount < 0
- DebtAmount > Total
- Transaction đã lock (MonthLockPolicy)

### 404 Error
- Transaction không tồn tại
- Transaction không thuộc về user hiện tại

---

## 5. Files & Touchpoints

### New Files
```
docs/plan/update-transaction-endpoint.md
```

### References to existing plan style
Style mirrors docs/plan/US03_Cash_Adjustment.md for consistency.

---

## 6. Implementation Checklist
- [ ] Define UpdateTransactionCommand with fields: payerMode, total, debtAmount, note, transactionDate
- [ ] Create UpdateTransactionValidator with rules: total > 0; debtAmount >= 0 and <= total; payerMode in {0,1}; note max length 255
- [ ] Implement UpdateTransactionCommandHandler: ownership check, MonthLockPolicy, store pre-change values, apply updates, recalc partner balance if needed, save, return DTO
- [ ] Update API Controller: add PUT /api/transactions/{id} endpoint; remove/retire PUT /api/transactions/{id}/note
- [ ] Update docs references: docs/plan/update-transaction-endpoint.md (this file)
- [ ] Ensure no DB schema/entity changes are required
- [ ] Validate with Bruno tests or equivalent (not included in build)

---

## 7. Constraints (Recap)
- No DB schema/entity changes
- MonthLockPolicy enforced during update
- WalletId and PartnerId immutable
- Ownership checks enforced by handler
