---
title: US-08: Debt Management Enhancement - Implementation Complete
status: done
created: 2026-02-26
completed: 2026-02-26
---

# US-08: Debt Management Enhancement - Done

## Summary

Implemented debt management enhancements allowing users to:
1. Add debt info to existing transactions
2. View all transactions for a specific partner
3. Edit existing debt information
4. Fixed critical PartnerTra calculation bug

---

## Business Requirements Implemented

### BR-1: Add Debt Later ✅
**User Story:** "When I pay a 100k bill (including partner A's share) but forget to tag the debt, I want to add it later from the history page."

**Implementation:**
- Added "Add Debt" button on `/history/[id]` page for transactions without debt
- Dialog allows selecting partner, payer mode, and debt amount
- Backend updates transaction + adjusts partner balance atomically

### BR-2: View Partner History ✅
**User Story:** "I want to see why Partner A's balance is 150k by viewing all transactions with them."

**Implementation:**
- Added History icon (clock) on each partner card in `/partners`
- Clicking redirects to `/history?partnerId=xxx`
- History page filters transactions by partner

### BR-3: Edit Debt Info ✅
**User Story:** "I entered wrong debt amount, I want to correct it."

**Implementation:**
- Button shows "Edit Debt" if transaction already has debt info
- Same dialog, pre-filled with existing values
- Backend recalculates partner balance (rollback old + apply new)

### BR-4: PartnerTra Bug Fix ✅
**Bug:** Partner balance calculated as -(Total - DebtAmount) instead of -DebtAmount

**Example:**
- Total: 100k, DebtAmount: 30k (user consumed 30k, partner paid rest)
- Before: Partner balance = -(100k - 30k) = -70k ❌
- After: Partner balance = -30k ✅

---

## Backend Implementation

### Bug Fix: PartnerTra Calculation

**QuickDeductCommandHandler.cs (line 102-107):**
```csharp
case PayerMode.PartnerTra:
    // Partner pays: wallet unchanged, user owes partner DebtAmount
    // DebtAmount = what user consumed, so user owes that to partner
    walletDelta = 0;
    partnerDelta = -debtAmount.Value;  // FIXED: was -(total - debtAmount)
    break;
```

**UpdateTransactionCommandHandler.cs - ComputePartnerDelta:**
```csharp
case PayerMode.PartnerTra:
    if (!debtAmount.HasValue)
    {
        throw new InvalidOperationException("DebtAmount is missing.");
    }
    // DebtAmount = what user consumed, so user owes that to partner
    return -debtAmount.Value;  // FIXED
```

### Add Partner to Existing Transaction

**UpdateTransactionCommandHandler.cs - Key Logic:**
```csharp
// Determine the effective partner ID (new or existing)
var effectivePartnerId = request.PartnerId ?? transaction.PartnerId;
var isAddingNewPartner = !transaction.PartnerId.HasValue && request.PartnerId.HasValue;
var isRemovingPartner = transaction.PartnerId.HasValue && !request.PartnerId.HasValue;

if (isAddingNewPartner)
{
    // Get partner, calculate delta, update balance
    var partner = await _context.DebtPartners...
    var newPartnerDelta = ComputePartnerDelta(...);
    partner.Balance += newPartnerDelta;
    
    transaction.PartnerId = effectivePartnerId;
    transaction.PartnerBalanceBefore = partnerBalanceBefore;
    transaction.PartnerBalanceAfter = partnerBalanceBefore + newPartnerDelta;
}
```

### Partner Filter Endpoint

**GET /api/transactions?partnerId={guid}**
- Added `PartnerId` to `GetTransactionsQuery`
- Handler filters: `query.Where(t => t.PartnerId == request.PartnerId.Value)`

---

## Frontend Implementation

### TransactionDetailPage - Add Debt Dialog

**New State:**
```tsx
const [isDebtOpen, setIsDebtOpen] = useState(false);
const [debtPartnerId, setDebtPartnerId] = useState<string>("");
const [debtPayerMode, setDebtPayerMode] = useState<PayerMode>(PayerMode.ToiTra);
const [debtAmount, setDebtAmount] = useState<string>("");
const [partners, setPartners] = useState<Partner[]>([]);
```

**Load Partners on Dialog Open:**
```tsx
useEffect(() => {
  if (isDebtOpen) {
    getDebtPartners().then(setPartners).catch(() => setPartners([]));
  }
}, [isDebtOpen]);
```

**Button Logic:**
```tsx
{!isTransfer && (
  <Button onClick={() => setIsDebtOpen(true)}>
    {transaction.partnerId ? "Edit Debt" : "Add Debt"}
  </Button>
)}
```

### PartnersPage - View History Button

**Added History Icon:**
```tsx
<button onClick={() => router.push(`/history?partnerId=${partner.id}`)}>
  <History className="h-4 w-4" />
</button>
```

### History Query State - PartnerId Support

**useHistoryQueryState.ts:**
```tsx
const currentPartnerId = searchParams.get("partnerId") ?? "";

const setPartnerId = useCallback((value: string) => {
  updateUrl({ partnerId: value });
}, [updateUrl]);
```

---

## API Functions Added

### updateTransactionDebt
```ts
export const updateTransactionDebt = async (
  id: string,
  data: UpdateDebtRequest
): Promise<HistoryDto> => {
  const payload = {
    PartnerId: data.partnerId || null,
    PayerMode: data.payerMode,
    Total: data.total,
    DebtAmount: data.debtAmount ?? undefined,
    Note: data.note ?? undefined,
    TransactionDate: data.transactionDate,
  };
  // PUT to /api/transactions/{id}
};
```

---

## Files Modified

| File | Lines Changed | Description |
|------|---------------|-------------|
| `QuickDeductCommandHandler.cs` | 6 | Fix partnerDelta |
| `UpdateTransactionCommandHandler.cs` | 80 | Fix + add partner logic |
| `UpdateTransactionRequest.cs` | 6 | Add PartnerId |
| `UpdateTransactionCommand.cs` | 6 | Add PartnerId |
| `GetTransactionsQuery.cs` | 6 | Add PartnerId filter |
| `GetTransactionsQueryHandler.cs` | 6 | Filter by partnerId |
| `TransactionsController.cs` | 10 | Add partnerId param |
| `history.ts` | 60 | Add updateTransactionDebt, getHistoryByPartner |
| `TransactionDetailPage.tsx` | 200 | Add debt dialog |
| `useHistoryQueryState.ts` | 30 | Add partnerId state |
| `HistoryPageContainer.tsx` | 5 | Pass partnerId |
| `partners/page.tsx` | 15 | Add History button |

**Total:** ~430 lines changed

---

## Testing Notes

### Manual Testing Performed:
1. ✅ Create transaction without debt → Add debt later → Partner balance updates
2. ✅ Edit existing debt amount → Partner balance adjusts correctly
3. ✅ Click History on partner → See filtered transactions
4. ✅ PartnerTra mode: 100k total, 30k debt → Partner balance = -30k (not -70k)

### Edge Cases Handled:
- Transaction locked (month passed) → Buttons disabled
- No partners exist → Dropdown shows empty
- Removing partner from transaction → Balance rolled back

---

## Known Limitations

1. Cannot change partner on existing debt transaction (must delete and recreate)
2. No bulk debt entry (must do one transaction at a time)
3. Debt history view doesn't show running balance (future enhancement)

---

## Related Documents

- Plan: `/docs/plan/US08_Debt_Management_Enhancement.md`
- Related: US-03 Quick Deduct, US-04 Debt Notification
