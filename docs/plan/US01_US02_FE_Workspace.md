# US-01 & US-02: Frontend Workspace Tabs Plan

## Overview
This plan defines the frontend implementation for **US-01: Physical Cash Partitioning (Wallets)** and **US-02: Debt Partner Management** within the workspace interface. The implementation focuses on creating two tabbed sections that allow users to manage wallets and debt partners with consistent UX patterns.

## Scope
- Frontend only (Next.js, React, TypeScript)
- No backend changes
- No new npm packages
- Integration with existing APIs from US-01 and US-02 backend

## Architecture Decisions

### 1. Workspace Tab Layout
- Single workspace page at `/workspace`
- Two tabs: "Wallets" and "Debt Partners"
- Each tab is a self-contained feature with:
  - List view of items
  - Create/Edit forms
  - Loading/Error/Empty states
  - Consistent visual treatment

### 2. Feature Organization
```
frontend/src/features/
├── wallet/
│   ├── components/
│   │   ├── WalletList.tsx       # List of wallets with edit/delete
│   │   └── WalletForm.tsx       # Create/edit form
│   ├── hooks/
│   │   └── useWallets.ts        # React Query hooks
│   └── types/
│       └── wallet.ts            # TypeScript definitions
├── debt/
│   ├── components/
│   │   ├── DebtPartnerList.tsx  # List of debt partners with badges
│   │   ├── DebtPartnerForm.tsx  # Create/edit form
│   │   └── HybridBalanceInput.tsx # Custom balance input
│   ├── hooks/
│   │   └── useDebtPartners.ts   # React Query hooks
│   └── types/
│       └── debtPartner.ts       # TypeScript definitions
└── workspace/
    ├── components/
    │   ├── WalletsTabContent.tsx        # Wallets tab container
    │   └── DebtPartnersTabContent.tsx   # Debt partners tab container
    └── debt/                            # Symlink to ../debt
```

### 3. Hybrid Balance Input (Debt Partners)
Decision: Provide two input modes for balance entry
- **Guided Mode**: Radio buttons (Receivable/Payable) + Amount field
  - User-friendly for non-technical users
  - Visual clarity of debt direction
- **Direct Mode**: Single number input accepting signed values
  - Power-user feature
  - Faster for experienced users
  - Supports edge case (neutral balance)

**Sync Logic**:
- Guided → Direct: Convert radio + amount to signed number
- Direct → Guided: Infer radio from sign, extract abs value
- Both modes stay in sync bidirectionally

## File Structure

### Components Created
1. `frontend/src/features/wallet/components/WalletList.tsx`
   - Displays list of wallets
   - Shows balance, description, parent wallet
   - Edit/delete actions

2. `frontend/src/features/wallet/components/WalletForm.tsx`
   - Create/edit wallet form
   - Fields: name, description, parent wallet
   - Validation with Zod

3. `frontend/src/features/debt/components/DebtPartnerList.tsx`
   - Displays debt partners in grid layout
   - Color-coded badges (green/red/gray)
   - Edit/delete dialogs

4. `frontend/src/features/debt/components/DebtPartnerForm.tsx`
   - Create/edit debt partner form
   - Fields: name, balance (hybrid input)
   - Validation with Zod

5. `frontend/src/features/debt/components/HybridBalanceInput.tsx`
   - Custom input with guided/direct modes
   - Bidirectional sync
   - Visual mode toggle

6. `frontend/src/features/workspace/components/WalletsTabContent.tsx`
   - Container for wallets tab
   - Integrates list, create form, edit form
   - Loading/error/empty states

7. `frontend/src/features/workspace/components/DebtPartnersTabContent.tsx`
   - Container for debt partners tab
   - Integrates list, create form, edit form
   - Summary statistics card

### Hooks Created
1. `frontend/src/features/wallet/hooks/useWallets.ts`
   - `useWallets()`: Fetch all wallets
   - `useCreateWallet()`: Create wallet mutation
   - `useUpdateWallet()`: Update wallet mutation
   - `useDeleteWallet()`: Delete wallet mutation

2. `frontend/src/features/debt/hooks/useDebtPartners.ts`
   - `useDebtPartners()`: Comprehensive hook with all CRUD operations
   - Returns: partners, isLoading, error, create, update, remove functions

### Type Definitions
1. `frontend/src/features/wallet/types/wallet.ts`
   ```typescript
   export interface Wallet {
     id: string;
     name: string;
     description?: string;
     balance: number;
     parentWalletId?: string;
   }
   ```

