# Plan: Refactor Large Frontend Components (>400 lines)

## Context
User wants to split all frontend files >400 lines into smaller, maintainable components. Currently 6 files exceed this threshold, with the largest being 796 lines.

## Files to Refactor (sorted by size)

| File | Lines | Target |
|------|-------|--------|
| `features/history/components/TransactionDetailPage.tsx` | 796 | ~200 |
| `app/(dashboard)/wallets/[id]/page.tsx` | 512 | ~180 |
| `features/transfers/components/TransferForm.tsx` | 506 | ~150 |
| `app/(dashboard)/wallets/page.tsx` | 447 | ~150 |
| `app/(dashboard)/wallets/dashboard/page.tsx` | 425 | ~150 |
| `features/transaction/components/QuickDebtForm.tsx` | 405 | ~150 |

---

## Phase 1: TransactionDetailPage.tsx (796 → ~200 lines)

**Extract these components:**

### New Components:
1. **`TransactionHeader.tsx`** (~30 lines)
   - Navigation back button, lock status icon
   - Props: `isLocked`, `onBack`

2. **`AmountCard.tsx`** (~60 lines)
   - Amount display with +/- formatting
   - Edit/Delete/Add Debt buttons
   - Props: `transaction`, `isLocked`, `onEdit`, `onDelete`, `onAddDebt`

3. **`DebtInfoCard.tsx`** (~80 lines)
   - Debt/repayment info, partner name, payer mode tag
   - Props: `transaction`, `isRepay`

4. **`WalletInfoCard.tsx`** (~40 lines)
   - Wallet name, parent wallet, timestamps
   - Props: `transaction`

5. **`TransferDetailsCard.tsx`** (~30 lines)
   - Transfer-specific info (from/to wallets)
   - Props: `transaction`

6. **`EditTransactionDialog.tsx`** (~70 lines)
   - Edit note dialog
   - Props: `isOpen`, `transaction`, `onSave`, `onCancel`

7. **`DeleteTransactionDialog.tsx`** (~40 lines)
   - Delete confirmation dialog
   - Props: `isOpen`, `transaction`, `onDelete`, `onCancel`

8. **`DebtDialog.tsx`** (~110 lines)
   - Add/Edit debt dialog with partner select, payer mode, debt amount
   - Props: `isOpen`, `transaction`, `partners`, `onSave`, `onCancel`

### Files to Create:
- `features/history/components/TransactionDetail/TransactionHeader.tsx`
- `features/history/components/TransactionDetail/AmountCard.tsx`
- `features/history/components/TransactionDetail/DebtInfoCard.tsx`
- `features/history/components/TransactionDetail/WalletInfoCard.tsx`
- `features/history/components/TransactionDetail/TransferDetailsCard.tsx`
- `features/history/components/TransactionDetail/EditTransactionDialog.tsx`
- `features/history/components/TransactionDetail/DeleteTransactionDialog.tsx`
- `features/history/components/TransactionDetail/DebtDialog.tsx`
- `features/history/components/TransactionDetail/index.ts` (exports)

---

## Phase 2: WalletDetailPage ([id]/page.tsx) (512 → ~180 lines)

**Extract these components:**

### New Components:
1. **`WalletHeader.tsx`** (~30 lines)
   - Wallet name, type badge (Parent/Sub)
   - Props: `wallet`, `isParent`

2. **`WalletOverviewCard.tsx`** (~90 lines)
   - Balance, description, default wallet star, edit button
   - Props: `wallet`, `isParent`, `isDefault`, `onSetDefault`, `onEdit`

3. **`ChildWalletList.tsx`** (~100 lines)
   - List of child wallets with balances, default indicator, actions
   - Props: `childWallets`, `defaultWalletId`, `onSetDefault`, `onEdit`, `onDelete`

4. **`WalletDialogs.tsx`** (~150 lines)
   - Edit parent, create child, edit child, delete dialogs
   - Props: Various dialog states and handlers

### Files to Create:
- `features/wallet/components/WalletDetail/WalletHeader.tsx`
- `features/wallet/components/WalletDetail/WalletOverviewCard.tsx`
- `features/wallet/components/WalletDetail/ChildWalletList.tsx`
- `features/wallet/components/WalletDetail/WalletDialogs.tsx`
- `features/wallet/components/WalletDetail/index.ts`

---

## Phase 3: TransferForm.tsx (506 → ~150 lines)

**Extract these components:**

### New Components:
1. **`WalletBalancePanel.tsx`** (~80 lines)
   - Left panel showing wallet balances grouped by parent
   - Props: `wallets`, `selectedFromId`, `selectedToId`

2. **`WalletSelectField.tsx`** (~60 lines)
   - Reusable wallet dropdown with optgroup
   - Props: `label`, `value`, `onChange`, `groupedWallets`, `disabled`

3. **`AmountInputField.tsx`** (~50 lines)
   - Numeric input with VND suffix
   - Props: `value`, `onChange`, `disabled`

4. **`NoteInputField.tsx`** (~30 lines)
   - Note input with optional label
   - Props: `value`, `onChange`, `disabled`

5. **`TransferFormActions.tsx`** (~40 lines)
   - Swap button and submit button
   - Props: `isSubmitting`, `canSwap`, `onSwap`

### Files to Create:
- `features/transfers/components/WalletBalancePanel.tsx`
- `features/transfers/components/WalletSelectField.tsx`
- `features/transfers/components/AmountInputField.tsx`
- `features/transfers/components/NoteInputField.tsx`
- `features/transfers/components/TransferFormActions.tsx`

