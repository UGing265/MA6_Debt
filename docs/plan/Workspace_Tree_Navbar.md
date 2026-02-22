# Workspace Tree & Navbar Integration Plan

## Overview
This plan defines the visual consistency implementation for the Workspace page, including:
- Tab-based navigation structure
- Wallet tree rendering with hierarchy support
- Debt partner badge system with signed balance indicators
- Visual styling consistency across all components

## Scope
- Frontend implementation only (Next.js, React, TypeScript)
- Tab navigation between Wallets and Debt Partners
- Tree-based wallet display with parent-child relationships
- Color-coded badge system for debt partners
- Consistent error/loading/empty states

## Architecture

### 1. Workspace Page Structure (`frontend/src/app/(dashboard)/workspace/page.tsx`)
**Main entry point** with:
- Tab navigation using Shadcn UI `Tabs` component
- Query parameter (`?tab=wallets|partners`) for state persistence
- Suspense boundaries for lazy loading
- Two tab content areas: Wallets and Debt Partners

### 2. Wallet Tree System
**Tree Building Algorithm** (`WalletList.tsx`):
- O(1) lookup using wallet map for performance
- Recursive node building with depth tracking
- Circular reference prevention using `visited` set
- Orphaned wallet handling (children whose parent doesn't exist)
- Alphabetical sorting at each level

**Tree Rendering**:
- Flat list display (non-hierarchical visual)
- Depth information stored but not rendered (reserved for future)
- Parent wallet reference shown as text link
- Consistent card styling with amber/yellow theme

### 3. Tab Content Components

#### Wallets Tab (`WalletsTabContent.tsx`)
- Loading state: Spinner with text
- Error state: Red alert with error message
- Empty state: Icon + CTA button
- List/form toggle with create and edit modes
- Suspense boundaries for async operations

#### Debt Partners Tab (`DebtPartnersTabContent.tsx`)
- Loading state: Orange spinner with text
- Error state: Red alert with error message
- Empty state: Icon + CTA button
- Grid layout for debt partner cards (responsive)
- Dialog-based create/edit/delete actions

### 4. List Components

#### Wallet List (`WalletList.tsx`)
**Tree Node Structure**:
```typescript
export interface WalletTreeNode {
  wallet: Wallet;
  depth: number;
  children: WalletTreeNode[];
}
```

**Features**:
- Builds tree from flat wallet array
- Shows parent wallet reference
- Currency formatting using `Intl.NumberFormat("vi-VN", ...)`
- Edit/delete buttons with confirmation
- Amber/yellow color scheme (#FCD34D, #FBBF24)

#### Debt Partner List (`DebtPartnerList.tsx`)
**Badge System**:
- Green (receivable): Partner owes you (balance > 0)
- Red (payable): You owe partner (balance < 0)
- Gray (neutral): No debt (balance = 0)

**Features**:
- Grid layout with responsive columns (1-3)
- Card-based design with hover effects
- Inline edit/delete buttons
- Dialog-based forms for CRUD operations
- Balance badge with icon and description

### 5. Hybrid Balance Input (`HybridBalanceInput.tsx`)
**Two Input Modes**:
1. **Guided Mode**: 
   - Non-negative amount field
   - Direction toggle buttons (Partner owes me / I owe partner)
   - Syncs to signed number

2. **Direct Mode**:
   - Single signed number input
   - Supports positive/negative/zero
   - Syncs to guided mode

**Sync Logic**:
- Latest user action wins
- Direction toggle recalculates signed balance
- Direct input parses sign and updates direction
- External value changes reset both modes

## Visual Styling

### Color Scheme
| Component | Color | Hex Code |
|-----------|-------|----------|
| Wallets Button | Amber | #FCD34D |
| Wallets Hover | Light Amber | #FBBF24 |
| Debt Partners Button | Orange | #FF7A00 |
| Debt Partners Hover | Dark Orange | #E56E00 |
| Card Background | Cream | #FFFBEB |
| Borders | Light Gray | #1F2937/10 |

### Component Consistency
- **Card styling**: `border-gray-200 bg-white rounded-lg`
- **Form backgrounds**: `bg-[#FFFBEB]` cream color
- **Spacing**: `space-y-6` between sections
- **Typography**: Consistent heading sizes and font weights
- **Icons**: Lucide React icons throughout

## Loading/Error/Empty States

### Consistent Pattern
1. **Loading**: 
   - Spinner icon (themed color)
   - Centered text: "Loading [feature]..."
   - Suspense fallback

2. **Error**:
   - Alert icon (red)
   - Centered error message
   - Detailed error text (smaller)
   - Red border and background

3. **Empty**:
   - Feature icon (gray)
   - Description text
   - CTA button to create first item

## Implementation Details

### Tree Building Algorithm
```
1. Create wallet map (id → wallet) for O(1) lookup
2. Track visited nodes to prevent circular references
3. Recursively build nodes:
   - Find children by parentWalletId match
   - Build each child node with depth + 1
   - Sort children alphabetically
4. Collect root wallets (no parent)
5. Find orphaned wallets (missing parent reference)
6. Return root nodes + orphaned nodes (sorted)
```

### Badge Rendering
- Get badge info based on balance sign
- Map balance to color scheme and icon
- Display absolute value in badge
- Show semantic label (Receivable/Payable/Neutral)

## Key Files
1. `frontend/src/app/(dashboard)/workspace/page.tsx` - Main page
2. `frontend/src/features/workspace/components/WalletsTabContent.tsx` - Wallet tab
3. `frontend/src/features/workspace/components/DebtPartnersTabContent.tsx` - Debt tab
4. `frontend/src/features/wallet/components/WalletList.tsx` - Wallet list + tree
5. `frontend/src/features/debt/components/DebtPartnerList.tsx` - Debt partner list
6. `frontend/src/features/debt/components/HybridBalanceInput.tsx` - Balance input
7. `frontend/src/features/debt/components/DebtPartnerForm.tsx` - Debt partner form
8. `frontend/src/features/wallet/components/WalletForm.tsx` - Wallet form

## Verification Checklist
- [x] Tab navigation works and persists tab state
- [x] Wallet tree builds correctly from flat array
- [x] Wallet list displays with parent references
- [x] Debt partner badges show correct colors
- [x] Hybrid balance input syncs both modes
- [x] Loading states display consistently
- [x] Error states display with red styling
- [x] Empty states show CTA buttons
- [x] Edit/delete dialogs work correctly
- [x] Responsive grid layout (mobile/tablet/desktop)
- [x] Color scheme consistent across tabs
- [x] Currency formatting applied to wallet balances

## Future Enhancements
- Hierarchical visual rendering of wallet tree (indentation/tree lines)
- Search/filter functionality
- Sorting options (by balance, name, date created)
- Bulk operations on wallets
