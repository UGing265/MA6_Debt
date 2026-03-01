# Session Summary: 2026-03-02

## Tổng quan
Session này thực hiện nhiều cải tiến và bug fixes cho ứng dụng MA6 Debt Management.

---

## 1. Allow Partner Pay without Debt Amount

### Vấn đề
Backend yêu cầu DebtAmount khi PayerMode là PartnerTra, gây lỗi khi user muốn chọn "Partner Pay" mà không nhập Debt Amount.

### Giải pháp
Xóa validation rule trong `QuickDeductValidator.cs` (lines 66-70):
```csharp
// DELETED:
RuleFor(x => x)
    .Must(cmd => cmd.DebtAmount.HasValue && cmd.DebtAmount.Value >= 0)
    .When(x => x.PayerMode == PayerMode.PartnerTra)
    .WithMessage("PartnerTra mode requires a valid DebtAmount to track the split");
```

---

## 2. UI Fixes cho History và Transfer

### History - Layout Changes
- Remove section "Partner owes you"
- Move tag next to note with lock icon
- Remove debt amount display

### Transfer - Show Total Balance
- Parent wallet hiển thị total balance từ child wallets
- Formula: parent.balance + sum(children.balances)

### Transfer NaN Display Fix
- File: `TransferForm.tsx`
- Fix: Display "0" thay vì "NaN" khi amount field empty

### History Detail Page - Wallet Hierarchy
- Hiển thị full wallet info bao gồm parent wallet name nếu là child wallet

### Wallet Sort Buttons → Dropdown
- File: `WalletList.tsx`
- Thay buttons bằng dropdown filter với options: A-Z, Z-A, Balance High-Low, Balance Low-High

### History Filters - Search Dropdown
- File: `HistoryFilters.tsx`
- Thay wallet selection buttons bằng search input để filter theo wallet name

---

## 3. TransactionDetailPage UI Improvements

### Layout Changes
- **Debt Info moved to LEFT column**
- **Wallet Info on RIGHT column**
- Yellow buttons cho Edit/Add Debt

### Transaction Date Editing
- Added transaction date editing trong edit dialog
- Date picker với datetime-local input

### Note Display
- Improved note display design
- Full width khi có debt info

---

## 4. Tag Filter trong History

### Features
- Tag filter buttons: Salary, Bill, Repay, Consume
- Help modal với (?) button giải thích mỗi tag:
  - **Salary**: Income transactions (amount > 0)
  - **Bill**: Transactions with partner (shared bills)
  - **Repay**: Debt repayment transactions
  - **Consume**: Expense transactions (amount < 0)

### Files Changed
- `HistoryFilters.tsx` - Added tag filter UI
- `historyKind.ts` - Tag detection logic

---

## 5. Soft Delete Handling

### Vấn đề
Khi partner/wallet bị xóa, history không còn hiển thị tên của chúng.

### Giải pháp
Sử dụng `IgnoreQueryFilters()` trong queries để fetch soft-deleted entities:

```csharp
var walletData = await _context.Wallets
    .IgnoreQueryFilters()
    .AsNoTracking()
    .Where(w => walletIds.Contains(w.Id))
    .Select(w => new { w.Id, w.Name, w.ParentWalletId })
    .ToDictionaryAsync(w => w.Id, cancellationToken);
```

### Files Changed
- `GetTransactionsQueryHandler.cs`
- `GetTransactionByIdQueryHandler.cs`

---

## 6. Vietnamese → English Changes

### Notification Messages
File: `QuickDeductCommandHandler.cs`

```csharp
var message = balance switch
{
    > 0 => $"{partner.Name} owes you {balance:N0} đ",
    < 0 => $"You owe {partner.Name} {Math.Abs(balance):N0} đ",
    _ => $"Settled with {partner.Name}"
};
```

### Icon Changes
- "⚠️ Not set" → "/!\ Not set" (removed emoji)

---

## 7. Default Wallet/Partner DB Storage

### Vấn đề
Default wallet và partner được lưu trong localStorage, không persist vào database.

### Giải pháp
Tạo API endpoints để lưu vào database.

### Backend
- `GetUserPreferencesQuery/Handler` - Fetch default wallet/partner
- `UpdateDefaultWalletCommand/Handler` - Update default wallet
- `UpdateDefaultPartnerCommand/Handler` - Update default partner

### API Endpoints
- `GET /api/users/preferences`
- `PUT /api/users/default-wallet`
- `PUT /api/users/default-partner`

### Frontend
- Updated `userApi.ts` với new API functions
- Updated pages to load/save via API with localStorage fallback

---

## 8. User Profile Management