2. `frontend/src/features/debt/types/debtPartner.ts`
   ```typescript
   export interface DebtPartner {
     id: string;
     name: string;
     balance: number; // Signed: >0 receivable, <0 payable
   }
   ```

## API Contracts Used

### Wallet APIs
- `GET /api/wallets` - List all wallets for current user
- `GET /api/wallets/:id` - Get single wallet
- `POST /api/wallets` - Create wallet
  - Body: `{ name, description?, parentWalletId? }`
- `PUT /api/wallets/:id` - Update wallet
  - Body: `{ name, description? }`
- `DELETE /api/wallets/:id` - Delete wallet

### Debt Partner APIs
- `GET /api/debtpartners` - List all debt partners for current user
- `GET /api/debtpartners/:id` - Get single debt partner
- `POST /api/debtpartners` - Create debt partner
  - Body: `{ name, balance }` (signed number)
- `PUT /api/debtpartners/:id` - Update debt partner
  - Body: `{ name, balance }`
- `DELETE /api/debtpartners/:id` - Soft delete debt partner

## UX Patterns

### Consistent States Across Both Tabs
1. **Loading State**: Spinner with centered text
2. **Error State**: Alert icon + error message
3. **Empty State**: Icon + description + CTA button
4. **List View**: Grid/card layout with actions

### Visual Design
- **Wallets**: Yellow/amber theme (`#FCD34D`)
- **Debt Partners**: Orange theme (`#FF7A00`)
- Both use paper cream backgrounds (`#FFFBEB`)
- Consistent card borders, shadows, rounded corners

### Error Handling
- Field-level validation errors (red text below inputs)
- Toast notifications for success/failure (using existing auth patterns)
- Graceful degradation for API failures

### Responsive Behavior
- Mobile: Single column, full-width cards
- Tablet: 2-column grid for lists
- Desktop: 3-column grid for debt partners, full-width for wallets
- Forms: Always full-width, stacked fields

## Implementation Steps

### Phase 1: Wallet Feature (US-01)
1. Create wallet types and API hooks
2. Build WalletForm component with validation
3. Build WalletList component with edit/delete
4. Create WalletsTabContent container
5. Test CRUD operations

### Phase 2: Debt Partner Feature (US-02)
1. Create debt partner types and API hooks
2. Build HybridBalanceInput component
3. Build DebtPartnerForm with hybrid input
4. Build DebtPartnerList with badges
5. Create DebtPartnersTabContent container
6. Add summary statistics card
7. Test CRUD operations

### Phase 3: Integration & Polish
1. Ensure consistent loading/error/empty states
2. Verify responsive behavior across breakpoints
3. Align toast notifications with auth patterns
4. Test navigation between tabs
5. Documentation updates

## Verification Checklist

### Wallets Tab
- [ ] Create parent wallet succeeds
- [ ] Create child wallet with valid parent succeeds
- [ ] Edit wallet name/description succeeds
- [ ] Delete wallet shows confirmation
- [ ] Empty state displays when no wallets
- [ ] Loading spinner shows during fetch
- [ ] Error state displays on API failure
- [ ] Form validation prevents invalid submissions
- [ ] Responsive at mobile/tablet/desktop widths

### Debt Partners Tab
- [ ] Create receivable partner (positive balance) succeeds
- [ ] Create payable partner (negative balance) succeeds
- [ ] Hybrid input guided mode works
- [ ] Hybrid input direct mode works
- [ ] Mode toggle syncs values correctly
- [ ] Edit partner updates name/balance
- [ ] Delete partner shows confirmation
- [ ] Empty state displays when no partners
- [ ] Loading spinner shows during fetch
- [ ] Error state displays on API failure
- [ ] Badge colors match balance sign (green/red/gray)
- [ ] Summary statistics calculate correctly
- [ ] Responsive grid at mobile/tablet/desktop widths

### Cross-Tab Consistency
- [ ] Both tabs use consistent loading states
- [ ] Both tabs use consistent error handling
- [ ] Both tabs use consistent empty states
- [ ] Both tabs use consistent button styling
- [ ] Navigation between tabs preserves state
- [ ] Toast notifications match auth patterns

## Known Limitations
- No search/filter functionality (reserved for US-03+)
- No transaction history (reserved for US-03+)
- Parent wallet selection shows all wallets (no hierarchy display)
- Debt partner balance has no currency formatting (intentional for v1)

## Design References
- Color palette: `docs/plan/Frontend_Design.md`
- Backend APIs: `docs/done/US02_DebtPartner_Backend.md`
- Backend wallet spec: `docs/plan/US01_Wallets.md`
