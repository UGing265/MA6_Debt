# US-01 & US-02: Frontend Workspace Tabs - COMPLETED

**Status**: Completed  
**Features**: US-01 Wallet Management Frontend + US-02 Debt Partner Management Frontend  
**Scope**: Frontend integration, consistency polish, documentation

---

## Components Implemented

### Workspace Infrastructure

#### 1. Dashboard Layout
- **File**: `frontend/src/app/(dashboard)/layout.tsx`
- Provides Toaster for notifications
- Paper Cream background (#FFFBEB)
- Suspense-ready structure

#### 2. Custom Tabs Component
- **File**: `frontend/src/components/ui/tabs.tsx`
- Context-based state management
- URL query support
- Active tab indicator with amber border

#### 3. Workspace Page
- **File**: `frontend/src/app/(dashboard)/workspace/page.tsx`
- URL query parameter state (`?tab=wallets` or `?tab=partners`)
- Defaults to "wallets" tab
- Suspense boundaries around tab content

### Wallet Feature (US-01)

#### 4. Wallet API Client
- **File**: `frontend/src/features/wallet/api/wallets.ts`
- Functions: `createWallet`, `getWallets`, `getWalletById`, `updateWallet`, `deleteWallet`
- Centralized error parsing

#### 5. Wallet Types
- **File**: `frontend/src/features/wallet/types/wallet.ts`
- `Wallet { id, name, description?, parentWalletId?, balance }`
- `CreateWalletRequest { name, description?, parentWalletId? }`
- `UpdateWalletRequest { name, description? }`

#### 6. Wallet Hooks
- **File**: `frontend/src/features/wallet/hooks/useWallets.ts`
- `useWallets()`: Suspense query with 30s stale time
- `useCreateWallet()`: Mutation with cache invalidation
- `useUpdateWallet()`: Mutation with cache invalidation
- `useDeleteWallet()`: Mutation with error surfacing

#### 7. WalletForm Component
- **File**: `frontend/src/features/wallet/components/WalletForm.tsx`
- Modes: create | edit
- Zod validation (name required, description/parentWalletId optional)
- Parent wallet selection (excludes self in edit mode)
- Project color palette (amber theme)

#### 8. WalletList Component
- **File**: `frontend/src/features/wallet/components/WalletList.tsx`
- Uses `useWallets()` hook
- Vietnamese currency formatting
- Edit/delete buttons with loading states
- Shows parent wallet names for sub-wallets
- Empty state handling

#### 9. WalletsTabContent Component
- **File**: `frontend/src/features/workspace/components/WalletsTabContent.tsx`
- Full CRUD integration
- Loading/error/empty states with icons
- Create/edit form cards
- Suspense boundaries
- Consistent with DebtPartnersTabContent styling

### Debt Partner Feature (US-02)

#### 10. Debt Partner API Client
- **File**: `frontend/src/features/debt/api/debtPartners.ts`
- Functions: `createDebtPartner`, `getDebtPartners`, `getDebtPartnerById`, `updateDebtPartner`, `deleteDebtPartner`
- Centralized error parsing

#### 11. Debt Partner Types
- **File**: `frontend/src/features/debt/types/debtPartner.ts`
- `DebtPartner { id, name, balance }`
- `CreateDebtPartnerRequest { name, balance }`
- `UpdateDebtPartnerRequest { name, balance }`

#### 12. Debt Partner Hooks
- **File**: `frontend/src/features/debt/hooks/useDebtPartners.ts`
- CRUD operations with toast notifications
- Error handling via `parseErrorResponse`

#### 13. HybridBalanceInput Component
- **File**: `frontend/src/features/debt/components/HybridBalanceInput.tsx`
- **Guided Mode**: Non-negative amount + direction toggle
  - "Partner nợ tôi" (receivable, positive)
  - "Tôi nợ partner" (payable, negative)
- **Direct Mode**: Signed number input
- **Sync Logic**: Bidirectional, latest user action wins

#### 14. DebtPartnerForm Component
- **File**: `frontend/src/features/debt/components/DebtPartnerForm.tsx`
- react-hook-form + Zod validation
- HybridBalanceInput integration
- Field-level error display
- Orange theme (#FF7A00)

#### 15. DebtPartnerList Component
- **File**: `frontend/src/features/debt/components/DebtPartnerList.tsx`
- Grid layout (responsive: 1/2/3 columns)
- Badge system:
  - Green (receivable, balance > 0)
  - Red (payable, balance < 0)
  - Gray (neutral, balance = 0)
- Edit/delete dialogs
- Empty state returns null (parent handles)

#### 16. Dialog Component
- **File**: `frontend/src/components/ui/dialog.tsx`
- Modal infrastructure for forms and confirmations
- Used by debt partner create/edit/delete flows

#### 17. DebtPartnersTabContent Component
- **File**: `frontend/src/features/debt/components/DebtPartnersTabContent.tsx`
- Full CRUD UI
- Loading spinner with centered layout
- Error state with red alert
- Empty state with CTA button
- Summary statistics card (receivable/payable/neutral counts, net balance)
- Consistent styling with WalletsTabContent

---

## Polish Updates (Task 5)

### Consistency Improvements

#### WalletsTabContent Alignment
- **Before**: Missing loading/error states, inconsistent empty state
- **After**:
  - Added loading spinner matching DebtPartnersTabContent
  - Added empty state with icon and CTA button
  - Unified card header with description
  - Consistent button styling (amber theme)
  - Suspense fallback for all async boundaries

#### Visual Consistency
Both tabs now share:
- Card-based header with title + description
- Loading state: Centered spinner + text
- Empty state: Icon + message + CTA button
- Responsive grid layouts
- Consistent spacing and padding

#### Error Handling Consistency
- Both tabs use `parseErrorResponse` utility
- Field-level errors displayed below inputs
- General errors shown via toast notifications
- Loading states prevent double submissions

---

## API Endpoints Used

### Wallet APIs
- `GET /api/wallets` - List all wallets for current user
- `GET /api/wallets/:id` - Get single wallet
- `POST /api/wallets` - Create wallet
  - Body: `{ name: string, description?: string, parentWalletId?: string }`
- `PUT /api/wallets/:id` - Update wallet
  - Body: `{ name: string, description?: string }`
- `DELETE /api/wallets/:id` - Delete wallet (hard constraint checks)

### Debt Partner APIs
- `GET /api/debtpartners` - List all debt partners for current user
- `GET /api/debtpartners/:id` - Get single debt partner
- `POST /api/debtpartners` - Create debt partner
  - Body: `{ name: string, balance: number }` (signed)
- `PUT /api/debtpartners/:id` - Update debt partner
  - Body: `{ name: string, balance: number }`
- `DELETE /api/debtpartners/:id` - Soft delete debt partner

---

## Key Logic Implemented

### URL State Management
```typescript
const searchParams = useSearchParams();
const activeTab = searchParams?.get("tab") || "wallets";

const handleTabChange = (newTab: string) => {
  const params = new URLSearchParams(searchParams);
  params.set("tab", newTab);
  window.history.replaceState(null, "", `?${params.toString()}`);
};
```
- Reads from query params
- Updates URL without page reload
- Defaults to "wallets"

### Hybrid Balance Sync (Debt Partners)
- **Guided → Direct**: `sign(direction) * amount`
- **Direct → Guided**: `{ direction: sign(value), amount: abs(value) }`
- User's last action wins
- State stays consistent across mode switches

### Parent Wallet Selection (Wallets)
```typescript
const selectableParents = availableWallets.filter((w) => w.id !== wallet?.id);
```
- Excludes current wallet (prevents circular parent)
- Only shown in create mode
- Optional field

### Delete Constraint Handling (Wallets)
Backend returns specific errors:
- "Cannot delete wallet with sub-wallets"
- "Cannot delete wallet with transactions"

Frontend surfaces via toast notification without field-level error.

### Summary Statistics (Debt Partners)
```typescript
const receivableCount = partners.filter((p) => p.balance > 0).length;
const payableCount = partners.filter((p) => p.balance < 0).length;
const neutralCount = partners.filter((p) => p.balance === 0).length;
const netBalance = partners.reduce((sum, p) => sum + p.balance, 0);
```
Displayed in summary card below partner list.

---

## UX Decisions

### 1. Hybrid Balance Input Rationale
**Problem**: Users unfamiliar with signed numbers might struggle with "negative balance = payable"

**Solution**: Provide two modes
- **Guided**: Natural language ("Partner nợ tôi" / "Tôi nợ partner") + amount
- **Direct**: Power-user shortcut (accepts signed numbers directly)

**Sync Strategy**: Bidirectional, immediate, latest action wins

### 2. Empty State Placement
- **Wallets**: Handled by WalletListContent wrapper (inside Suspense)
- **Debt Partners**: Handled by DebtPartnersTabContent (outside list component)

Both show icon + message + CTA button in dashed border box.

### 3. Form Placement
- Forms appear **above** the list when triggered
- Forms use card styling with cream background (#FFFBEB)
- Only one form visible at a time (create OR edit)
- Cancel hides form, returns to list-only view

### 4. Loading States
- Suspense fallback: Centered spinner + text
- Button loading: Spinner icon + "Creating..." text
- List actions: Individual button loading (Trash icon → Spinner)

### 5. Responsive Behavior
- **Mobile**: Single column, full-width cards
- **Tablet**: 2-column grid (debt partners)
- **Desktop**: 3-column grid (debt partners), full-width (wallets)
- Form inputs: Always full-width
- Button groups: Flexbox with gap

---

## Complete File List

### Created Files
1. `frontend/src/app/(dashboard)/layout.tsx`
2. `frontend/src/app/(dashboard)/workspace/page.tsx`
3. `frontend/src/components/ui/tabs.tsx`
4. `frontend/src/components/ui/dialog.tsx`
5. `frontend/src/features/workspace/index.ts`
6. `frontend/src/features/workspace/components/WalletsTabContent.tsx`
7. `frontend/src/features/workspace/components/DebtPartnersTabContent.tsx`
8. `frontend/src/features/wallet/api/wallets.ts`
9. `frontend/src/features/wallet/types/wallet.ts`
10. `frontend/src/features/wallet/hooks/useWallets.ts`
11. `frontend/src/features/wallet/components/WalletForm.tsx`
12. `frontend/src/features/wallet/components/WalletList.tsx`
13. `frontend/src/features/debt/api/debtPartners.ts`
14. `frontend/src/features/debt/types/debtPartner.ts`
15. `frontend/src/features/debt/hooks/useDebtPartners.ts`
16. `frontend/src/features/debt/components/HybridBalanceInput.tsx`
17. `frontend/src/features/debt/components/DebtPartnerForm.tsx`
18. `frontend/src/features/debt/components/DebtPartnerList.tsx`

### Modified Files (Task 5 Polish)
1. `frontend/src/features/workspace/components/WalletsTabContent.tsx` - Added loading/error/empty states
2. `frontend/src/features/workspace/components/DebtPartnersTabContent.tsx` - No changes (already polished)

### Documentation Files
1. `docs/plan/US01_US02_FE_Workspace.md` - Planning doc
2. `docs/done/US01_US02_FE_Workspace.md` - This file
3. `.sisyphus/notepads/us01-us02-fe-workspace-tabs/learnings.md` - Implementation notes

---

## Verification Results

### Wallets Tab
- ✅ Create parent wallet succeeds
- ✅ Create child wallet with valid parent succeeds
- ✅ Edit wallet name/description succeeds
- ✅ Delete wallet shows confirmation dialog
- ✅ Empty state displays when no wallets
- ✅ Loading spinner shows during fetch
- ✅ Error state displays on API failure
- ✅ Form validation prevents invalid submissions
- ✅ Responsive at mobile/tablet/desktop widths

### Debt Partners Tab
- ✅ Create receivable partner (positive balance) succeeds
- ✅ Create payable partner (negative balance) succeeds
- ✅ Hybrid input guided mode works
- ✅ Hybrid input direct mode works
- ✅ Mode toggle syncs values correctly
- ✅ Edit partner updates name/balance
- ✅ Delete partner shows confirmation dialog
- ✅ Empty state displays when no partners
- ✅ Loading spinner shows during fetch
- ✅ Error state displays on API failure
- ✅ Badge colors match balance sign (green/red/gray)
- ✅ Summary statistics calculate correctly
- ✅ Responsive grid at mobile/tablet/desktop widths

### Cross-Tab Consistency
- ✅ Both tabs use consistent loading states (Loader2 icon + text)
- ✅ Both tabs use consistent error handling (parseErrorResponse + toasts)
- ✅ Both tabs use consistent empty states (Icon + message + CTA)
- ✅ Both tabs use consistent button styling (theme colors + hover states)
- ✅ Navigation between tabs preserves state
- ✅ Toast notifications match auth patterns (Sonner)

---

## Known Limitations
- No search/filter functionality (reserved for US-03+)
- No transaction history (reserved for US-03+)
- Parent wallet selection shows flat list (no hierarchy visualization)
- Debt partner balance has no currency formatting (intentional - abstract units)
- Delete wallet constraints rely on backend errors (no client-side pre-check)

---

## Design References
- Color palette: `docs/plan/Frontend_Design.md`
- Backend APIs: `docs/done/US02_DebtPartner_Backend.md`
- Backend wallet spec: `docs/plan/US01_Wallets.md`

---

**Completion Date**: 2026-02-15  
**Developer Notes**: Full CRUD implementations working, consistency pass complete, responsive behavior verified, documentation workflow satisfied.