---

## Phase 4: WalletsPage (wallets/page.tsx) (447 → ~150 lines)

**Extract these components:**

### New Components:
1. **`WalletsStats.tsx`** (~50 lines)
   - Total wallets and total balance cards
   - Props: `wallets`

2. **`WalletSearchSort.tsx`** (~60 lines)
   - Search input and sort dropdown
   - Props: `searchQuery`, `sortCriteria`, `onSearchChange`, `onSortChange`

3. **`ParentWalletCard.tsx`** (~80 lines)
   - Individual parent wallet with children count, balance
   - Props: `wallet`, `childCount`, `aggregatedBalance`, `isDefault`, `onEdit`, `onDelete`, `onSetDefault`

4. **`WalletsDialogs.tsx`** (~120 lines)
   - Create, edit, delete wallet dialogs
   - Props: Various dialog states and handlers

### Files to Create:
- `features/wallet/components/WalletsPage/WalletsStats.tsx`
- `features/wallet/components/WalletsPage/WalletSearchSort.tsx`
- `features/wallet/components/WalletsPage/ParentWalletCard.tsx`
- `features/wallet/components/WalletsPage/WalletsDialogs.tsx`

---

## Phase 5: DashboardPage (dashboard/page.tsx) (425 → ~150 lines)

**Extract these components:**

### New Components:
1. **`SummaryCards.tsx`** (~80 lines)
   - Net worth, total cash, receivable, payable cards
   - Props: `netWorth`, `totalCash`, `receivable`, `payable`

2. **`StatsCards.tsx`** (~60 lines)
   - Total wallets, parent wallets, debt partners
   - Props: `wallets`, `partners`

3. **`MonthlyChart.tsx`** (~100 lines)
   - Recharts bar chart for monthly stats
   - Props: `monthlyStats`, `isLoading`

4. **`WalletsPanel.tsx`** (~60 lines)
   - List of top 6 parent wallets
   - Props: `parentWallets`, `childWallets`, `defaultWalletId`

5. **`RecentHistoryPanel.tsx`** (~80 lines)
   - Recent 5 transactions
   - Props: `history`, `isLoading`, `error`

### Files to Create:
- `app/(dashboard)/wallets/dashboard/components/SummaryCards.tsx`
- `app/(dashboard)/wallets/dashboard/components/StatsCards.tsx`
- `app/(dashboard)/wallets/dashboard/components/MonthlyChart.tsx`
- `app/(dashboard)/wallets/dashboard/components/WalletsPanel.tsx`
- `app/(dashboard)/wallets/dashboard/components/RecentHistoryPanel.tsx`

---

## Phase 6: QuickDebtForm.tsx (405 → ~150 lines)

**Extract these components:**

### New Components:
1. **`AmountInput.tsx`** (~50 lines)
   - Large centered amount input with VND suffix
   - Props: `value`, `onChange`, `disabled`

2. **`WalletSelect.tsx`** (~60 lines)
   - Grouped wallet dropdown
   - Props: `value`, `onChange`, `groupedWallets`, `disabled`

3. **`PartnerSelect.tsx`** (~40 lines)
   - Partner dropdown
   - Props: `value`, `onChange`, `partners`, `disabled`

4. **`PayerModeToggle.tsx`** (~50 lines)
   - I Pay / Partner Pays toggle buttons
   - Props: `value`, `onChange`, `disabled`

5. **`DebtAmountInput.tsx`** (~40 lines)
   - Optional debt amount input
   - Props: `value`, `onChange`, `disabled`

6. **`FormSubmitButton.tsx`** (~30 lines)
   - Submit button with loading state
   - Props: `isSubmitting`, `disabled`

### Files to Create:
- `features/transaction/components/QuickDebt/AmountInput.tsx`
- `features/transaction/components/QuickDebt/WalletSelect.tsx`
- `features/transaction/components/QuickDebt/PartnerSelect.tsx`
- `features/transaction/components/QuickDebt/PayerModeToggle.tsx`
- `features/transaction/components/QuickDebt/DebtAmountInput.tsx`
- `features/transaction/components/QuickDebt/FormSubmitButton.tsx`
- `features/transaction/components/QuickDebt/index.ts`

---

## Shared Utilities to Create

### `lib/utils/numericInput.ts`
```typescript
export const handleNumericKeyDown = (e: KeyboardEvent) => { ... }
export const formatNumericValue = (value: number) => { ... }
export const parseNumericInput = (input: string) => { ... }
```

---

## Execution Order

1. **Phase 1** - TransactionDetailPage (largest, most complex)
2. **Phase 2** - WalletDetailPage
3. **Phase 3** - TransferForm
4. **Phase 4** - WalletsPage
5. **Phase 5** - DashboardPage
6. **Phase 6** - QuickDebtForm

Each phase:
1. Create new component files
2. Export from index.ts
3. Update main file to import and use new components
4. Run `npx tsc --noEmit` to verify
5. Test in browser

---

## Verification

1. Type check: `cd frontend && npx tsc --noEmit`
2. Build: `npm run build`
3. Test each refactored page in browser

---

## Benefits

- **Maintainability**: Each component < 150 lines, easy to understand
- **Reusability**: Components can be reused across pages
- **Testability**: Smaller components easier to unit test
- **Performance**: Better memoization opportunities
- **Team collaboration**: Easier for multiple developers to work on different components
