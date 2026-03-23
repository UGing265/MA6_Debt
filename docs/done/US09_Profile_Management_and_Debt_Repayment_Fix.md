# US-09: Profile Management & Debt Repayment Fix

**Date:** 2026-03-02
**Status:** Completed

## Overview

This session implemented user profile management features and fixed critical issues with debt repayment functionality.

---

## Part 1: Default Wallet/Partner Storage (Database)

### Problem
Default wallet and partner were stored in localStorage, not persisted to database.

### Solution
Implemented API endpoints to store user preferences in database.

### Backend Changes
- **GetUserPreferencesQuery/Handler** - Fetch user's default wallet/partner
- **GetProfileQuery/Handler** - Fetch user profile info
- **UpdateDefaultWalletCommand/Handler** - Update default wallet
- **UpdateDefaultPartnerCommand/Handler** - Update default partner

### API Endpoints
- `GET /api/users/preferences` - Get default wallet/partner IDs
- `PUT /api/users/default-wallet` - Update default wallet
- `PUT /api/users/default-partner` - Update default partner

### Frontend Changes
- Updated `userApi.ts` with new API functions
- Updated `wallets/page.tsx` to load/save via API
- Updated `partners/page.tsx` to load/save via API
- Updated `wallets/[id]/page.tsx` to use API

---

## Part 2: User Profile Editing

### Features Implemented
1. View profile (username, email, member since date)
2. Edit username and email
3. Change password with confirmation

### Backend Changes
- **GetProfileQuery/Handler** - Fetch user profile
- **UpdateProfileCommand/Handler/Validator** - Update username/email with duplicate checking
- **ChangePasswordCommand/Handler/Validator** - Change password with current password verification

### API Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update username/email
- `PUT /api/users/password` - Change password

### Frontend Changes
- Created `app/(dashboard)/profile/page.tsx` - Profile editing page
- Added "Profile" navigation link to sidebar
- Password change dialog with current password, new password, confirm password fields

---

## Part 3: Partner Visual Highlighting

### Feature
When a partner is marked as default (starred), they are visually highlighted.

### Changes
- Card gets yellow border, light yellow background, shadow, and ring
- Avatar changes from light yellow to solid yellow
- Star icon appears next to partner name

---

## Part 4: Auto-Select Default Wallet in Quick Debt

### Feature
Quick Debt form auto-selects the default wallet (starred wallet) on load.

### Changes
- Added `getDefaultWalletId()` function
- Form initializes with default wallet
- After submit, form resets with default wallet still selected

---

## Part 5: Debt Repayment Wallet Balance Fix

### Problem
When partner pays (repays debt to user), the wallet balance was not updated.
- `PartnerTra` mode had `walletDelta = 0`
- This meant no money was added to wallet when partner repaid debt

### Root Cause
In `QuickDeductCommandHandler.cs`:
```csharp
case PayerMode.PartnerTra:
    walletDelta = 0;  // Bug: Wallet should receive money
    partnerDelta = -debtAmount.Value;
    break;
```

### Solution
Changed `PartnerTra` to add money to wallet:
```csharp
case PayerMode.PartnerTra:
    walletDelta = request.Total;  // Partner gives money to wallet
    partnerDelta = -debtAmount.Value;
    break;
```

### Repayment Logic Now
- **ToiTra (I pay):** Wallet decreases by Total, Partner owes me DebtAmount
- **PartnerTra (Partner pays):** Wallet increases by Total, I owe partner DebtAmount

For debt repayment specifically:
- If partner owed me and pays back → Wallet increases, Partner balance decreases
- If I owed partner and I pay back → Wallet decreases, Partner balance increases

---

## Part 6: Transaction Detail "Repaid" Status

### Feature
Transaction detail page now shows "Repaid" status for repayment transactions.

### Changes
- Added `isRepay` detection based on `[repay]` note marker
- Debt Info card shows green "Repayment" title and "Repaid" badge
- Labels change from "Who paid" to "Who repaid"
- Amount shows "Amount Repaid" instead of debt labels
- Visual styling uses emerald/green colors for repayments

---

## Files Modified

### Backend
- `Application/Features/Users/GetUserPreferences/*` (new)
- `Application/Features/Users/GetProfile/*` (new)
- `Application/Features/Users/UpdateProfile/*` (new)
- `Application/Features/Users/ChangePassword/*` (new)
- `Application/Features/Transactions/QuickDeduct/QuickDeductCommandHandler.cs` (fixed wallet balance)
- `API/Controllers/UsersController.cs` (added endpoints)

### Frontend
- `features/user/api/userApi.ts` (added API functions)
- `app/(dashboard)/profile/page.tsx` (new)
- `app/(dashboard)/layout.tsx` (added Profile nav)
- `app/(dashboard)/wallets/page.tsx` (use API for defaults)
- `app/(dashboard)/partners/page.tsx` (use API, visual highlighting)
- `app/(dashboard)/wallets/[id]/page.tsx` (use API)
- `features/transaction/components/QuickDebtForm.tsx` (auto-select default wallet)
- `features/history/components/TransactionDetailPage.tsx` (repaid status)

---

## Testing Notes

1. **Profile Management:**
   - Navigate to `/profile`
   - Edit username and save
   - Change password (requires current password verification)

2. **Default Wallet/Partner:**
   - Star a wallet/partner
   - Refresh page - should still be starred (persisted to DB)
   - Quick Debt form should auto-select starred wallet

3. **Debt Repayment:**
   - Create debt with partner (Partner owes you)
   - Go to Partners, click "Repay Debt"
   - Partner pays → Wallet balance should increase
   - Check transaction detail - should show "Repaid" status

---

## Security Considerations

- Password change requires current password verification
- Username/email uniqueness checked before update
- All endpoints require authentication
- Password hashed with BCrypt before storage