### Features
1. View profile (username, email, member since)
2. Edit username and email
3. Change password với confirmation

### Backend
- `GetProfileQuery/Handler` - Fetch user profile
- `UpdateProfileCommand/Handler/Validator` - Update profile with duplicate checking
- `ChangePasswordCommand/Handler/Validator` - Change password với verification

### API Endpoints
- `GET /api/users/profile`
- `PUT /api/users/profile`
- `PUT /api/users/password`

### Frontend
- Created `app/(dashboard)/profile/page.tsx`
- Added "Profile" navigation link to sidebar
- Password change dialog với validation

---

## 9. Partner Visual Highlighting

### Feature
Khi partner được đánh dấu star (default), card được highlight:

### Visual Changes
- Yellow border, light yellow background, shadow, ring
- Avatar changes to solid yellow
- Star icon next to partner name

---

## 10. Auto-Select Default Wallet in Quick Debt

### Feature
Quick Debt form auto-selects default wallet (starred wallet).

### Changes
- Added `getDefaultWalletId()` function
- Form initializes with default wallet
- Form resets with default wallet still selected after submit

---

## 11. Debt Repayment Wallet Balance Fix

### Vấn đề
Khi partner pays (repays debt to user), wallet balance không được cập nhật.
- `PartnerTra` mode có `walletDelta = 0`
- Không có tiền được thêm vào wallet khi partner trả nợ

### Root Cause
```csharp
case PayerMode.PartnerTra:
    walletDelta = 0;  // BUG: Wallet should receive money
    partnerDelta = -debtAmount.Value;
    break;
```

### Solution
```csharp
case PayerMode.PartnerTra:
    walletDelta = request.Total;  // Partner gives money to wallet
    partnerDelta = -debtAmount.Value;
    break;
```

### Repayment Logic
- **ToiTra (I pay):** Wallet decreases, Partner owes me
- **PartnerTra (Partner pays):** Wallet increases, I owe partner

---

## 12. Transaction Detail "Repaid" Status

### Feature
Transaction detail page hiển thị "Repaid" status cho repayment transactions.

### Changes
- Added `isRepay` detection based on `[repay]` note marker
- Debt Info card shows green "Repayment" title và "Repaid" badge
- Labels change từ "Who paid" to "Who repaid"
- Emerald/green colors cho repayments

---

## Quick-debt Bug Fix: Partner Not Tagged

### Vấn đề
Khi debtAmount = 0, partnerId không được gửi, khiến transaction không được tag là "bill".

### Solution
```javascript
const selectedPartner = values.partnerId;
const input = {
  ...
  partnerId: selectedPartner || undefined,
  ...
};
```

Always send partnerId if user selected one.

---

## Files Modified Summary

### Backend
```
Application/Features/Users/
├── GetUserPreferences/ (new)
├── GetProfile/ (new)
├── UpdateProfile/ (new)
├── ChangePassword/ (new)
├── UpdateDefaultWallet/ (existing)
└── UpdateDefaultPartner/ (existing)

Application/Features/Transactions/QuickDeduct/
├── QuickDeductCommandHandler.cs (fixed wallet balance)
└── QuickDeductValidator.cs (removed debt validation)

API/Controllers/
└── UsersController.cs (added profile/password endpoints)
```

### Frontend
```
app/(dashboard)/
├── profile/page.tsx (new)
├── layout.tsx (added Profile nav)
├── wallets/page.tsx (API for defaults)
├── partners/page.tsx (API, visual highlighting)
└── wallets/[id]/page.tsx (API)

features/
├── user/api/userApi.ts (new API functions)
├── transaction/components/QuickDebtForm.tsx (auto-select wallet)
├── history/components/TransactionDetailPage.tsx (repaid status)
├── history/components/HistoryFilters.tsx (tag filter)
└── debt/components/PartnerRepaymentDialog.tsx
```

---

## Testing Checklist

1. **Partner Pay without Debt Amount**
   - Select "Partner Pays" without entering debt amount
   - Should submit successfully

2. **Tag Filter**
   - Filter history by Salary, Bill, Repay, Consume
   - Click (?) for help modal

3. **Soft Delete**
   - Delete partner/wallet
   - History should still show names

4. **Profile Management**
   - Navigate to /profile
   - Edit username/email
   - Change password

5. **Default Wallet/Partner**
   - Star a wallet/partner
   - Refresh - should persist
   - Quick Debt should auto-select

6. **Debt Repayment**
   - Partner repays debt
   - Wallet balance should increase
   - Transaction detail shows "Repaid"

---

## Notes
- Backend API cần restart để apply changes
- Frontend changes đã compile successfully
- All localStorage fallbacks maintained for compatibility
